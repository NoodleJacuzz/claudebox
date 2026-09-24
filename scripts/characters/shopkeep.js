var character = {index: "shopkeep", flags: "", fName: "Bluebell", lName: "", color: "#89A2F9", outfit: "clothed", emotion: "happy", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: ""};

var logbookArray = [
	"im images/shopkeep/clothed-meat/happy; im images/shopkeep/nude-meat/happy; ?flag shopkeep meat; title Sly-Tongued; A girl who works at Ivy & Oak General Store, Syrup Town's everyday stop for everyday needs. She'll sell goods like food and clothes, and she'll buy things like fish and fruit from you in exchange for Muns, the town's currency.<br>Her house is upstairs from her workplace, and inside she keeps her eye-wateringly huge collection of smut and porn. Make sure to knock first if you visit, and if you hear screams or moans, you'll need to knock louder!",
	"im images/shopkeep/clothed/happy; im images/shopkeep/nude/happy; ?flag shopkeep veggie; title Sly-Tongued; A girl who works at Ivy & Oak General Store, Syrup Town's everyday stop for everyday needs. She'll sell goods like food and clothes, and she'll buy things like fish and fruit from you in exchange for Muns, the town's currency.<br>Her house is upstairs from her workplace, and inside she keeps her eye-wateringly huge collection of smut and porn. Make sure to knock first if you visit, and if you hear screams or moans, you'll need to knock louder!",
	"im images/shopkeep/logbook2m.png; ?flag shopkeep meat; title Red Apron; The only thing shopkeepF wears on the job aside from a bright smile is a simple apron, usually a bright red, sometimes with a plaid pattern. It's a little small, so the sides of her breasts are always visible and her nipples will often slip out. Besides that it doesn't cover anything besides her belly, so she's always totally bottomless.",
	"im images/shopkeep/logbook2v.png; ?flag shopkeep veggie; title Red Apron; The only thing shopkeepF wears on the job aside from a bright smile is a simple apron, usually a bright red, sometimes with a plaid pattern. It's a little small, so the sides of her breasts are always visible and her nipples will often slip out. Besides that it doesn't cover anything besides her belly, so she's always totally bottomless.",
	"im images/shopkeep/logbook3m.png; ?flag shopkeep meat; title Perky Meat; ?trustMin "+character.index+" 2; Before you arrived shopkeepF's penis has never been hard before. That hasn't stopped her from lazily stroking it to porn, but she used to think of masturbation as a fun hobby, like stretching or exercise. But since you've arrived and since she's had her first real orgasm she can barely keep away from touching herself constantly.<br>Her balls are constantly active and in overdrive, she's had to work very hard to build up the discipline to properly edge and ruin herself, since nowadays her balls always feel so full she'd cum just a few minutes into her daily porn sessions if she wasn't so careful.",
	"im images/shopkeep/logbook3v.png; ?flag shopkeep veggie; title Perky Apples; ?trustMin "+character.index+" 2; Her breasts are cute and perky, and are quite petite. She's not the smallest gal in town, maybe not even third place, but her pair of apples serve their purpose of when she grabs and gropes at them during her very frequent, very long masturbation sessions.<br>While she's always played with it, shopkeepF's pussy has started getting much wetter even when she isn't masturbating thanks to going into heat. She used to think of masturbation as a fun hobby, like stretching or exercise, but since you've arrived and since she's had her first real femgasm, she can barely keep away from touching herself constantly.",
	"im images/shopkeep/logbook4m.png; ?flag shopkeep meat; title Fancy Feast; ?trustMin "+character.index+" 3; shopkeepF's ass is nice and tight, she gets in a lot of squats after all. She's tried anal repeatedly, eager to transform herself into the kind of anal whore she spends her private time reading about, but it's only since you've arrived and her heat began that anal has gone from 'Hrm... I guess this is alright after about an hour of preptime' to 'Holy fffFFFFUCK I'M CUMMING~!'<br>Now a whole new world is unlocked for her, and thankfully her healthy lifestyle means she'll be staying tight no matter how much fisting, anal bead stuffing, or massive dildo gaping she does while absolutely soaking every towel she owns.",
	"im images/shopkeep/logbook4v.png; ?flag shopkeep veggie; title Fancy Feast; ?trustMin "+character.index+" 3; shopkeepF's ass is nice and tight, she gets in a lot of squats after all. She's tried anal repeatedly, eager to transform herself into the kind of anal whore she spends her private time reading about, but it's only since you've arrived and her heat began that anal has gone from 'Hrm... I guess this is alright after about an hour of preptime' to 'Holy fffFFFFUCK I'M CUMMING~!'<br>Now a whole new world is unlocked for her, and thankfully her healthy lifestyle means she'll be staying tight no matter how much fisting, anal bead stuffing, or massive dildo gaping she does while absolutely soaking every towel she owns.",
];

var achievementArray = [
	{index:"2shopkeepFriend", frame: "ultraRare", name: "Shopkeep's BFF", requirements: "?trustMin shopkeep 3;", description: "Help shopkeepF buy all the porn she wants by selling items.<br>Hint: Making friends will make gathering items go way faster!", image: "shopkeep/achievement1SEX",},
	//{index:"!collect3", frame: "ultraRare", name: "Pawggers", requirements: "?collectables pogs; 999;", description: "Collect every coin. They can be found anywhere!", image: "system/trophies/collectPog",},


	{index:"z_collect0-money", frame: "ultraRare", name: "Saint of the Muns", requirements: "?flag player limited;", description: "Have over 1000 muns and accept the limited offer from mayorF and shopkeepF.", image: "system/trophies/moneyLimit",},
	{index:"z_collect1-core", frame: "ultraRare", name: "Syrup Collector", requirements: "?completed Core;", description: "Collect every Syrup Town Jiggy. They can be found gathering anywhere!", image: "system/trophies/collectJiggy",},
	{index:"z_collect2-sub1", frame: "ultraRare", name: "Batch 1 Collector", requirements: "?completed Sub Batch 1;", description: "Collect every Subscriber Jiggy from Batch 1. They can be found via digging! Hint: Jiggies disabled by your content preferences will be ignored!", image: "system/trophies/collect-sub1",},
	{index:"z_collect2-sub2", frame: "ultraRare", name: "Batch 2 Collector", requirements: "?completed Sub Batch 2;", description: "Collect every Subscriber Jiggy from Batch 2. They can be found via digging!", image: "system/trophies/collect-sub2",},
	{index:"z_collect2-sub3", frame: "ultraRare", name: "Batch 3 Collector", requirements: "?completed Sub Batch 3;", description: "Collect every Subscriber Jiggy from Batch 3. They can be found via digging!", image: "system/trophies/collect-sub3",},
	{index:"z_collect2-sub4", frame: "ultraRare", name: "Batch 4 Collector", requirements: "?completed Sub Batch 4;", description: "Collect every Subscriber Jiggy from Batch 4. They can be found via digging!", image: "system/trophies/collect-sub4",},
	{index:"z_collect2-sub5", frame: "ultraRare", name: "Batch 5 Collector", requirements: "?completed Sub Batch 5;", description: "Collect every Subscriber Jiggy from Batch 5. They can be found via digging!", image: "system/trophies/collect-sub5",},
	//{index:"!collect2", frame: "ultraRare", name: "Jiggy Assembler", requirements: "?collectables complete; 999;", description: "Complete every Jiggy. Jiggies unlocked through postal codes are not counted!", image: "system/trophies/collectComplete",},
	{index:"z_roob", frame: "ultraRare", name: "Total Roob", requirements: "?item roobSet; ?item heiressSet; ?item shinobiSet; ?item rowdySet;", description: "Collect the Roob, Heiress, Shinobi, and Rowdy outfits. They can be obtained via digging!", image: "system/trophies/roob",},
	{index:"!grottoHiero", frame: "ultraRare", name: "Biggest Friends", requirements: "?flag player centralSphinx;", description: "Find who lies at the center of the grotto hidden in the diggy minigame!", image: "system/trophies/sphinx",},
	{index:"!grottoOrb", frame: "ultraRare", name: "Grotto Maniac", requirements: "?flag player grottoComplete;", description: "Obtain every scene in the grotto hidden in the diggy minigame then use the Orb. The Orb will provide hints!", image: "system/trophies/ruinsSlimeWhite0",},
];

var itemsArray = [
];

var shopArray = [
	{index: "pet1", name: "Pet the Cat", price: 100, unique: false, event: true, image:"shopkeep/pet1-1", 
	requirements: "?location store; ?flag shopkeep petIntro; !flag shopkeep pet1; !flag shopkeep pet3;",
	desc: "If you wanna huff this fluff, it'll cost you!",},
	{index: "pet2", name: "Pet Again", price: 50, unique: false, event: true, image:"shopkeep/pet1-1", 
	requirements: "?location store; ?flag shopkeep pet1; !flag shopkeep pet2; !flag shopkeep pet3;",
	desc: "You wanna pet again, right? I'll give you a discount!",},
	{index: "fruit-gummi-bag", name: "Gummie Candies", price: 10, unique: false, event: false, image:"items/fruit-gummi-bag", 
	requirements: "?location store;", desc: "A bag of yummy candies, restores a little bit of stamina while digging.",},

	{index: "rod", name: "Fishing Rod", price: 10, unique: true, image:"items/rod", 
	requirements: "?location store;",
	desc: "A cool fishing rod. Allows you to collect fish and other items from the water.<br>Reliable. It'll never break!",},
	{index: "net", name: "Bug Net", price: 10, unique: true, image:"items/net", 
	requirements: "?location store;",
	desc: "A net for catching bugs. Allows you to collect bugs and other items from dense foliage.<br>Reliable. It'll never break!",},
	{index: "hammer", name: "Digging Kit", price: 30, unique: true, image:"items/chest", 
	requirements: "?location store;",
	desc: "A kit to help with digging up treasure. Gives you an extra 10 points of stamina and unlocks the hammer.",},

	{index: "shopkeepMagazineMeat", name: "Purrfect Purloins Vol. #1", price: 10, unique: true, image:"items/magazine", 
	requirements: "?location store; ?flag shopkeep meat;",
	desc: "The latest issue of a naughty magazine all about me.",},
	{index: "shopkeepMagazineVeggie", name: "Purrfect Purloins Vol. #1", price: 10, unique: true, image:"items/magazine", 
	requirements: "?location store; ?flag shopkeep veggie;",
	desc: "The latest issue of a naughty magazine all about me.",},

	{index: "shopkeepPog", name: "Collectable Coin", price: 5, unique: true, image:"pogs/shopkeepPog", 
	requirements: "?location store;",
	desc: "Who's that cutie on that very flippable coin?",},

	/*{index: "shopkeepMagical", name: "Magical Outfit - Shopkeep", price: 5, unique: true, image:"shopkeep/magical/happy", 
	requirements: "?location store;",
	desc: "A costume inspired by bringers of happiness and joy. Cosmetic only.<br>Once purchased, you can change character outfits in the museum.",},*/

	{index: "shopkeep-core1", name: "Jiggy Puzzle", price: 10, unique: true, image:"items/magazine", 
	requirements: "?location store;",
	desc: "A jiggy puzzle of me! You can assemble it back home.",},
	/*
	{index: "jiggy-175c", name: "Jiggy Puzzle", price: 10, unique: true, image:"items/magazine", 
	requirements: "?location store;!carnivore;?flag shopkeep meat;",
	desc: "A jiggy puzzle of me! You can assemble it back home.",},
	{index: "jiggy-175v", name: "Jiggy Puzzle", price: 10, unique: true, image:"items/magazine", 
	requirements: "?location store;!vegetarian;?flag shopkeep veggie;",
	desc: "A jiggy puzzle of me! You can assemble it back home.",},
	*/

	{index: "tarot2", name: "Tarot Card", price: 10, unique: true, 
	requirements: "?location store;!carnivore;?item tarot0;",
	desc: "A tarot card with a shark on it. It's a good omen!",},
	{index: "tarot7Meat", name: "Tarot Card", price: 10, unique: true, 
	requirements: "?location store;;?item tarot0;!vegetarian;!item tarot7Meat;",
	desc: "A tarot card with a goat on it. White and fluffy!",},
	
	{index: "pocket-eev-v-0", name: "Bootleg Card", price: 10, unique: true, 
	requirements: "?location store;!vegetarian;?item pocket-eev-0;",
	desc: "A bootleg Pocketmanz card. Near mint, I found it on the ground!",},
	{index: "pocket-eev-s-0", name: "Bootleg Card", price: 10, unique: true, 
	requirements: "?location store;!vegetarian;?item pocket-eev-0;",
	desc: "A bootleg Pocketmanz card. Near mint, I found it on the ground!",},
	{index: "pocket-avul-1-0", name: "Bootleg Card", price: 10, unique: true, 
	requirements: "?location store;!vegetarian;?item pocket-eev-0;",
	desc: "A bootleg Pocketmanz card. Near mint, I found it on the ground!",},
	{index: "pocket-avul-2-0", name: "Bootleg Card", price: 10, unique: true, 
	requirements: "?location store;!vegetarian;?item pocket-eev-0;",
	desc: "A bootleg Pocketmanz card. Near mint, I found it on the ground!",},

	{index: "clothingDye", name: "Clothing Dye", price: 20, unique: true, 
	requirements: "?location store;",
	desc: "A neato set of dyes, unlocks color selection for your clothing!",},
	{index: "genderDye", name: "Genderswap Potion (Human Only)", price: 30, unique: true, image:"items/dye", 
	requirements: "?location store;",
	desc: "Changes your gender! Genital swapping not included. It's basically boobies in a bottle! Or the opposite.<br>Allows you to change between a feminine and masculine upper body in the layers menu of the wardrobe.",},
	{index: "skinDye", name: "Skin Spray", price: 30, unique: true, image:"items/dye", 
	requirements: "?location store;",
	desc: "A special spray that allows you to change skin color! Keep away from fur, and cover the body thoroughly!<br>Allows you to change your skintone in the layers menu of the wardrobe.",},

	{index: "Flames", name: "Red Flames", price: 5, unique: true, 
	requirements: "?location store;",
	desc: "A simple shirt, extra hot!<br>It's the pinnacle of human fashion, probably.",},

	{index: "Pencil Skirt", name: "Red Pencil Skirt", price: 5, unique: true, 
	requirements: "?location store;",
	desc: "A super short pencil skirt that hides nothing at all.",},
	{index: "Pleated Skirt", name: "Red Pleated Skirt", price: 5, unique: true, 
	requirements: "?location store;",
	desc: "A simple pleated microskirt that hides nothing at all.",},

	{index: "Boots", name: "Red Boots", price: 5, unique: true, 
	requirements: "?location store;",
	desc: "A pair of the absolute cutest boots ever, just like mine!<br>Eh? No, you can't buy the ones I'm wearing... Without paying extra~",},
	{index: "Thighhighs", name: "Red Thighhighs", price: 5, unique: true, 
	requirements: "?location store;",
	desc: "A pair of super-snug thighhighs. Will never get dirty!",},
	{index: "Thighboots", name: "Red Thighboots", price: 5, unique: true, 
	requirements: "?location store;",
	desc: "A pair of boots that go up to the thigh. They look stiff!",},
	{index: "Mary Janes", name: "Mary Janes", price: 10, unique: true, 
	requirements: "?location store;",
	desc: "A pair of super cute red shoes~<br>Super comfy, and perfectly fit for human feet, I promise!",},
	{index: "Loafers", name: "Red Loafers", price: 10, unique: true, 
	requirements: "?location store;",
	desc: "A pair of loafers~<br>Dyed red to match the rest of your wardrobe!",},

	{index: "Socks", name: "Red Socks", price: 3, unique: true, 
	requirements: "?location store;",
	desc: "A pair of simple socks. It's not good to wear shoes without them.",},
	{index: "Bow", name: "Red Bowtie", price: 5, unique: true, 
	requirements: "?location store;",
	desc: "A detached collar and a red bowtie, for if you want to look like a fashionista without needing a shirt.",},
	{index: "Choker", name: "Red Choker", price: 5, unique: true,
	requirements: "?location store;",
	desc: "A red choker, guaranteed to never snap. It's barely any fabric, but I won't be offering a discount.",},

	{index: "Aloha Shirt", name: "Aloha Shirt", price: 5, unique: true,
	requirements: "?location store;",
	desc: "A breezy vacation shirt! Wear it open, it's what all the beach boys in my magazines do~",},
	{index: "Nightgown", name: "Nightgown", price: 10, unique: true,
	requirements: "?location store;",
	desc: "A silky little nightgown. Great for sleeping, even better for not sleeping, if you catch my drift~",},
	{index: "Sling Bikini", name: "Sling Bikini", price: 10, unique: true,
	requirements: "?location store;",
	desc: "It's technically swimwear! Technically. Don't ask me how much it covers, the answer is 'yes, barely'.",},
	{index: "Bunny Leotard", name: "Bunny Leotard", price: 10, unique: true,
	requirements: "?location store;",
	desc: "A classic! Pair it with the ears and some heels and you'll be the hottest bunny in a town full of cats.",},
	{index: "Swimsuit", name: "Swimsuit", price: 10, unique: true,
	requirements: "?location store;",
	desc: "A snug one-piece swimsuit. Very sporty, very tight. Meow~",},
	{index: "Thong", name: "Thong", price: 5, unique: true,
	requirements: "?location store;",
	desc: "Barely a string! I'd charge less, but somebody's gotta pay for the fabric they didn't use.",},
	{index: "Fishnets", name: "Fishnets", price: 5, unique: true,
	requirements: "?location store;",
	desc: "A pair of fishnets! No fish were harmed, but I can't promise the same for anyone who sees you in them~",},
	{index: "Horny Hat", name: "Horny Hat", price: 5, unique: true,
	requirements: "?location store;",
	desc: "Named for the shape, not the mood. Probably. I haven't checked.",},
	{index: "Bunny Ears", name: "Bunny Ears", price: 5, unique: true,
	requirements: "?location store;",
	desc: "A headband with a pair of floppy bunny ears. Real ears not included, you'll have to settle for cute ones.",},
	{index: "Second Hat", name: "Second Hat", price: 5, unique: true,
	requirements: "?location store;",
	desc: "For when one hat just isn't enough! Don't ask where the first one went, I don't keep receipts.",},
	{index: "scrapbook", name: "Scrapbook", price: 50, unique: true, event: true, image: "system/ui/scrapbook",
	requirements: "?location store; !flag player scrapbook;",
	desc: "A sturdy little album for all those big pictures you humans keep finding. Buy one and you'll never lose a favorite again.",},

	{index: "shopDonate", name: "Donate Directly", price: 0, unique: false, event: true,
	requirements: "?location store;",
	desc: "Donate directly to my porn fund! My supplies are limited, but your generosity doesn't have to be!",},

	{index: "watch-identify", name: "Identify this Artifact", price: 0, unique: false, event: true, image:"artifacts/watch1", category: "artifact",
	requirements: "?location store; ?flag player watchReady; !item watch;",
	desc: "You found something weird while digging? Lemme see!",},
	{index: "hole-identify", name: "Identify this Artifact", price: 0, unique: false, event: true, image:"artifacts/hole1", category: "artifact",
	requirements: "?location store; ?flag player holeReady; !item hole;",
	desc: "You found something weird while digging? Lemme see!",},
	{index: "pill-identify", name: "Identify this Artifact", price: 0, unique: false, event: true, image:"artifacts/pills1", category: "artifact",
	requirements: "?location store; ?flag player pillReady; !item pill;",
	desc: "You found something weird while digging? Lemme see!",},
	{index: "cherry-identify", name: "Identify this Artifact", price: 0, unique: false, event: true, image:"artifacts/cherry1", category: "artifact",
	requirements: "?location store; ?flag player cherryReady; !item cherry;",
	desc: "Is that a pair of fat orbs in your pants, or...?",},
	{index: "tv-identify", name: "Identify this Artifact", price: 0, unique: false, event: true, image:"artifacts/tv1", category: "artifact",
	requirements: "?location store; ?flag player tvReady; !item tv;",
	desc: "You found something weird while digging? Lemme see!",},

	
	{index: "jiggyCore", name: "Core Jiggy Collection", price: 1000, unique: false, event: true, image:"treasure/chest-green-trove", category: "sphinx",
	requirements: "?location centralSphinx; !complete Core;",
	desc: "Every single jiggy from the 'Core' set you don't already have.",},
	{index: "jiggyCozy", name: "Cozy Jiggy Collection", price: 1000, unique: false, event: true, image:"treasure/chest-green-trove", category: "sphinx",
	requirements: "?location centralSphinx; !complete Cozy;",
	desc: "Every single jiggy from the 'Cozy' set you don't already have.",},
	{index: "jiggySummer", name: "Summertime Jiggy Collection", price: 1000, unique: false, event: true, image:"treasure/chest-green-trove", category: "sphinx",
	requirements: "?location centralSphinx; !complete Summertime;",
	desc: "Every single jiggy from the 'Summertime' set you don't already have.",},
	{index: "jiggyFleshy", name: "Non-Furry Jiggy Collection", price: 1000, unique: false, event: true, image:"treasure/chest-green-trove", category: "sphinx",
	requirements: "?location centralSphinx; !complete Non-Furry;",
	desc: "Every single jiggy from the 'Non-Furry' set you don't already have.",},
	{index: "fruit-gummie-box", name: "Box of Candy", price: 100, unique: false, event: true, image:"items/fruit-gummi-box", category: "sphinx",
	requirements: "?location centralSphinx;",
	desc: "A box of yummy candy, restores up to 60 stamina.",},

	
	{index: "jiggyChest", name: "Trove of Older Jiggies", price: 10, unique: false, event: true, image:"treasure/chest-green-null", category: "jiggy",
	requirements: "?location centralSphinx; !complete OLD;",
	desc: "A single random jiggy from previous subscriber batches.",},
	{index: "jiggyTrove", name: "Trove of Older Jiggies", price: 100, unique: false, event: true, image:"treasure/chest-green-trove", category: "jiggy",
	requirements: "?location centralSphinx; !complete OLD;",
	desc: "Up to ten random jiggies from previous subscriber batches.",},
];

var pickupArray = [
	{index: "gathering", requirements: "?location lavenderLane; ?flag carpenter orchard;", top: 10, left: 78, event: true, size: 10, image: "items/fruit/generic"},
	{index: "gathering", requirements: "?location lavenderLane;", top: 10, left: 8, event: true, size: 10, image: "items/fruit/generic"},
	{index: "gathering", requirements: "?location forestPath;", top: 10, left: 8, event: true, size: 10, image: "items/fruit/generic"},
	{index: "gathering", requirements: "?location forestWilderness;", top: 10, left: 78, event: true, size: 10, image: "items/fruit/generic"},
	{index: "gathering", requirements: "?location forestOrchard;", top: 35, left: 5, event: true, size: 8, image: "items/fruit/generic"},
	{index: "gathering", requirements: "?location forestOrchard; ?flag carpenter orchard;", top: 35, left: 63, event: true, size: 8, image: "items/fruit/generic"},

	{index: "fishing", requirements: "?location lakesideRetreat; ?item rod;", top: 35, left: 40, event: true, size: 15, image: "items/rod"},
	{index: "fishing", requirements: "?location lakesideRetreat; ?item rod;", top: 35, left: 40, event: true, size: 16, image: "items/rod"},
	{index: "fishing", requirements: "?location riversideRoad; ?item rod;", top: 66, left: 20, event: true, size: 15, image: "items/rod"},
	{index: "fishing", requirements: "?location lakesideRuins; ?item rod;", top: 60, left: 20, event: true, size: 15, image: "items/rod"},

	{index: "hunting", requirements: "?location willowWalk; ?item net;", top: 50, left: 55, event: true, size: 12, image: "items/net"},
	{index: "hunting", requirements: "?location forestPath; ?item net;", top: 50, left: 5, event: true, size: 15, image: "items/net"},
	{index: "hunting", requirements: "?location forestWilderness; ?item net;", top: 50, left: 5, event: true, size: 15, image: "items/net"},
	{index: "hunting", requirements: "?location forestWilderness; ?item net;", top: 40, left: 69, event: true, size: 15, image: "items/net"},

	{index: "exploration", requirements: "?location forestGather1;", bottom: 0, right: 0, event: true, size: 15, image: "items/questionOutlined"},
	{index: "exploration", requirements: "?location forestGather2;", bottom: 0, right: 0, event: true, size: 15, image: "items/questionOutlined"},
	{index: "exploration", requirements: "?location forestGather3;", bottom: 0, right: 0, event: true, size: 15, image: "items/questionOutlined"},
	{index: "exploration", requirements: "?location ruinsGather1;", bottom: 0, right: 0, event: true, size: 15, image: "items/questionOutlined"},
	{index: "exploration", requirements: "?location ruinsGather2;", bottom: 0, right: 0, event: true, size: 15, image: "items/questionOutlined"},
	{index: "exploration", requirements: "?location ruinsGather3;", bottom: 0, right: 0, event: true, size: 15, image: "items/questionOutlined"},
];

var morningArray = [
	{index: "shopkeepMorning-mayor", requirements: "?trustMin shopkeep 1; ?trustMin mayor 1;", unique: false,},
	{index: "shopkeepMorning-carpenter", requirements: "?trustMin shopkeep 1; ?trustMin carpenter 1;", unique: false,},
	{index: "shopkeepMorning-wolf", requirements: "?trustMin shopkeep 1; ?trustMin wolf 1;", unique: false,},
	{index: "shopkeepMorning-sadogato", priority: 1, requirements: "?trustMin shopkeep 1; ?trustMin sadogato 1;", unique: false,},
	{index: "shopkeepMorning-milf", priority: 1, requirements: "?trustMin shopkeep 1; ?trustMin milf 1;", unique: false,},
	{index: "shopkeepMorning-nun", priority: 1, requirements: "?trustMin shopkeep 1; ?trustMin nun 1;", unique: false,},
	{index: "shopkeepMorning-mesu", priority: 1, requirements: "?trustMin shopkeep 1; ?trustMin mesu 1;", unique: false,},
	{index: "shopkeepMorning-fash", priority: 1, requirements: "?trustMin shopkeep 1; ?trustMin fashionista 1;", unique: false,},
	{index: "shopkeepMorning-hyena", priority: 1, requirements: "?trustMin shopkeep 1; ?trustMin hyena 1;", unique: false,},
	{index: "hot-1", priority: 1, requirements: "?trustMin shopkeep 1;", unique: false,},
	{index: "bath-1", priority: 1, requirements: "?trustMin shopkeep 1;", unique: false,},
	{index: "nightmare", priority: 1, requirements: "", unique: false,},
];

var encounterArray = [
	{name: "Ivy & Oak General Store", index: "intro1", top: 35, left: 66, type:"button", time: "MorningEvening", requirements: "?flag player intro; ?location riversideRoad;"},
	{index: `dungeonSelect`, name: `Play a video game`, requirements: "?location playerHouse; ?item goonboy;", altName: "Goonboy Advance", altImage: "items/goonboy",},
	{index: "pet3", type: "walking", requirements: "?location store; ?flag shopkeep pet2; !flag shopkeep pet3;"},
	{index: "moneyLimitIntro", type: "walking", requirements: "?location lavenderLane; !flag shopkeep moneyLimit; ?money 1001;"},
	{index: `plug2Shop`, name: `Ask shopF about the strange artifact`, requirements: "?location store; ?trustMin shopkeep 1; ?flag deity artifact; ?trustMax deity 1; !flag deity shopAsked;", altName: "", altImage: "",},
];

var sceneArray = [
	{index: `intro1`,
	content: `
		t You take a step inside of the local store, "Ivy & Oak".
		t Almost immediately, an excited voice calls out. "Welcome! The name's <input type='text' id='nameSubmission-shopkeep' value='shopkeepF'>"
		eval introFunction("shopkeep");
	`,},
	{index: `intro2`,
	content: `
		shopkeep happy Shopkeep and saleslady extraordinaire! And you're a human!
		t She gets right up next to you, making it abundantly clear that without a counter the only thing between the two of you is a single apron that doesn't even reach down to her crotch.
		shopkeep sparkle You just arrived, right?<br>Did you bring any porn?
		player worried N-no...
		shopkeep shock Aw, man! Come on, you humans are supposed to be total sex freaks! Nothing? No nudie magazines? Erotic comics? Gooner audio compilations?
		player shock No, sorry! I was just hoping to learn more about something called 'heat', and maybe how I could make some money around here.
		shopkeep frown Tsk. Thought I'd struck gold for once.
		shopkeep happy Well, money's easy. Bugs, fruit, fish, I'll buy all of them off you. <br>We don't normally allow humans, so we're super insular. We've got a really healthy ecosystem, so pretty much everything here can be sold to health-nuts outside of town!<br>The only downside is that our heat cycles have been going a bit wonky, but that's why you're here, right?
		player worried I guess so...
		shopkeep Relax! It's really simple. Nobody around here has been getting horny, which means no kids, no honeymoons, no sex, the works.<br>mayorF's latest idea is, well, you!
		shopkeep sparkle You just be yourself, easy peasie!
		player worried This is all a bit much to take in at once...<br>But just be myself? That doesn't sound too hard.
		shopkeep happy Well, it'd help if you spread your pheromones around a bunch.<br>Exercise, sex, anything that gets you sweating. It's in your cum too.
		player happy Well, if it really is that easy, I'll do my best!
		shopkeep happy That's the spirit! Good luck getting hitched!<br>I'm not looking to get settled down myself, but I'm always here if you need a hand with anything else.<br>I recommend heading down to Willow Walk, it's a great place to start gathering stuff to sell.<br>You don't need any special tools to pick fruit after all.
		player And then-
		shopkeep sparkle And then I'll resell it to buy porn! It's a win-win!
		player worried Hey, I thought you said people around here weren't getting horny?
		shopkeep frown Yeah! Which is why I need harder stuff!<br>It doesn't help that mayorF's got an internet filter set up. Why's life got to be so hard for a good kitty?
		shopkeep happy But luckily I have connections to get around that. I actually run a 'human studies' club before the store opens each day, early early in the morning. You should come by sometime!
		player happy I prefer to sleep in, sorry.<br>But I'll definitely be back soon with something to sell!
		shopkeep sparkle Great! Although you should probably get some sleep, you look like you're about to pass out!
		player worried It is getting a little dark out...
		shopkeep happy Well, I'll be here tomorrow, so don't worry about it! I'll be waiting for you! Oh, and take this to commemorate our meeting!
		t shopF hands you a small cardboard box, it's full of small puzzle pieces.
		shopkeep I sell plenty more cool stuff like this. I checked out your house on Lavender Lane already though, it's a little small. You should get carpenterF to build you a wardrobe or something.
		shopkeep sparkle See you later!
		special All preferences have finished being set! Be sure to customize more fetish preferences in the settings menu to disable content such as rimming if desired, or to change the gender of mayorF, carpenterF, and shopkeepF.
		eval removeFlag("player", "intro");
		eval removeFlag("mayor", "mayorIntro");
		eval removeFlag("carpenter", "carpenterIntro");
		eval addFlag("player", "easyJiggy");
		eval passTime();
		button Head outside; changeLocation('riversideRoad');
	`,},

	{index: `shopkeepMorning-mayor`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town, and the Ivy & Oak General Store's door opens for her first customer of the day. 
		t *DING A LING*
		shopkeep Welcome, welcome! What can I get for you today?

		mayor excited H-hello...
		shopkeep worried Ah, mayorF. Goodness, you look beat. Right, I've got your order right here.
		mayor A-and you didn't peek, right?
		shopkeep sparkle Of course not! I'm a professional. It's a shame though, if I did, I would be able to recommend some similar products.
		mayor shock That w-won't be necessary!
		shopkeep happy Okay, but for realsies, can I ask why? No judgement, but you're the only one in town who can bypass the filter and look this stuff up for free.
		mayor worried ... It's different, holding it physically. N-not that-
		shopkeep sparkle Oh-hoh! I see! I guess the grass just <i>looked</i> greener, good to know I'd appreciate my stash even if I had unfiltered internet access.
		mayor shock Stash?!
		shopkeep happy No need to worry about that. Now, no judgement, but for you I've got a few petplay dou-
		mayor N-no thank you! I'll be going now!
		shopkeep happy I'll keep them handy for you if you change your mind!

		trans cancel; Finish
	`,},
	{index: `shopkeepMorning-carpenter`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town, and the Ivy & Oak General Store's door opens for her first customer of the day. 
		t *DING A LING*
		shopkeep Welcome, welcome! What can I get for you today?

		carpenter Hmm... Maybe today, some coffee?
		shopkeep shock Wha-?! carpenterF, are you feeling alright?
		carpenter Decaffinated, of course.
		shopkeep sleep Oh, gotcha. Coming right up.


		trans cancel; Finish
	`,},
	{index: `shopkeepMorning-wolf`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town, and the Ivy & Oak General Store's door opens for her first customer of the day. 
		t *DING A LING*
		shopkeep Welcome, welcome! What can I get for you today?

		wolf Yoohoo~!
		shopkeep sparkle Well, if it isn't my favorite customer!
		wolf Oh stop~<br>But if you absolutely must go on...
		shopkeep sparkle Should I? Or should we perhaps start talking merchandise~?
		wolf sparkle No... It's arrived?
		shopkeep happy You came at the perfect time. Behold!
		wolf Goodness... It's beautiful!
		shopkeep Custom made in exactly your usual style, every thread-
		wolf Is a beautiful seafoam green~! I must have it, immediately!
		shopkeep Of course! You know, I was given some advice to offer discounts to repeat customers. As a form of grati-
		wolf angry Absolutely not! Fashion is only worth what you've paid for. And I can't imagine paying you a single mun less for this masterpiece! If anything, I should be paying more!
		shopkeep shock That...
		shopkeep sparkle Is exactly why you're my best customer! wolfF, will you make me the happiest woman in the world, and pay double price for this dress?
		wolf sparkle Yes, yes! God's love for me, yes!


		trans cancel; Finish
	`,},
	{index: `shopkeepMorning-sadogato`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town, and the Ivy & Oak General Store's door opens for her first customer of the day. 
		t *DING A LING*
		shopkeep Welcome, welcome! What can I get for you today?

		sadogato ...
		shopkeep shock A-ah. Madame sadogatoF, I wasn't expecting you just yet.
		sadogato But it's arrived.
		shopkeep worried Right! Yes, of course it has, it's just... How did you know?
		sado glare A foolish question.
		shopkeep shock Eep! Right, sorry, here you are!
		sadogato frown Yes... This is it. The last piece of the puzzle.
		shopkeep worried S-so then...?
		sadogato frown You have served me well. As thanks for procuring this sacred tome, take your reward.
		shopkeep sparkle G-gold~! Pure, beautiful gold~! Thank you so much Madame sadogatoF! If you ever need anything else-
		sadogato Then you will know about it. 
		shopkeep happy Right!
		shopkeep worried Ah, before you go. Madame sadogatoF? Can I ask something?
		sadogato Carry yourself with pride, my sister in species. You ought to embrace your feline nature, and you've done well enough I can answer a single question. Speak.
		shopkeep shock R-right! I'm sorry, but... I know you told me that sacred teachings are often hidden in code, but...<br>I don't understand what message "constellation bedtime rhymes for sleepy kittens" could be hiding...
		sadogato Hmph. I expected better from you. Here. Educate yourself.
		shopkeep shock R-really?! You're just giving me this sacred text? Thank you! I may not be able to crack the code, but I'll ready it front to back!
		sadogato sparkle Really?!
		sadogato frown *Ahem*<br>See that you do. Knowledge is the source of dignity. Better to be wise and alone than a fool surrounded by savages.
		shopkeep sparkle Such wisdom! Thank you Madame!


		trans cancel; Finish
	`,},
	{index: `shopkeepMorning-milf`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town, and the Ivy & Oak General Store's door opens for her first customer of the day. 
		t *DING A LING*
		shopkeep Welcome, welcome! What can I get for you today?

		milf worried Ooh~<br>Mornin', shug. 
		shopkeep Morning milfF! Garden treating you well?
		milf happy You know it. The foliage here is always singin' me a cheery tune. Well, best as plants can, anywho.<br>How you doin', darlin'?
		shopkeep sparkle Wonderful! Today's looking to be a dream! Speaking of dreams, guess who's got the new pillow in stock!
		milf Good to hear. I'll take it.
		shopkeep worried Do you think this will help?
		milf worried Well, to be honest, I ain't holdin' my breath. These needy pair o' milkers just won't stop barkin' for my attention... Those tips ya' gave were the only thing so far that's made a difference.
		shopkeep worried Sorry milfF. If it helps, I've got more, free of charge. I keep selling you duds anyways, I figure I should try and make up for it somehow.
		milf happy Darlin'! You ain't hockin' duds! I'm just a basket case of nonsense. If you could spare that advice anyways I'd be mighty grateful though.
		shopkeep happy Of course! Now, did the pinching technique work?
		milf happy Plum did! It was tough managin' with my hooves, but cappin' the massage off with a good, nice nipple assault had me quakin' with relief!
		shopkeep sparkle Perfect! Okay, now, the next thing you should look into is called a milking machine. Humans invented them to remove the work from the breast pumping!
		milf shock Yer yankin' my tail! My big ol' tankers have my arms howlin', and you're sayin' that humans have it automated?!
		shopkeep Yeah! I'll have one ordered. The models made for cows are expensive but I'll give you a discount. To be honest, I'd lose less giving it to you for free than if you asked for refunds for all my defective products.
		milf worried Oh, bless yer heart! shopkeepF, I could smother ya right now!
		shopkeep shock Please don't, I'd probably suffocate!


		trans cancel; Finish
	`,},
	{index: `shopkeepMorning-nun`,
	content: `
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, it's a quiet day in Syrup Town, and the Ivy & Oak General Store's door opens for her first customer of the day. 
		t *DING A LING*
		shopkeep Welcome, welcome! What can I get for you today?

		nun Hmm...
		shopkeep Oh, hello! I haven't seen you around! Strange, I thought I knew everyone in town.
		nun We haven't had much reason to meet. In any case, I'm here for some ingredi...
		nun shock What... Is... This?!
		shopkeep Hmm? Oh, the calendar?
		nun sparkle Oh my goodness~! Look at this! Each picture... Is...!
		shopkeep Yeah? They've got humans in them. Not many ones themed around us animal folks.
		nun angry And why should there be? Who would want to decorate their dates with <i>furries</i> when they could be graced with human flesh~!
		shopkeep worried Uh... Normal people? I guess? That one's just a hiking themed calendar, it's not even risque.
		nun shock No... You have... <i>More</i>? And better than this?
		shopkeep happy Yeah! Humans do wacky photoshoots all the time. Sometimes even fully nude!
		nun excited Dear Lord...
		shopkeep I've got a few in the back, but I can order more. Plus if you're just in it for the pictures, out of date calendars cost less than the paper they're printed on.
		nun excited I'll take them all.
		shopkeep shock L-like... All the ones I've got in the back?
		nun excited All of them.
		shopkeep worried ...
		shopkeep sparkle You got it! Everything on the menu, what's your budget?
		nun sleep Cost is but a number. I'll pay your weight in muns in a heartbeat.
		shopkeep Ooh baby, that's what I like to hear! I think we'll be good friends!
		nun Yes. I see now that your shop was worth my time after all~


		trans cancel; Finish
	`,},
	{index: `shopkeepMorning-mesu`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town, and the Ivy & Oak General Store's door opens for her first customer of the day. 
		t *DING A LING*
		shopkeep Welcome, welcome! What can I get for you today?

		mesu Any new collectables?
		shopkeep Oh, I think Evil Dragon just released another model, actually, but-
		mesu sparkle Really?!
		shopkeep worried Sorry mesuF, it's one of those vaginal models.
		mesu worried Oh...
		shopkeep happy How come you only bother collecting the penis models? I feel like the other types are cool too, and you're one of the most well-off folks in town!
		mesu shock Oh, um... Shelf space?<br>Shelf space! That's it, not enough room.
		shopkeep Oh, that makes sense, you only order the stuff in the biggest sizes after all.
		mesu angry N-no! That's not true. Some tentacle models-
		shopkeep shock Right, right, sorry. I'll always ask, I promise. Hey, can I say something serious for a second?
		mesu happy What's up?
		shopkeep worried I wanted to apologize. See, I used to... Well, I used to tease you about the stuff you ordered from them... I thought you were buying them to...<br>Well, it doesn't matter.
		shopkeep sleep But seeing you come in day after day asking for dicks so brazenly? Not to mention getting them in sizes no folk could ever take? I really misjudged you. I know now that you're just an avid anatomy fan, but I... I used to think you were a pervert... Can you ever forgive me?
		mesu shock Of course! Oh jeez, it's totally okay! I noticed the teasing, actually, I thought it was just you being friendly!
		shopkeep sparkle Oh it totally was! See, I'm actually something of a pervert myself. I even own an Evil Dragon model myself, although my heart isn't as pure as yours. I used mine to... 
		shopkeep worried Well, it doesn't matter. It was a model half the size of your last one, It was a huge pain in more ways than one, and I couldn't even make a good amount of progress.
		mesu sparkle Oh! That's no problem at all. Heat will totally fix that for you, but what you can do in the meantime is first off go with your fingers and then fist, and just let it sit in there without actually moving. That adjustment period is... 
		mesu worried The most...
		shopkeep worried Are... Was I wrong? Are you... Actually...?
		mesu shock I-
		shopkeep sparkle BEST FRIEND MATERIAL?! <br>You gotta teach me more! I keep reading comics where the boys are squirting messes, but I can never get there!
		mesu shock W-well, they take creative liberties. Actually, without going into heat, when some people do anal, they just, uh...
		shopkeep sparkle So now that the human's here... Oh, I gotta try out  Bumble Hooves again! I finally have a teacher!
		mesu worried ... I kinda miss when you were just teasing me...

		trans cancel; Finish
	`,},
	{index: `shopkeepMorning-fash`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town, and the Ivy & Oak General Store's door opens for her first customer of the day. 
		t *DING A LING*
		shopkeep Welcome, welcome! What can I get for you today?

		shopkeep sparkle Ah, fashF, you're right on time~!
		fash sparkle Oh~? Has it arrived?
		shopkeep Of course~! And in mint condition too~! And...
		fash happy The payment! In full, you'll find.
		shopkeep sparkle Ooh~! Here you are!
		shopkeep happy I will say though, why this one? Aren't there cheaper models of collar?
		fash Oh my adorable blueberry of a friend, this one's special~! This one's custom made to be just tight enough it feels like being lightly choked~
		shopkeep worried And... That's a good thing?
		fash sparkle Good enough I'll pay well if you come across any more~
		shopkeep sparkle Then that's good enough for me~!

		trans cancel; Finish
	`,},
	{index: `shopkeepMorning-hyena`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
		t Morning comes, it's a quiet day in Syrup Town, aside from a pair of townsfolk chattering the early hours of the day away.
		hyena panic Uh... Yeah! I totally know what that thing is. It's a, uh... Oof, the name's escaping me.
		shopkeep worried Right, of course you'd know what a ball-stretcher is.
		hyena shock ...!?
		shopkeep worried I really thought I'd have you stumped by now. How'd you even learn about all this human stuff anyways?<br>I can understand knowing what a dildo is, but a cock ring? Sounding beads? 
		hyena blush W-well, I definitely haven't just been bluffing my way through our talks together!
		shopkeep happy Obviously! You don't usually show up to classes, so I always figured you already had this stuff down pat somehow.
		shopkeep sparkle Ooh! Hey, what if you handled teaching the next human culture class! I was thinking the next one could be on tribadism!
		hyena panic Well, I mean...
		shopkeep happy One of the girls in the reference materials has a jacket just like yours too! This'll be perfect! Here's a copy?
		hyena worried Uh...<br><i>Butch Goddesses from Lesbos, Anthology 3? What on earth is... Scissoring?</i>
		shopkeep sparkle So, when are you free?
		hyena panic Uhhh...

		trans cancel; Finish
	`,},
	{index: `nightmare`,
	content: `
		t You lay down for the night. Sweet dreams!
		t ...
		player tired Mmmgh... Huh?
		t *POP*
		shop worried Ghh... Thanks...
		im shopkeep/nightmareSEX
		player scared H-huh?! Your tail is... Fake?!<br>NOOOOOO-!
		t *Thud*
		t You rub your head gently as you wake up from a horrible nightmare.
		player cry Oh... Thank goodness... Just a dream.
		finish
	`,},


	{index: `placeholder`,
	content: `
		eval writeTest('`+character.index+`')
	`,},
	{index: `exploration`,
	content: `
		eval ruinsGathering("")
		eval unencounter('shopkeep')
	`,},
	{index: `gathering`,
	content: `
		eval gathering("Gathering")
		eval unencounter('shopkeep')
	`,},
	{index: `fishing`,
	content: `
		eval gathering("Fishing")
		eval unencounter('shopkeep')
	`,},
	{index: `hunting`,
	content: `
		eval gathering("Hunting")
		eval unencounter('shopkeep')
	`,},
	{index: `statusQuo`,
	content: `
		eval shopkeepQuo();
	`,},
	{index: `plug2Shop`,
	content: `
		t You pull out the strange artifact and hold it up for shopF to see.
		shop confused ... I've never seen this sort of thing before in my life.
		player amused You're joking, right?
		shop befuddled No? Should I be?
		player confused But... It's clearly a buttplug.
		shop worried playerF, I know what a buttplug looks like. And feels like. This is more like a... Uh...
		shop befuddled Okay, so I honestly have no idea what I'm looking at, but it's definitely weird.<br>And what's extra weird is I can't explain why, but I'm definitely getting the vibe that this <i>isn't</i> a sex toy.
		shop scared ... Which is honestly kinda scary.
		player worried Maybe it looks different to you than it does to me?
		shop worried Maybe. I don't mind shoving new things up my holes, but I draw the line at shoving <i>mysterious</i> things up my holes. Especially ones that make me feel less horny looking at them by the second.<br>Maybe someone else in town can help, sorry.
		eval addFlag('deity', 'shopAsked');
		finish
	`,},
	{index: `cancel`,
	content: `
		eval unencounter(data.player.currentCharacter);
		eval changeLocation(data.player.location);
	`,},
	{index: `chSexToggle`,
	content: `
		eval unencounter(data.player.currentCharacter);
		toggleflag shopkeep; meat
		toggleflag shopkeep; veggie
		eval diagnostic('sex em up');
	`,},
	{index: `shopDonate`,
	content: `
		shop sparkle Wow, for real?! Wow, thanks! I'll put this to good use, I promise!
		eval data.player.shopkeepSales = salesGoal;
		cancel
	`,},
	{index: `wall1`,
		content: `
			eval writeEvent('wall1')
			eval addFlag('shop', 'wall1')
			eval passTime();
			eval addFlag('carpenter', 'dailyWall')
			finish
		`
	},
	{index: `hot-1`,
		content: `
			t It's a brand new day in syrup town...
			t And it's an absolute scorcher!
			im hot1SEX
			shop sleep Ahhh~<br>Nothing quite like a nice breeze.<br>I have no idea how humans manage to wear clothes all day.
			trans cancel; Finish
		`
	},
	{index: `bath-1`,
		content: `
			shop sleep Mmm~!
			im bath1SEX
			shop excited Mmm, seriously, how do humans ever get anything done...<br>Testing new toys eats up so much time, I have to multitask wherever I can~<br>Good thing, gff... Fuck me, feels so good~<br>Can't finish without the human around, but... Feels good anywaysss~!
			trans cancel; Finish
		`
	},
	{index: "pill-shopkeep", 
	content: `
		eval writeEvent(data.player.currentScene)
		eval data.player.time = "Night";
		eval data.player.holiday = "";
		finish
	`},
	{index: "cherry-shopkeep", 
	content: `
		define playerduo = dual sp1 player; sp2 player;
		player shock Whoa there!
		player confused What's up, other me?
		player worried Last time, didn't we... Or, I guess, you and past me, or...
		player befuddled Ah, this is too confusing!
		player annoyed Well, whatever! Look, I'm trying to say that shopF seemed really exhausted after the last time she had two humans at once.<br>She's probably still a bit tired, we should give her a break for the day.
		player happy Y'know, I bet that's a great idea! I was actually thinking the same thing!
		playerduo sparkle I guess identical minds think alike!
		t ...
		shop tired ... Was any of that even real?<br>I mean, it had to be a dream, right?<br>But then, where'd all the cum come from?
		shop crying But if it was real, why can I barely remember it?!<br>Wahhh! I wanna do-over!
		t ...
		player happy Alright, let's go find someone else to spend time with.
		trans cancel; Finish
	`},
	{index: "watch-start-shopkeep", 
	content: `
		eval writeEvent(data.player.currentScene)
		eval addFlag('shop', 'watchStart')
		finish
	`},
	{index: "watch-finish-shopkeep", 
	content: `
		eval writeEvent(data.player.currentScene)
	`},
	{index: "hole-shopkeep", 
	content: `
		eval writeEvent(data.player.currentScene)
		t You're dragged by the arm to the shop, where you see shopF face-down on the floor. And so mayorF explains the situation...
		t ...
		player worried Oh geez, that could have gone poorly...
		mayor frown Exactly! Just look at her, poor cat...
		shop broken Ghhoooohhh~<br>Muh... Mrrrreee...
		mayor pent ... I guess she's fine. Are cats naturally masochistic, or is it just the ones in this town...<br>Look, I don't know if that magic... Thing... Is a good fit for you.
		player scared Eh?! But this is my friend ('s butthole)!<br>I promise, I'll be more responsible!<br>Pleasepleaseplease, we've bonded!
		mayor pent I wasn't... Look, I need you spreading pheromones, not cooped up in your home mating with people through portals...<br>Although, actually, I guess we could...<br>Wait, that's it! Fine, you can keep it, and any others like it, on one condition.
		mayor horny No washing! Right now that hole is full of a perfect means to trigger heat.<br>We, er... I mean, you leave the cleaning to someone else, understood?<br>I volunteer, of course.
		player surprised You'd really take care of that for me?<br>Wow... You're a true friend, mayorF!
		mayor excited Mhm... Okay, now, is there any left in there...?<br>I'll have it returned back to you when I'm done, I shouldn't be long.
		player sleep Sure thing!<br>So responsible...
		t You decide to leave the cleaning of your onaholes to mayorF and head home.
		t ...
		shop orgasm Ghouuuh~! Ngghhh, s-stuhhhhhhpppp~
		mayor flirting Quiet. Mmm...<br>You brought this on yourself.
		eval removeFlag('shop', 'holeReady')
		eval addFlag('shop', 'holeFinish')
		finish
	`},
	{index: "petIntro", 
	content: `
		shop teasing Mmmnope.
		player shock ...!
		player scared ...?!
		player crying ...!
		shop laughing Ahaha~! I can't get enough of how easy you are to read!
		shop amused Anyways, the answer is no, no petting, at least not for free.
		player shock Wait! So then there's a chance?!
		shop sleep Maaaaybe. If you follow some pretty strict rules. And no bending them, even if I ask you to.<br>See, unlike the rest of the town I know how crazy humans can get over petting a cat.<br>I have a bit of an addictive personality myself.
		shop worried ... Which we won't be going into. But let's just say I don't trust myself around catnip anymore for a reason.
		shop Anyways, only once per day, you pay up first, and just one minute max.
		player love How much? I can go get my life savings right now.
		shop mocking Hmm~ Good question~
		eval addFlag('shop', data.player.currentScene)
		cancel
	`},
	{index: "pet1", 
	content: `
		eval writeEvent(data.player.currentScene)
		eval addFlag('shop', data.player.currentScene)
		eval addFlag('shop', "busy")
		eval passTime();
		eval data.player.location = "riversideRoad";
		finish
	`},
	{index: "pet2", 
	content: `
		eval writeEvent(data.player.currentScene)
		eval addFlag('shop', data.player.currentScene)
		eval addFlag('shop', "busy")
		eval passTime();
		eval data.player.location = "riversideRoad";
		finish
	`},
	{index: "pet3", 
	content: `
		eval writeEvent(data.player.currentScene)
		eval addFlag('shop', data.player.currentScene)
		eval addFlag('shop', "busy")
		eval passTime();
		eval data.player.location = "riversideRoad";
		finish
	`},
	{index: "moneyLimitIntro", 
	content: `
		im mayor/moneyLimit1-1
		shop crying Please accept my apology!
		player shock Wah! What's this about?!
		shop Abuhuhuhuuu...
		mayor tired So, shopF here has been paying you for odd jobs around town, yes? Fish, fruit, digging things up, and so on.
		mayor angry There was <i>supposed</i> to be a cap on that. Some reasonable amount-
		shop It's not my *Sniff*<br>Not my fault I'm bad at math!<br>I just screwed up, it's not my fault!
		player amused D'aww, it's alright shopF, I'm bad at it too. All is forgiven.
		shop sparkle Yay~!
		mayor fury No you aren't! And you don't get to be an expert at compound interest when it suits you, and bad at math when you're in trouble!
		shop crying Aww!
		mayor tired Look, anyways, how many muns has she given you? Those things are made out of precious minerals... <i>I think</i>...
		shop worried I mean, it wasn't <i>that</i>-
		player happy I've got `+data.player.money+`. Exactly.
		dual sp1 mayor; sp2 shopkeep; scared ...
		mayor panic That's way too much! You'll devalue the entire economy!
		shop panic How are my goods supposed to feel like they're worth anything when you have that many muns!?
		player annoyed Well, they're mine. I don't wanna go foraging again.
		mayor scared But that's a huge problem!<br>You going out every day and scavenging-
		shop panic I'll never get to see that ass on all fours searching for fruit again?!
		mayor tired ... Priorities, shopF.<br>Look, we need to solve this. You walking around with that many muns means everything might as well be free.<br>If you think about it, life is really just a series of obstacles, and rewards are just the motivations for overcoming those hurdles.<br>So, while it might seem sensible to remove the obstacles from your life, if you do, then nothing in life will actually have any-
		shop amused Booooring~<br>Let's get to the point. playerF, please limit yourself to... Say... A thousand muns at once. And also, here's a small knapsack to keep items you find in the future.<br>As much as I love the idea of holding some fruit you smuggled down your shorts-
		player annoyed I don't wanna.
		shop scared Eh?!
		mayor tired I told you *he wouldn't just go for it!<br>playerF, we won't take it by force. But-
		shop panic If you do, I'll give you my limited edition movie tie-in crocs!
		player frown Hmn...
		shop scared And, uh... Um... mayorF will show you her boobs!
		mayor shock What?!
		player curious Hmn...?
		shop panic C'mon, this is important!
		mayor worried Why on earth would that even work? We already walk around bottomless all day!<br>And why mine?!
		shop tired Please. My kitties are practically always hanging out, but your-
		mayor annoyed You'd better not be about to say "sweater puppies".
		shop sparkle C'mon, what do you say? We can put my little screwup behind me, you get some fancy new footwear and a pair of apples to look at, everybody wins!
		special If you say <b>"Sure"</b>, your money will be capped at $1000, and your inventory will be limited to 3x of each item. At any time afterwards, these limits can be disabled using the <b>"Infinity"</b> cheat code.
		t <span style="color:red;">Please note that leaving money and items uncapped can lead to the "save to text string" breaking due to save data length.</span>
		eval addFlag('shop', "moneyLimit")
		trans moneyLimitYes; Sure
		trans moneyLimitNo; No!
	`},
	{index: "moneyLimitYes", 
	content: `
		shop sparkle YAAAAAY!
		mayor sleep You've made a very mature decision today, playerF. I'm proud of-
		player joy Boobies!
		mayor worried Er- That was... You weren't serious about-
		dual sp1 player; sp2 shopkeep; Boo-bies! Boo-bies! Boo-bies!
		mayor panic Why?! I'm mostly naked all the time already! And you've probably already seen them before!
		player annoyed Grr...
		shop worried mayorF! I can't believe you. You went on and on about how important it was that-
		mayor angry Don't you start! You're the reason-<br>Ghh, fine, whatever!
		im mayor/moneyLimit1-2
		mayor pent Here! Are you happy now?!
		dual sp1 player; sp2 shopkeep; sparkle YAAAAAY!
		mayor fury Why the hell are <i>you</i> cheering?!<br>Whatever, I need to get back to work.
		player happy Bye mayorF! Don't be a stranger!
		mayor angry I won't! Ghh...<br>That... All that for some lumps of fat... Not like I'm even happy about...
		shop happy Lookit her muttering all the way down the lane. She's really cute when she wants to be.<br>Aaaaanyways, I'll just take those from you.
		special You gave away your excess clutter!
		shop And here you go.
		eval addItem("Lightning McCrocs");
		player surprise Ooh!
		shop Alright, I'll get out of your hair now. Lemme know if you find anything else super neat while scavenging around town!
		eval addFlag("player", "limited")
		finish
	`},
	{index: "moneyLimitNo", 
	content: `
		player angry No deal! I like seeing big number.
		mayor annoyed ... shopF?
		shop scared Uh, eh, uh... Um...
		shop tired ... I'm getting my internet access taken away, aren't I?
		mayor fury For a whole week! At least! 
		shop tired Okay...
		t mayorF storms off in a huff.
		player worried Sorry you got in trouble.
		shop happy It's alright. I can see why you'd wanna hold onto your fortune. Plus, I always have-
		mayor fury (From a distance) And I'm blocking your secret connection too!
		shop scared Nooooo!
		finish
	`},

	{index: `bottleIdentify`,
		content: `
			shop sparkle Oho! And what do we have here?
			player happy I dug this up, any idea what it might be?
			shop happy No problem! Lemme take a look...
			im artifacts/bottle2
			shop Sparkle Oho! I know what this is! This is a bottle of Appreciation Perfume!<br>It doesn't actually smell like anything, here take a whiff!
			player sleep Well, if won't scare away the townsfolk...<br>*Sniff* *Sniff*
			player happy Weird. It doesn't smell like the rest of the room, it actually does smell like... 'Nothing'.
			shop worried Oh! Hold on, wait. I got it wrong. That perfume bottle is different...
			shop pout This is a knock-off brand! There's some tiny text down here, apparently this stuff is meant to attract... "Cryptids"?<br>"Beware of Miss Eight Boobs Tall"?
			shop happy Seems like it's bunk. Oh well, sorry.
			im artifacts/bottle3
			shop happy Well, it's not worth anything, so I won't buy it, sorry. Maybe you can use the cute design to store something else?<br>... playerF?
			player scared ...!
			eval removeFlag("player", "bottleReady");
			eval addItem("bottle");
			trans cancel; Finish
		`
	},
	{index: `pill-identify`,
		content: `
			eval writeScene('system', data.player.currentScene);
		`
	},
	{index: `cherry-identify`,
		content: `
			eval writeScene('system', data.player.currentScene);
		`
	},
	{index: `watch-identify`,
		content: `
			eval writeScene('system', data.player.currentScene);
		`
	},
	{index: `hole-identify`,
		content: `
			eval writeScene('system', data.player.currentScene);
		`
	},
	{index: `tv-identify`,
		content: `
			shopkeep sparkle It's...!
			shopkeep confused I have no idea what this thing is.
			player befuddled Huh? You're not even assuming it's a monitor? But you're the town's leading expert on porn! 
			shopkeep befuddled Monitor...? I watch porn on a little handheld thing, it's called a SmaPho.
			player shock Seriously? How can you not know what this is?<br>A TV? Not ringing any bells?  Television? The ol' boob tube?
			shopkeep sparkle Boobs?!
			player pent Hah... Nevermind, I'll ask someone else...<br>Who might be able to get this thing working?
			cancel
		`
	},
	{index: `scrapbook`,
		content: `
			shop sparkle A scrapbook! Now you can keep all those big pictures you humans keep finding.
			player happy What about the notes they come with?
			shop befuddled The... Notes?
			player sleep Nothing. Forget I asked. Thanks, shopF.
			eval addFlag("player", "scrapbook");
			finish
		`
	},
	{index: `jiggyChest`,
		content: `
            define sphinx = sp sphinx; altName Sphinx; altImage locations/grotto/centralSphinx; altColor #EB6707;
			sphinx A single one? I can spare it. Here, from my personal collection.
			eval randomJiggyObtain(1);
			eval unencounter('shopkeep');
			finish
		`
	},
	{index: `jiggyTrove`,
		content: `
            define sphinx = sp sphinx; altName Sphinx; altImage locations/grotto/centralSphinx; altColor #EB6707;
			sphinx A few? Very well, but none from the ones I'm still assembling.
			eval randomJiggyObtain(10);
			eval unencounter('shopkeep');
			finish
		`
	},
	{index: `jiggyCore`,
		content: `
            define sphinx = sp sphinx; altName Sphinx; altImage locations/grotto/centralSphinx; altColor #EB6707;
			sphinx Very well, all the ones you're lacking.
			eval randomJiggyNonSub(100, "Core");
			eval unencounter('shopkeep');
			finish
		`
	},
	{index: `jiggyCozy`,
		content: `
            define sphinx = sp sphinx; altName Sphinx; altImage locations/grotto/centralSphinx; altColor #EB6707;
			sphinx Very well, all the ones you're lacking.
			eval randomJiggyNonSub(100, "Cozy");
			eval unencounter('shopkeep');
			finish
		`
	},
	{index: `jiggySummer`,
		content: `
            define sphinx = sp sphinx; altName Sphinx; altImage locations/grotto/centralSphinx; altColor #EB6707;
			sphinx Very well, all the ones you're lacking.
			eval randomJiggyNonSub(100, "Summertime");
			eval unencounter('shopkeep');
			finish
		`
	},
	{index: `jiggyFleshy`,
		content: `
            define sphinx = sp sphinx; altName Sphinx; altImage locations/grotto/centralSphinx; altColor #EB6707;
			sphinx Very well, all the ones you're lacking.
			eval randomJiggyNonSub(100, "Non-Furry");
			eval unencounter('shopkeep');
			finish
		`
	},
	{index: `fruit-gummie-box`,
		content: `
            define sphinx = sp sphinx; altName Sphinx; altImage locations/grotto/centralSphinx; altColor #EB6707;
			sphinx A simple box of candy, yes?
			player curious They aren't expired, are they?
			sphinx No, they're fresh. 
			eval addItem("fruit-gummi-box");
			eval unencounter('shopkeep');
			finish
		`
	},

	{index: `dungeonSelect`,
	content: `
		eval dungeonSelect();
	`,},
];

var salesGoal = 50; 
function shopkeepQuo() {
	var sceneTarget = "";
	if (data.player.shopkeepSales == salesGoal) {
		if (countScenes("shopkeep")[0] < countScenes("shopkeep")[1]) {
			switch (checkTrust("shopkeep")) {
				case 0:
				case 1: {
					sceneTarget = "reward1";
					setTrust("shopkeep", 2);
					writeEvent(sceneTarget);
					passTime();
					data.player.shopkeepSales = 0;
					writeHTML(`finish`);
					break;
				}
				case 2: {
					sceneTarget = "reward2";
					raiseTrust("shopkeep", 1);
					writeEvent(sceneTarget);
					passTime();
					data.player.shopkeepSales = 0;
					writeHTML(`finish`);
					break;
				}
				case 3: {
					sceneTarget = "reward3";
					raiseTrust("shopkeep", 1);
					writeEvent(sceneTarget);
					passTime();
					data.player.shopkeepSales = 0;
					writeHTML(`finish`);
					break;
				}
				default: {
					sceneTarget = "pornSelect";
					writeHTML(`shop No new porn yet, sorry!`);
					data.player.shopkeepSales = 0;
					writeHTML(`finish`);
				}
			}
		}
		else {
			if (checkFlag("shopkeep", "error") != true) {
				/*sceneTarget = "error";
				addFlag("shopkeep", "error");
				writeHTML(`shop Placeholder for shopkeepQuo error first time`);
				writeHTML(`finish`);
				*/
				
				sceneTarget = "pornSelect";
				writeHTML(`shop No new porn yet, sorry!`);
				data.player.shopkeepSales = 0;
				writeHTML(`finish`);
			}
		}
	}
	if (sceneTarget == "") {
		if (data.player.shopSmall == null) {
			writeHTML(`shop Heya! How's the town so far?`);
			if (data.player.day == 2) {
				writeHTML(`player It's my first day here, so I can't say for sure yet.
				player sparkle But I've already met a few cute animal folks! I just wanna snuggle right up to 'em!
				shopkeep Oh, you're a real charmer! I'm sure you'll fit right in here!<br>So, what can I get for you today? Or do you have something to sell?
				player Hmm... Lemme think...`);
			}
			else {
				writeHTML(`player sparkle It's been a dream! I've met so many cute animal folks, I just wanna snuggle right up to 'em!
				shopkeep Oh, you're a real charmer! I'm sure you'll fit right in here!<br>So, what can I get for you today? Or do you have something to sell?
				player Hmm... Lemme think...`);
			}
			data.player.shopSmall = 0;
		}
		else {
			var shopSmallArray = [
				`player Hmm... Got any self-replicating land mines?
				shopkeep Nope.`,
	
				`player Hmm... Got any kind of insect repellent that works on imaginary friends?
				shopkeep Nope.`,
	
				`player Hmm... Got any red wax statues in the shapes of famous war criminals?
				shopkeep Do they need to be red?
				player Yes.
				shopkeep Then no.`,
	
				`player Hmm... Got any home workout videos that focus on strengthening up your eye muscles?
				shopkeep Nope.`,
	
				`player Hmm... Got any bags?
				shopkeep Paper, plastic, canvas, or tote?
				player Ones made out of solid charcoal.
				shopkeep Oh, nope.`,
	
				`player Hmm... Got any homicidal pet goldfish?
				shopkeep Not for sale, no.`,
	
				`player Hmm... Got any perfumes or sprays made from your concentrated sweat?
				shopkeep Nope. Plenty of synthetic musk scents though.
				player Ah, that's alright, I prefer the organic free-range stuff.`,
	
				`player Hmm... Got any magazines on dating advice for marsupials new to the big city?
				shopkeep Nope. Got a few for humans though.
				player Nah, I can't think of any use for those.`,
	
				`player Hmm... Got any calendars that show every day as being the second of March?
				shopkeep Nope.`,
	
				`player Hmm... Got any cookbooks that cover how to prepare roadside weeds?
				shop Yeah, we have a few-<br>Wait, sorry, I thought you said 'ancient murals depicting famous gardening trends'. No, no cookbooks on weeds, sorry.`,
	
				`player Hmm... Got any ancient murals depicting famous gardening trends?
				shopkeep Nope.`,
	
				`player Hmm... Got any textbooks on developing superpowers?
				shopkeep Oh, actually, I do order some weird books for sadogatoF. The only one I have right now though is one about making people throw up with every part of your body except your hands.
				player Darn, that's the one area I needed. Nevermind.`,
	
				`player Hmm, got any fishnet stockings, designed to be worn by actual fish?
				shopkeep Nope, just humans.`,
	
				`player Hmm... Got any food-safe plastic containers that can safely store crude oil and lead paint?
				shopkeep Nope. Fresh out.`,
	
				`player Hmm... Got any wigs made out of fibers taken from worn underwear?
				shopkeep Nope.`,
	
				`player Hmm... Got any pamphlets on conspiracy theories relating to how moisturizer makes your bones weaker?
				shopkeep Nope.`,
	
				`player Hmm... Got any uncooked pasta, cut into the shape of perfect three centimeter cubes?
				shopkeep Nope.`,
	
				`player Hmm... Got any self-restraint?
				shopkeep Nope, sorry.
				player Hah, I got you!
				shopkeep excited No, I caught the question.<br>Meow~`,
	
				`player Hmm... Got any carbonated sodas?
				shopkeep Yes, but you need to provide a urine test to buy those here.
				player Darn, nevermind.`,
	
				`player Hmm... Got any lethal weaponry?
				shopkeep Are you looking for firearms, knives, tasers, or guides on ancient dark arts?
				player Any of those would work.
				shopkeep Nope.`,
	
				`player Hmm... Any authentic pieces of clothing from the late Gothic period meant to be worn by expecting aunts?
				shopkeep I have some contacts for those actually, a friend ordered some. They could take a day or two to arrive though.
				player Oh, nevermind then.`,
	
				`player Hmm... Got any solar powered nightlights with no battery storage?
				shopkeep Nope`,
			];
			if (shopSmallArray[data.player.shopSmall] != null) {
				writeHTML(shopSmallArray[data.player.shopSmall]);
				data.player.shopSmall++;
			}
			else {
				writeHTML(`
					player Hmm, got any fruit?
					shopkeep shock No-<br>Er, wait-
					player sparkle Hah, too late, I got you! Now you owe me free stuff!
					shopkeep frown No way, I didn't agree to that!
					player worried You didn't? Then why have I been doing all this?
					shopkeep happy I thought it was a human bonding thing. To be honest, it's actually kind of fun! I guess I like bondage more than I thought.
					player Oh. Well, unfortunately I'm running out of ideas...
					shop happy Eh, just say whatever pops into your head. <br>Even if you repeat yourself it's no big deal, I like hanging out with you!
				`);
				data.player.shopSmall = 0;
			}
		}
		writeHTML(`
			trans petIntro; Ask to pet shopF !flag shop petIntro;
			trans cancel; Finish
		`)
	}
}

var eventArray = [
	{index: "reward1", name: "Shopkeep's Reward 1", image: "shopkeep/reward1SEX-1",
	content: `
		shop excited H-hah... Heya playerF...
		player worried You're certainly looking ragged today. Everything alright?
		shop Perfectly f-fine~! Better, even. I was just thinking about what I'd buy, and...
		shop pleasured Kh... S-sorry, I'm not normally like this... I usually let my mind drift to porn when things are quiet around here...<br>Which is always...<br>But since you came around, whenever I do, I get... 
		player happy Ah, feeling pent up? No worries! It happens to the best of us.
		shop excited Really? You get all... Sweaty and leaky... Too?
		player Yeah! Usually I find some quiet time to... Y'know... 
		eval writeHTML(shopEventCheat[0]) ?flag shopkeep meat;
		eval writeHTML(shopEventCheat[1]) ?flag shopkeep veggie;

	`},
	{index: "reward2", name: "Shopkeep's Reward 2", image: "shopkeep/reward2SEX-4",
	content: `
		eval writeHTML(shopEventCheat[2]) ?flag shopkeep meat;
		eval writeHTML(shopEventCheat[3]) ?flag shopkeep veggie;
	`},
	{index: "reward3", name: "Shopkeep's Reward 3", image: "shopkeep/reward3SEX-1",
	content: `
		eval writeHTML(shopEventCheat[4]) ?flag shopkeep meat;
		eval writeHTML(shopEventCheat[5]) ?flag shopkeep veggie;
	`},
	{index: "wall1", name: "Hole in the Wall - Shopkeep", image: "shopkeep/wallRearSEX-01", requirements: "?trustMin shopkeep 2;",
	content: `
		player happy Sounds like the wall's occupied today.
		carpenter sleep Yep. If you could head around back and help her out, I'd really appreciate it.<br>Oh, she wanted you to use this on her though, here.
		player sparkle Ooh~! I'll do my best!
		t ...
		eval writeHTML(shopEventCheat[6]) ?flag shopkeep meat;
		eval writeHTML(shopEventCheat[7]) ?flag shopkeep veggie;
	`},
	{index: "pill-shopkeep", name: "Denial Pills - Shopkeep", image: "shopkeep/pill6",
	content: `
		shop sparkle playerF! What can I-
		t *GURGLE*
		shop shock ...!
		shop excited <3
		t Without so much as another word, shopF steps out from behind the counter and kneels down in front of you.
		im pill1SEX
		player pent I took one of the pills.
		shop flirting I can tell~<br>I can really, really tell~
		im pill2
		t *GURGLE*
		shop love Whooooa~! Oh my God~<br>I wasn't imagining it! I can <i>hear</i> them! Like, for really real hear them~! This is-
		t *SPLT*
		player pleasured Hohh~<br>S-sorry there, whoa...
		im pill3
		shop love Just... Just one squirt of precum... My whole face is...
		player pent Nghh~<br>They feel so... Unbelievably heavy!
		shop excited It must feel like your balls are swimming in liquid pounds of precum~<br>If I'm right, there should be an inability to orgasm until you're backed up to beyond max capacity~! But that could be any minute now!<br>When you do cum, you'll completely bloat my stomach with a literal gallon of the thickest cum a human could possibly produce~!<br>So, can I dig in?
		player pent Sure, just-
		im pill4
		player pleasured Hohhh~!
		t *GURGLE* *SPLRT*
		im pill5
		t Your bloated, still-growing nutsack throbs up a few inches, and you hear a wet sloshing sound as you splatter down shopF's throat.
		t The volume is enough to plump her cheeks out and dribble out of her nose, and it is the absolute strangest sensation you've felt yet. The rigidity of your iron erection fighting against your urethra dilating, it's like trying to urinate a thick slime.
		shop pleasured Mmmg-<br>GLLLHRK~?!
		t Quickly realizing her own limitations, shopF pulls back. If your precum is this viscous, it won't matter if she's balls deep or just suckling at the tip, your cum will be so thick it'll feel like she's throating you all the way down to her stomach!
		t You can't tell if it feels solid or like a torrent of liquid. As your urethra begins to dilate and the bottom of your shaft visibly bulges, all the precum you have left to offer is forced into shopF's mouth in one moment and suddenly all your body can identify is some merciless, relentless pressure building inside you.
		t You have at least some mind to try and pull back, but shopF's totally lovestruck gaze and the "shlick schlick" sound of masturbation beneath you tells you she at least wants to try.
		t So, all you can do is let it out.
		player orgasm Houuuuuhhhh~!!!
		im pill6
		t Her head jerks back suddenly like she's been punched, her expression a mixture of complete panic and bliss.
		t There isn't even the sound of a choke or a stifled moan, just the loud gurgle of backed-up pipes.
		t She has to pull her hands away from pleasuring herself, though you do barely hear a small splutter of a noise beneath her despite how loud your ejaculation is.
		im pill7
		t The horny gremlin latched onto you actually tries to tug away, purely by instinct, as her stomach distends like she's had a three-course meal. Her senses are going haywire, even if you could read her mind right now it'd be the static of white noise.
		t *splrt* *splrt* *splrt*
		shop orgasm GHHHLK- GHHHHLK - GHHHHHHLK-
		im pill8SEX
		t She manages to pull herself free, but there's no gasps or grunts, her mouth and throat are both <i>completely</i> full!
		t And you aren't even close to finished yet!
		t ...
		t Your own eyes flutter as your cock finally flags down. It feels like your balls are hanging at least a few inches lower than they did this morning, you have no idea what they used as fuel to generate all... This.
		im pill9SEX
		shop broken Ghou... *Hic*... Mgrr...<br>Grrk-<br>*Hic*
		player tired I am... Going home now...<br>Goodbye, shopF.
		t Before you leave and stumble out on shaky legs, you give shopF an experimental tap on her belly.
		t There's no give. The cum inside her is so dense, so thickly packed, it's like poking a flexed muscle. She likely won't need to eat for weeks to come.
	`},
	{index: "watch-start-shopkeep", name: "Time Stopwatch - Shopkeep pt.1", image: "shop/watch8SEX",
	content: `
		player Oh, thank goodness, the door's already open. Excuse me, random customer, I'm here to visit a friend.
		im watch1SEX
		shop laugh ...
		player tired It's like she's waving at me...<br>"Hiya~! Here to help a poor gal's porn addiction? And I don't mean with rehab~!"
		im watch2
		player amused You're lucky you're so adorable.<br>I don't see the appeal of this, I like it when you talk, and squeak, and when your tail bobs back and forth...<br>But I guess it'll be really fun for you to feel all of this all at once, huh?
		player excited Ehehe~ Speaking of your tail...
		im watch3SEX
		player perverted Ehe, ehehehe~<3<br>*Snfffff*<br>This is your tax for being so lewd and needy~<br>I can play with your tail aaaaall I want~
		player sleep Ahhh...<br>Fluff-huffer skill activated, hp fully restored...<br>Well, maybe a bit more~
		player worried Ah, wait, this probably isn't what she was hoping for.<br>"Oh, you silly billy! I don't just want pets and scritches, I'm a total masturbation junkie, and I can't just be satisfied with stroking anymore~!”
		im watch4
		player confused ... Would she say "silly billy"? Maybe...
		player pout All this has got me totally mixed up, this is your fault, time for a punishment prank!
		im watch5
		player angry Take this! And this! No mercy!<br>Naughty kitties get the maso-treatment, be grateful!
		player tired ... Why am I bothering to do dirty talk?
		t ...
		im watch6SEX
		player sleep Stroke, stroke stroke~<br>Be~cause I'm fappy~<br>Plap along, if you feel, like schlicking, is the truth~
		player surprise Ooh, she squirted a little. I wonder how that works?
		t ...
		im watch7SEX
		player sleep Ohhhh, IIiii've been loosening the buuuutt-hole, all the live-long dayyyy~<br>IIiii've been fondling the nauuuuughty bits, just to pass the time a-waaaaay~
		player happy This should be loose enough. I'll need to relax the butt after every bead, otherwise they'll all just plop right out.<br>Good thing I read that pamphlet on physics, otherwise I'd have no idea about potential energy!
		t ...
		player sparkle Ah, my masterpiece, she is, <i>fini~</i>
		im watch8SEX
		player worried ... I may have gone too far in a few places.<br>Here, let me just move a few things out of the splatter zone...<br>And you too Ms. Random Customer, wouldn't want you getting hosed with cat juices.
		player amused Hoo! Okay, finally! Good gravy, that took all day, I should get home before it gets dark!
		player worried ... Right. Still sunny out. Brain, are you tired yet? Can we go sleepy?
		t "No. Sun shining. No melatonin for you."
		player tired Ooookay...
	`},
	{index: "watch-finish-shopkeep", name: "Time Stopwatch - Shopkeep pt.2", image: "shop/watch9SEX",
	content: `
		t ...
		im shop/watch8SEX
		shop laugh Welc-
		im shop/watch9SEX
		shop orgasm UUUUUUUUUUUMMMM~!<br>AHHH~! HAHHHHH~! GYAAAAaaaahhhh...
		t Time-stopped brain meets hours upon hours of backed-up sensation, and is flash-deep-fried.
		t A formerly-fresh onahole is now crumpled around her half-hard but extremely overstimulated dick, totally ruined, every bit of pleasure it could have given hitting into her all at once. ?flag shop meat;
		t A nubby, textured dildo holds a special surprise. A human carefully flicking at it for way too long has transformed the piece of firm silicone into an impossibly powerful vibrator. !flag shop meat;
		t Completely overwhelmed, her voice gives out before she can finish her first scream of pleasure. All this seasoned masturbation-addict can do is...
		t *FLOP* *THUD* *SQUIRT* *SQRRRRT* *SQRRRRRRT*
		im shop/watchFSEX
		t Landing on her fucked-stupid face, only her thrummingly sensitive breasts as cushioning, shopF naturally falls in a face-down ass-up bitch-in-heat position.
		t Anal bead after anal bead flops out of her anus, each twitchy, jerky motion a clear violation of the most basic laws of physics as the universe plays catch-up to your lewd shenanigans.
		t In the end, all that's left is a growing puddle of juices, a huge set of anal beads about to plop out and sail through the air, a completely blacked-out-from-pleasure kitty cat, and a very confused random customer who was <i>still</i> in the splash zone.
	`},
	{index: "hole-shopkeep", name: "Portal Onahole - Shopkeep pt.2", image: "shop/hole00",
	content: `
		player happy Sure, I feel like I could go for a quickie. Plus, it'd be neat to see how this thing works.
		t Holding the onahole in your hand, it doesn't <i>feel</i> like a magical artifact that breaks the boundaries of space, but what does?
		t However, after just a moment, the hole's face begins to morph, becoming a plump blue anus...
		t ...
		mayor worried Seriously? It was just laying there in the dirt?
		im hole01SEX
		shop laugh Yeah! Pretty cool, huh? Why would anyone stamp a butt onto a solid gold-
		im hole02
		im hole03SEX
		shop forced Nghh...!
		mayor confused ... shopF?
		mayor angry Hey, you'd better not be using sex toys on the job again!
		im hole04SEX
		shop laugh Ahaha~<br>D-don't be s-so uptight mayorF!<br>It's not me this time, promise!
		mayor frown Then you'd better have a good excuse.<br>I'm not an idiot, even if I couldn't see you sweating and flushed, I can smell you squirting behind the counter.<br>What's going on?
		shop excited You reeeeally wanna know?<br>If I had to guess...
		mayor frown Spill it, shopF!
		im hole05SEX
		shop perverted Mggh~<br>I'd say the human is about... Halfway? I can feel *him <i>throbbing</i> inside me...
		mayor befuddled ...?
		shop Ehehe~ Some magic thing... You believe in magic, right? It's a magic hole that links-<br>Ooh! I felt a spurt of precum!<br>Y'know, I've been testing if I can orgasm without *him nearby, I haven't managed it yet, but-
		im hole06
		shop love Eh-?
		im hole07
		shop pleasured Hooohhhh~!<br>N-no, w-wait, they're barely-
		mayor shock Your stomach! How are you doing that?!
		im hole08SEX
		shop pleasured Hh~! Hoh~!<br>*He's-<br>Hoh! Like a machine! I feel *him slamming against my-<br>Nhghhhhoh~! I'm... I'm gonna! Please!
		mayor angry Alright, that's enough of-
		shop torogao Ngghh~! Without... Heat... Fucking brain up... I'm still gonna-
		im hole09SEX
		shop orgasm GHHHNNN~<3! -MMMMMNGGG~!
		mayor scared ...! Nobody's there!<br>You're gaping around thin air!<br>Wah! Watch the squirting!
		shop torogao Ghnnn! I... Cuhhhh... Feel *him... Butthole... *He came so much...
		mayor awe N-no, there's nothing there! I'd know for sure if there was cum inside of you...<br>I think...
		mayor shock Wait! "Hole"? Like an onahole?<br>Does that mean...<br>Hold on, shopF! I'll be right back!
		t ...
		im hole10
		player pent Hooh, that was nice...<br>It twitched a lot, I guess it really is linked to her.<br>I wonder if she had fun?
		player tired ... Aw man, cleanup time.<br>I was never good at this part, I'll just do the bare minimum.<br>Gotta get the cum out of there at least.
		t Ever the lazy fellow, you decide on the most basic technique, the classic "squeeze the cum out, maybe use some warm water too" method.
		im hole11SEXRosebud
		shop torogao GNNNHHHGGGGGGGG~<3<br>Sttttt.... SNNNNGGHHHHH~!
		player sleep ... No, I shouldn't be lazy. This isn't just some sex toy, this is my friend!<br>Even if it's just a copy of my friend's butthole, I need to treat every part of my friends with respect!
		t *KNOCK* *KNOCK* *KNOCK*
		t *BANG*
		player scared Wah!
		mayor pent Thank goodness it was unlocked!
		mayor fury playerF! Drop the sex toy, put your hands and dick where I can see them!
	`},
	{index: "pet1", name: "Heavy Petting pt.1", image: "shop/pet1-2-light",
	content: `
		im pet1-1
		shop teasing I see that desperate look in your eye~<br>You really wanna buy it, huh? Expensive, but~
		t *Thunk*
		shop shock ...! You're really-?
		player angry I have one minute.
		shop amused Alright, alright. Go ahead.
		im pet1-2-light
		shop sleep Mmm~
		player love So soft-! Incredible!
		t With a limited amount of time, you go in for the classic chin scritch approach, basking in the sensation of her short fuzzy fur, all while keeping your eyes locked open to appreciate every ear wiggle.
		shop perverted Mgggh~<br><i>This feels... Really nice...<br>I could see myself getting hooked on this~
		im pet1-3-light
		shop Ghhhhhmmmgh~<3<br><i>This maybe feels a bit... Too good, though~?<br>Am I having an orgasm? It doesn't feel like any I've had before~<br>I feel like... My brain... Might be melting?
		player crying Wraaaa-!
		t And after one minute has passed, you summon your willpower and pull your hand away.
		shop pent H-haaah~? Has it... B-been a minute already?
		player worried It has... I have a perfect internal clock, it's how I wake up at exactly the same time every day.
		shop tired Oh... Well, if you say so.<br>I, uh, think I might close up early today, so-
		player happy Then I'll see you tomorrow!
		shop pent Huh...?
	`},
	{index: "pet2", name: "Heavy Petting pt.2", image: "shop/pet2-1",
	content: `
		shop excited Ah, welcome back!
		t You set the bag of muns down on the counter with a *THUNK*, and shopF has already begun visibly sweating.
		player confused Is it cheaper than last time?
		im pet2-1
		shop blushy For petting? You're imagining it~<br>So, the petting-
		player angry Right, it'll take a lot of willpower, but I'll keep track of the time.
		shop excited Uhuh. So let's get-
		player sleep Don't worry, I understand how important moderation is. I won't go over the limit.
		shop love Right, yeah, okay, so let's-
		player happy If you're worried, we could get an actual timer-
		player shock Wah!
		im pet2-2-light
		shop perverted Mmmmmhmhmhm~<br>There it is, that's the stuff~
		player love Hoh~ F-fuzzy kitty~
		t *Thump* *Thump* *Thump*
		player befuddled Eh? What was-
		shop Ghhh~
		im pet2-3SEX
		shop flirting Don't worryyy~ Keep goinggg~
		t Her hips are bucking against the desk, though it's hard to focus on that as she nuzzles into your hand, especially as she begins to purr.
		player perverted Ghhhhihihi~<br>Heavenly~
		shop perverted Almosssst~<3
		player forced B-but...! Ghhh!
		shop shock H-hey! W-wait!
		im pet2-4
		shop scared There's no way it's been a minute!
		player pent It... Has... Hooh, actually having restraint takes a lot out of me...
		shop panic Th-then, just let loose! I'll understand!
		player sleep No, but thank you, I'll be alright. I can hold out until tomorrow.
		shop scared Tomorrow?! Wait, hold on, today's 2-for-1 day, you know! S-so-
		player See you tomorrow, shopF.
		shop Waaaaaait!
	`},
	{index: "pet3", name: "Heavy Petting pt.3", image: "shop/pet3-2-light",
	content: `
		im pet3-1
		shop excited HELLO AND WELCOME TO IVY AND OAK!
		player shock Wah! Goodness, you scared me!
		shop love We are having a special today! All day! For all day long!<br>And it's on an extra special limited-time discount!
		player tired ... I knew this would happen. You weren't lying when you said you had an addictive personality.<br>If I go all out, I might spend all day petting you, and you probably won't let me get away.
		shop excited I'll c-close early! We can go to my bed! For free, no charge today!
		shop scared P-please?
		player smug Heh. 
		t ...
		player Now, where should I start~
		outfit shopkeep nude
		eval writeHTML(shopEventCheat[8]) ?flag shopkeep meat;
		eval writeHTML(shopEventCheat[9]) ?flag shopkeep veggie;
	`},
];

var shopEventCheat = [
	//reward1Meat
	`
	shop excited Y'know...? Oh, fap? R-right... I forget I'm around a real human, the kind that shoots real goo and stuff..
	player worried Do you not?
	shopkeep excited Well... Not really. I usually just rub myself until I get bored, like th...
	im shopkeep/reward1Meat-1
	shop shock Hoh... W-what's this?
	player happy Looks like precum. 
	shop worried Yeah but, it's never done that before...
	player sparkle Ooh, this is great! It seems like you're going through heat, I guess you've been around my pheromones long enough!
	shopkeep sparkle You think so?! Okay hold on to all that stuff, I'm gonna take a quick break.<br>You don't mind, do you? Actually, if you could stick around I'd appreciate it. 
	player sleep Take your time. 
	shop happy Alright...! Okay, heat-enhanced masturbation time... 
	im shopkeep/reward1Meat-2
	shop Wow, my balls are so bloated... I'm barely sitting down but... They're...
	shop excited A-almost to the floor~<br>It's...
	im shopkeep/reward1Meat-3
	shop ahegao Haahhh~!<br>I... Came? 
	player Looks like it, it splattered all over the floor!
	shop excited I didn't even touch myself, and it still felt...
	player That was your first real orgasm, huh?
	shop I-if I touched it normally, then... <3
	im shopkeep/reward1Meat-4
	shop ahegao Ah~! Ohmygawd~! I thought all that smut was exaggerating~!
	player shopF?
	shopkeep Hah~! Hah~! This is amazing~! 
	player worried shopF...?
	shopkeep ahegao Wanna cum~! Wannacumwannacumwannacum~!
	player frown shopF!
	im shopkeep/reward1Meat-5
	shop excited H-huh?
	player worried You were going a bit crazy there. You sure you don't wanna pace yourself?
	shop excited Hah... Uh... R-right, good point... I've got plenty of time to enjoy myself...
	player happy You should probably drink something too.
	shop Yeah... Sorry. I'll keep myself under control. Thank you.<br>Did you wanna sell something else?
	`,
	//reward1Veggie
	`
	shop excited Y'know...? Oh, fap? R-right... I forget I'm around a real human, the kind that shoots real goo and stuff..
	player worried Do you not? I know you don't have a dick, but...
	shopkeep excited Well... Not really. I usually just rub myself until I get bored, like th...
	im shopkeep/reward1Veggie-1
	shop shock Hoh... W-what's this?
	player happy You're wet. This new too? 
	shop worried Yeah...
	player sparkle Ooh, this is great! It seems like you're finally going through heat, I guess you've been around my pheromones long enough!
	shopkeep sparkle You think so?! Okay hold on to all that stuff, I'm gonna take a quick break.<br>You don't mind, do you? Actually, if you could stick around I'd appreciate it. 
	player sleep Take your time. 
	shop happy Alright...! Okay, heat-enhanced masturbation time... 
	im shopkeep/reward1Veggie-2
	shop Wow, I'm straight up leaking... It's...
	shop excited Ngghhh...
	player shock Whoa! You alright?
	im shopkeep/reward1Veggie-3
	shop worried Y-yeah... I felt this buzz wash over me and I slipped right off my seat...	
	shop excited I didn't even touch myself, and it still felt...
	player happy That was your first real orgasm, huh?
	shop I-if I touched it normally, then... <3
	im shopkeep/reward1Veggie-4
	shop ahegao Ah~! Ohmygawd~! I thought all that smut was exaggerating~!
	player shopF?
	shopkeep Hah~! Hah~! This is amazing~! 
	player worried shopF...?
	shopkeep ahegao Wanna cum~! Wannacumwannacumwannacum~!
	player frown shopF!
	im shopkeep/reward1Veggie-5
	shop excited Ghhhhz...<br>H-huh?
	player worried You were going a bit crazy there. You sure you don't wanna pace yourself?
	shop excited Hah... Uh... R-right, good point... I've got plenty of time to enjoy myself...
	player happy You should probably drink something too.
	shop Yeah... Sorry. I'll keep myself under control. Thank you.<br>Did you wanna sell something else?
	`,
	//reward2Meat
	`
	im shopkeep/reward2Meat-1
	shop excited O-okay, I owe you... Uh ...
	player worried You distracted again? You're usually a lot faster with handling muns.
	shop Sorry, silver tongue's a bit tied up...<br>I tried masturbating again since last time, but I'm still pent-up somehow... It didn't feel as good.
	player worried Hmm. Well, if you need a break, I can-
	shop Watch the store? Just for a few minutes, I think something in the back will help me...
	player shock You want to leave me in charge of this place?
	player sparkle I accept! I've always wanted to hold people's lives in my hands!<br>And selling groceries is the closest I'll ever get!
	shop Ahaha... I appreciate it, even if your phrasing worries me a bit...
	t Moving quickly, shopF slips off her apron and quickly scurries away into the back.
	outfit shopkeep; nude
	player worried Wow, geez. She got naked right in front of me...
	player happy Although She's basically naked all the time I guess, this apron doesn't cover much.<br>Alright, gotta be ready for my first customer!
	t ...

	im shopkeep/reward2Meat-2
	shop worried W-wow... They're downright swollen~<br>Probably bigger than in most of my smut comics, I always figured they were exaggerating the size of those things...
	shop excited I wonder if playerF's are...
	shop shock Gah! No, can't get ahead of myself. I came too quick to have fun last time, and stroking didn't feel nearly as good without *him around...<br>Gotta make the most of my time while *he's still here!
	shop happy Let's see...<br>Oh! You'll do!

	im shopkeep/reward2Meat-4
	shop The idea of the nubs was super hot, but when I tried you before they were just annoying...<br>Let's see how you do now that my sex drive is actually running~
	t ...
	player sparkle Thanks, come again anytime~
	mesu excited I w-will, promise~
	player happy What a nice fellow. Oh, hello!
	mayor happy playerF! I didn't know you had a job already!
	player Haha, no way! I swore a blood contract years ago to never have a job. I'm just helping shopF out.<br>Speaking of, she's been a while...
	mayor worried Is everything alright?
	t ...

	im shopkeep/reward2Meat-5
	shop excited Hoh~! Ho-ly fuck~! 
	shop ahegao It's a totally different feeling~! I'm not just being stretched anymore~! 

	im shopkeep/reward2Meat-6
	shop torogao Khh~!<br>Amazing~! My cock won't stop squirting everywhere~!
	shop ahegao Hah~! More~!<br>I've never felt this good~! I'm gonna cum from remodeling my asspipe~!
	t ...
	player worried Phew~! I didn't think that giraffe would ever leave!
	player happy Oh, shopF, you're-

	im shopkeep/reward2Meat-7
	shop ahegao Ahah~ C-cumming... <3
	player shock Whoa! You're leaking all over the place!
	shop excited It... It worked... Feeling better now...<br>C-can't... Feel my legs...
	player worried I should skadoodle then! I think the pheromones are too much for you!
	shop C-come back soon, okay? 
	player happy Sure thing! Good luck cleaning all that up!
	shop torogao Ghh~!
	player worried ... You'll need it.
	`,
	//reward2Veggie
	`
	im shopkeep/reward2Veggie-1
	shop excited O-okay, I owe you... Uh ...
	player worried You distracted again? You're usually a lot faster with handling muns.
	shop Sorry, silver tongue's a bit tied up...<br>I tried masturbating again since last time, but I'm still pent-up somehow... It didn't feel as good.
	player worried Hmm. Well, if you need a break, I can-
	shop Watch the store? Just for a few minutes, I think something in the back will help me...
	player shock You want to leave me in charge of this place?
	player sparkle I accept! I've always wanted to hold people's lives in my hands!<br>And selling groceries is the closest I'll ever get!
	shop Ahaha... I appreciate it, even if your phrasing worries me a bit...
	t Moving quickly, shopF slips off her apron and quickly scurries away into the back.
	outfit shopkeep; nude
	player worried Wow, geez. She got naked right in front of me...
	player happy Although She's basically naked all the time I guess, this apron doesn't cover much.<br>Alright, gotta be ready for my first customer!
	t ...

	im shopkeep/reward2Veggie-2
	shop worried W-wow... I'm honestly dripping~<br>Even more wet than in most of my smut comics, I always figured they were exaggerating how wet girls got...
	shop excited I wonder if playerF's dick could...
	shop shock Gah! No, can't get ahead of myself. I came too quick to have fun last time, and stroking didn't feel nearly as good without *him around...<br>Gotta make the most of my time while *he's still here!
	shop happy Let's see...<br>Oh! You'll do!

	im shopkeep/reward2Veggie-4
	shop The idea of the nubs was super hot, but when I tried you before they were just annoying...<br>Let's see how you do now that my sex drive is actually running~
	t ...
	player sparkle Thanks, come again anytime~
	mesu excited I w-will, promise~
	player happy What a nice fellow. Oh, hello!
	mayor happy playerF! I didn't know you had a job already!
	player Haha, no way! I swore a blood contract years ago to never have a job. I'm just helping shopF out.<br>Speaking of, she's been a while...
	mayor worried Is everything alright?
	t ...

	im shopkeep/reward2Veggie-5
	shop excited Hoh~! Ho-ly fuck~! 
	shop ahegao It's a totally different feeling~! I'm not just being stretched anymore~! 

	im shopkeep/reward2Veggie-6
	shop torogao Khh~!<br>Amazing~! I can't stop squirting everywhere~!
	shop ahegao Hah~! More~!<br>I've never felt this good~! I'm gonna cum from remodeling my asspipe~!
	t ...
	player worried Phew~! I didn't think that giraffe would ever leave!
	player happy Oh, shopF, you're-

	im shopkeep/reward2Veggie-7
	shop ahegao Ahah~ C-cumming... <3
	player shock Whoa! You're leaking all over the place!
	shop excited It... It worked... Feeling better now...<br>C-can't... Feel my legs...
	player worried I should skadoodle then! I think the pheromones are too much for you!
	shop C-come back soon, okay? 
	player happy Sure thing! Good luck cleaning all that up!
	shop torogao Ghh~!
	player worried ... You'll need it.
	`,
	//reward3Meat
	`
		outfit shopkeep nude
		im reward3Meat-1
		t As you take a step into the shop you're greeted by the sight of shopF trying to deal with her overactive body.
		shop angry Ghh... Go... Down... You...!
		player worried shopF? Are you-
		im reward3Meat-2
		shop excited playerF~! playerF playerF playerF~!
		t Like a lightswitch has been flipped, her face goes from frustrated to lovestruck in less than a second, and her cock goes from iron-stiff to half-hard and leaking even quicker.
		t Almost like it's... Bowing? But that's silly, of course.
		shop playerF~!
		player happy That is my name, yep!
		im reward3Meat-3
		shop Hah~ Hah~!
		player shock Oh... Wow!<br>That's...!
		t As she turns around and presents her puffy, just-barely-but-definitely-constantly-agape anus to you, it's clear instantly that she's been masturbating. A lot.
		t Goodness knows how long this poor girl has been rocking her world to endless hardcore smut, struggling to push herself over the edge.
		player worried Need me to help?
		shop playerF~!
		t You nod solemnly, just being around your pheromones right now is probably teetering her mind on a razor's edge, and her psyche isn't equipped for this.
		im reward3Meat-4
		shop ahegao Hah~!
		t You slide in with incredible ease, shopF's ass is incredibly well-trained, and uniquely textured too from so many varied toys.
		t It genuinely feels like you're sinking deeper into an incredibly premium onahole, each inch causing her body to twitch delivering a brand new way for her insides to wrap and cuddle around your dick.
		t You have half a mind to grab her by the waist and put her into the living fleshlight position, but you need to let her acclimate.
		shop torogao Khhhhghh~<3
		t This masturbation addict must be used to hitting a plateau of sensation, plastic toys only doing so much, so her brain is overloaded with both pleasure and relief from not hitting the usual wall.
		t Slowly and steadily you thrust, strong enough though to push the desk she's using for support forward.
		t Mixed signals are flowing through her. "Breed!" "Submit!" "Relax!" "Throb!"
		t Though most important of all hits her suddenly.
		im reward3Meat-5
		t A solid, unbroken line of her backed-up goo splatters on the floor as you send a very clear message ripping through her body.
		t "Cum."
		shop Khhhhhh~<br>Khhumminggggg~<3
		t A fresh word has returned to her vocabulary!
		im reward3Meat-6
		shop Cummingcummingcummingcummingggg~~~<3
		t She grips her support desk hard enough for her claws to scratch into the wood, and you start to pull out.
		t It's one hell of a fight, this girl has done everything in her power to transform her asshole into a fleshlight, and she's gripping you like her life depends on it.
		t Although, since her brain is wildly flashing "Cum!" "Cock!" "Dick!" on loop, she might actually think it does.
		t Finally, you pull yourself free.
		im reward3Meat-7rosebud
		t She... <i>Milked</i> you, there's absolutely no other word for it. You only just now realize your knees are shaking, this girl's asshole is dangerous!
		shop Ghhhhhhhggh~<3
		t Her body quakes as she rides out the long, long high that marks the end to what's been basically a multi-day long masturbation session.
		t ...
		shop ahegao Hohh...<br>Ohh my...
		player happy Coming back down?
		shop blush Eh? playerF? When did...?
		player sparkle I've been manning the ship while you napped! Made quite a few sales today!
		shop shock That's... Great?<br>Wait, how many customers came by while I was... Laying on the floor, naked, cum drooling out of my ass?
		player happy All of them.
		shop worried ... Oh.
		shop happy ... Well, they know what I'm about. I guess it had to happen sometime.
		shop sparkle And... Wow! My head's so clear! It's like a fog's been lifted!
		player sparkle That's great!<br>Were you feeling down before?
		shop happy I think dealing with heat all alone was messing with my head.<br>It makes sense. When a breeding season starts, I guess folks either have to breed or get bred, playing with myself forever probably would have driven me actually insane.
		player sleep Haha~! Well, you got pretty close!
		shop sleep Haha, yeah.
		shop worried ... How close? My memory's a bit foggy.
		player happy I should probably skedaddle, it's getting late. Plus, you probably want to enjoy feeling clear-headed again.
		shop ... Seriously though. Like, did I do something?<br>Did I say something?<br>Please tell me catnip wasn't involved.
		player sleep Byyyeee~
		shop shock What happened?! No red marks, so no BDSM...<br>Oh no, did I say I loved you to get you to fuck me?! playerF, get back here!
	`,
	//reward3Veggie
	`
		outfit shopkeep nude
		im reward3Veggie-1
		t As you take a step into the shop you're greeted by the sight of shopF trying to deal with her overactive body.
		shop angry Ghh... Just stop squirting... For a few-
		player worried shopF? Are you-
		im reward3Veggie-2
		shop excited playerF~! playerF playerF playerF~!
		t Like a lightswitch has been flipped, her face goes from frustrated to lovestruck in less than a second, and her barely contained floodgates are loose and leaking even quicker.
		shop playerF~!
		player happy That is my name, yep!
		im reward3Veggie-3
		shop Hah~ Hah~!
		player shock Oh... Wow!<br>That's...!
		t As she turns around and presents her puffy, just-barely-but-definitely-constantly-agape anus to you, it's clear instantly that she's been masturbating. A lot.
		t Goodness knows how long this poor girl has been rocking her world to endless hardcore smut, struggling to push herself over the edge.
		player worried Need me to help?
		shop playerF~!
		t You nod solemnly, just being around your pheromones right now is probably teetering her mind on a razor's edge, and her psyche isn't equipped for this.
		im reward3Veggie-4
		shop ahegao Hah~!
		t You slide in with incredible ease, shopF's ass is incredibly well-trained, and uniquely textured too from so many varied toys.
		t It genuinely feels like you're sinking deeper into an incredibly premium onahole, each inch causing her body to twitch delivering a brand new way for her insides to wrap and cuddle around your dick.
		t You have half a mind to grab her by the waist and put her into the living fleshlight position, but you need to let her acclimate.
		shop torogao Khhhhghh~<3
		t This masturbation addict must be used to hitting a plateau of sensation, plastic toys only doing so much, so her brain is overloaded with both pleasure and relief from not hitting the usual wall.
		t Slowly and steadily you thrust, strong enough though to push the desk she's using for support forward.
		t Mixed signals are flowing through her. "Breed!" "Submit!" "Relax!" "Throb!"
		t Though most important of all hits her suddenly.
		im reward3Veggie-5
		t A solid, unbroken line of her backed-up cum splatters on the floor as you send a very clear message to her prostate.
		t "Cum."
		shop Khhhhhh~<br>Khhumminggggg~<3
		t A fresh word has returned to her vocabulary!
		im reward3Veggie-6
		shop Cummingcummingcummingcummingggg~~~<3
		t She grips her support desk hard enough for her claws to scratch into the wood, and you start to pull out.
		t It's one hell of a fight, this girl has done everything in her power to transform her asshole into a fleshlight, and she's gripping you like her life depends on it.
		t Although, since her brain is wildly flashing "Cum!" "Cock!" "Dick!" on loop, she might actually think it does.
		t Finally, you pull yourself free.
		im reward3Veggie-7rosebud
		t She... <i>Milked</i> you, there's absolutely no other word for it. You only just now realize your knees are shaking, this girl's asshole is dangerous!
		shop Ghhhhhhhggh~<3
		t Her body quakes as she rides out the long, long high that marks the end to what's been basically a multi-day long masturbation session.
		t ...
		shop ahegao Hohh...<br>Ohh my...
		player happy Coming back down?
		shop blush Eh? playerF? When did...?
		player sparkle I've been manning the ship while you napped! Made quite a few sales today!
		shop shock That's... Great?<br>Wait, how many customers came by while I was... Laying on the floor, naked, cum drooling out of my ass?
		player happy All of them.
		shop worried ... Oh.
		shop happy ... Well, they know what I'm about. I guess it had to happen sometime.
		shop sparkle And... Wow! My head's so clear! It's like a fog's been lifted!
		player sparkle That's great!<br>Were you feeling down before?
		shop happy I think dealing with heat all alone was messing with my head.<br>It makes sense. When a breeding season starts, I guess folks either have to breed or get bred, playing with myself forever probably would have driven me actually insane.
		player sleep Haha~! Well, you got pretty close!
		shop sleep Haha, yeah.
		shop worried ... How close? My memory's a bit foggy.
		player I should probably skedaddle, it's getting late. Plus, you probably want to enjoy feeling clear-headed again.
		shop ... Seriously though. Like, did I do something?<br>Did I say something?<br>Please tell me catnip wasn't involved.
		player sleep Byyyeee~
		shop shock What happened?! No red marks, so no BDSM...<br>Oh no, did I say I loved you to get you to fuck me?! playerF, get back here!
	`,
	//wall1Meat
	`
	im wallFront-1
	shop worried ...? Hello?
	player Hello~<br>Wallbutt helper playerF, dropping in to save the day~
	im wallRearMeat-01
	shop sparkle Perfect timing! Seriously, my butt was starting to get cold.
	im wallRearMeat-02
	shop excited Hooh~<br>Hooold on there, just a minute.<br>Did carpenterF give it to you?
	im wallRearMeat-03
	player worried This white rod thing?
	shop sparkle Yesss! I've been super excited to try it now that I'm in heat. <br>But I can't manage to hold it in place, it's like being tickled, y'know? I keep pulling away out of reflex because of how intense it feels.
	shop happy Go ahead and press it against my peen, pretty please~
	player happy ... Peen?
	im wallFront-2
	shop happy Hey, it's not like I need to be crass <i>all</i> the time.<br>Variation is important-
	shop excited Ooh~<br>Little cold, not too bad.<br>N-now you ju-
	t *CLICK*
	im wallRearMeat-04
	t *BZZZ* *BZZZ* *BZZZ*
	im wallFront-3
	shop blush Hhhholy shit!<br>F-fuck me, this is so much better!
	player happy Have you used this before?<br>It's probably a lot more intense now that you're in heat.
	shop pleasured Ohhhh~<br>From my glans to my prostate... They won't stop buzzing~
	shop excited M-more... We <i>absolutely need to test this more thoroughly~<3
	player happy You got it!
	im wallRearMeat-05
	player worried Hmm. It's strong, sure, but at this rate you'll go numb before you're satisfied.<br>I need to think of a way to...
	player sparkle ...!
	im wallRearMeat-06
	shop shock Eh?! Where are you putting...<br>Will... Can that even fi-
	im wallRearMeat-07
	shop torogao -iiiIIIIIIIT~<3
	shop ahegao Hoooough~!!!<br>Yer mashin' my p-spot into jelllyyyy~<3
	im wallFront-4
	shop Gummminnnn~!!!<br>Head 'n cummies gettin' scrambleddd~!!!
	player sleep I'm glad you're enjoying yourself!
	player shock Oh! I just realized, if I'm still around, you'll just keep huffing pheromones!<br>... Wait, are you even getting any through the wall?
	shop torogao GHHHHG~<3
	player worried I guess so...<br>It looks like we're stuck in a loop...<br>... Stuck?
	player sparkle ...!
	t ...
	carpenter happy shopF~<br>Hey, shopF?<br>playerF said to check up on you.
	im wallFront-5
	shop ahegao Gghheeh~<br>C-can't escape~<br>Brainmush... Prostate...<br>Can't stop...
	im wallRearMeat-08
	shop torogao Ghhhg... Battery... Finally...
	carpenter sleep Sounds like you had fun. I'll let playerF know another wallbutt customer has left satisfied.<br>Now, about your pay, there are a few extra fees I was hoping to go over with you. I can hear you squirting from here.
	shop ahegao A-anything... Lemme out...<br>Fffuuu...
	carpenter sparkle Oh? Anything~?<br>You're already pretty heavy in debt you know, but I suppose I can add to the tab.
	`,
	//wall1Veggie
	`
	im wallFront-1
	shop worried ...? Hello?
	player Hello~<br>Wallbutt helper playerF, dropping in to save the day~
	im wallRearVeggie-01
	shop sparkle Perfect timing! Seriously, my butt was starting to get cold.
	im wallRearVeggie-02
	shop excited Hooh~<br>Hooold on there, just a minute.<br>Did carpenterF give it to you?
	im wallRearVeggie-03
	player worried This white rod thing?
	shop sparkle Yesss! I've been super excited to try it now that I'm in heat. <br>It's supposed to be <i>the</i> premier woman-pleasing device. But I can't manage to hold it in place<br>But it's like being tickled, y'know? I keep pulling away out of reflex because of how intense it feels.
	shop happy Go ahead and press it against this kitty's kitty, pretty please~
	player happy ... Kitty's kitty?
	im wallFront-2
	shop happy Hey, it's not like I need to be crass <i>all</i> the time.<br>Variation is important-
	shop blush Ooh~!<br>Little cold, not too bad.<br>N-now you ju-
	t *CLICK*
	im wallRearVeggie-04
	t *BZZZ* *BZZZ* *BZZZ*
	im wallFront-3
	shop blush Hhhholy shit!<br>F-fuck me, this is so much better!
	player happy Have you used this before?<br>It's probably a lot more intense now that you're in heat.
	shop pleasured Ohhhh~<br>Hhhhharder~! It's like a sshhhhock from my clit, all through my cunt~!
	shop excited M-more... We <i>absolutely need to test this more thoroughly~<3
	player happy You got it!
	im wallRearVeggie-05
	shop ahegao Hooooh~!
	player worried Hmm. It's strong, sure, but at this rate you'll go numb before you're satisfied.<br>I need to think of a way to...
	player sparkle ...!
	im wallRearVeggie-06
	shop shock Eh?! Where are yoy putting...<br>Will... Can that even fi-
	im wallRearVeggie-07
	shop torogao -iiiIIIIIIIT~<3
	shop ahegao Hoooough~!!!<br>My ass is getting jellied~!<3
	im wallFront-4
	shop Gummminnnn~!!!<br>G-spot... Through my ass... Gettin' scrambleddd~!!!
	player sleep I'm glad you're enjoying yourself!
	player shock Oh! I just realized, if I'm still around, you'll just keep huffing pheromones!<br>... Wait, are you even getting any through the wall?
	shop torogao GHHHHG~<3
	player worried I guess so...<br>It looks like we're stuck in a loop...<br>... Stuck?
	player sparkle ...!
	t ...
	carpenter happy shopF~<br>Hey, shopF?<br>playerF said to check up on you.
	im wallFront-5
	shop ahegao Gghheeh~<br>C-can't escape~<br>Brainmush... Back of womb...<br>Can't stop...
	im wallRearVeggie-08
	shop torogao Ghhhg... Battery... Finally...
	carpenter sleep Sounds like you had fun. I'll let playerF know another wallbutt customer has left satisfied.<br>Now, about your pay, there are a few extra fees I was hoping to go over with you. I can hear you squirting from here.
	shop ahegao A-anything... Lemme out...<br>Fffuuu...
	carpenter sparkle Oh? Anything~?<br>You're already pretty heavy in debt you know, but I suppose I can add to the tab.
	`,
	//pet3Meat
	`
	im pet3-3Meat
	shop excited Anywhere~! Just stop teasing me!
	player amused Well then, I guess I'll go for... Belly rubs!
	im pet3-4Meat-light
	shop forced Ghhhhh~! <br>What... Is this... Sensation?!
	t You let your hands sink in and get to work. On her end, it's like a deep-tissue massage, causing a pulsing ZING of pleasure in her belly. Her hips buck and thrust, like she's so used to her sex toys that she's expecting to get some kind of penile or anal stimulation from the movement.
	t There's not really any kind of toy that can replicate the feeling, so she's left confused in the head and squirting strings of precum as she tries to work through the strange yet overwhelming sensations.
	t On your end, though...
	player pervert Mmmhmhm~! Soft belly~<3
	shop torogao Fffffuck~! I can't... Stop myself from pushing into your grip!
	shop ahegao Ahaha~! My hips... Actually are moving on their own~!
	t Whether a feral quadruped or the plump shortstack before you, a cat's belly truly is made for petting. You couldn't stop, even if you wanted to!
	shop torogao Ghhhhg~~! I feel it... Building! Don't you dare stop!
	player excited Ehehe~
	im pet3-5Meat-light
	shop orgasm NNNYGHOUHHHHH~<br>CUMMINGGGG~<br>I'M GONNA NUT MY FUCKING BRAINS OUTTTT~!
	t Her entire body makes like an arch under your grasp. Her balls aren't clenching, almost like a prostate orgasm, except triggered from the outside. <i>Something</i> is getting squeezed empty, her brain just can't wrap around exactly what.
	shop perverted Ghhgeehh... Hhhheghh~<br>Amazhing~
	player flirting Mwehehe~ Now, what part next...?
	shop pent Ghh... Hhh...<br>C'mere...!
	player confused Eh?
	t She grabs you by the hand and tugs you forward.
	im pet3-2-light
	shop sleep Mmm. Naptime.
	player love Hoh, soft cheek~
	shop Now hold still and be my human pillow. I love falling asleep right after a good session~<br>And don't move a muscle, or you'll interrupt my catnap~
	player panic Eh?! What?!
	shop teasing Thought you were slick, huh? Teasing me until I couldn't take anymore~?<br>Sorry, but I've been a porn addict way too long to not see what you were trying and...
	shop sleep Myyyyaaaaawn~<br>Looks to me like I've got all the cards again. Should have held back, teased me longer.
	player blushy B-but there's no way I could have held back, all the fluff in the world was in the palm of my hands!<br>You can't stop me now, now that...
	player scared Oh no...
	shop sleep Zzz...
	t She seems to have actually fallen asleep, and is gently purring while hugging your arm like a pillow.
	t She truly has done her research on humans: A sleeping cat can immobilize even the most hardened of souls!
	t ...
	t It's well into the evening as her catnap ends. Your legs have fallen asleep, your mind is groggy, it feels like your very soul is exhausted.
	player broken F-fuzzy... Kitty...
	t But, as you finally make your way outside the shop, you have to acknowledge...
	player afterglow I got to pet a cat... For free...<br>Today was a good day~
	`,
	//pet3Veggie
	`
	im pet3-3Veggie
	shop excited Anywhere~! Just stop teasing me!
	player amused Well then, I guess I'll go for... Belly rubs!
	im pet3-4Veggie-light
	shop forced Ghhhhh~! <br>What... Is this... Sensation?!
	t You let your hands sink in and get to work. On her end, it's like a deep-tissue massage, causing a pulsing ZING of pleasure like her womb is being pleasured from the outside.
	t On your end, though...
	player pervert Mmmhmhm~! Soft belly~<3
	shop torogao Fffffuck~! I can't... Stop myself from pushing into your grip!
	shop ahegao Ahaha~! My hips... Actually are moving on their own~!
	t Whether a feral quadruped or the plump shortstack before you, a cat's belly truly is made for petting. You couldn't stop, even if you wanted to!
	shop torogao Ghhhhg~~! I feel it... Building! Don't you dare stop!
	player excited Ehehe~
	im pet3-5Veggie-light
	shop orgasm NNNYGHOUHHHHH~<br>CUMMINGGGG~<br>I'M GONNA SQUIRT MY FUCKING BRAINS OUTTTT~!
	t Her entire body makes like an arch under your grasp in some kind of feline show of total submission.
	shop perverted Ghhgeehh... Hhhheghh~<br>Amazhing~
	player flirting Mwehehe~ Now, what part next...?
	shop pent Ghh... Hhh...<br>C'mere...!
	player confused Eh?
	t She grabs you by the hand and tugs you forward.
	im pet3-2-light
	shop sleep Mmm. Naptime.
	player love Hoh, soft cheek~
	shop Now hold still and be my human pillow. I love falling asleep right after a good session~<br>And don't move a muscle, or you'll interrupt my catnap~
	player panic Eh?! What?!
	shop teasing Thought you were slick, huh? Teasing me until I couldn't take anymore~?<br>Sorry, but I've been a porn addict way too long to not see what you were trying and...
	shop sleep Myyyyaaaaawn~<br>Looks to me like I've got all the cards again. Should have held back, teased me longer.
	player blushy B-but there's no way I could have held back, all the fluff in the world was in the palm of my hands!<br>You can't stop me now, now that...
	player scared Oh no...
	shop sleep Zzz...
	t She seems to have actually fallen asleep, and is gently purring while hugging your arm like a pillow.
	t She truly has done her research on humans: A sleeping cat can immobilize even the most hardened of souls!
	t ...
	t It's well into the evening as her catnap ends. Your legs have fallen asleep, your mind is groggy, it feels like your very soul is exhausted.
	player broken F-fuzzy... Kitty...
	t But, as you finally make your way outside the shop, you have to acknowledge...
	player afterglow I got to pet a cat... For free...<br>Today was a good day~
	`,
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