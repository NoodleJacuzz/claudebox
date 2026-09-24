const initialShopArray = [
];

const initialItemsArray = [
	{index: "Bald", category: "hair", filter: "", image: "player/player-empty"},
	{index: "Topless", category: "upperwear", filter: "", image: "player/player-empty"},
	{index: "Bottomless", category: "lowerwear", filter: "", image: "player/player-empty"},
	{index: "Barefoot", category: "footwear", filter: "", image: "player/player-empty"},

	{index: "Basic Haircut", category: "hair", filter: "", image: "player/hair/basic-mascFront"},
	{index: "Shirt", category: "upperwear", filter: "", image: "player/upperwear/shirt-masc"},
	{index: "Shorts", category: "lowerwear", filter: "", image: "player/lowerwear/shorts-penis", tags: "covering",},
	{index: "Sneakers", category: "footwear", filter: "", image: "player/footwear/sneakers"},

	{index: "Bowl Cut", category: "hair", filter: "", image: "player/hair/bowl"},
	{index: "Twintails", category: "hair", filter: "", image: "player/hair/twintails-masc"},
	{index: "Ponytail", category: "hair", filter: "", image: "player/hair/ponytailFront"},
	{index: "Gradient Hair", category: "hair", filter: "", image: "player/hair/flippedFront"},
	{index: "Heiress Ponytail", category: "hair", filter: "", image: "player/hair/heiressFront"},
	{index: "Colored Inner Hair", category: "hair", filter: "", image: "player/hair/bowFront"},
	{index: "Goldie Locks", category: "hair", filter: "", image: "player/hair/goldieFront",},

	{index: "Flames", category: "upperwear", filter: "", image: "player/upperwear/flame-masc"},
	{index: "Sleeveless", category: "upperwear", filter: "", image: "player/upperwear/sleeveless-masc"},
	{index: "Sweater", category: "upperwear", filter: "", image: "player/upperwear/sweater-masc"},
	{index: "Apron", category: "upperwear", filter: "", image: "player/upperwear/apron-masc"},
	{index: "Dress", category: "upperwear", filter: "", image: "player/upperwear/dress-masc"},
	{index: "Chest Wraps", category: "upperwear", filter: "", image: "player/upperwear/wraps-masc"},
	{index: "Business", category: "upperwear", filter: "", image: "player/upperwear/business-masc"},
	{index: "Bowtie", category: "upperwear", filter: "", image: "player/upperwear/bowtie-masc"},
	{index: "Bikini Armor", category: "upperwear", filter: "", image: "player/upperwear/armor-masc"},
	{index: "Rose Uniform", category: "upperwear", filter: "", image: "player/upperwear/gothic-masc"},
	{index: "White Jacket", category: "upperwear", filter: "", image: "player/upperwear/heiress-masc"},
	{index: "Shinobi Garb", category: "upperwear", filter: "", image: "player/upperwear/shinobi-masc"},
	{index: "Tube Jacket", category: "upperwear", filter: "", image: "player/upperwear/goldie-masc"},
	{index: "Full Poncho", category: "upperwear", filter: "", image: "player/upperwear/fullPoncho-masc"},
	{index: "Half Poncho", category: "upperwear", filter: "", image: "player/upperwear/halfPoncho-masc"},
	{index: "Sheer Shirt", category: "upperwear", filter: "", image: "player/upperwear/sheer-masc"},
	{index: "Donut Muncher Shirt", category: "upperwear", filter: "", image: "player/upperwear/sheer-donut-masc"},
	{index: "Titty Enjoyer Shirt", category: "upperwear", filter: "", image: "player/upperwear/sheer-titty-masc"},
	{index: "Salami Fanatic Shirt", category: "upperwear", filter: "", image: "player/upperwear/sheer-salami-masc"},
	{index: "Leather Jacket (Closed)", category: "upperwear", filter: "", image: "player/upperwear/jacketC-masc"},
	{index: "Leather Jacket (Open)", category: "upperwear", filter: "", image: "player/upperwear/jacketO-masc"},
	{index: "Aloha Shirt", category: "upperwear", filter: "", image: "player/upperwear/aloha-masc"},
	{index: "Nightgown", category: "upperwear", filter: "", image: "player/upperwear/nightie-masc"},
	{index: "Sling Bikini", category: "upperwear", filter: "", image: "player/upperwear/sling-masc"},
	{index: "Bunny Leotard", category: "upperwear", filter: "", image: "player/upperwear/leotard-masc-penis", tags: "covering",},

	{index: "Pencil Skirt", category: "lowerwear", filter: "", image: "player/lowerwear/pencil-skirt"},
	{index: "Pleated Skirt", category: "lowerwear", filter: "", image: "player/lowerwear/pleated-skirt"},
	{index: "Jeans", category: "lowerwear", filter: "", image: "player/lowerwear/jeans-penis", tags: "covering",},
	{index: "Pantyhose", category: "lowerwear", filter: "", image: "player/lowerwear/pantyhose-penis", tags: "covering",},
	{index: "Pure Dress", category: "lowerwear", filter: "", image: "player/lowerwear/heiress-penis-masc"},
	{index: "Shiny Pants", category: "lowerwear", filter: "", image: "player/lowerwear/latex-penis", tags: "covering",},
	{index: "Bootyshorts", category: "lowerwear", filter: "", image: "player/lowerwear/booty-penis", tags: "covering",},
	{index: "Swimsuit", category: "lowerwear", filter: "", image: "player/lowerwear/swimsuit-masc-penis", tags: "covering",},

	{index: "Boots", category: "footwear", filter: "", image: "player/footwear/boots"},
	{index: "Thighboots", category: "footwear", filter: "", image: "player/footwear/thighboots"},
	{index: "Mary Janes", category: "footwear", filter: "", image: "player/footwear/janes"},
	{index: "Loafers", category: "footwear", filter: "", image: "player/footwear/loafers"},
	{index: "Greaves", category: "footwear", filter: "", image: "player/footwear/greaves"},
	{index: "High Heels", category: "footwear", filter: "", image: "player/footwear/heiress"},
	{index: "Belted Boots", category: "footwear", filter: "", image: "player/footwear/belted"},
	{index: "Cowboy Boots", category: "footwear", filter: "", image: "player/footwear/cowboy"},
	{index: "Lightning McCrocs", category: "footwear", filter: "", image: "player/footwear/crocsLightning"},

	{index: "Cumload", category: "accessory", filter: "", image: "player/accessories/cum"},
	{index: "Thighhighs", category: "accessory", filter: "", image: "player/footwear/thighhighs"},
	{index: "Pasties", category: "accessory", filter: "", image: "player/accessories/pasties-masc"},
	{index: "Fishnets", category: "accessory", filter: "", image: "player/accessories/fishnets-light"},
	{index: "Horny Hat", category: "accessory", filter: "", image: "player/accessories/hat"},
	{index: "Bunny Ears", category: "accessory", filter: "", image: "player/accessories/bunny"},
	{index: "Thong", category: "accessory", filter: "", image: "player/lowerwear/thong-penis", tags: "underwear",},
	{index: "Second Hat", category: "accessory", filter: "", image: "player/accessories/weeg"},
	{index: "Mini Crown", category: "accessory", filter: "", image: "player/accessories/crown"},
	{index: "Glasses", category: "accessory", filter: "", image: "player/accessories/glasses"},
	{index: "Bow", category: "accessory", filter: "", image: "player/accessories/bowtie"},
	{index: "Socks", category: "accessory", filter: "", image: "player/accessories/socks"},
	{index: "Shades", category: "accessory", filter: "", image: "player/accessories/shades"},
	{index: "Choker", category: "accessory", filter: "", image: "player/accessories/choker"},
	{index: "Hair Flower", category: "accessory", filter: "", image: "player/accessories/flower"},
	{index: "Pelvic Curtain", category: "accessory", filter: "", image: "player/accessories/loincloth-penis", tags: "underwear",},
	{index: "Cloak", category: "accessory", filter: "", image: "player/accessories/cloakFront"},
	{index: "Gauntlets", category: "accessory", filter: "", image: "player/accessories/gauntlets"},

	{index: "Inspector's Vest", category: "upperwear", filter: "", image: "player/upperwear/vest-masc", requirements: "?flag player anomaly;",},
	{index: "Inspector's Slacks", category: "upperwear", filter: "", image: "player/lowerwear/slacks-penis", requirements: "?flag player anomaly;", tags: "covering",},
	{index: "Survivor's Shirt", category: "upperwear", filter: "", image: "player/lowerwear/rainy-masc", requirements: "?flag player rainy;",},
	{index: "Survivor's Pants", category: "lowerwear", filter: "", image: "player/lowerwear/rainy-penis", requirements: "?flag player rainy;", tags: "covering",},
	{index: "Princess Haircut", category: "hair", filter: "", image: "player/hair/princessFront", requirements: "?flag player princess;",},
	{index: "Princess Dress", category: "upperwear", filter: "", image: "player/upperwear/princess-masc", requirements: "?flag player princess;",},
	{index: "Male Counselor Top", category: "upperwear", filter: "", image: "player/upperwear/thomas-masc", requirements: "?flag player university;",},
	{index: "Male Counselor Bottoms", category: "upperwear", filter: "", image: "player/lowerwear/thomas-penis", requirements: "?flag player university;", tags: "covering",},
	{index: "Female Counselor Top", category: "upperwear", filter: "", image: "player/upperwear/tomara-masc", requirements: "?flag player university;",},
	{index: "Female Counselor Bottoms", category: "upperwear", filter: "", image: "player/lowerwear/tomara-skirt", requirements: "?flag player university;",},
	{index: "Counselor Glasses", category: "accessory", filter: "", image: "player/accessories/glasses", requirements: "?flag player university;",},
	{index: "Spacer's Bodysuit Top", category: "upperwear", filter: "", image: "player/upperwear/bodysuit-masc", requirements: "?flag player argent;",},
	{index: "Spacer's Bodysuit Bottom", category: "upperwear", filter: "", image: "player/lowerwear/bodysuit-penis", requirements: "?flag player argent;", tags: "covering",},
	{index: "Medicenter Hat", category: "accessory", filter: "", image: "player/accessories/nurse", requirements: "?flag player medicenter;",},
	{index: "Medicenter Uniform", category: "upperwear", filter: "", image: "player/upperwear/nurse-masc", requirements: "?flag player medicenter;",},
	{index: "Hyper Breasts", category: "upperwear", filter: "", image: "player/upperwear/hyper-light", requirements: "?flag player haa;",},
	{index: "Hyper Penis", category: "lowerwear", filter: "", image: "player/lowerwear/hyper-light", requirements: "?flag player haa;",},
	{index: "Cow", category: "accessory", filter: "", image: "player/accessories/cow"},

	{index: "shopkeepMagical", category: "costume", filter: "", name: "Magical Outfit - Shopkeep", image:"shopkeep/magical/happy"},

	{category: `tarot`, set: `tarot`, index: "tarot0", name: "The Cat", value: 0, category: "tarot", image: "tarot/0"},
	{category: `tarot`, set: `tarot`, index: "tarot1Meat", name: "The Hyena", value: 0, category: "tarot", image: "tarot/1Meat"},
	{category: `tarot`, set: `tarot`, index: "tarot2", name: "The Shark", value: 0, category: "tarot", image: "tarot/2"},
	{category: `tarot`, set: `tarot`, index: "tarot3Meat", name: "The Tiger", value: 0, category: "tarot", image: "tarot/3Meat"},
	{category: `tarot`, set: `tarot`, index: "tarot4Meat", name: "The Lion", value: 0, category: "tarot", image: "tarot/4Meat"},
	{category: `tarot`, set: `tarot`, index: "tarot5", name: "The Raven", value: 0, category: "tarot", image: "tarot/5"},
	{category: `tarot`, set: `tarot`, index: "tarot6", name: "The Antelope", value: 0, category: "tarot", image: "tarot/6"},
	{category: `tarot`, set: `tarot`, index: "tarot7Meat", name: "The Goat", value: 0, category: "tarot", image: "tarot/7Meat"},
	{category: `tarot`, set: `tarot`, index: "tarot8Meat", name: "The Horse", value: 0, category: "tarot", image: "tarot/8Meat"},
	{category: `tarot`, set: `tarot`, index: "tarot9", name: "The Gecko", value: 0, category: "tarot", image: "tarot/9"},
	{category: `tarot`, set: `tarot`, index: "tarot10", name: "The Owl", value: 0, category: "tarot", image: "tarot/10"},
	{category: `tarot`, set: `tarot`, index: "tarot11", name: "The Wolf", value: 0, category: "tarot", image: "tarot/11"},
	{category: `tarot`, set: `tarot`, index: "tarot12", name: "The Snake", value: 0, category: "tarot", image: "tarot/12"},
	{category: `tarot`, set: `tarot`, index: "tarot13", name: "The Moth", value: 0, category: "tarot", image: "tarot/13"},
	{category: `tarot`, set: `tarot`, index: "tarot14", name: "The Bee", value: 0, category: "tarot", image: "tarot/14"},
	{category: `tarot`, set: `tarot`, index: "tarot15Meat", name: "The Squirrel", value: 0, category: "tarot", image: "tarot/15Meat"},
	{category: `tarot`, set: `tarot`, index: "tarot16", name: "The Fox", value: 0, category: "tarot", image: "tarot/16"},
	{category: `tarot`, set: `tarot`, index: "tarot17Meat", name: "The Dog", value: 0, category: "tarot", image: "tarot/17Meat"},
	{category: `tarot`, set: `tarot`, index: "tarot18Meat", name: "The Rabbit", value: 0, category: "tarot", image: "tarot/18Meat"},
	{category: `tarot`, set: `tarot`, index: "tarot19Meat", name: "The Dragon", value: 0, category: "tarot", image: "tarot/19Meat"},

	{index: "rod", name: "Fishing Rod", category: "key", filter: "", image: "items/rod"},
	{index: "net", name: "Bug Net", category: "key", filter: "", image: "items/net"},
	{index: "hammer", name: "Digging Kit", category: "key", filter: "", image: "items/chest"},

	{index: "mayorMagazineMeat", name: "Magazine", value: 0, category: "magazine", image: "mayor/magazine1Meat", tags: "dickgirl",},
	{index: "mayorMagazineVeggie", name: "Magazine", value: 0, category: "magazine", image: "mayor/magazine1Veggie", tags: "female",},
	{index: "carpenterMagazineMeat", name: "Magazine", value: 0, category: "magazine", image: "carpenter/magazine1Meat", tags: "male",},
	{index: "carpenterMagazineVeggie", name: "Magazine", value: 0, category: "magazine", image: "carpenter/magazine1Veggie", tags: "female",},
	{index: "shopkeepMagazineMeat", name: "Magazine", value: 0, category: "magazine", image: "shopkeep/magazine1Meat", tags: "dickgirl",},
	{index: "shopkeepMagazineVeggie", name: "Magazine", value: 0, category: "magazine", image: "shopkeep/magazine1Veggie", tags: "female",},
	{index: "foxfMagazine", name: "Magazine", value: 0, category: "magazine", image: "foxf/magazine1", tags: "female",},
	{index: "foxmMagazine", name: "Magazine", value: 0, category: "magazine", image: "foxm/magazine1", tags: "male",},
	{index: "wolfMagazine", name: "Magazine", value: 0, category: "magazine", image: "wolf/magazine1", tags: "female",},
	{index: "sadogatoMagazine", name: "Magazine", value: 0, category: "magazine", image: "sadogato/magazine1", tags: "female",},
	{index: "milfMagazine", name: "Magazine", value: 0, category: "magazine", image: "milf/magazine1", tags: "female, pregnancy",},
	{index: "nunMagazine", name: "Magazine", value: 0, category: "magazine", image: "nun/magazine1", tags: "female",},
	{index: "mommyMagazine", name: "Magazine", value: 0, category: "magazine", image: "mommy/magazine1", tags: "female",},
	{index: "fashMagazine", name: "Magazine", value: 0, category: "magazine", image: "fashionista/magazine1", tags: "male",},
	{index: "mesuMagazine", name: "Magazine", value: 0, category: "magazine", image: "mesu/magazine1", tags: "male",},
	{index: "hyenaMagazine", name: "Magazine", value: 0, category: "magazine", image: "hyena/magazine1", tags: "dickgirl",},
	{index: "doeMagazine", name: "Magazine", value: 0, category: "magazine", image: "doe/magazine1", tags: "dickgirl",},

    {index: "mayorPog", name: "Mayor Pog", value: 1, category: "pogs", image: "pogs/mayorPog", tags: "",},
    {index: "carpenterPog", name: "Carpenter Pog", value: 1, category: "pogs", image: "pogs/carpenterPog", tags: "",},
    {index: "shopkeepPog", name: "Shopkeep Pog", value: 1, category: "pogs", image: "pogs/shopkeepPog", tags: "",},
    {index: "foxfPog", name: "Vixen Pog", value: 1, category: "pogs", image: "pogs/foxfPog", tags: "female",},
    {index: "foxmPog", name: "Fox Pog", value: 1, category: "pogs", image: "pogs/foxmPog", tags: "male",},
    {index: "wolfPog", name: "Fashionista Pog", value: 1, category: "pogs", image: "pogs/wolfPog", tags: "female",},
    {index: "sadogatoPog", name: "Sadogato Pog", value: 1, category: "pogs", image: "pogs/sadoPog", tags: "female",},
    {index: "milfPog", name: "Cow Pog", value: 1, category: "pogs", image: "pogs/milfPog", tags: "female, pregnancy",},
    {index: "nunPog", name: "Nun Pog", value: 1, category: "pogs", image: "pogs/nunPog", tags: "female",},
    {index: "mommyPog", name: "Mommy Pog", value: 1, category: "pogs", image: "pogs/mommyPog", tags: "female, dickgirl",},
    {index: "mesuPog", name: "Mesu Pog", value: 1, category: "pogs", image: "pogs/mesuPog", tags: "male",},
    {index: "fashionistaPog", name: "Wolf Pog", value: 1, category: "pogs", image: "pogs/fashPog", tags: "male",},
    {index: "hyenaPog", name: "Hyena Pog", value: 1, category: "pogs", image: "pogs/hyenaPog", tags: "dickgirl, playerSub",},
    {index: "doePog", name: "Doe Pog", value: 1, category: "pogs", image: "pogs/hyenaPog", tags: "dickgirl",},
	
	{category: `key`, index: "pocketBase", name: "Full Base Pocketmanz Set", value: 0, image: "pocketmanz/eev-0"},
	{category: `key`, index: "tarotBase", name: "Full Base Tarot Set", value: 0, image: "tarot/0"},
	{category: `key`, index: "magazinesBase", name: "Full 1st Ed. Magazine Collection", value: 0, image: "items/magazine"},
	{category: `key`, index: "pogsBase", name: "Full Basic Coin Collection", value: 0, image: "items/orb"},
	{category: `key`, index: "jiggyBase", name: "Full 1st Set Jiggy Collection", value: 0, image: "items/bag"},

	{index: "fruit-gummi-bag", value: 5, category: "fruit", desc: "A bag of yummy chewable candies. A favorite among humans, right?"},
	{index: "fruit-gummi-box", value: 20, category: "fruit", desc: "A box of chewy candies with a suspicious shape. They aren't sold anywhere in town anymore."},
	{index: "fruit-cheeries", value: 2, category: "fruit", desc: "A pair of cheeries, the most commonly found fruit in town. They grow everywhere, and make a great snack!"},
	{index: "fruit-dewdrop", value: 5, category: "fruit", desc: "A plump, squishy fruit that can be squished like a water balloon. They have to be carefully grown in the orchard."},
	{index: "fruit-assple-seed", value: 1, category: "fruit", desc: "A tough, smooth fruit capable of growing larger. Only appears after obtaining the Monster Fucker Permit.", requirements: "?weird;", tags: "weird",},
	{index: "fruit-assple-fruit", value: 10, category: "fruit", desc: "A carefully washed, smooth fruit grown in the fertile fields of Uranus. Only appears after obtaining the Monster Fucker Permit.", requirements: "?weird;", tags: "weird",},
	{index: "bug-crimket", value: 2, category: "critter", desc: "A small little guy, the most commonly found bug in town."},
	{index: "bug-flumph", value: 5, category: "critter", desc: "A floofy little fellow only found in the wilderness at the edge of town."},
	{index: "bug-lurm", value: 5, category: "critter", desc: "A thick-lipped blue worm of the Wormb family only found in the wilderness at the edge of town. Only appears after obtaining the Monster Fucker Permit.", requirements: "?weird;", tags: "weird",},
	{index: "fish-yuppie", value: 2, category: "critter", desc: "An extremely common fish that can be found anywhere in town. Yuppie!"},
	{index: "fish-foambeard", value: 5, category: "critter", desc: "A rarer fish that can be found in the town lake. His 'beard' is actually his tongue, covered in a foamy slime."},
	{index: "fish-fooba", value: 5, category: "critter", desc: "A rarer fish that can be found in the town lake. Only appears after obtaining the Monster Fucker Permit.", requirements: "?weird;", tags: "weird",},

	{index: "dildo-stone", category: "treasure", image: "treasure/ruins-dildo-stone", value: 0, name: "Stone dildo"}, 
	{index: "dildo-bronze", category: "treasure", image: "treasure/ruins-dildo-bronze", value: 1, name: "Bronze dildo"}, 
	{index: "dildo-glass", category: "treasure", image: "treasure/ruins-dildo-glass", value: 2, name: "Glass dildo"}, 
	{index: "dildo-silver", category: "treasure", image: "treasure/ruins-dildo-silver", value: 2, name: "Silver dildo"}, 
	{index: "dildo-gold", category: "treasure", image: "treasure/ruins-dildo-gold", value: 3, name: "Gold dildo"}, 
	{index: "chalice-bronze-male", category: "treasure", image: "treasure/ruins-chalice-bronze-male", value: 1, name: "Bronze Chalice"}, 
	{index: "chalice-bronze-female", category: "treasure", image: "treasure/ruins-chalice-bronze-female", value: 1, name: "Bronze Chalice"}, 
	{index: "chalice-silver-male", category: "treasure", image: "treasure/ruins-chalice-silver-male", value: 2, name: "Silver Chalice"}, 
	{index: "chalice-silver-female", category: "treasure", image: "treasure/ruins-chalice-silver-female", value: 2, name: "Silver Chalice"}, 
	{index: "chalice-gold-male", category: "treasure", image: "treasure/ruins-chalice-gold-male", value: 3, name: "Gold Chalice"}, 
	{index: "chalice-gold-female", category: "treasure", image: "treasure/ruins-chalice-gold-female", value: 3, name: "Gold Chalice"}, 
	{index: "shield-bronze-male", category: "treasure", image: "treasure/ruins-shield-bronze-male", value: 1, name: "Bronze Shield"}, 
	{index: "shield-bronze-female", category: "treasure", image: "treasure/ruins-shield-bronze-female", value: 1, name: "Bronze Shield"}, 
	{index: "shield-silver-male", category: "treasure", image: "treasure/ruins-shield-silver-male", value: 2, name: "Silver Shield"}, 
	{index: "shield-silver-female", category: "treasure", image: "treasure/ruins-shield-silver-female", value: 2, name: "Silver Shield"}, 
	{index: "shield-gold-male", category: "treasure", image: "treasure/ruins-shield-gold-male", value: 3, name: "Gold Shield"}, 
	{index: "shield-gold-female", category: "treasure", image: "treasure/ruins-shield-gold-female", value: 3, name: "Gold Shield"}, 
	{index: "trophy-bronze-male", category: "treasure", image: "treasure/ruins-trophy-bronze-male", value: 2, name: "Bronze Trophy"}, 
	{index: "trophy-bronze-female", category: "treasure", image: "treasure/ruins-trophy-bronze-female", value: 2, name: "Bronze Trophy"}, 
	{index: "trophy-silver-male", category: "treasure", image: "treasure/ruins-trophy-silver-male", value: 3, name: "Silver Trophy"}, 
	{index: "trophy-silver-female", category: "treasure", image: "treasure/ruins-trophy-silver-female", value: 3, name: "Silver Trophy"}, 
	{index: "trophy-gold-male", category: "treasure", image: "treasure/ruins-trophy-gold-male", value: 4, name: "Gold Trophy"}, 
	{index: "trophy-gold-female", category: "treasure", image: "treasure/ruins-trophy-gold-female", value: 4, name: "Gold Trophy"}, 
	{index: "fruit-red-male", category: "fruit", image: "treasure/wilderness-fruit-red-male", value: 1, name: "Napple"}, 
	{index: "fruit-red-female", category: "fruit", image: "treasure/wilderness-fruit-red-female", value: 1, name: "Cleftberry", "tags": "weird"}, 
	{index: "fruit-red-null", category: "fruit", image: "treasure/wilderness-fruit-red-null", value: 1, name: "Rosepuff", "tags": "weird"}, 
	{index: "fruit-green-male", category: "fruit", image: "treasure/wilderness-fruit-green-male", value: 3, name: "Pearnuts", "tags": "weird"}, 
	{index: "fruit-green-female", category: "fruit", image: "treasure/wilderness-fruit-green-female", value: 3, name: "Peasucker", "tags": "weird"}, 
	{index: "fruit-green-null", category: "fruit", image: "treasure/wilderness-fruit-green-null", value: 3, name: "Celu Fruit"}, 
	{index: "fruit-blue-male", category: "fruit", image: "treasure/wilderness-fruit-blue-male", value: 6, name: "Starschmeat Plant"}, 
	{index: "fruit-blue-female", category: "fruit", image: "treasure/wilderness-fruit-blue-female", value: 6, name: "Boobberry Bushel"}, 
	{index: "fruit-blue-null", category: "fruit", image: "treasure/wilderness-fruit-blue-null", value: 6, name: "Buttkin"}, 
	{index: "misc-pot-male", category: "treasure", image: "treasure/wilderness-misc-pot-male", value: 1, name: "Stone Plant-Pot"}, 
	{index: "misc-pot-female", category: "treasure", image: "treasure/wilderness-misc-pot-female", value: 1, name: "Stone Plant-Pot"}, 
	{index: "misc-shell-male", category: "critter", image: "treasure/wilderness-misc-shell-male", value: 0, name: "Giant Mollusk", "tags": "weird"}, 
	{index: "misc-shell-female", category: "critter", image: "treasure/wilderness-misc-shell-female", value: 0, name: "Giant Mollusk", "tags": "weird"}, 
	{index: "sculpture-stone-male", category: "treasure", image: "treasure/wilderness-sculpture-stone-male", value: 1, name: "Stone Sculpture"}, 
	{index: "sculpture-stone-female", category: "treasure", image: "treasure/wilderness-sculpture-stone-female", value: 1, name: "Stone Sculpture"}, 
	{index: "sculpture-stone-null", category: "treasure", image: "treasure/wilderness-sculpture-stone-null", value: 1, name: "Stone Sculpture"}, 
	{index: "statue-stone-male", category: "treasure", image: "treasure/wilderness-statue-stone-male", value: 2, name: "Stone Statue"}, 
	{index: "statue-stone-female", category: "treasure", image: "treasure/wilderness-statue-stone-female", value: 2, name: "Stone Statue"}, 
	{index: "statue-marble-male", category: "treasure", image: "treasure/wilderness-statue-marble-male", value: 3, name: "Marble Statue"}, 
	{index: "statue-marble-female", category: "treasure", image: "treasure/wilderness-statue-marble-female", value: 3, name: "Marble Statue"}, 
	{index: "statue-glass-male", category: "treasure", image: "treasure/wilderness-statue-glass-male", value: 2, name: "Glass Statue"}, 
	{index: "statue-glass-female", category: "treasure", image: "treasure/wilderness-statue-glass-female", value: 2, name: "Glass Statue"}, 
	{index: "statue-gold-male", category: "treasure", image: "treasure/wilderness-statue-gold-male", value: 3, name: "Gold Statue"}, 
	{index: "statue-gold-female", category: "treasure", image: "treasure/wilderness-statue-gold-female", value: 3, name: "Gold Statue"}, 

	{index: "clothingDye", name: "Clothing Dye", value: 5, category: "key", image: "items/dye"},
	{index: "skinDye", name: "Skin Spray", value: 5, category: "key", image: "items/dye"},
	{index: "genderDye", name: "Genderswap Potion", value: 5, category: "key", image: "items/dye"},
	{index: "goonboy", name: "Goonboy Advance", value: 20, category: "key", image: "items/goonboy"},
	{index: "unknownWorm", name: "Weird Worm", value: 20, category: "key", image: "items/lurm"},

	{index: "watch", name: "Time Stopwatch", value: 200, category: "key", image: "artifacts/watch1"},
	{index: "hole", name: "Portal Onahole", value: 200, category: "key", image: "artifacts/hole1"},
	{index: "pill", name: "Denial Pills", value: 200, category: "key", image: "artifacts/pills1"},
	{index: "cherry", name: "Star-Crossed Cherry", value: 200, category: "key", image: "artifacts/cherry1"},
	{index: "tv", name: "Tellyvision", value: 200, category: "key", image: "artifacts/tv1"},
	{index: "chainsaw", name: "Chainsaw", value: 200, category: "key", image: "tink/chainsaw0-0"},
	{index: "clips", name: "Clips", value: 200, category: "key", image: "tink/clips0-0"},
	{index: "permit", name: "Monster Fucker Permit", value: 200, category: "key", image: "items/permit"},

	//Mayor jiggies
    {category: `jiggy`, index: `mayor-core1`, set: "Core", image: `mayor/jiggyCore1-light`, pieces: 100, name: `Good Doggy`, desc: `A jiggy of mayorF.<br>Part of the SET Set.`, tags: "",},
    {category: `jiggy`, index: `mayor-cozy`, set: "Cozy", image: `mayor/jiggyCozy`, pieces: 75, name: `'A Human is Coming?'`, desc: `A jiggy of mayorF.<br>Part of the SET Set.`, tags: "",},
    {category: `jiggy`, index: `mayor-summ`, set: "Summertime", image: `mayor/jiggySummSEX-light`, pieces: 100, name: `Settling In`, desc: `A jiggy of mayorF.<br>Part of the SET Set.`, tags: "",},
    {category: `jiggy`, index: `mayor-fles`, set: "Non-Furry", image: `mayor/jiggyFlesSEX`, pieces: 125, name: `Kissy Booth`, desc: `A jiggy of mayorF.<br>Part of the SET Set.`, tags: "",},
	
	//Shopkeep jiggies
    {category: `jiggy`, index: `shopkeep-core1`, set: "Core", image: `shopkeep/jiggyCore1SEX`, pieces: 100, name: `This is just the Foreplay!`, desc: `A jiggy of shopkeepF.<br>Part of the SET Set.`, tags: "",},
    {category: `jiggy`, index: `shopkeep-cozy`, set: "Cozy", image: `shopkeep/jiggyCozySEX`, pieces: 75, name: `Human Culture Class`, desc: `A jiggy of shopkeepF.<br>Part of the SET Set.`, tags: "",},
    {category: `jiggy`, index: `shopkeep-summ`, set: "Summertime", image: `shopkeep/jiggySumm-light`, pieces: 75, name: `Solid Argument. Counterpoint:`, desc: `A jiggy of shopkeepF.<br>Part of the SET Set.`, tags: "",},
    {category: `jiggy`, index: `shopkeep-fles`, set: "Non-Furry", image: `shopkeep/jiggyFlesSEX`, pieces: 100, name: `Trying Technology`, desc: `A jiggy of shopkeepF.<br>Part of the SET Set.`, tags: "",},
	
	//Carpenter jiggies
    {category: `jiggy`, index: `carpenter-core1`, set: "Core", image: `carpenter/jiggyCore1SEX`, pieces: 100, name: `Nighttime Emissions`, desc: `A jiggy of carpenterF.<br>Part of the SET Set.`, tags: "",},
    {category: `jiggy`, index: `carpenter-cozy`, set: "Cozy", image: `carpenter/jiggyCozySEX`, pieces: 75, name: `Drowsy Bathtime`, desc: `A jiggy of carpenterF.<br>Part of the SET Set.`, tags: "",},
    {category: `jiggy`, index: `carpenter-summ`, set: "Summertime", image: `carpenter/jiggySumm`, pieces: 75, name: `Expert Napper`, desc: `A jiggy of carpenterF.<br>Part of the SET Set.`, tags: "",},
    {category: `jiggy`, index: `carpenter-fles`, set: "Non-Furry", image: `carpenter/jiggyFlesSEX`, pieces: 75, name: `Awoken Feelings`, desc: `A jiggy of carpenterF.<br>Part of the SET Set.`, tags: "",},
	
	//Foxf jiggies
    {category: `jiggy`, index: `foxf-cozy`, set: "Cozy", image: `foxf/jiggyCozy`, pieces: 75, name: `Morning Habit`, desc: `A jiggy of foxfF.<br>Part of the SET Set.`, tags: "female",},
    {category: `jiggy`, index: `foxf-summ`, set: "Summertime", image: `foxf/jiggySumm`, pieces: 75, name: `Sister's Vacation`, desc: `A jiggy of foxfF.<br>Part of the SET Set.`, tags: "female",},
    {category: `jiggy`, index: `foxf-fles`, set: "Non-Furry", image: `foxf/jiggyFles`, pieces: 75, name: `Squirting Salute`, desc: `A jiggy of foxfF.<br>Part of the SET Set.`, tags: "female",},
	
	//Foxm jiggies
    {category: `jiggy`, index: `foxm-cozy`, set: "Cozy", image: `foxm/jiggyCozy`, pieces: 75, name: `Evening Nap`, desc: `A jiggy of foxmF.<br>Part of the SET Set.`, tags: "male",},
    {category: `jiggy`, index: `foxm-summ`, set: "Summertime", image: `foxm/jiggySumm`, pieces: 75, name: `Brother's Vacation`, desc: `A jiggy of foxmF.<br>Part of the SET Set.`, tags: "male",},
    {category: `jiggy`, index: `foxm-fles`, set: "Non-Furry", image: `foxm/jiggyFles`, pieces: 75, name: `Precum Pooling`, desc: `A jiggy of foxmF.<br>Part of the SET Set.`, tags: "male",},
	
	//Wolf jiggies
	{category: `jiggy`, index: `wolf-core1`, set: "Core", image: `wolf/jiggyCore1`, pieces: 100, name: `Twerk it, Girl!`, desc: `A jiggy of wolfF.<br>Part of the SET Set.`, tags: "female",},
    {category: `jiggy`, index: `wolf-cozy`, set: "Cozy", image: `wolf/jiggyCozy`, pieces: 75, name: `Work Behind the Beauty`, desc: `A jiggy of wolfF.<br>Part of the SET Set.`, tags: "female",},
    {category: `jiggy`, index: `wolf-summ`, set: "Summertime", image: `wolf/jiggySumm-light`, pieces: 100, name: `Ocean Spray`, desc: `A jiggy of wolfF.<br>Part of the SET Set.`, tags: "female",},
    {category: `jiggy`, index: `wolf-fles`, set: "Non-Furry", image: `wolf/jiggyFles`, pieces: 75, name: `Newfound Passion`, desc: `A jiggy of wolfF.<br>Part of the SET Set.`, tags: "female",},
	
	//Sadogato jiggies
    {category: `jiggy`, index: `sadogato-core1`, set: "Core", image: `sado/jiggyCore1-light`, pieces: 75, name: `Sadogato`, desc: `A jiggy of sadogatoF.<br>Part of the SET Set.`, tags: "female",},
    {category: `jiggy`, index: `sadogato-cozy`, set: "Cozy", image: `sado/jiggyCozy`, pieces: 100, name: `Winter Weight`, desc: `A jiggy of sadogatoF.<br>Part of the SET Set.`, tags: "female",},
    {category: `jiggy`, index: `sadogato-summ`, set: "Summertime", image: `sado/jiggySumm-light`, pieces: 125, name: `Empty Balls Before Swimming`, desc: `A jiggy of sadogatoF.<br>Part of the SET Set.`, tags: "female",},
    {category: `jiggy`, index: `sadogato-fles`, set: "Non-Furry", image: `sado/jiggyFles-light`, pieces: 100, name: `An Honest Face`, desc: `A jiggy of sadogatoF.<br>Part of the SET Set.`, tags: "female",},
	
	//Milf jiggies
    {category: `jiggy`, index: `milf-core1`, set: "Core", image: `milf/jiggyCore1`, pieces: 125, name: `Miracle Machine`, desc: `A jiggy of milfF.<br>Part of the SET Set.`, tags: "female, pregnancy",},
    {category: `jiggy`, index: `milf-cozy`, set: "Cozy", image: `milf/jiggyCozy`, pieces: 75, name: `Bathtime Sigh`, desc: `A jiggy of milfF.<br>Part of the SET Set.`, tags: "female, pregnancy",},
    {category: `jiggy`, index: `milf-summ`, set: "Summertime", image: `milf/jiggySumm`, pieces: 75, name: `Maiden in Need`, desc: `A jiggy of milfF.<br>Part of the SET Set.`, tags: "female, pregnancy",},
    {category: `jiggy`, index: `milf-fles`, set: "Non-Furry", image: `milf/jiggyFles`, pieces: 125, name: `Warm Welcome`, desc: `A jiggy of milfF.<br>Part of the SET Set.`, tags: "female, pregnancy",},
	
	//Nun jiggies
    {category: `jiggy`, index: `nun-core1`, set: "Core", image: `nun/jiggyCore1`, pieces: 125, name: `Intense Prayer`, desc: `A jiggy of nunF.<br>Part of the SET Set.`, tags: "female",},
    {category: `jiggy`, index: `nun-cozy`, set: "Cozy", image: `nun/jiggyCozy`, pieces: 100, name: `Scrubly Bubbly`, desc: `A jiggy of nunF.<br>Part of the SET Set.`, tags: "female",},
    {category: `jiggy`, index: `nun-summ`, set: "Summertime", image: `nun/jiggySumm`, pieces: 100, name: `Nunbathing`, desc: `A jiggy of nunF.<br>Part of the SET Set.`, tags: "female",},
    {category: `jiggy`, index: `nun-fles`, set: "Non-Furry", image: `nun/jiggyFles-light`, pieces: 100, name: `Callipygian Altar`, desc: `A jiggy of nunF.<br>Part of the SET Set.`, tags: "female, rimming",},
	
	//Fash jiggies
    {category: `jiggy`, index: `fashionista-core1`, set: "Core", image: `fashionista/jiggyCore1`, pieces: 100, name: `Bratty and Pink`, desc: `A jiggy of fashionistaF.<br>Part of the SET Set.`, tags: "male",},
    {category: `jiggy`, index: `fashionista-cozy`, set: "Cozy", image: `fashionista/jiggyCozy`, pieces: 100, name: `Lazy Afternoon`, desc: `A jiggy of fashionistaF.<br>Part of the SET Set.`, tags: "male",},
    {category: `jiggy`, index: `fashionista-summ`, set: "Summertime", image: `fashionista/jiggySumm-light`, pieces: 100, name: `Sunscreen is Essential`, desc: `A jiggy of fashionistaF.<br>Part of the SET Set.`, tags: "male",},
    {category: `jiggy`, index: `fashionista-fles`, set: "Non-Furry", image: `fashionista/jiggyFles`, pieces: 75, name: `Rear Invitation`, desc: `A jiggy of fashionistaF.<br>Part of the SET Set.`, tags: "male",},
    {category: `jiggy`, index: `jiggy-bonus1c`, set: "Misc", image: `jiggy/bonus1c`, pieces: 100, name: `Canine Prodding`, desc: `A jiggy you found in the forest.`, tags: "male",},
	
	//Mesu jiggies
    {category: `jiggy`, index: `mesu-core1`, set: "Core", image: `mesu/jiggyCore1`, pieces: 100, name: `Maid Cage`, desc: `A jiggy of mesuF.<br>Part of the SET Set.`, tags: "male",},
    {category: `jiggy`, index: `mesu-cozy`, set: "Cozy", image: `mesu/jiggyCozy`, pieces: 75, name: `Honest Wish`, desc: `A jiggy of mesuF.<br>Part of the SET Set.`, tags: "male",},
    {category: `jiggy`, index: `mesu-summ`, set: "Summertime", image: `mesu/jiggySumm`, pieces: 75, name: `Lingering Pleasure`, desc: `A jiggy of mesuF.<br>Part of the SET Set.`, tags: "male",},
    {category: `jiggy`, index: `mesu-fles`, set: "Non-Furry", image: `mesu/jiggyFles`, pieces: 100, name: `Cotton Cage`, desc: `A jiggy of mesuF.<br>Part of the SET Set.`, tags: "male",},
	
	//Hyena jiggies
    {category: `jiggy`, index: `hyena-core1`, set: "Core", image: `hyena/jiggyCore1`, pieces: 125, name: `Urgent Issue`, desc: `A jiggy of hyenaF.<br>Part of the SET Set.`, tags: "dickgirl",},
    {category: `jiggy`, index: `hyena-cozy`, set: "Cozy", image: `hyena/jiggyCozy`, pieces: 100, name: `Fluffy Concert`, desc: `A jiggy of hyenaF.<br>Part of the SET Set.`, tags: "dickgirl",},
    {category: `jiggy`, index: `hyena-summ`, set: "Summertime", image: `hyena/jiggySumm`, pieces: 125, name: `Hotel Self-Service`, desc: `A jiggy of hyenaF.<br>Part of the SET Set.`, tags: "dickgirl",},
    {category: `jiggy`, index: `hyena-fles`, set: "Non-Furry", image: `hyena/jiggyFles`, pieces: 125, name: `Ready to Burst`, desc: `A jiggy of hyenaF.<br>Part of the SET Set.`, tags: "dickgirl",},
	
	//Doe jiggies
    {category: `jiggy`, index: `doe-core1`, set: "Core", image: `doe/jiggyCore1`, pieces: 125, name: `Limit Break`, desc: `A jiggy of doeF.<br>Part of the SET Set.`, tags: "dickgirl",},
    {category: `jiggy`, index: `doe-cozy`, set: "Cozy", image: `doe/jiggyCozy`, pieces: 100, name: `Restful Doe`, desc: `A jiggy of doeF.<br>Part of the SET Set.`, tags: "dickgirl",},
    {category: `jiggy`, index: `doe-summ`, set: "Summertime", image: `doe/jiggySumm`, pieces: 125, name: `Willpower Exhausted`, desc: `A jiggy of doeF.<br>Part of the SET Set.`, tags: "dickgirl",},
    {category: `jiggy`, index: `doe-fles`, set: "Non-Furry", image: `doe/jiggyFles`, pieces: 100, name: `Urgent Answering`, desc: `A jiggy of doeF.<br>Part of the SET Set.`, tags: "dickgirl",},
	
	//Side-character jiggies
    {category: `jiggy`, index: `mommy-core1`, set: "Core", image: `mommy/jiggyCore1`, pieces: 100, name: `What Mommy Wants...`, desc: `A jiggy of mommyF.<br>Part of the SET Set.`, tags: "female",},
	
    //{category: `jiggy`, index: `silf-core1`, set: "Core", image: `silf/jiggyCore1`, pieces: 125, name: `Mother's Intuition`, desc: `A jiggy of a side character.<br>Part of the SET Set.`, tags: "female",},
	
    //{category: `jiggy`, index: `wilf-core1`, set: "Core", image: `wilf/jiggyCore1`, pieces: 125, name: `Strong Genetics`, desc: `A jiggy of a side character.<br>Part of the SET Set.`, tags: "female",},
	
    {category: `jiggy`, index: `deity-core1`, set: "Core", image: `deity/jiggyCore1`, pieces: 100, name: `Deity`, desc: `A jiggy of a side character.<br>Part of the SET Set.`, tags: "male, feral",},
	
    {category: `jiggy`, index: `anubian-core1`, set: "Core", image: `jiggy/anubianc`, pieces: 75, name: `The Anubian`, desc: `A jiggy of a side character.<br>Part of the SET Set.`, tags: "male",},
	
	//Group jiggies
	{category: `jiggy`, index: `group-veggie1`, set: "Group", image: `jiggy/group-veggie1`, pieces: 150, name: `Squish that Cat`, desc: `wolfF and sadoF yuri!`, tags: "female",},
	{category: `jiggy`, index: `group-veggie2`, set: "Group", image: `jiggy/group-veggie2`, pieces: 150, name: `Battle of the Breast`, desc: `nunF and milfF competing.`, tags: "female, pregnancy",},
	{category: `jiggy`, index: `group-veggie3`, set: "Group", image: `jiggy/group-veggie3`, pieces: 100, name: `Booty Appreciation`, desc: `Looks tasty!<br>From a morning event.`, tags: "female",},
	{category: `jiggy`, index: `jiggy-bonus3v`, set: "Group", image: `jiggy/bonus3v`, pieces: 125, name: `September`, desc: `Do you remember~?`, tags: "female",},
	
	{category: `jiggy`, index: `group-meat1`, set: "Group", image: `jiggy/group-meat1`, pieces: 125, name: `Teasing Among Boys`, desc: `mesuF and fashionistaF circlejerk!<br>... Kinda.`, tags: "male",},
	{category: `jiggy`, index: `group-meat2`, set: "Group", image: `jiggy/group-meat2`, pieces: 150, name: `Let the Meat Compete`, desc: `hyenaF and doeF competing.`, tags: "dickgirl",},
    {category: `jiggy`, index: `jiggy-bonus2c`, set: "Group", image: `jiggy/bar-4`, pieces: 150, name: `Drink the Bar Dry`, desc: `The mayor's jealousy gets the better of her.`, tags: "male, dickgirl",}, 
    {category: `jiggy`, index: `group-meat3`, set: "Group", image: `jiggy/group-meat3`, pieces: 100, name: `Happy Haircut`, desc: `(SFW)<br>From one of fashionistaF's scenes.`, tags: "male",}, 

	{category: `jiggy`, index: `cheatMisc1c`, set: "Misc", image: `jiggy/cheatMisc1c`, pieces: 100, name: `Dragon Lady (C)`, desc: `A jiggy of a dragon waking from her slumber. Meat ver.`, tags: "dickgirl"},
	{category: `jiggy`, index: `cheatMisc1v`, set: "Misc", image: `jiggy/cheatMisc1v`, pieces: 100, name: `Dragon Lady (V)`, desc: `A jiggy of a dragon waking from her slumber. No-meat ver.`, tags: "female"},
    {category: `jiggy`, index: `cheatMisc1v`, set: "Misc", image: `jiggy/cheatMisc1v`, pieces: 100, name: `Dragon Lady (V)`, desc: `A jiggy of a dragon waking from her slumber. No meat ver.`, tags: "female"},
    {category: `jiggy`, index: `cheatMisc2c`, set: "Misc", image: `jiggy/cheatMisc2c`, pieces: 100, name: `Gobbo Supremacy (C)`, desc: `A jiggy of a goblin shortstack. Meat ver.`, tags: "dickgirl"},
    {category: `jiggy`, index: `cheatMisc2v`, set: "Misc", image: `jiggy/cheatMisc2v`, pieces: 100, name: `Gobbo Supremacy (V)`, desc: `A jiggy of a goblin shortstack. No meat ver.`, tags: "female"},
	
	{category: `jiggy`, index: `jiggy-evilteamc`, set: "Misc", image: `jiggy/evilteamc`, pieces: 150, name: `Evil Team`, desc: `A trio of evildoers from a Syrup Town tellyvision show.`, tags: "dickgirl, male",},
    {category: `jiggy`, index: `jiggy-sentaiv`, set: "Misc", image: `jiggy/sentaiv`, pieces: 150, name: `Sentai Squad`, desc: `A trio of heroes from a Syrup Town tellyvision show.`, tags: "female",},
];

const initialClothesArray =[
	//The Bald / Topless / Bottomless / Barefoot sentinel garments used to live here. Not
	//wearing a category now means having no piece of that category, so they are gone; see
	//migrateClothes for how old saves and shared outfit codes that name them are converted.
	{index: "Hyper Breasts", category: "upperwear", filter: "", image: "player/upperwear/hyper-light", requirements: "?flag player haa;",},
	{index: "Hyper Penis", category: "lowerwear", filter: "", image: "player/lowerwear/hyper-light", requirements: "?flag player haa;",},

	{index: "Basic Haircut", category: "hair", filter: "", image: "player/hair/basic-mascFront", requirements: "",},
	{index: "Sneakers", category: "footwear", filter: "", image: "player/footwear/sneakers", requirements: "",},
	{index: "Shorts", category: "lowerwear", filter: "", image: "player/lowerwear/shorts-penis", requirements: "", tags: "covering",},
	{index: "Shirt", category: "upperwear", filter: "", image: "player/upperwear/shirt-masc", requirements: "",},

	{index: "Ponytail", category: "hair", filter: "", image: "player/hair/ponytailFront"},

	{index: "Bowl Cut", category: "hair", filter: "", image: "player/hair/bowl"},

	{index: "Twintails", category: "hair", filter: "", image: "player/hair/twintails-masc"},

	{index: "Gradient Hair", category: "hair", filter: "", image: "player/hair/flippedFront", requirements: "?item roobSet;"},

	{index: "Heiress Ponytail", category: "hair", filter: "", image: "player/hair/heiressFront", requirements: "?item heiressSet;"},

	{index: "Colored Inner Hair", category: "hair", filter: "", image: "player/hair/bowFront", requirements: "?item shinobiSet;"},

	{index: "Goldie Locks", category: "hair", filter: "", image: "player/hair/goldieFront", requirements: "?item rowdySet;"},

	{index: "Princess Haircut", category: "hair", filter: "", image: "player/hair/princessFront", requirements: "?flag player princess;",},
	{index: "Hexy Haircut", category: "hair", filter: "", image: "player/hair/hexFront", requirements: "?flag player placeholder;",},

	{index: "Flames", category: "upperwear", filter: "", image: "player/upperwear/flame-masc"},
	//{index: "Flames", category: "upperwear", filter: "filter: brightness(200%) hue-rotate(-75deg) contrast(1.2)", image: "player/upperwear/flame-masc"},
	//{index: "Flames", category: "upperwear", filter: "filter: brightness(200%) hue-rotate(30deg)", image: "player/upperwear/flame-masc"},
	//{index: "Flames", category: "upperwear", filter: "filter: brightness(300%) hue-rotate(40deg)", image: "player/upperwear/flame-masc"},

	{index: "Aloha Shirt", category: "upperwear", filter: "", image: "player/upperwear/aloha-masc"},

	{index: "Dress", category: "upperwear", filter: "", image: "player/upperwear/dress-masc"},

	{index: "Sleeveless", category: "upperwear", filter: "", image: "player/upperwear/sleeveless-masc", requirements: "?trophy 1mayorFriend;",},

	{index: "Sweater", category: "upperwear", filter: "", image: "player/upperwear/sweater-masc", requirements: "?trophy 3carpenterFriend;",},

	{index: "Apron", category: "upperwear", filter: "", image: "player/upperwear/apron-masc", requirements: "?trophy 2shopkeepFriend;",},

	{index: "Nightgown", category: "upperwear", filter: "", image: "player/upperwear/nightie-masc"},

	{index: "Chest Wraps", category: "upperwear", filter: "", image: "player/upperwear/wraps-masc", requirements: "?trophy 5sadogatoFriend;",},
	//{index: "Chest Wraps", category: "upperwear", filter: "filter: brightness(200%) hue-rotate(-75deg) contrast(1.2)", image: "player/upperwear/wraps-masc"},
	//{index: "Chest Wraps", category: "upperwear", filter: "filter: brightness(200%) hue-rotate(30deg)", image: "player/upperwear/wraps-masc"},
	//{index: "Chest Wraps", category: "upperwear", filter: "filter: brightness(270%) hue-rotate(50deg) contrast(1.2)", image: "player/upperwear/wraps-masc"},
	//{index: "Chest Wraps", category: "upperwear", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)", image: "player/upperwear/wraps-masc"},

	{index: "Business", category: "upperwear", filter: "", image: "player/upperwear/business-masc"},
	//{index: "Business", category: "upperwear", filter: "filter: brightness(200%) hue-rotate(-75deg) contrast(1.2)", image: "player/upperwear/business-masc"},
	//{index: "Business", category: "upperwear", filter: "filter: brightness(200%) hue-rotate(30deg)", image: "player/upperwear/business-masc"},
	//{index: "Business", category: "upperwear", filter: "filter: brightness(270%) hue-rotate(50deg) contrast(1.2)", image: "player/upperwear/business-masc"},

	{index: "Bowtie", category: "upperwear", filter: "", image: "player/upperwear/bowtie-masc", requirements: "?trophy 8fashFriend;",},
	//{index: "Bowtie", category: "upperwear", filter: "filter: brightness(200%) hue-rotate(-75deg) contrast(1.2)", image: "player/upperwear/bowtie-masc"},
	//{index: "Bowtie", category: "upperwear", filter: "filter: brightness(200%) hue-rotate(30deg)", image: "player/upperwear/bowtie-masc"},
	//{index: "Bowtie", category: "upperwear", filter: "filter: brightness(270%) hue-rotate(50deg) contrast(1.2)", image: "player/upperwear/bowtie-masc"},

	{index: "Sling Bikini", category: "upperwear", filter: "", image: "player/upperwear/sling-masc"},

	{index: "Bikini Armor", category: "upperwear", filter: "", image: "player/upperwear/armor-masc"},

	{index: "Full Poncho", category: "upperwear", filter: "", image: "player/upperwear/fullPoncho-masc"},
	
	{index: "Half Poncho", category: "upperwear", filter: "", image: "player/upperwear/halfPoncho-masc"},

	{index: "Bunny Leotard", category: "upperwear", filter: "", image: "player/upperwear/leotard-masc-penis", tags: "covering",},

	{index: "Leather Jacket (Closed)", category: "upperwear", filter: "", image: "player/upperwear/jacketC-masc",},
	{index: "Leather Jacket (Open)", category: "upperwear", filter: "", image: "player/upperwear/jacketO-masc",},
	
	{index: "Rose Uniform", category: "upperwear", filter: "", image: "player/upperwear/gothic-masc", requirements: "?item roobSet;"},
	
	{index: "White Jacket", category: "upperwear", filter: "", image: "player/upperwear/heiress-masc", requirements: "?item heiressSet;"},
	
	{index: "Shinobi Garb", category: "upperwear", filter: "", image: "player/upperwear/shinobi-masc", requirements: "?item shinobiSet;"},
	
	{index: "Tube Jacket", category: "upperwear", filter: "", image: "player/upperwear/goldie-masc", requirements: "?item rowdySet;"},

	{index: "Sheer Shirt", category: "upperwear", filter: "", image: "player/upperwear/sheer-masc", requirements: "",},
	{index: "Donut Muncher Shirt", category: "upperwear", filter: "", image: "player/upperwear/sheer-donut-masc", requirements: "!vegetarian; !carnivore;",},
	{index: "Titty Enjoyer Shirt", category: "upperwear", filter: "", image: "player/upperwear/sheer-titty-masc", requirements: "!carnivore;",},
	{index: "Salami Fanatic Shirt", category: "upperwear", filter: "", image: "player/upperwear/sheer-salami-masc", requirements: "!vegetarian;",},

	{index: "Swimsuit", category: "lowerwear", filter: "", image: "player/lowerwear/swimsuit-masc-penis", tags: "covering",},

	{index: "Pencil Skirt", category: "lowerwear", filter: "", image: "player/lowerwear/pencil-skirt"},

	{index: "Pleated Skirt", category: "lowerwear", filter: "", image: "player/lowerwear/pleated-skirt"},

	{index: "Jeans", category: "lowerwear", filter: "", image: "player/lowerwear/jeans-penis", tags: "covering",},
	
	{index: "Pantyhose", category: "lowerwear", filter: "", image: "player/lowerwear/pantyhose-penis", tags: "covering", requirements: "?item roobSet;"},

	{index: "Pure Dress", category: "lowerwear", filter: "", image: "player/lowerwear/heiress-penis-masc", requirements: "?item heiressSet;"},

	{index: "Shiny Pants", category: "lowerwear", filter: "", image: "player/lowerwear/latex-penis", tags: "covering", requirements: "?item shinobiSet;"},

	{index: "Bootyshorts", category: "lowerwear", filter: "", image: "player/lowerwear/booty-penis", tags: "covering", requirements: "?item rowdySet;"},

	{index: "Boots", category: "footwear", filter: "", image: "player/footwear/boots"},

	{index: "Thighboots", category: "footwear", filter: "", image: "player/footwear/thighboots"},

	{index: "Mary Janes", category: "footwear", filter: "", image: "player/footwear/janes"},
	
	{index: "Loafers", category: "footwear", filter: "", image: "player/footwear/loafers"},
	
	{index: "Greaves", category: "footwear", filter: "", image: "player/footwear/greaves"},

	{index: "High Heels", category: "footwear", filter: "", image: "player/footwear/heiress", requirements: "?item heiressSet;"},
	
	{index: "Belted Boots", category: "footwear", filter: "", image: "player/footwear/belted", requirements: "?item shinobiSet;"},
	
	{index: "Cowboy Boots", category: "footwear", filter: "", image: "player/footwear/cowboy", requirements: "?item rowdySet;"},
	
	{index: "Lightning McCrocs", category: "footwear", filter: "", image: "player/footwear/crocsLightning"},

	{index: "Socks", category: "accessory", filter: "", image: "player/accessories/socks"},

	{index: "Thighhighs", category: "accessory", filter: "", image: "player/footwear/thighhighs"},

	{index: "Pasties", category: "accessory", filter: "", image: "player/accessories/pasties-masc", requirements: "?trophy 6milfFriend;",},

	{index: "Thong", category: "accessory", filter: "", image: "player/lowerwear/thong-penis", tags: "underwear",},

	{index: "Fishnets", category: "accessory", filter: "", image: "player/accessories/fishnets-light"},

	{index: "Shades", category: "accessory", filter: "", image: "player/accessories/shades"},

	{index: "Choker", category: "accessory", filter: "", image: "player/accessories/choker"},
	
	{index: "Cloak", category: "accessory", filter: "", image: "player/accessories/cloakFront", requirements: "?item roobSet;"},
	
	{index: "Hair Flower", category: "accessory", filter: "", image: "player/accessories/flower"},

	{index: "Pelvic Curtain", category: "accessory", filter: "", image: "player/accessories/loincloth-penis", tags: "underwear",},

	{index: "Horny Hat", category: "accessory", filter: "", image: "player/accessories/hat"},

	{index: "Cumload", category: "accessory", filter: "", image: "player/accessories/cum"},
	{index: "Cow", category: "accessory", filter: "", image: "player/accessories/cow-masc"},
	{index: "Bunny Ears", category: "accessory", filter: "", image: "player/accessories/bunny"},
	{index: "Second Hat", category: "accessory", filter: "", image: "player/accessories/weeg"},
	{index: "Mini Crown", category: "accessory", filter: "", image: "player/accessories/crown", requirements: "?flag player patron;",},
	//{index: "Equine Penis", category: "accessory", filter: "", image: "player/dick-equine", requirements: "?trophy 93doeFriend;",},
	//{index: "Canine Penis", category: "accessory", filter: "", image: "player/dick-canine", requirements: "?trophy 94deityFriend;",},

	{index: "Gauntlets", category: "accessory", filter: "", image: "player/accessories/gauntlets", requirements: "?item rowdySet;"},

	{index: "Apothecary Locks", category: "hair", filter: "", image: "player/hair/apothecaryFront", requirements: "?item apothecarySet;",},
	{index: "Apothecary Garb", category: "upperwear", filter: "", image: "player/upperwear/apothecary-masc", requirements: "?item apothecarySet;",},
	{index: "Apothecary Longskirt", category: "lowerwear", filter: "", image: "player/lowerwear/apothecary-penis", requirements: "?item apothecarySet;", tags: "covering",},
	{index: "Apothecary Treads", category: "footwear", filter: "", image: "player/footwear/apothecary", requirements: "?item apothecarySet;",},

	{index: "Cat Ears", category: "hair", filter: "", image: "player/hair/catFront", requirements: "?item catSet;",},
	{index: "Lacey Top", category: "upperwear", filter: "", image: "player/upperwear/cat-masc", requirements: "?item catSet;",},
	{index: "Neck Bell", category: "accessory", filter: "", image: "player/accessories/cat", requirements: "?item catSet;",},

	{index: "Swept Ponytail", category: "hair", filter: "", image: "player/hair/escortFront", requirements: "?item escortSet;",},
	{index: "Escort's Top", category: "upperwear", filter: "", image: "player/upperwear/escort-masc", requirements: "?item escortSet;",},
	{index: "Escort's Heels", category: "footwear", filter: "", image: "player/footwear/escort", requirements: "?item escortSet;",},
	{index: "Escort's Bling", category: "accessory", filter: "", image: "player/accessories/escort", requirements: "?item escortSet;",},

	{index: "Forehead Gem", category: "hair", filter: "", image: "player/hair/crow", requirements: "?item crowSet;",},
	{index: "Latex Leotard", category: "lowerwear", filter: "", image: "player/lowerwear/crow-masc-penis", requirements: "?item crowSet;",},
	{index: "Bead Belt", category: "accessory", filter: "", image: "player/waistwear/crow", requirements: "?item crowSet;",},
	{index: "Crow's Cloak", category: "accessory", filter: "", image: "player/accessories/crowFront-masc", requirements: "?item crowSet;",},
	
	{index: "Braided Ponytail", category: "hair", filter: "", image: "player/hair/fatedFront", requirements: "?item fatedSet;",},
	{index: "Sailor Top", category: "upperwear", filter: "", image: "player/upperwear/fated-masc", requirements: "?item fatedSet;",},
	{index: "Sailor Skirt", category: "lowerwear", filter: "", image: "player/lowerwear/fated-skirt", requirements: "?item fatedSet;",},
	
	{index: "Froggy Hair", category: "hair", filter: "", image: "player/hair/frogsuitFront", requirements: "?item frogsuitSet;",},
	{index: "Frogsuit Top", category: "upperwear", filter: "", image: "player/upperwear/frogsuit-masc", requirements: "?item frogsuitSet;",},
	{index: "Frogsuit Bottom", category: "lowerwear", filter: "", image: "player/lowerwear/frogsuit-penis", requirements: "?item frogsuitSet;", tags: "covering",},
	{index: "Frogsuit Belt", category: "accessory", filter: "", image: "player/waistwear/frogsuit", requirements: "?item frogsuitSet;",},
	{index: "Frogsuit Stompers", category: "footwear", filter: "", image: "player/footwear/frogsuit", requirements: "?item frogsuitSet;",},
	
	{index: "Goth-Lolly Hairdo", category: "hair", filter: "", image: "player/hair/gollyFront", requirements: "?item gollySet;",},
	{index: "Goth-Lolly Dress", category: "upperwear", filter: "", image: "player/upperwear/golly-masc", requirements: "?item gollySet;",},
	{index: "Striped Stockings", category: "accessory", filter: "", image: "player/accessories/golly", requirements: "?item gollySet;",},
	
	{index: "Magical Ribbons", category: "hair", filter: "", image: "player/hair/magic-masc", requirements: "?item magicSet;",},
	{index: "Magical Dress", category: "upperwear", filter: "", image: "player/upperwear/magic-masc", requirements: "?item magicSet;",},
	{index: "Magical Boots", category: "footwear", filter: "", image: "player/footwear/magic", requirements: "?item magicSet;",},
	
	{index: "Wicked Dress", category: "upperwear", filter: "", image: "player/upperwear/ooble-masc", requirements: "?item oobleSet;",},
	{index: "Wicked Bands", category: "accessory", filter: "", image: "player/armwear/ooble-masc", requirements: "?item oobleSet;",},
	{index: "Wicked Treads", category: "footwear", filter: "", image: "player/footwear/ooble", requirements: "?item oobleSet;",},
	
	{index: "Prince's Ahoge", category: "hair", filter: "", image: "player/hair/princeFront", requirements: "?item princeSet;",},
	{index: "Prince's Shirt", category: "upperwear", filter: "", image: "player/upperwear/prince-masc", requirements: "?item princeSet;",},
	{index: "Prince's Suspenders", category: "lowerwear", filter: "", image: "player/lowerwear/prince-masc-penis", requirements: "?item princeSet;", tags: "covering",},
	{index: "Prince's Shoes", category: "footwear", filter: "", image: "player/footwear/prince", requirements: "?item princeSet;",},
	
	{index: "Earmuffs", category: "hair", filter: "", image: "player/hair/rabbitFront", requirements: "?item rabbitSet;",},
	{index: "Rabbit Leotard", category: "lowerwear", filter: "", image: "player/lowerwear/rabbit-masc-penis", requirements: "?item rabbitSet;",},
	{index: "Rabbit Stompers", category: "footwear", filter: "", image: "player/footwear/rabbit", requirements: "?item rabbitSet;",},
	{index: "Rabbit Gloves", category: "accessory", filter: "", image: "player/armwear/rabbit", requirements: "?item rabbitSet;",},
	
	{index: "Sorceress Locks", category: "hair", filter: "", image: "player/hair/sorceressFront", requirements: "?item sorceressSet;",},
	{index: "Sorceress Bodice", category: "upperwear", filter: "", image: "player/upperwear/sorceress-masc", requirements: "?item sorceressSet;",},
	{index: "Sorceress Sarong", category: "lowerwear", filter: "", image: "player/lowerwear/sorceressFront", requirements: "?item sorceressSet;",},
	{index: "Sorceress Shoes", category: "footwear", filter: "", image: "player/footwear/sorceress", requirements: "?item sorceressSet;",},
	{index: "Sorceress Thong", category: "accessory", filter: "", image: "player/underwear/sorceress-penis", requirements: "?item sorceressSet;", tags: "underwear",},
	{index: "Sorceress Sleeves", category: "accessory", filter: "", image: "player/armwear/sorceress-masc", requirements: "?item sorceressSet;",},
	{index: "Sorceress Hat", category: "accessory", filter: "", image: "player/accessories/sorceressFront", requirements: "?item sorceressSet;",},
	
	{index: "Spooky Drills", category: "hair", filter: "", image: "player/hair/spooky", requirements: "?item spookySet;",},
	{index: "Spooky Top", category: "upperwear", filter: "", image: "player/upperwear/spooky-masc", requirements: "?item spookySet;",},
	{index: "Spooky Skirt", category: "lowerwear", filter: "", image: "player/lowerwear/spooky-skirt", requirements: "?item spookySet;",},
	{index: "Spooky Thighhighs", category: "accessory", filter: "", image: "player/accessories/spooky", requirements: "?item spookySet;",},
	
	{index: "Star-Princess Locks", category: "hair", filter: "", image: "player/hair/starFront", requirements: "?item starSet;",},
	{index: "Star-Princess Top", category: "upperwear", filter: "", image: "player/upperwear/star-masc", requirements: "?item starSet;",},
	{index: "Star-Princess Skirt", category: "lowerwear", filter: "", image: "player/lowerwear/star-skirt", requirements: "?item starSet;",},
	{index: "Star-Princess Armguards", category: "accessory", filter: "", image: "player/armwear/star-masc", requirements: "?item starSet;",},
	
	{index: "Witchy Forelocks", category: "hair", filter: "", image: "player/hair/witchyFront", requirements: "?item witchySet;",},
	{index: "Witchy Dress", category: "upperwear", filter: "", image: "player/upperwear/witchy-masc", requirements: "?item witchySet;",},
	{index: "Leg Wraps", category: "accessory", filter: "", image: "player/accessories/witchy", requirements: "?item witchySet;",},
	{index: "Witch's Cape", category: "accessory", filter: "", image: "player/accessories/capeFront", requirements: "?item witchySet;",},
	
	{index: "Inspector's Vest", category: "upperwear", filter: "", image: "player/upperwear/vest-masc", requirements: "?flag player anomaly;",},
	{index: "Inspector's Slacks", category: "lowerwear", filter: "", image: "player/lowerwear/slacks-penis", requirements: "?flag player anomaly;", tags: "covering",},

	{index: "Survivor's Shirt", category: "upperwear", filter: "", image: "player/upperwear/rainy-masc", requirements: "?flag player rainy;",},
	{index: "Survivor's Pants", category: "lowerwear", filter: "", image: "player/lowerwear/rainy-penis", requirements: "?flag player rainy;", tags: "covering",},

	{index: "Princess Dress", category: "upperwear", filter: "", image: "player/upperwear/princess-masc", requirements: "?flag player princess;",},

	{index: "Male Counselor Top", category: "upperwear", filter: "", image: "player/upperwear/thomas-masc", requirements: "?flag player university;"},
	{index: "Male Counselor Bottoms", category: "lowerwear", filter: "", image: "player/lowerwear/thomas-penis", requirements: "?flag player university;", tags: "covering",},

	{index: "Female Counselor Top", category: "upperwear", filter: "", image: "player/upperwear/tomara-masc", requirements: "?flag player university;",},
	{index: "Female Counselor Bottoms", category: "lowerwear", filter: "", image: "player/lowerwear/tomara-penis", requirements: "?flag player university;", tags: "covering",},

	{index: "Counselor Glasses", category: "accessory", filter: "", image: "player/accessories/glasses", requirements: "?flag player university;",},

	{index: "Medicenter Hat", category: "accessory", filter: "", image: "player/accessories/nurse", requirements: "?flag player medicenter;",},
	{index: "Medicenter Uniform", category: "upperwear", filter: "", image: "player/upperwear/nurse-masc", requirements: "?flag player medicenter;",},

	{index: "Spacer's Bodysuit Top", category: "upperwear", filter: "", image: "player/upperwear/bodysuit-masc", requirements: "?flag player argent;",},
	{index: "Spacer's Bodysuit Bottom", category: "lowerwear", filter: "", image: "player/lowerwear/bodysuit-penis", requirements: "?flag player argent;", tags: "covering",},

	{index: "Swept Bangs", category: "hair", filter: "", image: "player/hair/brisketAltFront", requirements: "?item brisketSet;",},
	{index: "Sporty Hoodie", category: "upperwear", filter: "", image: "player/upperwear/brisketOpen-mascAltFront", requirements: "?item brisketSet;",},
	{index: "Sporty Shorts", category: "lowerwear", filter: "", image: "player/lowerwear/brisket-penis", requirements: "?item brisketSet;", tags: "covering",},
	{index: "Sporty Kicks", category: "footwear", filter: "", image: "player/footwear/brisket", requirements: "?item brisketSet;",},

	{index: "Wallflower Ponytail", category: "hair", filter: "", image: "player/hair/squigAlt", requirements: "?item squigSet;",},
	{index: "Skull", category: "upperwear", filter: "", image: "player/upperwear/squig-masc", requirements: "?item squigSet;",},
	{index: "Wallflower Dress", category: "lowerwear", filter: "", image: "player/lowerwear/squig-masc-penisAlt", requirements: "?item squigSet;", tags: "covering",},
	{index: "Candycane Sleeves", category: "accessory", filter: "", image: "player/armwear/squig-mascFront", requirements: "?item squigSet;",},
	{index: "Candycane Tights", category: "accessory", filter: "", image: "player/underwear/squig-penis", requirements: "?item squigSet;", tags: "underwear",},

	{index: "Jiangshi Hat", category: "accessory", filter: "", image: "player/hat/ofuda", requirements: "?item ofudaSet;",},
	{index: "Talisman (Head)", category: "accessory", filter: "", image: "player/accessories/ofuda-masc", requirements: "?item ofudaSet;",},
	{index: "Jiangshi Sleeves", category: "accessory", filter: "", image: "player/armwear/ofuda-mascFront", requirements: "?item ofudaSet;",},
	{index: "Talisman (Nipples)", category: "upperwear", filter: "", image: "player/upperwear/ofuda-masc", requirements: "?item ofudaSet;",},
	{index: "Talisman (Maebari)", category: "accessory", filter: "", image: "player/underwear/ofuda-penis", requirements: "?item ofudaSet;", tags: "underwear",},
	
	{index: "Head Ribbons", category: "accessory", filter: "", image: "player/accessories/ribbon", requirements: "?item ribbonSet;",},
	{index: "Chest Ribbon", category: "accessory", filter: "", image: "player/upperwear/ribbon-masc", requirements: "?item ribbonSet;",},
	{index: "Crotch Ribbon", category: "accessory", filter: "", image: "player/underwear/ribbon-penis", requirements: "?item ribbonSet;", tags: "underwear",},
	
	{index: "Angel Halo", category: "accessory", filter: "", image: "player/hat/angel", requirements: "?item angelSet;",},
	{index: "Angelic Robes", category: "upperwear", filter: "", image: "player/upperwear/angel-masc-penisFront", requirements: "?item angelSet;",},
	{index: "Genital Ring", category: "accessory", filter: "", image: "player/underwear/angel-penis", requirements: "?item angelSet;", tags: "underwear",},
	{index: "Angel Wings", category: "accessory", filter: "", image: "player/accessories/angelFront", requirements: "?item angelSet;",},

	{index: "Devil Horns", category: "accessory", filter: "", image: "player/horns/demon", requirements: "?item devilSet;",},
	{index: "Devil Wings", category: "accessory", filter: "", image: "player/accessories/demonFront", requirements: "?item devilSet;",},
	{index: "Devil Tail", category: "accessory", filter: "", image: "player/tail/demonFront", requirements: "?item devilSet;",},

	{index: "Round Glasses", category: "accessory", filter: "", image: "player/accessories/glasses", requirements: "?item neetSet;",},
	//Listed innermost first, like every other set: anything that reads this array in order (the
	//new-outfit preview most of all) draws it back to front, so the shirt has to come after the
	//bra and the jacket after the shirt. The order here matches the NEET premade outfit.
	{index: "NEET Locks", category: "hair", filter: "", image: "player/hair/neetFront", requirements: "?item neetSet;",},
	{index: "NEET Socks", category: "accessory", filter: "", image: "player/socks/neet", requirements: "?item neetSet;",},
	{index: "NEET Boots", category: "accessory", filter: "", image: "player/footwear/neet", requirements: "?item neetSet;",},
	{index: "NEET Shorts", category: "lowerwear", filter: "", image: "player/lowerwear/neet-penis", requirements: "?item neetSet;", tags: "covering",},
	{index: "NEET Bra", category: "accessory", filter: "", image: "player/upperwear/bra-masc", requirements: "?item neetSet;",},
	{index: "NEET Shirt", category: "upperwear", filter: "", image: "player/upperwear/neet-masc-alt", requirements: "?item neetSet;",},
	{index: "NEET Jacket", category: "accessory", filter: "", image: "player/cloak/neet-masc", requirements: "?item neetSet;",},

	{index: "Supercharged Balls", category: "body", filter: "", image: "player/lowerwear/superballs-light", tags: "genitals",},

	//Test piece for tall headwear. Its art fills the frame like any other layer and lands on the
	//head as drawn, so it needs nothing special; offsetY is the knob for raising or lowering it,
	//in percent of the canvas, and the crown reaches the top edge at 0. Art that genuinely will
	//not fit inside the canvas can set canvasHeight instead, which is documented on
	//clothingHeadroom, but that overhang is cut off in the wardrobe and outfit tiles.
	{index: "Magician's Hat", category: "accessory", filter: "", image: "player/hat/magicianFront", offsetY: 0, requirements: "?flag player placeholder;",},
];

//Alternate colours and alt art for garments that already exist in initialClothesArray.
//A variant names the piece it varies with index and overrides only what actually differs;
//every field it leaves out is copied from that piece. The optional name is the label the
//wardrobe shows, so a variant can be presented as its own thing rather than another swatch
//of its parent. Optional fields: name, image, filter, requirements, tags.
//
//Being a variant is declared here rather than inferred from carrying a filter. That inference
//is what forced every variant to have one even when it only swapped the art, and what stopped
//a real garment from ever shipping with a filter of its own.
const initialVariantsArray = [
	{index: "Basic Haircut", filter: "filter: hue-rotate(-23deg) contrast(1.4)"},
	{index: "Basic Haircut", filter: "filter: hue-rotate(-150deg) contrast(1.4)"},
	{index: "Basic Haircut", filter: "filter: hue-rotate(-100deg) contrast(1.4)"},
	{index: "Basic Haircut", filter: "filter: brightness(250%) hue-rotate(30deg) contrast(1.4)"},
	{index: "Basic Haircut", filter: "filter: hue-rotate(100deg) contrast(1.4)"},
	{index: "Basic Haircut", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Basic Haircut", filter: "filter: grayscale(100%) brightness(70%) contrast(1.4)"},

	{index: "Sneakers", filter: "filter: hue-rotate(-120deg)"},
	{index: "Sneakers", filter: "filter: hue-rotate(-85deg)"},
	{index: "Sneakers", filter: "filter: brightness(150%) hue-rotate(-75deg)"},
	{index: "Sneakers", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Sneakers", filter: "filter: brightness(270%) hue-rotate(50deg) contrast(1.2)"},
	{index: "Sneakers", filter: "filter: hue-rotate(75deg)"},
	{index: "Sneakers", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Sneakers", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Shorts", filter: "filter: hue-rotate(-120deg)"},
	{index: "Shorts", filter: "filter: hue-rotate(-85deg)"},
	{index: "Shorts", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Shorts", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Shorts", filter: "filter: grayscale(40%) brightness(200%) hue-rotate(40deg)"},
	{index: "Shorts", filter: "filter: hue-rotate(75deg)"},
	{index: "Shorts", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Shorts", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Shirt", filter: "filter: hue-rotate(-120deg)"},
	{index: "Shirt", filter: "filter: hue-rotate(-85deg)"},
	{index: "Shirt", filter: "filter: brightness(200%) hue-rotate(-75deg) contrast(1.2)"},
	{index: "Shirt", filter: "filter: brightness(200%) hue-rotate(30deg)"},
	{index: "Shirt", filter: "filter: brightness(270%) hue-rotate(50deg) contrast(1.2)"},
	{index: "Shirt", filter: "filter: hue-rotate(75deg)"},
	{index: "Shirt", filter: "filter: grayscale(100%) brightness(250%) contrast(1.2)"},
	{index: "Shirt", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Ponytail", filter: "filter: hue-rotate(-23deg) contrast(1.4)"},
	{index: "Ponytail", filter: "filter: hue-rotate(-150deg) contrast(1.4)"},
	{index: "Ponytail", filter: "filter: hue-rotate(-100deg) contrast(1.4)"},
	{index: "Ponytail", filter: "filter: brightness(200%) hue-rotate(30deg) contrast(1.4)"},
	{index: "Ponytail", filter: "filter: hue-rotate(100deg) contrast(1.4)"},
	{index: "Ponytail", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Ponytail", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Bowl Cut", filter: "filter: hue-rotate(-23deg) contrast(1.4))"},
	{index: "Bowl Cut", filter: "filter: hue-rotate(-150deg) contrast(1.4)"},
	{index: "Bowl Cut", filter: "filter: hue-rotate(-100deg) contrast(1.4)"},
	{index: "Bowl Cut", filter: "filter: brightness(150%) hue-rotate(30deg) contrast(1.4)"},
	{index: "Bowl Cut", filter: "filter: hue-rotate(100deg) contrast(1.4)"},
	{index: "Bowl Cut", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Bowl Cut", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Twintails", filter: "filter: hue-rotate(-23deg) contrast(1.4)"},
	{index: "Twintails", filter: "filter: hue-rotate(-150deg) contrast(1.4)"},
	{index: "Twintails", filter: "filter: hue-rotate(-100deg) contrast(1.4)"},
	{index: "Twintails", filter: "filter: brightness(200%) hue-rotate(30deg) contrast(1.4)"},
	{index: "Twintails", filter: "filter: hue-rotate(100deg) contrast(1.4)"},
	{index: "Twintails", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Twintails", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Gradient Hair", filter: "filter: hue-rotate(60deg) contrast(1.4) brightness(2)"},
	{index: "Gradient Hair", filter: "filter: hue-rotate(260deg) contrast(1.2) brightness(1.7)"},
	{index: "Gradient Hair", filter: "filter: hue-rotate(300deg) contrast(1.2) brightness(2)"},
	{index: "Gradient Hair", filter: "filter: hue-rotate(30deg) contrast(1.2) brightness(2.5)"},
	{index: "Gradient Hair", filter: "filter: brightness(200%) hue-rotate(100deg) contrast(2)"},
	{index: "Gradient Hair", filter: "filter: grayscale(100%) brightness(300%) contrast(1.5)"},
	{index: "Gradient Hair", filter: "filter: grayscale(100%) brightness(150%) contrast(1.4)"},

	{index: "Heiress Ponytail", filter: "filter: hue-rotate(90deg) contrast(1.2)"},
	{index: "Heiress Ponytail", filter: "filter: hue-rotate(260deg) contrast(1.2)"},
	{index: "Heiress Ponytail", filter: "filter: hue-rotate(350deg) contrast(1.2) brightness(1) saturate(2)"},
	{index: "Heiress Ponytail", filter: "filter: hue-rotate(140deg) contrast(1.2) brightness(1) saturate(2)"},
	{index: "Heiress Ponytail", filter: "filter: hue-rotate(230deg) contrast(1.2) saturate(2) brightness(1)"},
	{index: "Heiress Ponytail", filter: "filter: grayscale(100%) brightness(110%) contrast(1)"},
	{index: "Heiress Ponytail", filter: "filter: brightness(50%) contrast(1.5)"},
	{index: "Heiress Ponytail", image: "player/hair/heiress-altFront", filter: "filter: contrast(1)"},
	{index: "Heiress Ponytail", image: "player/hair/heiress-altFront", filter: "filter: hue-rotate(-23deg) contrast(1.4)"},
	{index: "Heiress Ponytail", image: "player/hair/heiress-altFront", filter: "filter: hue-rotate(-150deg) contrast(1.4)"},
	{index: "Heiress Ponytail", image: "player/hair/heiress-altFront", filter: "filter: hue-rotate(-100deg) contrast(1.4)"},
	{index: "Heiress Ponytail", image: "player/hair/heiress-altFront", filter: "filter: brightness(200%) hue-rotate(30deg) contrast(1.4)"},
	{index: "Heiress Ponytail", image: "player/hair/heiress-altFront", filter: "filter: hue-rotate(100deg) contrast(1.4)"},
	{index: "Heiress Ponytail", image: "player/hair/heiress-altFront", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Heiress Ponytail", image: "player/hair/heiress-altFront", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Colored Inner Hair", filter: "filter: hue-rotate(60deg) contrast(1.4) brightness(2)"},
	{index: "Colored Inner Hair", filter: "filter: hue-rotate(260deg) contrast(1.2) brightness(1.7)"},
	{index: "Colored Inner Hair", filter: "filter: hue-rotate(300deg) contrast(1.2) brightness(1)"},
	{index: "Colored Inner Hair", filter: "filter: hue-rotate(30deg) contrast(1.2) brightness(2.5)"},
	{index: "Colored Inner Hair", filter: "filter: brightness(200%) hue-rotate(100deg) contrast(2)"},
	{index: "Colored Inner Hair", image: "player/hair/bow-altFront", filter: "filter: contrast(1)"},
	{index: "Colored Inner Hair", image: "player/hair/bow-altFront", filter: "filter: hue-rotate(-23deg) contrast(1.4)"},
	{index: "Colored Inner Hair", image: "player/hair/bow-altFront", filter: "filter: hue-rotate(-150deg) contrast(1.4)"},
	{index: "Colored Inner Hair", image: "player/hair/bow-altFront", filter: "filter: hue-rotate(-100deg) contrast(1.4)"},
	{index: "Colored Inner Hair", image: "player/hair/bow-altFront", filter: "filter: brightness(170%) hue-rotate(30deg) contrast(1.4)"},
	{index: "Colored Inner Hair", image: "player/hair/bow-altFront", filter: "filter: hue-rotate(100deg) contrast(1.4)"},
	{index: "Colored Inner Hair", image: "player/hair/bow-altFront", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Colored Inner Hair", image: "player/hair/bow-altFront", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Goldie Locks", filter: "filter: hue-rotate(300deg) brightness(80%) contrast(1.2)"},
	{index: "Goldie Locks", filter: "filter: brightness(80%) contrast(1) hue-rotate(190deg)"},
	{index: "Goldie Locks", filter: "filter: brightness(60%) contrast(1.4) hue-rotate(100deg)"},
	{index: "Goldie Locks", filter: "filter: grayscale(100%) brightness(110%) contrast(1)"},
	{index: "Goldie Locks", image: "player/hair/goldie-altFront", filter: "filter: contrast(1)"},
	{index: "Goldie Locks", image: "player/hair/goldie-altFront", filter: "filter: hue-rotate(-23deg) contrast(1.4)"},
	{index: "Goldie Locks", image: "player/hair/goldie-altFront", filter: "filter: hue-rotate(-150deg) contrast(1.4)"},
	{index: "Goldie Locks", image: "player/hair/goldie-altFront", filter: "filter: hue-rotate(-100deg) contrast(1.4)"},
	{index: "Goldie Locks", image: "player/hair/goldie-altFront", filter: "filter: brightness(200%) hue-rotate(30deg) contrast(1.4)"},
	{index: "Goldie Locks", image: "player/hair/goldie-altFront", filter: "filter: hue-rotate(100deg) contrast(1.4)"},
	{index: "Goldie Locks", image: "player/hair/goldie-altFront", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Goldie Locks", image: "player/hair/goldie-altFront", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Princess Haircut", filter: "filter: hue-rotate(300deg) brightness(80%) contrast(1.2)"},
	{index: "Princess Haircut", filter: "filter: brightness(80%) contrast(1) hue-rotate(190deg)"},
	{index: "Princess Haircut", filter: "filter: brightness(60%) contrast(1.4) hue-rotate(100deg)"},
	{index: "Princess Haircut", image: "player/hair/princess-altFront", filter: "filter: contrast(1)"},
	{index: "Princess Haircut", image: "player/hair/princess-altFront", filter: "filter: hue-rotate(-23deg) contrast(1.4)"},
	{index: "Princess Haircut", image: "player/hair/princess-altFront", filter: "filter: hue-rotate(-150deg) contrast(1.4)"},
	{index: "Princess Haircut", image: "player/hair/princess-altFront", filter: "filter: hue-rotate(-100deg) contrast(1.4)"},
	{index: "Princess Haircut", image: "player/hair/princess-altFront", filter: "filter: brightness(200%) hue-rotate(30deg) contrast(1.4)"},
	{index: "Princess Haircut", image: "player/hair/princess-altFront", filter: "filter: hue-rotate(100deg) contrast(1.4)"},
	{index: "Princess Haircut", image: "player/hair/princess-altFront", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Princess Haircut", image: "player/hair/princess-altFront", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Hexy Haircut", filter: "filter: contrast(1.4) hue-rotate(100deg)", requirements: "?flag player princess;"},
	{index: "Hexy Haircut", filter: "filter: hue-rotate(70deg) brightness(150%) contrast(1.4)", requirements: "?flag player princess;"},
	{index: "Hexy Haircut", filter: "filter: hue-rotate(300deg) brightness(120%) contrast(1.2)", requirements: "?flag player princess;"},
	{index: "Hexy Haircut", filter: "filter: brightness(80%) contrast(1) hue-rotate(190deg)", requirements: "?flag player princess;"},
	{index: "Hexy Haircut", image: "player/hair/hex-altFront", filter: "filter: contrast(1)"},
	{index: "Hexy Haircut", image: "player/hair/hex-altFront", filter: "filter: hue-rotate(-23deg) contrast(1.4)"},
	{index: "Hexy Haircut", image: "player/hair/hex-altFront", filter: "filter: hue-rotate(-150deg) contrast(1.4)"},
	{index: "Hexy Haircut", image: "player/hair/hex-altFront", filter: "filter: hue-rotate(-100deg) contrast(1.4)"},
	{index: "Hexy Haircut", image: "player/hair/hex-altFront", filter: "filter: brightness(200%) hue-rotate(30deg) contrast(1.4)"},
	{index: "Hexy Haircut", image: "player/hair/hex-altFront", filter: "filter: hue-rotate(100deg) contrast(1.4)"},
	{index: "Hexy Haircut", image: "player/hair/hex-altFront", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Hexy Haircut", image: "player/hair/hex-altFront", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Flames", filter: "filter: hue-rotate(-160deg)"},
	{index: "Flames", filter: "filter: hue-rotate(-85deg)"},
	{index: "Flames", filter: "filter: hue-rotate(75deg)"},
	{index: "Flames", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Flames", filter: "filter: grayscale(100%) brightness(100%)"},

	{index: "Aloha Shirt", filter: "filter: hue-rotate(-120deg)"},
	{index: "Aloha Shirt", filter: "filter: hue-rotate(-85deg)"},
	{index: "Aloha Shirt", filter: "filter: brightness(200%) hue-rotate(-75deg) contrast(1.2)"},
	{index: "Aloha Shirt", filter: "filter: brightness(200%) hue-rotate(30deg)"},
	{index: "Aloha Shirt", filter: "filter: brightness(175%) hue-rotate(25deg)"},
	{index: "Aloha Shirt", filter: "filter: hue-rotate(75deg)"},
	{index: "Aloha Shirt", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Aloha Shirt", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Dress", filter: "filter: hue-rotate(-120deg)"},
	{index: "Dress", filter: "filter: hue-rotate(-85deg)"},
	{index: "Dress", filter: "filter: brightness(200%) hue-rotate(-75deg) contrast(1.2)"},
	{index: "Dress", filter: "filter: brightness(200%) hue-rotate(30deg)"},
	{index: "Dress", filter: "filter: brightness(270%) hue-rotate(50deg) contrast(1.2)"},
	{index: "Dress", filter: "filter: hue-rotate(75deg)"},
	{index: "Dress", filter: "filter: grayscale(100%) brightness(250%) contrast(1.2)"},
	{index: "Dress", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Sleeveless", filter: "filter: hue-rotate(-120deg)"},
	{index: "Sleeveless", filter: "filter: hue-rotate(-85deg)"},
	{index: "Sleeveless", filter: "filter: brightness(200%) hue-rotate(-75deg) contrast(1.2)"},
	{index: "Sleeveless", filter: "filter: brightness(200%) hue-rotate(30deg)"},
	{index: "Sleeveless", filter: "filter: brightness(270%) hue-rotate(50deg) contrast(1.2)"},
	{index: "Sleeveless", filter: "filter: hue-rotate(75deg)"},
	{index: "Sleeveless", filter: "filter: grayscale(100%) brightness(250%) contrast(1.2)"},
	{index: "Sleeveless", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Sweater", filter: "filter: hue-rotate(-120deg)"},
	{index: "Sweater", filter: "filter: hue-rotate(-85deg)"},
	{index: "Sweater", filter: "filter: brightness(200%) hue-rotate(-75deg) contrast(1.2)"},
	{index: "Sweater", filter: "filter: brightness(200%) hue-rotate(30deg)"},
	{index: "Sweater", filter: "filter: brightness(300%) hue-rotate(40deg)"},
	{index: "Sweater", filter: "filter: hue-rotate(75deg)"},
	{index: "Sweater", filter: "filter: grayscale(100%) brightness(250%) contrast(1.2)"},
	{index: "Sweater", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Apron", filter: "filter: hue-rotate(-120deg)"},
	{index: "Apron", filter: "filter: hue-rotate(-85deg)"},
	{index: "Apron", filter: "filter: brightness(200%) hue-rotate(-75deg) contrast(1.2)"},
	{index: "Apron", filter: "filter: brightness(200%) hue-rotate(30deg)"},
	{index: "Apron", filter: "filter: brightness(270%) hue-rotate(50deg) contrast(1.2)"},
	{index: "Apron", filter: "filter: hue-rotate(75deg)"},
	{index: "Apron", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Apron", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Nightgown", filter: "filter: hue-rotate(-120deg)"},
	{index: "Nightgown", filter: "filter: hue-rotate(-85deg)"},
	{index: "Nightgown", filter: "filter: brightness(200%) hue-rotate(-75deg) contrast(1.2)"},
	{index: "Nightgown", filter: "filter: brightness(200%) hue-rotate(30deg)"},
	{index: "Nightgown", image: "player/upperwear/dress-masc", filter: "filter: brightness(270%) hue-rotate(50deg) contrast(1.2)"},
	{index: "Nightgown", filter: "filter: hue-rotate(75deg)"},
	{index: "Nightgown", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Nightgown", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Chest Wraps", filter: "filter: hue-rotate(-120deg)"},
	{index: "Chest Wraps", filter: "filter: hue-rotate(-85deg)"},
	{index: "Chest Wraps", filter: "filter: hue-rotate(75deg)"},
	{index: "Chest Wraps", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Business", filter: "filter: hue-rotate(-120deg)"},
	{index: "Business", filter: "filter: hue-rotate(-85deg)"},
	{index: "Business", filter: "filter: hue-rotate(75deg)"},
	{index: "Business", filter: "filter: grayscale(100%)"},
	{index: "Business", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Bowtie", filter: "filter: hue-rotate(-120deg)"},
	{index: "Bowtie", filter: "filter: hue-rotate(-85deg)"},
	{index: "Bowtie", filter: "filter: hue-rotate(75deg)"},
	{index: "Bowtie", filter: "filter: grayscale(100%)"},
	{index: "Bowtie", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Sling Bikini", filter: "filter: hue-rotate(-120deg)"},
	{index: "Sling Bikini", filter: "filter: hue-rotate(-85deg)"},
	{index: "Sling Bikini", filter: "filter: brightness(200%) hue-rotate(-75deg) contrast(1.2)"},
	{index: "Sling Bikini", filter: "filter: brightness(200%) hue-rotate(30deg)"},
	{index: "Sling Bikini", filter: "filter: brightness(175%) hue-rotate(25deg)"},
	{index: "Sling Bikini", filter: "filter: hue-rotate(75deg)"},
	{index: "Sling Bikini", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Sling Bikini", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Bikini Armor", filter: "filter: hue-rotate(240deg) contrast(1.4)"},
	{index: "Bikini Armor", filter: "filter: hue-rotate(280deg) contrast(1.4)"},
	{index: "Bikini Armor", filter: "filter: hue-rotate(310deg) contrast(1.5) brightness(1.6)"},
	{index: "Bikini Armor", filter: "filter: hue-rotate(30deg) contrast(1.4) brightness(1.4)"},
	{index: "Bikini Armor", filter: "filter: hue-rotate(60deg) contrast(1.1) brightness(2.3)"},
	{index: "Bikini Armor", filter: "filter: hue-rotate(100deg) contrast(1.4) brightness(1.2)"},
	{index: "Bikini Armor", filter: "filter: grayscale(100%) brightness(200%) contrast(1.4)"},
	{index: "Bikini Armor", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Full Poncho", filter: "filter: hue-rotate(-23deg) contrast(1.4)"},
	{index: "Full Poncho", filter: "filter: hue-rotate(-150deg)"},
	{index: "Full Poncho", filter: "filter: hue-rotate(-100deg)"},
	{index: "Full Poncho", filter: "filter: brightness(200%) hue-rotate(30deg)"},
	{index: "Full Poncho", filter: "filter: hue-rotate(-265deg)"},
	{index: "Full Poncho", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Full Poncho", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Half Poncho", filter: "filter: hue-rotate(-23deg) contrast(1.4)"},
	{index: "Half Poncho", filter: "filter: hue-rotate(-150deg)"},
	{index: "Half Poncho", filter: "filter: hue-rotate(-100deg)"},
	{index: "Half Poncho", filter: "filter: brightness(200%) hue-rotate(30deg)"},
	{index: "Half Poncho", filter: "filter: hue-rotate(-265deg)"},
	{index: "Half Poncho", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Half Poncho", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Bunny Leotard", filter: "filter: hue-rotate(-120deg)"},
	{index: "Bunny Leotard", filter: "filter: hue-rotate(-85deg)"},
	{index: "Bunny Leotard", filter: "filter: brightness(200%) hue-rotate(-75deg) contrast(1.2)"},
	{index: "Bunny Leotard", filter: "filter: brightness(200%) hue-rotate(30deg)"},
	{index: "Bunny Leotard", filter: "filter: brightness(175%) hue-rotate(25deg)"},
	{index: "Bunny Leotard", filter: "filter: hue-rotate(75deg)"},
	{index: "Bunny Leotard", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Bunny Leotard", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Rose Uniform", filter: "filter: hue-rotate(60deg) contrast(1.2) brightness(1.5)"},
	{index: "Rose Uniform", filter: "filter: hue-rotate(260deg) contrast(1.2) brightness(1.2)"},
	{index: "Rose Uniform", filter: "filter: hue-rotate(300deg) contrast(1.2) brightness(1.3)"},
	{index: "Rose Uniform", filter: "filter: brightness(150%) hue-rotate(30deg) contrast(1.2)"},
	{index: "Rose Uniform", filter: "filter: hue-rotate(100deg) contrast(1.2) brightness(1.2)"},
	{index: "Rose Uniform", filter: "filter: grayscale(100%) brightness(200%) contrast(1.5)"},
	{index: "Rose Uniform", filter: "filter: grayscale(100%) contrast(1.2)"},

	{index: "White Jacket", filter: "filter: hue-rotate(60deg) contrast(1.2)"},
	{index: "White Jacket", filter: "filter: hue-rotate(260deg) contrast(1.2) brightness(1.2)"},
	{index: "White Jacket", filter: "filter: hue-rotate(300deg) contrast(1) saturate(2)"},
	{index: "White Jacket", filter: "filter: hue-rotate(140deg) contrast(1.2) brightness(1) saturate(2)"},
	{index: "White Jacket", filter: "filter: hue-rotate(100deg) contrast(1.2) brightness(1.2)"},
	{index: "White Jacket", filter: "filter: grayscale(100%) brightness(110%) contrast(1)"},
	{index: "White Jacket", filter: "filter: brightness(50%) contrast(1.5)"},

	{index: "Shinobi Garb", filter: "filter: hue-rotate(60deg) contrast(1.2)"},
	{index: "Shinobi Garb", filter: "filter: hue-rotate(260deg) contrast(1.2)"},
	{index: "Shinobi Garb", filter: "filter: hue-rotate(300deg) contrast(1) saturate(0.6)"},
	{index: "Shinobi Garb", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Shinobi Garb", filter: "filter: hue-rotate(100deg) contrast(1.2)"},
	{index: "Shinobi Garb", filter: "filter: grayscale(100%) contrast(1.3)"},
	{index: "Shinobi Garb", filter: "filter: grayscale(70%) contrast(1.3) hue-rotate(300deg)"},

	{index: "Tube Jacket", filter: "filter: hue-rotate(200deg) contrast(1.2) brightness(1.2)"},
	{index: "Tube Jacket", filter: "filter: hue-rotate(60deg) contrast(1.2)"},
	{index: "Tube Jacket", filter: "filter: hue-rotate(260deg) contrast(1.2) brightness(1.2)"},
	{index: "Tube Jacket", filter: "filter: hue-rotate(300deg) contrast(1.2) brightness(1.3)"},
	{index: "Tube Jacket", filter: "filter: hue-rotate(10deg) contrast(1.3) saturate(2)"},
	{index: "Tube Jacket", filter: "filter: grayscale(100%) brightness(150%) contrast(1.5)"},
	{index: "Tube Jacket", filter: "filter: grayscale(100%) contrast(1.3) brightness(70%)"},

	{index: "Swimsuit", filter: "filter: hue-rotate(-120deg)"},
	{index: "Swimsuit", filter: "filter: hue-rotate(-85deg)"},
	{index: "Swimsuit", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Swimsuit", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Swimsuit", filter: "filter: grayscale(40%) brightness(200%) hue-rotate(40deg)"},
	{index: "Swimsuit", filter: "filter: hue-rotate(75deg)"},
	{index: "Swimsuit", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Swimsuit", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Pencil Skirt", filter: "filter: hue-rotate(-120deg)"},
	{index: "Pencil Skirt", filter: "filter: hue-rotate(-85deg)"},
	{index: "Pencil Skirt", filter: "filter: brightness(200%) hue-rotate(-75deg) contrast(1.2)"},
	{index: "Pencil Skirt", filter: "filter: brightness(200%) hue-rotate(30deg)"},
	{index: "Pencil Skirt", image: "player/lowerwear/Pencil", filter: "filter: brightness(270%) hue-rotate(50deg) contrast(1.2)"},
	{index: "Pencil Skirt", filter: "filter: hue-rotate(75deg)"},
	{index: "Pencil Skirt", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Pencil Skirt", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Pleated Skirt", filter: "filter: hue-rotate(-120deg)"},
	{index: "Pleated Skirt", filter: "filter: hue-rotate(-85deg)"},
	{index: "Pleated Skirt", filter: "filter: brightness(200%) hue-rotate(-75deg) contrast(1.2)"},
	{index: "Pleated Skirt", filter: "filter: brightness(200%) hue-rotate(30deg)"},
	{index: "Pleated Skirt", filter: "filter: brightness(300%) hue-rotate(40deg)"},
	{index: "Pleated Skirt", filter: "filter: hue-rotate(75deg)"},
	{index: "Pleated Skirt", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Pleated Skirt", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Jeans", filter: "filter: hue-rotate(-120deg)"},
	{index: "Jeans", filter: "filter: hue-rotate(-85deg)"},
	{index: "Jeans", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Jeans", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Jeans", filter: "filter: grayscale(40%) brightness(200%) hue-rotate(40deg)"},
	{index: "Jeans", filter: "filter: hue-rotate(75deg)"},
	{index: "Jeans", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Jeans", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Pantyhose", filter: "filter: hue-rotate(-120deg)"},
	{index: "Pantyhose", filter: "filter: hue-rotate(-85deg)"},
	{index: "Pantyhose", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Pantyhose", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Pantyhose", filter: "filter: grayscale(40%) brightness(200%) hue-rotate(40deg)"},
	{index: "Pantyhose", filter: "filter: hue-rotate(75deg)"},
	{index: "Pantyhose", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Pantyhose", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Pure Dress", filter: "filter: hue-rotate(60deg) contrast(1.2)"},
	{index: "Pure Dress", filter: "filter: hue-rotate(260deg) contrast(1.2)"},
	{index: "Pure Dress", filter: "filter: hue-rotate(300deg) contrast(1) saturate(2)"},
	{index: "Pure Dress", filter: "filter: hue-rotate(140deg) contrast(1.2) brightness(1) saturate(2)"},
	{index: "Pure Dress", filter: "filter: hue-rotate(100deg) contrast(1.2) saturate(2)"},
	{index: "Pure Dress", filter: "filter: grayscale(100%) brightness(110%) contrast(1)"},
	{index: "Pure Dress", filter: "filter: brightness(50%) contrast(1.5)"},

	{index: "Shiny Pants", filter: "filter: hue-rotate(-120deg) contrast(0.7)"},
	{index: "Shiny Pants", filter: "filter: hue-rotate(-85deg)contrast(0.7)"},
	{index: "Shiny Pants", filter: "filter: brightness(115%) hue-rotate(-45deg) contrast(0.7)"},
	{index: "Shiny Pants", filter: "filter: brightness(150%) hue-rotate(30deg) contrast(0.7)"},
	{index: "Shiny Pants", filter: "filter: grayscale(40%) brightness(200%) hue-rotate(40deg) contrast(0.7)"},
	{index: "Shiny Pants", filter: "filter: hue-rotate(75deg) contrast(0.7)"},
	{index: "Shiny Pants", filter: "filter: grayscale(100%) brightness(90%) contrast(1.2)"},
	{index: "Shiny Pants", filter: "filter: grayscale(70%) brightness(60%) contrast(0.9) hue-rotate(300deg)"},

	{index: "Bootyshorts", filter: "filter: hue-rotate(-120deg)"},
	{index: "Bootyshorts", filter: "filter: hue-rotate(-85deg)"},
	{index: "Bootyshorts", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Bootyshorts", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Bootyshorts", filter: "filter: grayscale(40%) brightness(200%) hue-rotate(40deg)"},
	{index: "Bootyshorts", filter: "filter: grayscale(70%) brightness(100%) contrast(1.4)"},
	{index: "Bootyshorts", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Bootyshorts", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Boots", filter: "filter: hue-rotate(-120deg)"},
	{index: "Boots", filter: "filter: hue-rotate(-85deg)"},
	{index: "Boots", filter: "filter: brightness(120%) hue-rotate(-35deg)"},
	{index: "Boots", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Boots", filter: "filter: brightness(200%) hue-rotate(50deg)"},
	{index: "Boots", filter: "filter: hue-rotate(75deg)"},
	{index: "Boots", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Boots", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Thighboots", filter: "filter: hue-rotate(-120deg)"},
	{index: "Thighboots", filter: "filter: hue-rotate(-85deg)"},
	{index: "Thighboots", filter: "filter: brightness(120%) hue-rotate(-35deg)"},
	{index: "Thighboots", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Thighboots", filter: "filter: brightness(200%) hue-rotate(50deg)"},
	{index: "Thighboots", filter: "filter: hue-rotate(75deg)"},
	{index: "Thighboots", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Thighboots", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Mary Janes", filter: "filter: hue-rotate(-23deg) contrast(1.4)"},
	{index: "Mary Janes", filter: "filter: hue-rotate(-150deg)"},
	{index: "Mary Janes", filter: "filter: hue-rotate(-100deg)"},
	{index: "Mary Janes", filter: "filter: brightness(200%) hue-rotate(30deg)"},
	{index: "Mary Janes", filter: "filter: hue-rotate(-265deg)"},
	{index: "Mary Janes", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Mary Janes", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Loafers", filter: "filter: hue-rotate(-23deg) contrast(1.4)"},
	{index: "Loafers", filter: "filter: hue-rotate(-150deg)"},
	{index: "Loafers", filter: "filter: hue-rotate(-100deg)"},
	{index: "Loafers", filter: "filter: brightness(200%) hue-rotate(30deg)"},
	{index: "Loafers", filter: "filter: hue-rotate(-265deg)"},
	{index: "Loafers", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Loafers", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Greaves", filter: "filter: hue-rotate(240deg) contrast(1.4)"},
	{index: "Greaves", filter: "filter: hue-rotate(280deg) contrast(1.4)"},
	{index: "Greaves", filter: "filter: hue-rotate(310deg) contrast(1.5) brightness(1.6)"},
	{index: "Greaves", filter: "filter: hue-rotate(30deg) contrast(1.4) brightness(1.4)"},
	{index: "Greaves", filter: "filter: hue-rotate(60deg) contrast(1.1) brightness(2.3)"},
	{index: "Greaves", filter: "filter: hue-rotate(100deg) contrast(1.4) brightness(1.2)"},
	{index: "Greaves", filter: "filter: grayscale(100%) brightness(200%) contrast(1.4)"},
	{index: "Greaves", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "High Heels", filter: "filter: hue-rotate(240deg) contrast(1.4)"},
	{index: "High Heels", filter: "filter: hue-rotate(280deg) contrast(1.4)"},
	{index: "High Heels", filter: "filter: hue-rotate(310deg) contrast(1.5)"},
	{index: "High Heels", filter: "filter: hue-rotate(30deg) contrast(1.4)"},
	{index: "High Heels", filter: "filter: hue-rotate(60deg) contrast(1.1)"},
	{index: "High Heels", filter: "filter: hue-rotate(100deg) contrast(1.4)"},
	{index: "High Heels", filter: "filter: grayscale(100%) contrast(1.4)"},
	{index: "High Heels", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Belted Boots", filter: "filter: hue-rotate(240deg) contrast(1.4)"},
	{index: "Belted Boots", filter: "filter: hue-rotate(280deg) contrast(1.4)"},
	{index: "Belted Boots", filter: "filter: hue-rotate(310deg) contrast(1.5) brightness(1.6)"},
	{index: "Belted Boots", filter: "filter: hue-rotate(30deg) contrast(1.4) brightness(1.4)"},
	{index: "Belted Boots", filter: "filter: hue-rotate(60deg) contrast(1.1) brightness(2.3)"},
	{index: "Belted Boots", filter: "filter: hue-rotate(100deg) contrast(1.4) brightness(1.2)"},
	{index: "Belted Boots", filter: "filter: grayscale(100%) brightness(200%) contrast(1.4)"},
	{index: "Belted Boots", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Cowboy Boots", filter: "filter: hue-rotate(240deg) contrast(1.4)"},
	{index: "Cowboy Boots", filter: "filter: hue-rotate(280deg) contrast(1.4)"},
	{index: "Cowboy Boots", filter: "filter: hue-rotate(310deg) contrast(1.5) brightness(1.6)"},
	{index: "Cowboy Boots", filter: "filter: hue-rotate(30deg) contrast(1.4) brightness(1.4)"},
	{index: "Cowboy Boots", filter: "filter: hue-rotate(60deg) contrast(1.1) brightness(2.3)"},
	{index: "Cowboy Boots", filter: "filter: hue-rotate(100deg) contrast(1.4) brightness(1.2)"},
	{index: "Cowboy Boots", filter: "filter: grayscale(100%) brightness(150%) contrast(1.5)"},
	{index: "Cowboy Boots", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Socks", filter: "filter: hue-rotate(-23deg) contrast(1.4)"},
	{index: "Socks", filter: "filter: hue-rotate(-150deg)"},
	{index: "Socks", filter: "filter: hue-rotate(-100deg)"},
	{index: "Socks", filter: "filter: brightness(200%) hue-rotate(30deg)"},
	{index: "Socks", filter: "filter: hue-rotate(-265deg)"},
	{index: "Socks", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Socks", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Thighhighs", filter: "filter: hue-rotate(-120deg)"},
	{index: "Thighhighs", filter: "filter: hue-rotate(-85deg)"},
	{index: "Thighhighs", filter: "filter: brightness(200%) hue-rotate(-75deg) contrast(1.2)"},
	{index: "Thighhighs", filter: "filter: brightness(200%) hue-rotate(30deg)"},
	{index: "Thighhighs", filter: "filter: brightness(270%) hue-rotate(50deg) contrast(1.2)"},
	{index: "Thighhighs", filter: "filter: hue-rotate(75deg)"},
	{index: "Thighhighs", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Thighhighs", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Pasties", filter: "filter: hue-rotate(-120deg)"},
	{index: "Pasties", filter: "filter: hue-rotate(-85deg)"},
	{index: "Pasties", filter: "filter: brightness(200%) hue-rotate(-75deg) contrast(1.2)"},
	{index: "Pasties", filter: "filter: brightness(200%) hue-rotate(30deg)"},
	{index: "Pasties", filter: "filter: brightness(270%) hue-rotate(50deg) contrast(1.2)"},
	{index: "Pasties", filter: "filter: hue-rotate(75deg)"},
	{index: "Pasties", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Pasties", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Thong", filter: "filter: hue-rotate(-120deg)"},
	{index: "Thong", filter: "filter: hue-rotate(-85deg)"},
	{index: "Thong", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Thong", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Thong", filter: "filter: grayscale(40%) brightness(200%) hue-rotate(40deg)"},
	{index: "Thong", filter: "filter: hue-rotate(75deg)"},
	{index: "Thong", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Thong", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Shades", filter: "filter: hue-rotate(-23deg) contrast(1.4)"},
	{index: "Shades", filter: "filter: hue-rotate(-150deg)"},
	{index: "Shades", filter: "filter: hue-rotate(-100deg)"},
	{index: "Shades", filter: "filter: brightness(200%) hue-rotate(30deg)"},
	{index: "Shades", filter: "filter: hue-rotate(-265deg)"},
	{index: "Shades", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Shades", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Choker", filter: "filter: hue-rotate(-23deg) contrast(1.4)"},
	{index: "Choker", filter: "filter: hue-rotate(-150deg)"},
	{index: "Choker", filter: "filter: hue-rotate(-100deg)"},
	{index: "Choker", filter: "filter: brightness(200%) hue-rotate(30deg)"},
	{index: "Choker", filter: "filter: hue-rotate(-265deg)"},
	{index: "Choker", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Choker", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Cloak", filter: "filter: hue-rotate(60deg) contrast(1.4)"},
	{index: "Cloak", filter: "filter: hue-rotate(-100deg)"},
	{index: "Cloak", filter: "filter: hue-rotate(300deg)"},
	{index: "Cloak", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Cloak", filter: "filter: hue-rotate(-265deg)"},
	{index: "Cloak", filter: "filter: grayscale(100%) brightness(250%) contrast(1.5)"},
	{index: "Cloak", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Hair Flower", filter: "filter: hue-rotate(-23deg) contrast(1.4)"},
	{index: "Hair Flower", filter: "filter: hue-rotate(-150deg)"},
	{index: "Hair Flower", filter: "filter: hue-rotate(-100deg)"},
	{index: "Hair Flower", filter: "filter: brightness(200%) hue-rotate(30deg)"},
	{index: "Hair Flower", filter: "filter: hue-rotate(-265deg)"},
	{index: "Hair Flower", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Hair Flower", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Pelvic Curtain", filter: "filter: hue-rotate(240deg) contrast(1.4)"},
	{index: "Pelvic Curtain", filter: "filter: hue-rotate(280deg) contrast(1.4)"},
	{index: "Pelvic Curtain", filter: "filter: hue-rotate(310deg) contrast(1.5) brightness(1.6)"},
	{index: "Pelvic Curtain", filter: "filter: hue-rotate(30deg) contrast(1.4) brightness(1.4)"},
	{index: "Pelvic Curtain", filter: "filter: hue-rotate(60deg) contrast(1.1) brightness(2.3)"},
	{index: "Pelvic Curtain", filter: "filter: hue-rotate(100deg) contrast(1.4) brightness(1.2)"},
	{index: "Pelvic Curtain", filter: "filter: grayscale(100%) brightness(200%) contrast(1.4)"},
	{index: "Pelvic Curtain", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Horny Hat", filter: "filter: hue-rotate(-120deg)"},
	{index: "Horny Hat", filter: "filter: hue-rotate(-85deg)"},
	{index: "Horny Hat", filter: "filter: brightness(200%) hue-rotate(-75deg) contrast(1.2)"},
	{index: "Horny Hat", filter: "filter: brightness(200%) hue-rotate(30deg)"},
	{index: "Horny Hat", filter: "filter: brightness(270%) hue-rotate(50deg) contrast(1.2)"},
	{index: "Horny Hat", filter: "filter: hue-rotate(75deg)"},
	{index: "Horny Hat", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Horny Hat", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Gauntlets", filter: "filter: hue-rotate(240deg) contrast(1.4)"},
	{index: "Gauntlets", filter: "filter: hue-rotate(280deg) contrast(1.4)"},
	{index: "Gauntlets", filter: "filter: hue-rotate(310deg) contrast(1.5) brightness(1.6)"},
	{index: "Gauntlets", filter: "filter: hue-rotate(30deg) contrast(1.4) brightness(1.4)"},
	{index: "Gauntlets", filter: "filter: hue-rotate(60deg) contrast(1.1) brightness(2.3)"},
	{index: "Gauntlets", filter: "filter: hue-rotate(100deg) contrast(1.4) brightness(1.2)"},
	{index: "Gauntlets", filter: "filter: grayscale(100%) brightness(200%) contrast(1.4)"},
	{index: "Gauntlets", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Apothecary Locks", filter: "filter: hue-rotate(-23deg) contrast(1.4)"},
	{index: "Apothecary Locks", filter: "filter: hue-rotate(-150deg) contrast(1.4)"},
	{index: "Apothecary Locks", filter: "filter: hue-rotate(-100deg) contrast(1.4)"},
	{index: "Apothecary Locks", filter: "filter: brightness(200%) hue-rotate(30deg) contrast(1.4)"},
	{index: "Apothecary Locks", filter: "filter: hue-rotate(100deg) contrast(1.4)"},
	{index: "Apothecary Locks", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Apothecary Locks", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Apothecary Garb", filter: "filter: hue-rotate(75deg) contrast(1) saturate(40%) brightness(150%)"},
	{index: "Apothecary Garb", filter: "filter: hue-rotate(-120deg)"},
	{index: "Apothecary Garb", filter: "filter: hue-rotate(-85deg)"},
	{index: "Apothecary Garb", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Apothecary Garb", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Apothecary Garb", filter: "filter: hue-rotate(75deg)"},
	{index: "Apothecary Garb", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Apothecary Garb", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Apothecary Longskirt", filter: "filter: hue-rotate(-120deg)"},
	{index: "Apothecary Longskirt", filter: "filter: hue-rotate(-85deg)"},
	{index: "Apothecary Longskirt", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Apothecary Longskirt", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Apothecary Longskirt", filter: "filter: hue-rotate(75deg)"},
	{index: "Apothecary Longskirt", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Apothecary Longskirt", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Apothecary Treads", filter: "filter: hue-rotate(-120deg)"},
	{index: "Apothecary Treads", filter: "filter: hue-rotate(-85deg)"},
	{index: "Apothecary Treads", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Apothecary Treads", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Apothecary Treads", filter: "filter: hue-rotate(75deg)"},
	{index: "Apothecary Treads", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Apothecary Treads", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Cat Ears", filter: "filter: hue-rotate(-23deg) contrast(1.4)"},
	{index: "Cat Ears", filter: "filter: hue-rotate(-150deg) contrast(1.4)"},
	{index: "Cat Ears", filter: "filter: hue-rotate(-100deg) contrast(1.4)"},
	{index: "Cat Ears", filter: "filter: brightness(150%) hue-rotate(30deg) contrast(1.4)"},
	{index: "Cat Ears", filter: "filter: hue-rotate(100deg) contrast(1.4)"},
	{index: "Cat Ears", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Cat Ears", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Lacey Top", filter: "filter: hue-rotate(-120deg)"},
	{index: "Lacey Top", filter: "filter: hue-rotate(-85deg)"},
	{index: "Lacey Top", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Lacey Top", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Lacey Top", filter: "filter: hue-rotate(75deg)"},
	{index: "Lacey Top", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Lacey Top", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Neck Bell", filter: "filter: hue-rotate(-120deg)"},
	{index: "Neck Bell", filter: "filter: hue-rotate(-85deg)"},
	{index: "Neck Bell", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Neck Bell", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Neck Bell", filter: "filter: hue-rotate(75deg)"},
	{index: "Neck Bell", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Neck Bell", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Swept Ponytail", filter: "filter: hue-rotate(-23deg) contrast(1.4)"},
	{index: "Swept Ponytail", filter: "filter: hue-rotate(-150deg) contrast(1.4)"},
	{index: "Swept Ponytail", filter: "filter: hue-rotate(-100deg) contrast(1.4)"},
	{index: "Swept Ponytail", filter: "filter: brightness(150%) hue-rotate(30deg) contrast(1.4)"},
	{index: "Swept Ponytail", filter: "filter: hue-rotate(100deg) contrast(1.4)"},
	{index: "Swept Ponytail", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Swept Ponytail", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Escort's Top", filter: "filter: hue-rotate(-120deg)"},
	{index: "Escort's Top", filter: "filter: hue-rotate(-85deg)"},
	{index: "Escort's Top", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Escort's Top", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Escort's Top", filter: "filter: hue-rotate(75deg)"},
	{index: "Escort's Top", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Escort's Top", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Escort's Heels", filter: "filter: hue-rotate(-120deg)"},
	{index: "Escort's Heels", filter: "filter: hue-rotate(-85deg)"},
	{index: "Escort's Heels", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Escort's Heels", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Escort's Heels", filter: "filter: hue-rotate(75deg)"},
	{index: "Escort's Heels", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Escort's Heels", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Escort's Bling", filter: "filter: hue-rotate(-120deg)"},
	{index: "Escort's Bling", filter: "filter: hue-rotate(-85deg)"},
	{index: "Escort's Bling", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Escort's Bling", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Escort's Bling", filter: "filter: hue-rotate(75deg)"},
	{index: "Escort's Bling", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Escort's Bling", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Forehead Gem", filter: "filter: hue-rotate(-23deg) contrast(1.4)"},
	{index: "Forehead Gem", filter: "filter: hue-rotate(-150deg) contrast(1.4)"},
	{index: "Forehead Gem", filter: "filter: hue-rotate(-100deg) contrast(1.4)"},
	{index: "Forehead Gem", filter: "filter: brightness(200%) hue-rotate(30deg) contrast(1.4)"},
	{index: "Forehead Gem", filter: "filter: hue-rotate(100deg) contrast(1.4)"},
	{index: "Forehead Gem", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Forehead Gem", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Latex Leotard", filter: "filter: hue-rotate(-120deg)"},
	{index: "Latex Leotard", filter: "filter: hue-rotate(-85deg)"},
	{index: "Latex Leotard", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Latex Leotard", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Latex Leotard", filter: "filter: hue-rotate(75deg)"},
	{index: "Latex Leotard", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Latex Leotard", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Bead Belt", filter: "filter: hue-rotate(-120deg)"},
	{index: "Bead Belt", filter: "filter: hue-rotate(-85deg)"},
	{index: "Bead Belt", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Bead Belt", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Bead Belt", filter: "filter: hue-rotate(75deg)"},
	{index: "Bead Belt", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Bead Belt", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Crow's Cloak", filter: "filter: hue-rotate(-120deg)"},
	{index: "Crow's Cloak", filter: "filter: hue-rotate(-85deg)"},
	{index: "Crow's Cloak", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Crow's Cloak", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Crow's Cloak", filter: "filter: hue-rotate(75deg)"},
	{index: "Crow's Cloak", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Crow's Cloak", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Braided Ponytail", filter: "filter: hue-rotate(-23deg) contrast(1.4)"},
	{index: "Braided Ponytail", filter: "filter: hue-rotate(-150deg) contrast(1.4)"},
	{index: "Braided Ponytail", filter: "filter: hue-rotate(-100deg) contrast(1.4)"},
	{index: "Braided Ponytail", filter: "filter: brightness(200%) hue-rotate(30deg) contrast(1.4)"},
	{index: "Braided Ponytail", filter: "filter: hue-rotate(100deg) contrast(1.4)"},
	{index: "Braided Ponytail", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Braided Ponytail", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Sailor Top", filter: "filter: hue-rotate(-120deg)"},
	{index: "Sailor Top", filter: "filter: hue-rotate(-85deg)"},
	{index: "Sailor Top", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Sailor Top", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Sailor Top", filter: "filter: hue-rotate(75deg)"},
	{index: "Sailor Top", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Sailor Top", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Sailor Skirt", filter: "filter: hue-rotate(-120deg)"},
	{index: "Sailor Skirt", filter: "filter: hue-rotate(-85deg)"},
	{index: "Sailor Skirt", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Sailor Skirt", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Sailor Skirt", filter: "filter: hue-rotate(75deg)"},
	{index: "Sailor Skirt", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Sailor Skirt", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Froggy Hair", filter: "filter: hue-rotate(-23deg) contrast(1.4)"},
	{index: "Froggy Hair", filter: "filter: hue-rotate(-150deg) contrast(1.4)"},
	{index: "Froggy Hair", filter: "filter: hue-rotate(-100deg) contrast(1.4)"},
	{index: "Froggy Hair", filter: "filter: brightness(200%) hue-rotate(30deg) contrast(1.4)"},
	{index: "Froggy Hair", filter: "filter: hue-rotate(100deg) contrast(1.4)"},
	{index: "Froggy Hair", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Froggy Hair", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Frogsuit Top", filter: "filter: hue-rotate(-120deg)"},
	{index: "Frogsuit Top", filter: "filter: hue-rotate(-85deg)"},
	{index: "Frogsuit Top", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Frogsuit Top", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Frogsuit Top", filter: "filter: hue-rotate(75deg)"},
	{index: "Frogsuit Top", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Frogsuit Top", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Frogsuit Bottom", filter: "filter: hue-rotate(-120deg)"},
	{index: "Frogsuit Bottom", filter: "filter: hue-rotate(-85deg)"},
	{index: "Frogsuit Bottom", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Frogsuit Bottom", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Frogsuit Bottom", filter: "filter: hue-rotate(75deg)"},
	{index: "Frogsuit Bottom", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Frogsuit Bottom", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Frogsuit Belt", filter: "filter: hue-rotate(-120deg)"},
	{index: "Frogsuit Belt", filter: "filter: hue-rotate(-85deg)"},
	{index: "Frogsuit Belt", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Frogsuit Belt", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Frogsuit Belt", filter: "filter: hue-rotate(75deg)"},
	{index: "Frogsuit Belt", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Frogsuit Belt", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Frogsuit Stompers", filter: "filter: hue-rotate(-120deg)"},
	{index: "Frogsuit Stompers", filter: "filter: hue-rotate(-85deg)"},
	{index: "Frogsuit Stompers", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Frogsuit Stompers", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Frogsuit Stompers", filter: "filter: hue-rotate(75deg)"},
	{index: "Frogsuit Stompers", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Frogsuit Stompers", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Goth-Lolly Hairdo", filter: "filter: hue-rotate(-23deg) contrast(1.4)"},
	{index: "Goth-Lolly Hairdo", filter: "filter: hue-rotate(-150deg) contrast(1.4)"},
	{index: "Goth-Lolly Hairdo", filter: "filter: hue-rotate(-100deg) contrast(1.4)"},
	{index: "Goth-Lolly Hairdo", filter: "filter: hue-rotate(100deg) contrast(1.4)"},
	{index: "Goth-Lolly Hairdo", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},
	{index: "Goth-Lolly Hairdo", image: "player/hair/golly-altFront", filter: "filter: contrast(1)"},
	{index: "Goth-Lolly Hairdo", image: "player/hair/golly-altFront", filter: "filter: hue-rotate(-23deg) contrast(1.4)"},
	{index: "Goth-Lolly Hairdo", image: "player/hair/golly-altFront", filter: "filter: hue-rotate(-150deg) contrast(1.4)"},
	{index: "Goth-Lolly Hairdo", image: "player/hair/golly-altFront", filter: "filter: hue-rotate(-100deg) contrast(1.4)"},
	{index: "Goth-Lolly Hairdo", image: "player/hair/golly-altFront", filter: "filter: brightness(150%) hue-rotate(30deg) contrast(1.4)"},
	{index: "Goth-Lolly Hairdo", image: "player/hair/golly-altFront", filter: "filter: hue-rotate(100deg) contrast(1.4)"},
	{index: "Goth-Lolly Hairdo", image: "player/hair/golly-altFront", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Goth-Lolly Hairdo", image: "player/hair/golly-altFront", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Goth-Lolly Dress", filter: "filter: hue-rotate(-120deg)"},
	{index: "Goth-Lolly Dress", filter: "filter: hue-rotate(-85deg)"},
	{index: "Goth-Lolly Dress", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Goth-Lolly Dress", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Goth-Lolly Dress", filter: "filter: hue-rotate(75deg)"},
	{index: "Goth-Lolly Dress", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Goth-Lolly Dress", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Striped Stockings", filter: "filter: hue-rotate(-120deg)"},
	{index: "Striped Stockings", filter: "filter: hue-rotate(-85deg)"},
	{index: "Striped Stockings", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Striped Stockings", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Striped Stockings", filter: "filter: hue-rotate(75deg)"},
	{index: "Striped Stockings", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Striped Stockings", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Magical Ribbons", filter: "filter: hue-rotate(-23deg) contrast(1.4)"},
	{index: "Magical Ribbons", filter: "filter: hue-rotate(-150deg) contrast(1.4)"},
	{index: "Magical Ribbons", filter: "filter: hue-rotate(-100deg) contrast(1.4)"},
	{index: "Magical Ribbons", filter: "filter: brightness(200%) hue-rotate(30deg) contrast(1.4)"},
	{index: "Magical Ribbons", filter: "filter: hue-rotate(100deg) contrast(1.4)"},
	{index: "Magical Ribbons", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Magical Ribbons", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Magical Dress", filter: "filter: hue-rotate(-120deg)"},
	{index: "Magical Dress", filter: "filter: hue-rotate(-85deg)"},
	{index: "Magical Dress", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Magical Dress", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Magical Dress", filter: "filter: hue-rotate(75deg)"},
	{index: "Magical Dress", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Magical Dress", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Magical Boots", filter: "filter: hue-rotate(-120deg)"},
	{index: "Magical Boots", filter: "filter: hue-rotate(-85deg)"},
	{index: "Magical Boots", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Magical Boots", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Magical Boots", filter: "filter: hue-rotate(75deg)"},
	{index: "Magical Boots", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Magical Boots", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Wicked Dress", filter: "filter: hue-rotate(-120deg)"},
	{index: "Wicked Dress", filter: "filter: hue-rotate(-85deg)"},
	{index: "Wicked Dress", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Wicked Dress", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Wicked Dress", filter: "filter: hue-rotate(75deg)"},
	{index: "Wicked Dress", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Wicked Dress", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Wicked Bands", filter: "filter: hue-rotate(-120deg)"},
	{index: "Wicked Bands", filter: "filter: hue-rotate(-85deg)"},
	{index: "Wicked Bands", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Wicked Bands", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Wicked Bands", filter: "filter: hue-rotate(75deg)"},
	{index: "Wicked Bands", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Wicked Bands", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Wicked Treads", filter: "filter: hue-rotate(-120deg)"},
	{index: "Wicked Treads", filter: "filter: hue-rotate(-85deg)"},
	{index: "Wicked Treads", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Wicked Treads", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Wicked Treads", filter: "filter: hue-rotate(75deg)"},
	{index: "Wicked Treads", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Wicked Treads", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Prince's Ahoge", filter: "filter: hue-rotate(-23deg) contrast(1.4)"},
	{index: "Prince's Ahoge", filter: "filter: hue-rotate(-150deg) contrast(1.4)"},
	{index: "Prince's Ahoge", filter: "filter: hue-rotate(-100deg) contrast(1.4)"},
	{index: "Prince's Ahoge", filter: "filter: brightness(200%) hue-rotate(30deg) contrast(1.4)"},
	{index: "Prince's Ahoge", filter: "filter: hue-rotate(100deg) contrast(1.4)"},
	{index: "Prince's Ahoge", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Prince's Ahoge", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Prince's Shirt", filter: "filter: hue-rotate(-120deg)"},
	{index: "Prince's Shirt", filter: "filter: hue-rotate(-85deg)"},
	{index: "Prince's Shirt", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Prince's Shirt", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Prince's Shirt", filter: "filter: hue-rotate(75deg)"},
	{index: "Prince's Shirt", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Prince's Shirt", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Prince's Suspenders", filter: "filter: hue-rotate(-120deg)"},
	{index: "Prince's Suspenders", filter: "filter: hue-rotate(-85deg)"},
	{index: "Prince's Suspenders", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Prince's Suspenders", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Prince's Suspenders", filter: "filter: hue-rotate(75deg)"},
	{index: "Prince's Suspenders", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Prince's Suspenders", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Prince's Shoes", filter: "filter: hue-rotate(-120deg)"},
	{index: "Prince's Shoes", filter: "filter: hue-rotate(-85deg)"},
	{index: "Prince's Shoes", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Prince's Shoes", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Prince's Shoes", filter: "filter: hue-rotate(75deg)"},
	{index: "Prince's Shoes", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Prince's Shoes", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Earmuffs", filter: "filter: hue-rotate(-23deg) contrast(1.4)"},
	{index: "Earmuffs", filter: "filter: hue-rotate(-150deg) contrast(1.4)"},
	{index: "Earmuffs", filter: "filter: hue-rotate(-100deg) contrast(1.4)"},
	{index: "Earmuffs", filter: "filter: brightness(200%) hue-rotate(30deg) contrast(1.4)"},
	{index: "Earmuffs", filter: "filter: hue-rotate(100deg) contrast(1.4)"},
	{index: "Earmuffs", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Earmuffs", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Rabbit Leotard", filter: "filter: hue-rotate(-120deg)"},
	{index: "Rabbit Leotard", filter: "filter: hue-rotate(-85deg)"},
	{index: "Rabbit Leotard", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Rabbit Leotard", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Rabbit Leotard", filter: "filter: hue-rotate(75deg)"},
	{index: "Rabbit Leotard", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Rabbit Leotard", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Rabbit Stompers", filter: "filter: hue-rotate(-120deg)"},
	{index: "Rabbit Stompers", filter: "filter: hue-rotate(-85deg)"},
	{index: "Rabbit Stompers", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Rabbit Stompers", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Rabbit Stompers", filter: "filter: hue-rotate(75deg)"},
	{index: "Rabbit Stompers", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Rabbit Stompers", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Rabbit Gloves", filter: "filter: hue-rotate(-120deg)"},
	{index: "Rabbit Gloves", filter: "filter: hue-rotate(-85deg)"},
	{index: "Rabbit Gloves", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Rabbit Gloves", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Rabbit Gloves", filter: "filter: hue-rotate(75deg)"},
	{index: "Rabbit Gloves", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Rabbit Gloves", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Sorceress Locks", filter: "filter: hue-rotate(-23deg) contrast(1.4)"},
	{index: "Sorceress Locks", filter: "filter: hue-rotate(-150deg) contrast(1.4)"},
	{index: "Sorceress Locks", filter: "filter: hue-rotate(-100deg) contrast(1.4)"},
	{index: "Sorceress Locks", filter: "filter: brightness(150%) hue-rotate(30deg) contrast(1.4)"},
	{index: "Sorceress Locks", filter: "filter: hue-rotate(100deg) contrast(1.4)"},
	{index: "Sorceress Locks", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Sorceress Locks", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Sorceress Bodice", filter: "filter: hue-rotate(-120deg)"},
	{index: "Sorceress Bodice", filter: "filter: hue-rotate(-85deg)"},
	{index: "Sorceress Bodice", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Sorceress Bodice", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Sorceress Bodice", filter: "filter: hue-rotate(75deg)"},
	{index: "Sorceress Bodice", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Sorceress Bodice", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Sorceress Sarong", filter: "filter: hue-rotate(-120deg)"},
	{index: "Sorceress Sarong", filter: "filter: hue-rotate(-85deg)"},
	{index: "Sorceress Sarong", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Sorceress Sarong", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Sorceress Sarong", filter: "filter: hue-rotate(75deg)"},
	{index: "Sorceress Sarong", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Sorceress Sarong", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Sorceress Shoes", filter: "filter: hue-rotate(-120deg)"},
	{index: "Sorceress Shoes", filter: "filter: hue-rotate(-85deg)"},
	{index: "Sorceress Shoes", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Sorceress Shoes", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Sorceress Shoes", filter: "filter: hue-rotate(75deg)"},
	{index: "Sorceress Shoes", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Sorceress Shoes", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Sorceress Thong", filter: "filter: hue-rotate(-120deg)"},
	{index: "Sorceress Thong", filter: "filter: hue-rotate(-85deg)"},
	{index: "Sorceress Thong", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Sorceress Thong", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Sorceress Thong", filter: "filter: hue-rotate(75deg)"},
	{index: "Sorceress Thong", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Sorceress Thong", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Sorceress Sleeves", filter: "filter: hue-rotate(-120deg)"},
	{index: "Sorceress Sleeves", filter: "filter: hue-rotate(-85deg)"},
	{index: "Sorceress Sleeves", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Sorceress Sleeves", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Sorceress Sleeves", filter: "filter: hue-rotate(75deg)"},
	{index: "Sorceress Sleeves", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Sorceress Sleeves", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Sorceress Hat", filter: "filter: hue-rotate(-120deg)"},
	{index: "Sorceress Hat", filter: "filter: hue-rotate(-85deg)"},
	{index: "Sorceress Hat", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Sorceress Hat", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Sorceress Hat", filter: "filter: hue-rotate(75deg)"},
	{index: "Sorceress Hat", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Sorceress Hat", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Spooky Drills", filter: "filter: hue-rotate(50deg) contrast(1) brightness(100%)"},
	{index: "Spooky Drills", filter: "filter: hue-rotate(-150deg) contrast(1.4)"},
	{index: "Spooky Drills", filter: "filter: hue-rotate(-100deg) contrast(1.4)"},
	{index: "Spooky Drills", filter: "filter: brightness(100%) hue-rotate(70deg) contrast(1.2)"},
	{index: "Spooky Drills", filter: "filter: hue-rotate(300deg) contrast(1.2)"},
	{index: "Spooky Drills", filter: "filter: grayscale(100%) brightness(120%)"},
	{index: "Spooky Drills", filter: "filter: grayscale(100%) brightness(60%) contrast(1.4)"},
	{index: "Spooky Drills", image: "player/hair/spooky-alt", filter: "filter: hue-rotate(-120deg)"},
	{index: "Spooky Drills", image: "player/hair/spooky-alt", filter: "filter: hue-rotate(-85deg)"},
	{index: "Spooky Drills", image: "player/hair/spooky-alt", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Spooky Drills", image: "player/hair/spooky-alt", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Spooky Drills", image: "player/hair/spooky-alt", filter: "filter: grayscale(40%) brightness(200%) hue-rotate(40deg)"},
	{index: "Spooky Drills", image: "player/hair/spooky-alt", filter: "filter: hue-rotate(75deg)"},
	{index: "Spooky Drills", image: "player/hair/spooky-alt", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Spooky Top", filter: "filter: hue-rotate(-120deg)"},
	{index: "Spooky Top", filter: "filter: hue-rotate(-85deg)"},
	{index: "Spooky Top", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Spooky Top", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Spooky Top", filter: "filter: hue-rotate(75deg)"},
	{index: "Spooky Top", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Spooky Top", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Spooky Skirt", filter: "filter: hue-rotate(-120deg)"},
	{index: "Spooky Skirt", filter: "filter: hue-rotate(-85deg)"},
	{index: "Spooky Skirt", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Spooky Skirt", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Spooky Skirt", filter: "filter: hue-rotate(75deg)"},
	{index: "Spooky Skirt", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Spooky Skirt", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Spooky Thighhighs", filter: "filter: hue-rotate(-120deg)"},
	{index: "Spooky Thighhighs", filter: "filter: hue-rotate(-85deg)"},
	{index: "Spooky Thighhighs", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Spooky Thighhighs", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Spooky Thighhighs", filter: "filter: hue-rotate(75deg)"},
	{index: "Spooky Thighhighs", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Spooky Thighhighs", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Star-Princess Locks", filter: "filter: hue-rotate(-23deg) contrast(1.4)"},
	{index: "Star-Princess Locks", filter: "filter: hue-rotate(-150deg) contrast(1.4)"},
	{index: "Star-Princess Locks", filter: "filter: hue-rotate(-100deg) contrast(1.4)"},
	{index: "Star-Princess Locks", filter: "filter: brightness(170%) hue-rotate(30deg) contrast(1.4)"},
	{index: "Star-Princess Locks", filter: "filter: hue-rotate(100deg) contrast(1.4)"},
	{index: "Star-Princess Locks", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Star-Princess Locks", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Star-Princess Top", filter: "filter: hue-rotate(-120deg)"},
	{index: "Star-Princess Top", filter: "filter: hue-rotate(-85deg)"},
	{index: "Star-Princess Top", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Star-Princess Top", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Star-Princess Top", filter: "filter: hue-rotate(75deg)"},
	{index: "Star-Princess Top", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Star-Princess Top", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Star-Princess Skirt", filter: "filter: hue-rotate(-120deg)"},
	{index: "Star-Princess Skirt", filter: "filter: hue-rotate(-85deg)"},
	{index: "Star-Princess Skirt", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Star-Princess Skirt", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Star-Princess Skirt", filter: "filter: hue-rotate(75deg)"},
	{index: "Star-Princess Skirt", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Star-Princess Skirt", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Star-Princess Armguards", filter: "filter: hue-rotate(-120deg)"},
	{index: "Star-Princess Armguards", filter: "filter: hue-rotate(-85deg)"},
	{index: "Star-Princess Armguards", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Star-Princess Armguards", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Star-Princess Armguards", filter: "filter: hue-rotate(75deg)"},
	{index: "Star-Princess Armguards", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Star-Princess Armguards", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Witchy Forelocks", filter: "filter: hue-rotate(-23deg) contrast(1.4)"},
	{index: "Witchy Forelocks", filter: "filter: hue-rotate(-150deg) contrast(1.4)"},
	{index: "Witchy Forelocks", filter: "filter: hue-rotate(-100deg) contrast(1.4)"},
	{index: "Witchy Forelocks", filter: "filter: brightness(200%) hue-rotate(30deg) contrast(1.4)"},
	{index: "Witchy Forelocks", filter: "filter: hue-rotate(100deg) contrast(1.4)"},
	{index: "Witchy Forelocks", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)"},
	{index: "Witchy Forelocks", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Witchy Dress", filter: "filter: hue-rotate(-120deg)"},
	{index: "Witchy Dress", filter: "filter: hue-rotate(-85deg)"},
	{index: "Witchy Dress", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Witchy Dress", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Witchy Dress", filter: "filter: hue-rotate(75deg)"},
	{index: "Witchy Dress", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Witchy Dress", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Leg Wraps", filter: "filter: hue-rotate(-120deg)"},
	{index: "Leg Wraps", filter: "filter: hue-rotate(-85deg)"},
	{index: "Leg Wraps", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Leg Wraps", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Leg Wraps", filter: "filter: hue-rotate(75deg)"},
	{index: "Leg Wraps", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Leg Wraps", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Witch's Cape", filter: "filter: hue-rotate(-120deg)"},
	{index: "Witch's Cape", filter: "filter: hue-rotate(-85deg)"},
	{index: "Witch's Cape", filter: "filter: brightness(115%) hue-rotate(-45deg)"},
	{index: "Witch's Cape", filter: "filter: brightness(150%) hue-rotate(30deg)"},
	{index: "Witch's Cape", filter: "filter: hue-rotate(75deg)"},
	{index: "Witch's Cape", filter: "filter: saturate(00%) brightness(160%) contrast(1.5)"},
	{index: "Witch's Cape", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},

	{index: "Spacer's Bodysuit Top", filter: "filter: hue-rotate(-120deg)"},
	{index: "Spacer's Bodysuit Top", filter: "filter: hue-rotate(-85deg)"},
	{index: "Spacer's Bodysuit Top", filter: "filter: brightness(200%) hue-rotate(-75deg) contrast(1.2)"},
	{index: "Spacer's Bodysuit Top", filter: "filter: brightness(200%) hue-rotate(30deg)"},
	{index: "Spacer's Bodysuit Top", filter: "filter: hue-rotate(75deg)"},
	{index: "Spacer's Bodysuit Top", filter: "filter: grayscale(100%) brightness(250%) contrast(1.2)"},
	{index: "Spacer's Bodysuit Top", filter: "filter: grayscale(100%) brightness(60%) contrast(1.2)"},

	{index: "Spacer's Bodysuit Bottom", filter: "filter: hue-rotate(-120deg)"},
	{index: "Spacer's Bodysuit Bottom", filter: "filter: hue-rotate(-85deg)"},
	{index: "Spacer's Bodysuit Bottom", filter: "filter: brightness(200%) hue-rotate(-75deg) contrast(1.2)"},
	{index: "Spacer's Bodysuit Bottom", filter: "filter: brightness(200%) hue-rotate(30deg)"},
	{index: "Spacer's Bodysuit Bottom", filter: "filter: hue-rotate(75deg)"},
	{index: "Spacer's Bodysuit Bottom", filter: "filter: grayscale(100%) brightness(250%) contrast(1.2)"},
	{index: "Spacer's Bodysuit Bottom", filter: "filter: grayscale(100%) brightness(60%) contrast(1.2)"},

	{index: "Sporty Hoodie", image: "player/upperwear/brisketOpen-mascFront"},
	{index: "Sporty Hoodie", image: "player/upperwear/brisketClosed-mascAltFront"},
	{index: "Sporty Hoodie", image: "player/upperwear/brisketClosed-mascFront"},

	{index: "Sporty Shorts", image: "player/lowerwear/brisket-penisAlt"},

	{index: "Wallflower Ponytail", image: "player/hair/squig"},

	{index: "Wallflower Dress", image: "player/lowerwear/squig-masc-penis"},

	{index: "Jiangshi Hat", image: "player/hat/ofudaAlt"},

	{index: "NEET Locks", image: "player/hair/neetFront-alt"},

	{index: "NEET Jacket", image: "player/cloak/neet-masc-alt"},

	{index: "NEET Shirt", image: "player/upperwear/neet-masc"},
];

//Premade and community-submitted outfits shown in the wardrobe's Outfits tab.
//Each piece names a globalClothesArray item by its index, with an optional filter override to recolor it however you like.
//A piece can also carry an image override for alt-art variants, IE {index: "Shirt", filter: "", image: "player/upperwear/shirt-alt-masc"},
//and body suffixes (-masc, -light, -penis, etc) in overrides still adapt to the current body. image: "" keeps the base art.
//An outfit only appears once every piece it uses is unlocked, judged by the index's base item, whatever the art override.
//source is "premade" or "community", and credit for community submissions can go right in the name, IE "Neon Nights (by Noodle)"
const playerOutfitsArray = [
	{name: "It's Yu!",
		source: "premade",
		clothes: [
			{index: "Basic Haircut", filter: ""},
			{index: "Shirt", filter: ""},
			{index: "Shorts", filter: ""},
			{index: "Sneakers", filter: ""},
		],
	},
	{name: "Bikini Armor",
		source: "premade",
		clothes: [
			{index: "Basic Haircut", filter: ""},
			{index: "Bikini Armor", filter: ""},
			{index: "Pelvic Curtain", filter: ""},
			{index: "Greaves", filter: ""},
		],
	},
	{name: "Bunday Finest",
		source: "premade",
		clothes: [
			{index: "Basic Haircut", filter: ""},
			{index: "Bunny Ears", filter: ""},
			{index: "Pantyhose", filter: ""},
			{index: "Escort's Heels", filter: ""},
			{index: "Bunny Leotard", filter: ""},
		],
	},
	{name: "Beach-Ready",
		source: "premade",
		clothes: [
			{index: "Basic Haircut", filter: ""},
			{index: "Sling Bikini", filter: ""},
			{index: "Sorceress Thong", filter: ""},
			{index: "Lightning McCrocs", filter: ""},
		],
	},
	{name: "Yu or Angel",
		source: "premade",
		clothes: [
			{index: "Basic Haircut", filter: ""},
			{index: "Angel Halo", filter: ""},
			{index: "Angelic Robes", filter: ""},
			{index: "Genital Ring", filter: ""},
			{index: "Angel Wings", filter: ""},
		],
	},
	{name: "Yu or Devil",
		source: "premade",
		clothes: [
			{index: "Basic Haircut", filter: ""},
			{index: "Devil Horns", filter: ""},
			{index: "Devil Wings", filter: ""},
			{index: "Devil Tail", filter: ""},
		],
	},
	{name: "Special Gift",
		source: "premade",
		clothes: [
			{index: "Basic Haircut", filter: ""},
			{index: "Head Ribbons", filter: ""},
			{index: "Chest Ribbon", filter: ""},
			{index: "Crotch Ribbon", filter: ""},
		],
	},
	{name: "Maniac Maiden",
		source: "premade",
		clothes: [
			{index: "Hexy Haircut", filter: ""},
			{index: "Prince's Shoes", filter: "filter: hue-rotate(-85deg)"},
			{index: "Apothecary Longskirt", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},
			{index: "Goth-Lolly Dress", filter: "filter: brightness(150%) hue-rotate(30deg)"},
		],
	},
	{name: "Roob",
		source: "premade",
		clothes: [
			{index: "Gradient Hair", filter: "filter: hue-rotate(260deg) contrast(1.2) brightness(1.7)"},
			{index: "Pantyhose", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},
			{index: "Belted Boots", filter: "filter: hue-rotate(240deg) contrast(1.4)"},
			{index: "Rose Uniform", filter: "filter: hue-rotate(260deg) contrast(1.2) brightness(1.2)"},
		],
	},
	{name: "Heiress",
		source: "premade",
		clothes: [
			{index: "Heiress Ponytail", filter: "filter: hue-rotate(90deg) contrast(1.2)"},
			{index: "Pure Dress", filter: "filter: hue-rotate(60deg) contrast(1.2)"},
			{index: "High Heels", filter: "filter: hue-rotate(60deg) contrast(1.1)"},
			{index: "White Jacket", filter: "filter: hue-rotate(60deg) contrast(1.2)"},
		],
	},
	{name: "Shinobi",
		source: "premade",
		clothes: [
			{index: "Colored Inner Hair", filter: ""},
			{index: "Shinobi Garb", filter: ""},
			{index: "Shiny Pants", filter: ""},
			{index: "Belted Boots", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},
		],
	},
	{name: "Rowdy",
		source: "premade",
		clothes: [
			{index: "Goldie Locks", filter: ""},
			{index: "Bootyshorts", filter: "filter: grayscale(70%) brightness(100%) contrast(1.4)"},
			{index: "Cowboy Boots", filter: ""},
			{index: "Tube Jacket", filter: ""},
		],
	},
	{name: "Apothecary",
		source: "premade",
		clothes: [
			{index: "Apothecary Locks", filter: ""},
			{index: "Apothecary Garb", filter: ""},
			{index: "Apothecary Longskirt", filter: ""},
			{index: "Apothecary Treads", filter: ""},
		],
	},
	{name: "Catty",
		source: "premade",
		clothes: [
			{index: "Cat Ears", filter: ""},
			{index: "Neck Bell", filter: ""},
			{index: "Lacey Top", filter: ""},
			{index: "Pantyhose", filter: ""},
			{index: "Mary Janes", filter: ""},
		],
	},
	{name: "Escort",
		source: "premade",
		clothes: [
			{index: "Escort's Heels", filter: ""},
			{index: "Thong", filter: ""},
			{index: "Fishnets", filter: ""},
			{index: "Bottomless", filter: ""},
			{index: "Swept Ponytail", filter: ""},
			{index: "Escort's Top", filter: ""},
			{index: "Escort's Bling", filter: ""},
		],
	},
	{name: "Crow",
		source: "premade",
		clothes: [
			{index: "Forehead Gem", filter: ""},
			{index: "Latex Leotard", filter: ""},
			{index: "Bead Belt", filter: ""},
			{index: "Crow's Cloak", filter: ""},
			{index: "Belted Boots", filter: ""},
		],
	},
	{name: "Frenchie",
		source: "premade",
		clothes: [
			{index: "Braided Ponytail", filter: ""},
			{index: "Sailor Top", filter: ""},
			{index: "Thighhighs", filter: "filter: saturate(0) brightness(1.9) contrast(1.6)"},
			{index: "Loafers", filter: "filter: hue-rotate(28deg) saturate(0.75) brightness(0.75) contrast(1.1)"},
			{index: "Sailor Skirt", filter: ""},
		],
	},
	{name: "Frogsuit",
		source: "premade",
		clothes: [
			{index: "Froggy Hair", filter: ""},
			{index: "Frogsuit Top", filter: ""},
			{index: "Frogsuit Bottom", filter: ""},
			{index: "Frogsuit Belt", filter: ""},
			{index: "Frogsuit Stompers", filter: ""},
		],
	},
	{name: "Goth-Lolly",
		source: "premade",
		clothes: [
			{index: "Goth-Lolly Hairdo", filter: ""},
			{index: "Goth-Lolly Dress", filter: ""},
			{index: "Striped Stockings", filter: ""},
			{index: "Bottomless", filter: ""},
			{index: "Mary Janes", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)"},
		],
	},
	{name: "Magical",
		source: "premade",
		clothes: [
			{index: "Magical Ribbons", filter: ""},
			{index: "Magical Dress", filter: ""},
			{index: "Magical Boots", filter: ""},
			{index: "Bottomless", filter: ""},
		],
	},
	{name: "Wicked",
		source: "premade",
		clothes: [
			{index: "Ponytail", filter: ""},
			{index: "Wicked Dress", filter: ""},
			{index: "Wicked Bands", filter: ""},
			{index: "Wicked Treads", filter: ""},
			{index: "Bottomless", filter: ""},
		],
	},
	{name: "Prince",
		source: "premade",
		clothes: [
			{index: "Prince's Ahoge", filter: ""},
			{index: "Prince's Shirt", filter: ""},
			{index: "Prince's Suspenders", filter: ""},
			{index: "Prince's Shoes", filter: ""},
		],
	},
	{name: "Pro Hero",
		source: "premade",
		clothes: [
			{index: "Earmuffs", filter: ""},
			{index: "Rabbit Stompers", filter: ""},
			{index: "Rabbit Leotard", filter: ""},
			{index: "Rabbit Gloves", filter: ""},
		],
	},
	{name: "Sorceress",
		source: "premade",
		clothes: [
			{index: "Sorceress Locks", filter: ""},
			{index: "Sorceress Bodice", filter: ""},
			{index: "Sorceress Sarong", filter: ""},
			{index: "Sorceress Shoes", filter: ""},
			{index: "Sorceress Thong", filter: ""},
			{index: "Sorceress Sleeves", filter: ""},
			{index: "Sorceress Hat", filter: ""},
		],
	},
	{name: "Spooky",
		source: "premade",
		clothes: [
			{index: "Spooky Drills", filter: ""},
			{index: "Spooky Top", filter: ""},
			{index: "Spooky Thighhighs", filter: ""},
			{index: "Spooky Skirt", filter: ""},
		],
	},
	{name: "Star-Princess",
		source: "premade",
		clothes: [
			{index: "Star-Princess Locks", filter: ""},
			{index: "Star-Princess Top", filter: ""},
			{index: "Star-Princess Skirt", filter: ""},
			{index: "Star-Princess Armguards", filter: ""},
			{index: "Belted Boots", filter: ""},
		],
	},
	{name: "Witchy",
		source: "premade",
		clothes: [
			{index: "Witchy Forelocks", filter: ""},
			{index: "Leg Wraps", filter: ""},
			{index: "Boots", filter: "filter: hue-rotate(30deg) saturate(0.65) brightness(0.9)"},
			{index: "Witch's Cape", filter: ""},
			{index: "Bottomless", filter: ""},
			{index: "Witchy Dress", filter: ""},
		],
	},
	{name: "Inspector",
		source: "premade",
		clothes: [
			{index: "Basic Haircut", filter: ""},
			{index: "Inspector's Vest", filter: ""},
			{index: "Inspector's Slacks", filter: ""},
			{index: "Loafers", filter: "filter: hue-rotate(28deg) saturate(0.75) brightness(0.75) contrast(1.1)"},
		],
	},
	{name: "Survivor",
		source: "premade",
		clothes: [
			{index: "Basic Haircut", filter: ""},
			{index: "Survivor's Shirt", filter: ""},
			{index: "Survivor's Pants", filter: ""},
			{index: "Sneakers", filter: "filter: hue-rotate(75deg)"},
		],
	},
	{name: "Princess",
		source: "premade",
		clothes: [
			{index: "Princess Haircut", filter: ""},
			{index: "Princess Dress", filter: ""},
		],
	},
	{name: "Male Counselor",
		source: "premade",
		clothes: [
			{index: "Basic Haircut", filter: ""},
			{index: "Male Counselor Top", filter: ""},
			{index: "Male Counselor Bottoms", filter: ""},
			{index: "Counselor Glasses", filter: ""},
			{index: "Loafers", filter: "filter: hue-rotate(28deg) saturate(0.75) brightness(0.75) contrast(1.1)"},
		],
	},
	{name: "Female Counselor",
		source: "premade",
		clothes: [
			{index: "Basic Haircut", filter: ""},
			{index: "Female Counselor Top", filter: ""},
			{index: "Female Counselor Bottoms", filter: ""},
			{index: "Counselor Glasses", filter: ""},
			{index: "Loafers", filter: "filter: hue-rotate(28deg) saturate(0.75) brightness(0.75) contrast(1.1)"},
		],
	},
	{name: "Teak's Outfit",
        source: "community",
        clothes: [
            {index: "Goldie Locks", filter: "filter: hue-rotate(100deg) saturate(1.2) brightness(0.95) contrast(1.5)", image: "player/hair/goldie-altFront"},
            {index: "Chest Wraps", filter: "filter: hue-rotate(-53deg) saturate(0) brightness(0.7) contrast(1.7)", image: ""},
            {index: "Witch's Cape", filter: "filter: hue-rotate(-150deg) saturate(0.4) brightness(1.8) contrast(1.9)", image: ""},
            {index: "Star-Princess Armguards", filter: "filter: hue-rotate(-129deg) saturate(0.55) brightness(0.95) contrast(1.65)", image: ""},
            {index: "Shiny Pants", filter: "filter: grayscale(100%) brightness(90%) contrast(1.2)", image: ""},
            {index: "Greaves", filter: "filter: hue-rotate(-139deg) saturate(0.1) brightness(1.55) contrast(1.55)", image: ""},
        ],
    },
	{name: "Boop's Outfit",
        source: "community",
        clothes: [
            {index: "Hexy Haircut", filter: "filter: hue-rotate(96deg) saturate(0.85) brightness(1.25) contrast(1.6)", image: ""},
            {index: "Thighhighs", filter: "filter: saturate(0.75) brightness(0.7) contrast(1.85)", image: ""},
            {index: "Pelvic Curtain", filter: "filter: hue-rotate(-6deg) saturate(1.45) brightness(0.55) contrast(1.4)", image: ""},
            {index: "Counselor Glasses", filter: "", image: ""},
            {index: "Sorceress Sleeves", filter: "filter: hue-rotate(15deg) saturate(1.35) brightness(0.65) contrast(2.2)", image: ""},
            {index: "Sorceress Hat", filter: "filter: hue-rotate(25deg) saturate(1.45) brightness(0.5) contrast(1.2)", image: ""},
            {index: "Rabbit Gloves", filter: "filter: hue-rotate(-94deg) saturate(3) brightness(0.45) contrast(3)", image: ""},
            {index: "Sorceress Shoes", filter: "filter: hue-rotate(73deg) saturate(1.5) brightness(0.6) contrast(1.2)", image: ""},
            {index: "Spooky Skirt", filter: "filter: saturate(1.75) brightness(0.5) contrast(2.6)", image: ""},
            {index: "Nightgown", filter: "filter: saturate(0.7) brightness(0.7) contrast(1.75)", image: ""},
            {index: "Frogsuit Belt", filter: "filter: hue-rotate(42deg) saturate(0.55) brightness(0.6) contrast(3)", image: ""},
            {index: "Bead Belt", filter: "filter: hue-rotate(80deg) brightness(0.9) contrast(1.4)", image: ""},
            {index: "Crow's Cloak", filter: "filter: hue-rotate(77deg) saturate(1.45) brightness(0.7) contrast(1.3)", image: ""},
        ],
    },
	{name: "Satoo's Outfit",
        source: "community",
        clothes: [
            {index: "Spooky Drills", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)", image: "images-webp/player/hair/spooky-alt.webp"},
            {index: "Witch's Cape", filter: "filter: brightness(115%) hue-rotate(-45deg)", image: ""},
            {index: "Choker", filter: "", image: ""},
            {index: "Pelvic Curtain", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)", image: ""},
            {index: "Pasties", filter: "filter: brightness(270%) hue-rotate(50deg) contrast(1.2)", image: ""},
            {index: "Wicked Bands", filter: "", image: ""},
            {index: "Escort's Bling", filter: "", image: ""},
            {index: "Fishnets", filter: "", image: ""},
            {index: "Pasties", filter: "", image: ""},
            {index: "Wicked Treads", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)", image: ""},
            {index: "Sorceress Bodice", filter: "filter: brightness(115%) hue-rotate(-45deg)", image: ""},
            {index: "Sorceress Sarong", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)", image: ""},
        ],
    },
	{name: "Rei's Outfit",
        source: "community",
        clothes: [
            {index: "Cat Ears", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)", image: ""},
            {index: "Counselor Glasses", filter: "", image: ""},
            {index: "Prince's Shoes", filter: "filter: hue-rotate(75deg)", image: ""},
            {index: "Sorceress Sarong", filter: "filter: hue-rotate(75deg)", image: ""},
            {index: "Lacey Top", filter: "filter: hue-rotate(75deg)", image: ""},
        ],
    },
	{name: "Sporty",
		source: "premade",
		clothes: [
			{index: "Swept Bangs", filter: ""},
			{index: "Sporty Hoodie", filter: ""},
			{index: "Sporty Shorts", filter: ""},
			{index: "Sporty Kicks", filter: ""},
		],
	},
	{name: "Wallflower",
		source: "premade",
		clothes: [
			{index: "Wallflower Ponytail", filter: ""},
			{index: "Candycane Sleeves", filter: ""},
			{index: "Candycane Tights", filter: ""},
			{index: "Wallflower Dress", filter: ""},
			{index: "Skull", filter: ""},
		],
	},
	{name: "Jiangshi",
		source: "premade",
		clothes: [
			{index: "Jiangshi Hat", filter: ""},
			{index: "Talisman (Head)", filter: ""},
			{index: "Jiangshi Sleeves", filter: ""},
			{index: "Talisman (Nipples)", filter: ""},
			{index: "Talisman (Maebari)", filter: ""},
		],
	},
	{name: "NEET",
		source: "premade",
		clothes: [
			{index: "NEET Socks", filter: ""},
			{index: "NEET Boots", filter: ""},
			{index: "NEET Shorts", filter: ""},
			{index: "NEET Bra", filter: ""},
			{index: "NEET Shirt", filter: ""},
			{index: "NEET Jacket", filter: ""},
			{index: "NEET Locks", filter: ""},
			{index: "Round Glasses", filter: ""},
		],
	},
	{name: "Noodle's Outfit",
		source: "community",
		clothes: [
			{index: "Pasties", filter: "filter: hue-rotate(-85deg)", image: "player/accessories/pasties-fem"},
			{index: "Candycane Sleeves", filter: "filter: hue-rotate(-79deg)", image: "player/armwear/squig-femFront"},
			{index: "Hair Flower", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)", image: "player/accessories/flower"},
			{index: "*Genitals*"},
			{index: "Candycane Tights", filter: "filter: hue-rotate(-79deg)", image: "player/underwear/squig-penis"},
			{index: "Witch's Cape", filter: "filter: hue-rotate(-120deg)", image: "player/accessories/capeFront"},
			{index: "Skull", filter: "", image: "player/upperwear/squig-fem", scaleY: "1.2", offsetY: "-13"},
			{index: "Witchy Forelocks", filter: "filter: brightness(200%) hue-rotate(30deg) contrast(1.4)", image: "player/hair/witchyFront"},
		],
	},
];

//Shorthand for a garment that wants the standard palette: write filter: "simple" on it and the
//whole set of colours is added to initialVariantsArray here, instead of by hand. Only the
//palette colours come out of this; a set that needs its colours tuned is written out in
//initialVariantsArray, which is where all the existing ones live.
//
//consoleOutputList prints what it generated in the new short form, so a palette can be pasted
//into initialVariantsArray and then tweaked.
var consoleOutputList = "";
for (clothingIndex = 0; clothingIndex < initialClothesArray.length; clothingIndex++) {
	if (initialClothesArray[clothingIndex].filter == "simple") {
		//easier filters
		if (initialClothesArray[clothingIndex].category == "hair") {
			var ordinaryColors = [ //Hair Colors (starting from brown)
				"filter: contrast(1)",
				"filter: hue-rotate(-23deg) contrast(1.4)",
				"filter: hue-rotate(-150deg) contrast(1.4)", 
				"filter: hue-rotate(-100deg) contrast(1.4)",
				"filter: brightness(200%) hue-rotate(30deg) contrast(1.4)", 
				"filter: hue-rotate(100deg) contrast(1.4)",
				"filter: grayscale(100%) brightness(180%) contrast(1.2)",
				"filter: grayscale(100%) brightness(70%) contrast(1.2)",
			]
		}
		else {
			var ordinaryColors = [ //Clothing Colors (starting from red)
				"filter: hue-rotate(-120deg)", 
				"filter: hue-rotate(-85deg)", 
				"filter: brightness(115%) hue-rotate(-45deg)", 
				"filter: brightness(150%) hue-rotate(30deg)", 
				"filter: grayscale(40%) brightness(200%) hue-rotate(40deg)", 
				"filter: hue-rotate(75deg)",
				"filter: grayscale(100%) brightness(70%) contrast(1.2)",
			]
		}
		initialClothesArray[clothingIndex].filter = "";
		for (colorIndex = 0; colorIndex < ordinaryColors.length; colorIndex++) {
			if (!initialClothesArray[clothingIndex].tags) {
				initialClothesArray[clothingIndex].tags = "";
			}
			//A colour swatch changes nothing but the filter, so that is all it has to say. The
			//category, art, tags and unlock all come from the garment it names.
			initialVariantsArray.push({
				index: initialClothesArray[clothingIndex].index,
				filter: ordinaryColors[colorIndex],
			});
			consoleOutputList += "{index: \""+initialClothesArray[clothingIndex].index+"\", filter: \""+ordinaryColors[colorIndex]+"\"},\n";
		}
	}
}
console.debug(consoleOutputList);

//Secondary cleanup for error detection
for (itemIndex = 0; itemIndex < initialItemsArray.length; itemIndex++) {
	console.log("Processing item no "+itemIndex+": "+initialItemsArray[itemIndex].index);
	if (initialItemsArray[itemIndex].image == null) {
		initialItemsArray[itemIndex].image = cleanupImage("items/"+initialItemsArray[itemIndex].index);
	}
	if (initialItemsArray[itemIndex].name == null) {
		initialItemsArray[itemIndex].name = initialItemsArray[itemIndex].index.replace("fish-", "").replace("bug-","").replace("fruit-","");
		initialItemsArray[itemIndex].name = initialItemsArray[itemIndex].name[0].toUpperCase() + initialItemsArray[itemIndex].name.slice(1);
	}
}

//===========================================================================================
//Full Control clothing system. See !designDocs/syrup_town_features/FULL-CONTROL.md for the reasoning behind all
//of this; the short version is that the old system allowed exactly one hair, upperwear,
//lowerwear and footwear piece at a time, and represented "nothing worn" with empty sentinel
//garments. Full Control allows any number of pieces per category, so the sentinels are gone
//and the point where genitals are drawn is an explicit layer instead.
//===========================================================================================

//The categories that used to be limited to one worn piece each
//Named specifically rather than "exclusiveCategories" because the WebUI's defaultDB.js
//declares a global by that name for prompt category groups, and webui.js loads it into this
//same scope at runtime. Two declarations of one name is a SyntaxError that kills whichever
//file loads second, so nothing in here may take a plain generic global name.
const exclusiveClothingCategories = ["hair", "upperwear", "lowerwear", "footwear"];

//The old sentinel garments, kept only so migrateClothes can recognise them in saves and
//shared outfit strings written before Full Control. They are no longer wearable.
const legacySentinelNames = ["Bald", "Topless", "Bottomless", "Barefoot"];

//Image path rewrites applied during migration, as [oldPath, newPath]. Both sides are logical
//paths in base-variant form: no images-png/ prefix, no extension, and -light / -masc / -penis
//rather than a specific body. One row per renamed image; matching is exact, so a whole folder
//move needs a row per file rather than one row for the folder.
const clothingPathRewrites = [
	["player/hair/apothecary", "player/hair/apothecaryFront"],
	["player/hair/basic-masc", "player/hair/basic-mascFront"],
	["player/hair/bow-masc", "player/hair/bowFront"],
	["player/hair/bow-masc-alt", "player/hair/bow-altFront"],
	["player/hair/cat", "player/hair/catFront"],
	["player/hair/escort", "player/hair/escortFront"],
	["player/hair/fated-masc", "player/hair/fatedFront"],
	["player/hair/flipped", "player/hair/flippedFront"],
	["player/hair/frogsuit-masc", "player/hair/frogsuitFront"],
	["player/hair/goldie-masc", "player/hair/goldieFront"],
	["player/hair/goldie-masc-alt", "player/hair/goldie-altFront"],
	["player/hair/golly-masc", "player/hair/gollyFront"],
	["player/hair/golly-masc-alt", "player/hair/golly-altFront"],
	["player/hair/heiress-masc", "player/hair/heiressFront"],
	["player/hair/heiress-masc-alt", "player/hair/heiress-altFront"],
	["player/hair/hex-masc", "player/hair/hexFront"],
	["player/hair/hex-masc-alt", "player/hair/hex-altFront"],
	["player/hair/ponytail", "player/hair/ponytailFront"],
	["player/hair/princess-masc", "player/hair/princessFront"],
	["player/hair/princess-masc-alt", "player/hair/princess-altFront"],
	["player/hair/prince", "player/hair/princeFront"],
	["player/hair/rabbit", "player/hair/rabbitFront"],
	["player/hair/sorceress-masc", "player/hair/sorceressFront"],
	["player/hair/star-masc", "player/hair/starFront"],
	["player/hair/witchy", "player/hair/witchyFront"],
];

//Whether a Front/Back garment pair mirrors its X offset on the back half. The two halves are
//one garment drawn in a single front-facing view (cloakFront is the drape in front of the
//body, cloakBack the part behind it), so moving the garment should move both halves the same
//way. Flip this to true if back pieces separate from their fronts when offset.
const mirrorBackOffset = false;

//What a layer is called in the wardrobe menus. The anchor's stored name is a reserved marker
//so it can never collide with a real garment, which is not something to show the player.
function layerDisplayName(piece) {
	if (isGenitalAnchor(piece)) {
		return "Genitals";
	}
	return clothingDisplayName(piece);
}

//True for an alternate colour or alt art of a garment, as opposed to the garment itself. This
//used to be "has a filter", which is why every variant had to carry one even when it only
//changed the art, and why no real garment could ever ship with a filter of its own.
function isClothingVariant(garment) {
	if (!garment) {
		return false;
	}
	return garment.variant == true;
}

//Whether a worn piece is this exact clothing entry, rather than some other version of the same
//garment. The wardrobe uses it to decide which single box in a row of swatches gets the worn
//ring and the take-it-off click.
//
//This used to compare filters alone, which only worked because every variant carried a
//different one: the hue-rotate(0deg) rows existed for no other reason than to keep that true.
//Now that a variant can differ by art alone, several of them share the garment's empty filter,
//and comparing filters marked every one of them worn as soon as any was.
function isWearingExactly(wornPiece, garment) {
	if (!wornPiece || !garment) {
		return false;
	}
	if (wornPiece.index != garment.index) {
		return false;
	}
	if (String(wornPiece.filter ? wornPiece.filter : "") != String(garment.filter ? garment.filter : "")) {
		return false;
	}
	//Compared as base art: the worn copy has been pointed at the player's own body, and the
	//clothing list holds the body-neutral form
	return clothingBaseImage(wornPiece.image ? wornPiece.image : "") == clothingBaseImage(garment.image ? garment.image : "");
}

//What a garment is called on screen. index stays its identity, which is what wearing, layering,
//outfit export and replacement all match on; name is only a label, so a variant can be shown as
//its own thing without ever becoming a separate garment.
function clothingDisplayName(garment) {
	if (!garment) {
		return "";
	}
	if (garment.name) {
		return garment.name;
	}
	return garment.index;
}

//Builds the real clothing entries for initialVariantsArray and appends them to a clothing list.
//Each variant copies the garment it names and overrides only the fields it actually declares,
//so a colour swatch is one short line rather than a full duplicate row.
function expandClothingVariants(targetArray) {
	for (var variantCounter = 0; variantCounter < initialVariantsArray.length; variantCounter++) {
		var spec = initialVariantsArray[variantCounter];
		//Match the garment, never another variant of it, so a variant can never inherit from one
		var basePiece = null;
		for (var baseCounter = 0; baseCounter < targetArray.length; baseCounter++) {
			if (targetArray[baseCounter].index == spec.index && isClothingVariant(targetArray[baseCounter]) != true) {
				basePiece = targetArray[baseCounter];
				break;
			}
		}
		if (!basePiece) {
			console.error("Clothing variant names a garment that isn't in the clothing list: "+spec.index);
			continue;
		}
		var variantPiece = {
			index: basePiece.index,
			category: basePiece.category,
			image: basePiece.image,
			filter: basePiece.filter ? basePiece.filter : "",
			tags: basePiece.tags ? basePiece.tags : "",
			variant: true
		};
		if (basePiece.requirements != undefined) {
			variantPiece.requirements = basePiece.requirements;
		}
		if (basePiece.name != undefined) {
			variantPiece.name = basePiece.name;
		}
		//Only what the variant declares is overridden. Everything else stays the garment's, which
		//is what keeps an unlock, a tag or a rename in one place instead of on every swatch.
		if (spec.name != undefined) {
			variantPiece.name = spec.name;
		}
		if (spec.image != undefined) {
			variantPiece.image = spec.image;
		}
		if (spec.filter != undefined) {
			variantPiece.filter = spec.filter;
		}
		if (spec.requirements != undefined) {
			variantPiece.requirements = spec.requirements;
		}
		if (spec.tags != undefined) {
			variantPiece.tags = spec.tags;
		}
		targetArray.push(variantPiece);
	}
	return targetArray;
}

//Turns Full Control on and off. Only the wardrobe menus read this: the renderer and the worn
//array always handle any number of pieces, because an outfit built in Full Control can be
//equipped by a player who has it switched off. Turning it off re-pins the anchor and underwear.
function toggleFullControl() {
	if (fullControlEnabled() == true) {
		removeFlag("player", "fullControl");
	}
	else {
		addFlag("player", "fullControl");
	}
	enforceClothingOrder(data.player.clothes);
	updateMenu();
	printWardrobeShuffle();
}

//Reads a tag off a piece. Tags are a comma joined string, so this has to be a substring test
//rather than the exact match some of the old code used.
function hasTag(piece, tag) {
	if (!piece || !piece.tags) {
		return false;
	}
	return String(piece.tags).includes(tag);
}

//Full Control is a wardrobe UI setting only. The renderer and the worn array always support
//any number of pieces, because an outfit made in Full Control can be equipped by a player who
//has the setting switched off.
function fullControlEnabled() {
	return checkFlag("player", "fullControl") == true;
}

//How the anchor is written into exported outfit text. The asterisks keep it from ever
//colliding with a real garment name, and it survives the existing import parser untouched.
const anchorMarkerName = "*Genitals*";

//The genital anchor: a body layer, never a garment. It marks the point in the draw order
//where the genital stack and underwear are printed. Exactly one is always present.
function makeGenitalAnchor() {
	return {index: anchorMarkerName, category: "body", anchor: true, filter: "", image: "", tags: ""};
}

function isGenitalAnchor(piece) {
	if (!piece) {
		return false;
	}
	return piece.anchor == true;
}

function findAnchorIndex(clothes) {
	for (var anchorCounter = 0; anchorCounter < clothes.length; anchorCounter++) {
		if (isGenitalAnchor(clothes[anchorCounter])) {
			return anchorCounter;
		}
	}
	return -1;
}

//Genitals are hidden when a garment drawn ABOVE the anchor already accounts for them in its
//own art, which is what the covering tag means. Note that covering is not a lowerwear-only
//tag: Bunny Leotard and a few miscategorised bottoms carry it on upperwear, so this cannot
//be narrowed to one category. Resolved in one pass before anything is drawn, because the old
//code decided it mid-draw and so could emit the genitals before discovering a covering piece.
function genitalsVisible(clothes) {
	//Full Control hands the decision to the player: once they have touched the toggle on the
	//Genitals layer, that answer sticks whatever they put on over it. Layering is theirs to
	//manage in that mode, and having the genitals vanish on their own fights that.
	var anchorAt = findAnchorIndex(clothes);
	if (anchorAt >= 0 && fullControlEnabled() == true && clothes[anchorAt].invisible != undefined) {
		return clothes[anchorAt].invisible != true;
	}
	//Otherwise it is automatic: a garment above the anchor that already draws the genitals in
	//its own art (the covering tag) hides the separate genital layer.
	for (var coverCounter = anchorAt + 1; coverCounter < clothes.length; coverCounter++) {
		if (hasTag(clothes[coverCounter], "covering")) {
			return false;
		}
	}
	return true;
}

//Full Control only: show or hide the genital layer by hand. Stored on the anchor and only
//written when the player has actually chosen, so saves do not grow a field nobody set.
function toggleGenitalVisibility() {
	var anchorAt = findAnchorIndex(data.player.clothes);
	if (anchorAt < 0 || fullControlEnabled() != true) {
		return;
	}
	//First press takes over from whatever the automatic rule was showing, so nothing jumps
	var showingNow = genitalsVisible(data.player.clothes);
	data.player.clothes[anchorAt].invisible = showingNow;
	updateMenu();
	printWardrobeShuffle();
}

//Whether anyone looking at the player would call them bottomless. Underwear counts as covered
//even though the renderer still draws the genital stack underneath it, so a player in a thong or
//tights is not treated as nude in public: townsfolk were chastising a clothed player for it.
//Everything else defers to the renderer, so reactions and the picture cannot otherwise drift.
function isBottomless(clothes) {
	for (var coveredCounter = 0; coveredCounter < clothes.length; coveredCounter++) {
		if (hasTag(clothes[coveredCounter], "underwear")) {
			return false;
		}
	}
	return genitalsVisible(clothes);
}

function isTopless(clothes) {
	for (var topCounter = 0; topCounter < clothes.length; topCounter++) {
		if (clothes[topCounter].category == "upperwear") {
			return false;
		}
	}
	return true;
}

//The height of the doll's own canvas, which almost every piece of clothing art is drawn on.
const clothingCanvasHeight = 2688;

//How much taller than the doll's canvas a piece's art is, as a fraction of the doll's canvas.
//
//Art normally shares the doll's canvas exactly, which leaves 85px above the head: enough for a
//halo, nowhere near enough for a tall hat. Such a piece is drawn on a taller canvas instead,
//with the doll's own area occupying the BOTTOM of it and the extra room above, and says how
//tall that canvas is with canvasHeight. Nothing else about it changes.
function clothingHeadroom(piece) {
	if (!piece || !piece.canvasHeight) {
		return 0;
	}
	var artHeight = parseFloat(piece.canvasHeight);
	if (isNaN(artHeight) || artHeight <= clothingCanvasHeight) {
		return 0;
	}
	return (artHeight - clothingCanvasHeight) / clothingCanvasHeight;
}

//Builds the style attribute for one drawn layer: the piece's colour filter plus its scale and
//offset. Every clothing image is generated onto the doll and then has the doll erased, so all
//art shares the doll's canvas and a centre origin scales about the doll's centre. Offsets are
//percentages of that same canvas.
function clothingStyle(piece, isBackHalf) {
	var style = "";
	if (piece && piece.filter) {
		style = String(piece.filter);
	}
	var scaleX = parseFloat(piece && piece.scaleX != null ? piece.scaleX : 1);
	var scaleY = parseFloat(piece && piece.scaleY != null ? piece.scaleY : 1);
	var offsetX = parseFloat(piece && piece.offsetX != null ? piece.offsetX : 0);
	var offsetY = parseFloat(piece && piece.offsetY != null ? piece.offsetY : 0);
	if (isNaN(scaleX)) {
		scaleX = 1;
	}
	if (isNaN(scaleY)) {
		scaleY = 1;
	}
	if (isNaN(offsetX)) {
		offsetX = 0;
	}
	if (isNaN(offsetY)) {
		offsetY = 0;
	}
	if (isBackHalf == true && mirrorBackOffset == true) {
		offsetX = -offsetX;
	}
	var transform = "";
	if (offsetX != 0 || offsetY != 0) {
		transform += " translate(" + offsetX + "%, " + offsetY + "%)";
	}
	if (scaleX != 1 || scaleY != 1) {
		transform += " scale(" + scaleX + ", " + scaleY + ")";
	}
	//A piece on a taller canvas is stretched into the doll's box like every other layer, so undo
	//that and pin its bottom edge back where the doll's is. Transforms apply right to left: the
	//art is stretched back to its true proportions about its centre, which drops its bottom edge
	//by half the extra height, and the translate lifts it back up by exactly that. What is left
	//over hangs above the frame, which is where a hat's crown belongs. The player's own scale and
	//offset are applied after all that, so they act on the piece as drawn.
	var headroom = clothingHeadroom(piece);
	if (headroom > 0) {
		transform += " translateY(" + (-headroom / 2 * 100) + "%) scaleY(" + (1 + headroom) + ")";
	}
	if (transform != "") {
		if (style != "" && style.trim().endsWith(";") == false) {
			style += ";";
		}
		//A scaled or offset layer can spill well past its frame, and the frame in the side menu sits
		//directly under the menu's buttons, so a transformed layer never takes clicks. Clicks land on
		//whatever is beneath instead, which includes the wardrobe cell the layer is drawn in.
		style += "transform:" + transform + ";transform-origin:center;pointer-events:none;";
	}
	return style;
}

//Moves every hair piece to the front of the array, keeping their order relative to each other.
//Hair draws behind everything, which the old renderer achieved by splicing it into the output
//HTML at a fixed offset. Sorting the list instead means the renderer can just walk it in order,
//and it makes hair an ordinary layer the day the art is reissued as Front/Back pairs.
function sortHairToFront(clothes) {
	var hair = [];
	for (var hairCounter = clothes.length - 1; hairCounter >= 0; hairCounter--) {
		if (clothes[hairCounter].category == "hair") {
			hair.unshift(clothes.splice(hairCounter, 1)[0]);
		}
	}
	for (var insertCounter = hair.length - 1; insertCounter >= 0; insertCounter--) {
		clothes.unshift(hair[insertCounter]);
	}
}

//Where the anchor goes when a clothes array does not already say. The old system backfilled a
//Bottomless sentinel into the lowerwear slot, which landed the genitals just below the first
//lowerwear piece, or straight after the hair when nothing was worn down there.
function defaultAnchorIndex(clothes) {
	for (var lowerCounter = 0; lowerCounter < clothes.length; lowerCounter++) {
		if (clothes[lowerCounter].category == "lowerwear") {
			return lowerCounter;
		}
	}
	var afterHair = 0;
	while (afterHair < clothes.length && clothes[afterHair].category == "hair") {
		afterHair++;
	}
	return afterHair;
}

//Keeps the worn array in a legal shape, and is called after every change to it.
//
//The anchor's position is player data, not something derived. The old Bottomless sentinel was
//an ordinary draggable row in the Layers menu, so wherever the player left it is where the
//genitals belong, and wearing or removing lowerwear preserved that slot. Nothing here moves it.
//
//Hair sorts to the front, and exactly one anchor exists. In simple mode underwear is stacked
//directly above the anchor, reproducing the hoist the old renderer did at draw time; in Full
//Control the player owns that ordering too.
function enforceClothingOrder(clothes) {
	//Keep the first anchor exactly where it is and drop any extras, rather than pulling it out
	//and reinserting it by index. Removing it and reordering both shift positions, so an index
	//noted beforehand goes stale and the genitals drift a layer.
	var anchorSeen = false;
	for (var stripCounter = 0; stripCounter < clothes.length; stripCounter++) {
		if (isGenitalAnchor(clothes[stripCounter])) {
			if (anchorSeen == true) {
				clothes.splice(stripCounter, 1);
				stripCounter--;
			}
			anchorSeen = true;
		}
	}
	if (anchorSeen == false) {
		clothes.splice(defaultAnchorIndex(clothes), 0, makeGenitalAnchor());
	}

	//Hair is an ordinary layer now and is never sorted here, in either mode, so a player who
	//drags it keeps that position. Legacy data still gets hair pulled to the front once, during
	//migration, so old saves and the premade outfits open looking the way they always did.

	if (fullControlEnabled() != true) {
		//Simple mode is automatic: the genitals sit under the lowerwear and the player never
		//sees the layer at all. Only re-pin when there IS lowerwear to sit under, because
		//outfits with none (Escort, Bikini Armor) carry a deliberate anchor position instead.
		var firstLower = -1;
		for (var lowerCounter = 0; lowerCounter < clothes.length; lowerCounter++) {
			if (clothes[lowerCounter].category == "lowerwear") {
				firstLower = lowerCounter;
				break;
			}
		}
		if (firstLower >= 0) {
			var anchorAt = findAnchorIndex(clothes);
			if (anchorAt >= 0 && anchorAt != firstLower) {
				var anchor = clothes.splice(anchorAt, 1)[0];
				//Removing from in front of the lowerwear shifts it back one
				if (anchorAt < firstLower) {
					firstLower--;
				}
				clothes.splice(firstLower, 0, anchor);
			}
		}
		//A hand-set visibility is a Full Control choice, so simple mode drops it and goes back
		//to reading the covering tags
		var simpleAnchor = findAnchorIndex(clothes);
		if (simpleAnchor >= 0) {
			delete clothes[simpleAnchor].invisible;
		}
		placeUnderwearAboveAnchor(clothes);
	}
	return clothes;
}

//Removes every worn piece of a category, replacing the old trick of wearing an empty sentinel
//garment over the top. The anchor is a body layer and is never touched.
function stripCategory(category) {
	for (var stripCounter = data.player.clothes.length - 1; stripCounter >= 0; stripCounter--) {
		if (isGenitalAnchor(data.player.clothes[stripCounter])) {
			continue;
		}
		if (data.player.clothes[stripCounter].category == category) {
			data.player.clothes.splice(stripCounter, 1);
		}
	}
	enforceClothingOrder(data.player.clothes);
}

//True if a legacy empty sentinel garment. Both the name and the empty image have to match, so
//a real garment that happens to be called Topless one day is not silently eaten.
function isLegacySentinel(piece) {
	if (!piece || !piece.index) {
		return false;
	}
	if (legacySentinelNames.includes(piece.index) == false) {
		return false;
	}
	if (!piece.image) {
		return true;
	}
	return String(piece.image).includes("player-empty");
}

//The variant suffixes a clothing image can carry. The FIRST form in each list is the base, and
//it is what globalClothesArray stores, so any worn path can be reduced back to it and re-derived
//for whatever body the player currently has.
const clothingVariantGroups = [
	{base: "-light", forms: ["-tan", "-dark"]},
	{base: "-masc", forms: ["-fem"]},
	{base: "-penis", forms: ["-pussy"]}
];

//Strips the image format folder and extension, leaving the logical path the clothing arrays use.
//cleanupImage puts them back, so nothing downstream needs to care.
function clothingLogicalPath(imagePath) {
	var logicalPath = String(imagePath);
	logicalPath = logicalPath.split("images-webp/").join("");
	logicalPath = logicalPath.split("images-png/").join("");
	logicalPath = logicalPath.split("images/").join("");
	logicalPath = logicalPath.split(".webp").join("");
	logicalPath = logicalPath.split(".png").join("");
	return logicalPath;
}

//Reduces the body suffixes in a path back to their base forms, leaving the image folder and the
//extension exactly as they were. Everything that draws a garment re-derives the body from the
//base form, so anything holding a path has to be able to get back to it: a path that has already
//been pointed at, say, dark skin cannot be pointed at light skin without coming through here
//first, because the rewrites downstream only ever convert away from the base.
function clothingBaseVariants(imagePath) {
	var basedPath = String(imagePath);
	for (var groupCounter = 0; groupCounter < clothingVariantGroups.length; groupCounter++) {
		var group = clothingVariantGroups[groupCounter];
		for (var formCounter = 0; formCounter < group.forms.length; formCounter++) {
			basedPath = basedPath.split(group.forms[formCounter]).join(group.base);
		}
	}
	return basedPath;
}

//Reduces a worn image back to its base variants, whatever body it was saved for, and to the
//logical path the clothing arrays use
function clothingBaseImage(imagePath) {
	return clothingBaseVariants(clothingLogicalPath(imagePath));
}

//Points a base image at the player's current body. A piece with no variant suffix is left alone,
//which is what makes swapping gendered art for agender art (or the reverse) just work.
function applyPlayerVariants(imagePath) {
	var finalPath = String(imagePath);
	finalPath = finalPath.split("-light").join("-"+data.player.skin);
	finalPath = finalPath.split("-masc").join("-"+data.player.gender);
	//Genitals are binary as far as clothing art goes, whatever else data.player.genitals holds
	if (data.player.genitals == "pussy") {
		finalPath = finalPath.split("-penis").join("-pussy");
	}
	return finalPath;
}

//Renames one clothing image. Matching is EXACT and never partial: the incoming path is first
//reduced to its base variants, and it has to equal a rule source outright. Partial matching was
//too dangerous here, because a rule for one garment could catch an unrelated one whose name
//merely contained it, and a renamed path still contains the name it was renamed from, so it
//would keep being rewritten on every load.
function rewriteClothingPath(imagePath) {
	var logicalPath = clothingLogicalPath(imagePath);
	for (var ruleCounter = 0; ruleCounter < clothingPathRewrites.length; ruleCounter++) {
		//Already renamed, so leave it alone
		if (logicalPath == clothingPathRewrites[ruleCounter][1]) {
			return logicalPath;
		}
		if (logicalPath == clothingPathRewrites[ruleCounter][0]) {
			return clothingPathRewrites[ruleCounter][1];
		}
	}
	return logicalPath;
}

//Converts a clothes array from the old one-piece-per-category model to Full Control: drops the
//empty sentinel garments, leaves the anchor where Bottomless used to sit, applies any image
//path rewrites, and normalises the order. Safe to run on already migrated data, so it can be
//called on every load without tracking a version number.
function migrateClothes(clothes, sortHair) {
	if (!clothes) {
		return [];
	}
	var migrated = [];
	var anchorTarget = -1;
	for (var migrateCounter = 0; migrateCounter < clothes.length; migrateCounter++) {
		var piece = clothes[migrateCounter];
		if (!piece) {
			continue;
		}
		if (isGenitalAnchor(piece)) {
			if (anchorTarget < 0) {
				anchorTarget = migrated.length;
			}
			continue;
		}
		if (isLegacySentinel(piece)) {
			//Bottomless was doing double duty as "no lowerwear" and "draw the genitals here".
			//Only the second job survives, as the anchor's position.
			if (piece.index == "Bottomless" && anchorTarget < 0) {
				anchorTarget = migrated.length;
			}
			continue;
		}
		if (piece.image) {
			//Reduce to the base art, apply any rename, then point it back at the player's body.
			//Doing it in that order means a rename only ever needs the base path written once,
			//and gendered art swapping to agender art (or the reverse) needs no special case.
			piece.image = applyPlayerVariants(rewriteClothingPath(clothingBaseImage(piece.image)));
		}
		//Two runs of pieces were added with the category misspelled, one dropping an s and one
		//adding one, which kept them out of the Accessories tab entirely. The clothing list is
		//fixed, but a save that already has one worn is carrying the misspelling in its own
		//copy, so correct that too.
		if (piece.category == "accesory" || piece.category == "accessories") {
			piece.category = "accessory";
		}
		//Size was one number before it was split into two axes. Convert rather than carrying a
		//fallback through the renderer forever.
		if (piece.scale != undefined) {
			if (piece.scaleX == undefined) {
				piece.scaleX = readOutfitNumber(piece.scale, 1);
			}
			if (piece.scaleY == undefined) {
				piece.scaleY = readOutfitNumber(piece.scale, 1);
			}
			delete piece.scale;
		}
		migrated.push(piece);
	}
	if (anchorTarget < 0) {
		anchorTarget = defaultAnchorIndex(migrated);
	}
	migrated.splice(anchorTarget, 0, makeGenitalAnchor());
	//Legacy data leaned on the renderer hoisting underwear to the genitals at draw time. Full
	//Control lets the player reorder underwear, so the hoist can no longer rescue bad ordering
	//and the position has to be made real here instead.
	placeUnderwearAboveAnchor(migrated);
	//Hair only draws behind everything by convention now, so its position is the player's to
	//set. Pulling it forward is a one-off conversion for data written before that was true.
	if (sortHair == true) {
		sortHairToFront(migrated);
	}
	enforceClothingOrder(migrated);
	return migrated;
}

//Runs the clothing migration over everything in a save: what the player is wearing, and every
//outfit they have saved. Idempotent, so it is safe to call on every load without tracking a
//version number, and it is where the image path rewrite table gets applied to old saves.
//True for clothing data written before Full Control: it still names the empty sentinel
//garments, or has no genital anchor at all
function looksLegacyClothing(clothes) {
	if (!clothes || clothes.length == 0) {
		return false;
	}
	var hasAnchor = false;
	for (var checkCounter = 0; checkCounter < clothes.length; checkCounter++) {
		if (isGenitalAnchor(clothes[checkCounter])) {
			hasAnchor = true;
		}
		if (isLegacySentinel(clothes[checkCounter])) {
			return true;
		}
	}
	return hasAnchor == false;
}

function migrateSaveClothing() {
	if (!data || !data.player) {
		return;
	}
	data.player.clothes = migrateClothes(data.player.clothes, looksLegacyClothing(data.player.clothes));
	if (data.player.outfits) {
		for (var outfitCounter = 0; outfitCounter < data.player.outfits.length; outfitCounter++) {
			if (data.player.outfits[outfitCounter] && data.player.outfits[outfitCounter].clothes) {
				data.player.outfits[outfitCounter].clothes = migrateClothes(data.player.outfits[outfitCounter].clothes, looksLegacyClothing(data.player.outfits[outfitCounter].clothes));
			}
		}
	}
}

//Moves every underwear piece to sit directly above the anchor, in its existing relative order
function placeUnderwearAboveAnchor(clothes) {
	var underwear = [];
	for (var liftCounter = clothes.length - 1; liftCounter >= 0; liftCounter--) {
		if (hasTag(clothes[liftCounter], "underwear")) {
			underwear.unshift(clothes.splice(liftCounter, 1)[0]);
		}
	}
	var anchorAt = findAnchorIndex(clothes);
	if (anchorAt < 0) {
		anchorAt = clothes.length - 1;
	}
	for (var dropCounter = 0; dropCounter < underwear.length; dropCounter++) {
		clothes.splice(anchorAt + 1 + dropCounter, 0, underwear[dropCounter]);
	}
	return clothes;
}

//Drawing has to cope with clothes arrays that never went through migration: saved outfits
//being previewed, arrays handed over by mods, and the treasure preview in test.js which still
//passes raw globalClothesArray entries. Returns a fresh array with any legacy sentinels
//removed and exactly one anchor present, without altering the pieces or the caller's array.
function normalizeDrawList(clothes) {
	var normalized = [];
	var anchorFound = false;
	for (var readCounter = 0; readCounter < clothes.length; readCounter++) {
		var piece = clothes[readCounter];
		if (!piece) {
			continue;
		}
		if (isGenitalAnchor(piece)) {
			if (anchorFound == false) {
				normalized.push(piece);
				anchorFound = true;
			}
			continue;
		}
		if (isLegacySentinel(piece)) {
			if (piece.index == "Bottomless" && anchorFound == false) {
				normalized.push(makeGenitalAnchor());
				anchorFound = true;
			}
			continue;
		}
		normalized.push(piece);
	}
	if (anchorFound == false) {
		normalized.splice(defaultAnchorIndex(normalized), 0, makeGenitalAnchor());
	}
	if (fullControlEnabled() != true) {
		placeUnderwearAboveAnchor(normalized);
	}
	return normalized;
}

//Puts a garment on a clothes array and returns it. Both wearing and previewing go through
//this, so a wardrobe tile always shows exactly what equipping that garment would do.
//
//Worn pieces are unique by name, so an identical garment swaps in place rather than stacking
//up. In simple mode an exclusive category still allows only one piece, and the replacement
//inherits the old piece's position so a dragged layer order survives a change of clothes.
function applyGarment(clothes, garment) {
	var piece = JSON.parse(JSON.stringify(garment));
	if (!piece.tags) {
		piece.tags = "";
	}
	if (!piece.filter) {
		piece.filter = "";
	}
	if (piece.image) {
		piece.image = String(piece.image).replace("neo/", "player/");
	}
	var replacesCategory = (fullControlEnabled() != true && exclusiveClothingCategories.includes(piece.category));

	//Take the position of the first piece this one displaces, so layering is preserved
	var insertAt = -1;
	for (var findCounter = 0; findCounter < clothes.length; findCounter++) {
		var worn = clothes[findCounter];
		if (isGenitalAnchor(worn)) {
			continue;
		}
		if (worn.index == piece.index || (replacesCategory && worn.category == piece.category)) {
			insertAt = findCounter;
			break;
		}
	}
	for (var dropCounter = clothes.length - 1; dropCounter >= 0; dropCounter--) {
		var oldPiece = clothes[dropCounter];
		if (isGenitalAnchor(oldPiece)) {
			continue;
		}
		if (oldPiece.index == piece.index || (replacesCategory && oldPiece.category == piece.category)) {
			clothes.splice(dropCounter, 1);
		}
	}
	if (insertAt < 0) {
		if (piece.category == "lowerwear") {
			//Lowerwear takes the slot the Bottomless sentinel used to hold, directly over the
			//genitals, which is what keeps them covered in simple mode
			insertAt = findAnchorIndex(clothes) + 1;
		}
		else {
			//Everything else goes in just above the hair, where the old code spliced it
			insertAt = 0;
			while (insertAt < clothes.length && clothes[insertAt].category == "hair") {
				insertAt++;
			}
		}
	}
	if (insertAt < 0 || insertAt > clothes.length) {
		insertAt = clothes.length;
	}
	clothes.splice(insertAt, 0, piece);
	enforceClothingOrder(clothes);
	return clothes;
}

//Inventory and shopping functions
function switchItemCat(target) {
	soundEffectStart("button");

	var uniqueItemsList = "";
	var displayedItemsList = [];
	for (i = 0; i < data.items.length; i++) {
		var itemToAdd = globalItemsArray.find(item => item.index === data.items[i][0]);
		var itemQuantity = data.items[i][1]

		if (itemToAdd) {
			console.log("Adding item to list to print:")
			console.log(itemToAdd)
			if (target.includes(itemToAdd.category)) {
				itemToAdd.quantity = itemQuantity;
				displayedItemsList.push(itemToAdd);
			}
		}
		else {
			console.error("Error! Item listed to be printed, but not present in the global item array:")
			console.error(data.items[i][0])
		}
	}
	displayedItemsList.sort((a, b) => a.name.localeCompare(b.name));
	switch (target) {
		case "magazine":
		case "tarot":
		case "pocketmanz":

		break;
		default:
			
	}
	console.log("Inventory assembled. Full list of items to print:")
	console.log(displayedItemsList)

	//Create the grid for displaying items
	//This is bad
	document.getElementById('logbookRight').innerHTML = `
		<div id = "logbookGridHolder" class="gridHolder" style="width: 100%; height: auto; overflow: visible;">
			<div id="phoneSelectionMenu" class="phoneSelectionMenu" style="margin: 0px; justify-content:initial;">
			</div>
		</div>
	`;

	//Display money if on the goodies page (which includes fruit)
	if (target.includes("fruit")) {
		document.getElementById('phoneSelectionMenu').innerHTML += `
			<div class = "item">
				<p class = "itemName">Muns</p>
				<p class = "itemQuantity">x`+data.player.money+`</p>
				<img class ="itemImage" src="` + cleanupImage(`items/orb`) + `">
			</div>
		`;
	}

	//Actually print each item
	for (i = 0; i < displayedItemsList.length; i++) {
		document.getElementById('phoneSelectionMenu').innerHTML += `
			<div class = "item" onclick="useItem('`+displayedItemsList[i].name+`')">
				<p class = "itemName">`+displayedItemsList[i].name+`</p>
				<p class = "itemQuantity">x`+displayedItemsList[i].quantity+`</p>
				<img class ="itemImage" src="`+cleanupImage(displayedItemsList[i].image)+`">
			</div>
		`;
	}
}

function useItem(usedItem) {
	var itemToUse = globalItemsArray.find(item => item.name === usedItem);
	console.info(itemToUse);
	if (itemToUse) {
		if (itemToUse.category == "fruit" && (document.getElementById('digHealth') || grottoStarted == true)) {
			console.info("using healing item")
			if (document.getElementById('digHealth')) {
				digHealth += itemToUse.value*3;
				if (digHealth > maxDigHealth) {
					digHealth = maxDigHealth
				}
				console.info("digHealth: "+digHealth)
				document.getElementById('digHealth').innerHTML = digHealth;
			}
			else if (document.getElementById('digBarContainer')) {
				digHealth += itemToUse.value*3;
				if (digHealth > maxDigHealth) {
					digHealth = maxDigHealth
				}
				console.info("digHealth: "+digHealth)
				var digBarContainer = document.getElementById('digBarContainer');
				if (digBarContainer) {
					//Remove all children and clear the div
					while (digBarContainer.firstChild) {
						digBarContainer.removeChild(digBarContainer.firstChild);
					}
				}
				else {
					digBarContainer = document.createElement('div');
					digBarContainer.id = 'digBarContainer';
					digBarContainer.classList.add('digBarContainer');
					document.getElementById('output').appendChild(digBarContainer);
				}
				HTMLContainer = "digBarContainer";
				var targetLocation = grottoLocations.find(location => location.index === grottoPosition);
				writeBar("player", targetLocation.name, digHealth, maxDigHealth)
				HTMLContainer = "output";
			}
			else {
				return
			}

			soundEffectStart("talk");
			var flavorTextZone = document.getElementById('flavorTextZone');
			if (flavorTextZone) {
				//Remove all children and clear the div
				while (flavorTextZone.firstChild) {
					flavorTextZone.removeChild(flavorTextZone.firstChild);
				}
			}
			else {
				flavorTextZone = document.createElement('div');
				flavorTextZone.id = 'flavorTextZone';
				flavorTextZone.classList.add('flavorTextZone');
				document.getElementById('output').appendChild(flavorTextZone);
			}
			HTMLContainer = "flavorTextZone";
			writeHTML(`player happy *Nom* *Nom* *Nom*<br>Yum~!`, "flavorTextZone");
			HTMLContainer = "output";
    		
			var itemToRemove = data.items.find(item => item[0] === itemToUse.index);
			//Reduce quantity of used item, if it's 0, remove it
			if (itemToRemove[1] == 1) {
				data.items.splice(data.items.indexOf(itemToRemove), 1);
			}
			else {
				itemToRemove[1]--;
			}
			switchItemCat("fruit, critter, treasure");
			if (grottoStarted == true) {
				digHealth += 1;
				grottoMove(grottoPosition);
			}
		}
		//== not = : the old assignment blanked data.player.currentScene and made this branch
		//ALWAYS win, so weird items fired their events from anywhere — Fooba mid-dig, weird
		//fruit mid-conversation. Weird items only work while idle at home or from the
		//terrarium list, and never while a dig board or grotto is active.
		else if ((data.player.currentScene == "" || data.player.currentScene == "weirdList" || data.player.currentScene == false)
			&& (data.player.location == "playerHouse" || data.player.currentScene == "weirdList")
			&& !document.getElementById('digHealth') && grottoStarted != true) {
			console.info("using weird item")
			if (itemToUse.category == "fruit" || itemToUse.category == "critter" || itemToUse.category == "treasure") {
				var itemToRemove = data.items.find(item => item[0] === itemToUse.index);
				if (itemToUse.tags == null) {
					itemToUse.tags = "";
				}
				if (itemToUse.tags.includes("weird") && checkRequirements("?weird;")) {
					deleteWindow();
					//Reduce quantity of used item, if it's 0, remove it
					if (itemToRemove[1] == 1) {
						data.items.splice(data.items.indexOf(itemToRemove), 1);
					}
					else {
						itemToRemove[1]--;
					}
					useCryptid(itemToRemove[0]);
				}
			}
		}
		else {
			writeHTML(`player worried I can't use that right now.`);
		}
	}
}

function useCryptid(cryptid) {
	switch(cryptid) {
		case "bug-lurm": {
			if (checkFlag("foxf", "lurm1") != true) {
				writeScene("system", "lurm1First");
				addFlag("foxf", "lurm1");
			}
			else {
				writeScene("system", "lurm1Repeat");
			}
			break;
		}
		case "fish-fooba": {
			if (checkFlag("foxf", "fooba1") != true) {
				writeScene("system", "fooba1First");
				addFlag("foxf", "fooba1");
			}
			else {
				writeScene("system", "fooba1Repeat");
			}
			break;
		}
		case "fruit-assple-seed": {
			if (checkFlag("player", "assple-1") != true) {
				writeScene("system", "assple-1");
			}
			else {
				writeHTML(`
					player tired Yeah, no. I'm not crazy enough to have two sets of these things in me.
					finish
				`)
			}
			break;
		}
		/*
		case "wilderness-misc-shell-male": {
			if (checkFlag("foxf", "shell-male") != true) {
				writeScene("system", "shell-male1");
				addFlag("foxf", "shell-male1");
			}
			else {
				writeScene("system", "shell-male1Repeat");
			}
			break;
		}
		case "wilderness-misc-shell-female": {
			if (checkFlag("foxf", "shell-female") != true) {
				writeScene("system", "shell-female1");
				addFlag("foxf", "shell-female1");
			}
			else {
				writeScene("system", "shell-female1Repeat");
			}
			break;
		}
		*/
	}
}

var currentCategory = "";
var shopCategories= [
	{location: "store", name: "Buy", category: ""},
	{location: "store", name: "Sell", category: "sell"},
	{location: "store", name: "Sell-All", category: "sell-all"},
	{location: "store", name: "Artifacts", category: "artifact"},
];

function filterShop(category) {
	currentCategory=category;
	wrapperBypass = 1;
	changeLocation(data.player.location);
}

function checkForShops() {
	//Print shopkeep's progress bar
	if (data.player.shopkeepSales != null) {
		if (countScenes("shopkeep")[0] == 0) {
			salesGoal = 50;
		}
		else {
			salesGoal = 100;
		}
		if (data.player.shopkeepSales >= salesGoal) {
			data.player.shopkeepSales = salesGoal;
			changeEmotion("shop", "excited")
			title = "Porn Funded!"
		}
		else {
			changeEmotion("shop", "happy")
		}
	}
	else {
		data.player.shopkeepSales = 0;
	}
	if (currentCategory == "sell" && data.player.location == "store") {
		document.getElementById('output').innerHTML += `
			<div id = "progressBar"></div>
		`;
		var title = "Porn Funds";
		if (countScenes("shopkeep")[0] == countScenes("shopkeep")[1]) {
			changeEmotion("shop", "happy")
			title = "All Available Porn Purchased!"
		}
		//console.info(salesGoal)
		writeBar("shopkeep", title, data.player.shopkeepSales, salesGoal)
	}
	//Generate the list of categories at the shop
	var categoriesToList = [];
	for (i = 0; i < shopCategories.length; i++) {
		var addCategory = true;
		if (shopCategories[i].name == "Artifacts") {
			addCategory = false;
			for (artifactCounter = 0; artifactCounter < artifactArray.length; artifactCounter++) {
				//console.info("Artifact: "+artifactArray[artifactCounter]+"Ready Flag status: "+checkFlag("player", artifactArray[artifactCounter]+"Ready"));
				if (checkFlag("player", artifactArray[artifactCounter]+"Ready") == true) {
					addCategory = true;
				}
			}
		}
		if (data.player.location == shopCategories[i].location && addCategory == true) {
			categoriesToList.push(shopCategories[i])
		}
	}
	if (categoriesToList.length == 0) {
		currentCategory = "";
	}
	else {
		if (currentCategory == "") {
			currentCategory = categoriesToList[0].category;
		}
		document.getElementById('output').innerHTML += `
			<div id = "shopGridHolder" class="gridHolder" style="width: 100%; height: 80%;">
				
			</div>
		`;
		document.getElementById('shopGridHolder').innerHTML = `
			<div id="shopSelectionMenu" class="phoneSelectionMenu shop">
			</div>
		`;
		for (i = 0; i < categoriesToList.length; i++) {
			document.getElementById('shopSelectionMenu').innerHTML += `
					<div class = "shopCategory" onClick = "filterShop('`+categoriesToList[i].category+`')">
						<p class = "shopCategoryName">`+categoriesToList[i].name+`</p>
					<div>
			`;
		}
	}
	//Selling items
	if (currentCategory == "sell-all") {
		writeText("Clicking the buttons below will sell an entire stack of items at once, collected items will still appear in the museum!")
	}
	if (currentCategory == "sell" || currentCategory == "sell-all") {
		var itemsForSale = "fruit, treasure, critter";
		var uniqueItemsListed = [];
		for (i = 0; i < data.items.length; i++) {
			var itemIdentity = globalItemsArray.find(item => item.index === data.items[i][0]);
			var itemQuantity = data.items[i][1]
			//console.log(itemIdentity)
			if (itemIdentity) {
				if (itemsForSale.includes(itemIdentity.category)) {
					var itemToPrint = {index: data.items[i][0], category: itemIdentity.category, name: itemIdentity.name, value: itemIdentity.value, filter: itemIdentity.filter, image: cleanupImage(itemIdentity.image), quantity: itemQuantity};
					uniqueItemsListed.push(itemToPrint);
					console.log(uniqueItemsListed)
				}
			}
		}
		//Sort the unique items list by name
		uniqueItemsListed.sort((a, b) => a.name.localeCompare(b.name));
		//Sort the unique items list by category
		uniqueItemsListed.sort((a, b) => a.category.localeCompare(b.category));
		if (currentCategory == "sell-all") {
			onclickEffect = "sellAllItem";
		}
		else {
			onclickEffect = "sellItem";
		}
		for (i = 0; i < uniqueItemsListed.length; i++) {
			document.getElementById('output').innerHTML += `
				<div class = "shopItem" id="shopItem(`+i+`)" onclick = "`+onclickEffect+`('`+uniqueItemsListed[i].index+`')">
					<p class = "shopName">`+uniqueItemsListed[i].name+` <span id="shopItem(`+i+`)Quantity">x`+uniqueItemsListed[i].quantity+`</span></p>
					<p class = "shopPrice">$`+uniqueItemsListed[i].value+`</p>
					<img class ="shopImage" style="`+uniqueItemsListed[i].filter+`" src="`+uniqueItemsListed[i].image+`">
				</div>
				<br>
			`;
		}
	}
	else {
		//Make a list of printed items to avoid duplicates
		var uniqueItemsList = [];
		//Generate the list of items for sale, filtered by the current category
		for (i = 0; i < globalShopArray.length; i++) {
			//Check if the item is already in the unique items list
			if (uniqueItemsList.includes(globalShopArray[i]) == false) {
				var sellItem = true;
				if (globalShopArray[i].index == "shopDonate") {
					if (countScenes("shopkeep")[0] == countScenes("shopkeep")[1]) {
						sellItem = false;
					}
					else {
						globalShopArray[i].price = salesGoal - data.player.shopkeepSales;
						globalShopArray[i].image = cleanupImage("items/orb");
					}
				}
				if (checkRequirements(globalShopArray[i].requirements) == true && globalShopArray[i].collected == false && sellItem == true) {
					if (currentCategory.includes(globalShopArray[i].category) || currentCategory == "") {
						var itemPricePrefix = "$";
						var itemPriceSuffix = "";
						var itemTarget = globalItemsArray.find(item => item.index === globalShopArray[i].index);
						//Garments live in globalClothesArray, not globalItemsArray, so clothing sold
						//in a shop has no item entry to borrow its name and image from. Without this
						//fallback the sale's image stays undefined and cleanupImage throws.
						if (!itemTarget) {
							itemTarget = globalClothesArray.find(item => item.index === globalShopArray[i].index);
						}
						//Mod-editor sales store their price under "value" (the engine reads "price"),
						//and mods exported before the loader fix never got their item defaults filled
						//in — patch both here so those sales display and sell instead of "undefined".
						if (globalShopArray[i].price == null && globalShopArray[i].value != null && globalShopArray[i].value !== "") {
							if (globalShopArray[i].event == true || globalShopArray[i].value != 0) {
								globalShopArray[i].price = globalShopArray[i].value;
							}
						}
						if (itemTarget) {
							console.log("Item to display for sale found:")
							console.log(itemTarget)
							globalShopArray[i].category = itemTarget.category;
							if (itemTarget.image && !globalShopArray[i].image) {
								globalShopArray[i].image = itemTarget.image;

							}
							if (globalShopArray[i].name == null || globalShopArray[i].name === "") {
								globalShopArray[i].name = itemTarget.name;
							}
							if ((globalShopArray[i].desc == null || globalShopArray[i].desc === "") && itemTarget.desc != null) {
								globalShopArray[i].desc = itemTarget.desc;
							}
							if (globalShopArray[i].price == null) {
								globalShopArray[i].price = itemTarget.value*2;
							}
						}

						var finalImage = cleanupImage(globalShopArray[i].image);
						if (globalShopArray[i].filter) {
							var finalFilter = globalShopArray[i].filter+";";
						}
						else {
							var finalFilter = "";
						}

						if (globalShopArray[i].category == "upperwear" || globalShopArray[i].category == "lowerwear" || globalShopArray[i].category == "footwear" || globalShopArray[i].category == "accessory") {
							if (globalShopArray[i].image.includes("-masc")) {
								if (data.player.gender == "fem") {
									finalImage = finalImage.replace("-masc", "-fem");
								}
							}
							if (globalShopArray[i].image.includes("-penis")) {
								if (data.player.genitals == "pussy") {
									finalImage = finalImage.replace("-penis", "-pussy");
								}
							}
						}
						var offset = "height:initial;";
						switch (globalShopArray[i].category) {
							case "costume":
								offset += "bottom:20%;"
							break;
							case "upperwear":
								offset += "bottom:30%;"
							break;
							case "lowerwear":
								offset += "bottom:50%;"
							break;
							case "footwear":
								offset += "bottom:120%;"
							break;
							case "tarot":
								offset += "bottom:20%;right:3%;"
							break;
							case "pocketmanz":
								offset = ""
							break;
						}
						switch (globalShopArray[i].index) {
							case "Thighhighs":
								offset += "bottom:120%;"
							break;
						}
						if (globalShopArray[i].index == "jiggyChest") {
							if (data.player.money > 100) {
								globalShopArray[i].price = data.player.money / 10;
								//Ensure whole numbers
								globalShopArray[i].price = Math.floor(globalShopArray[i].price);
							}
							else {
								globalShopArray[i].price = 10;
							}
						}
						if (globalShopArray[i].index == "jiggyTrove") {
							if (data.player.money > 1000) {
								globalShopArray[i].price = data.player.money / 3;
								//Ensure whole numbers
								globalShopArray[i].price = Math.floor(globalShopArray[i].price);
							}
							else {
								globalShopArray[i].price = 100;
							}
						}
						if (!digHealth) {
							digHealth = 1;
						}
						if (globalShopArray[i].category == "sphinx") {
							//Sphinx prices get rewritten on every shop render, so stash the
							//listed price the first time through and always derive from it
							if (globalShopArray[i].basePrice == null) {
								globalShopArray[i].basePrice = globalShopArray[i].price;
							}
							if (digHealth > 1 && getLegalSphinxScenes().length > 0) {
								//Scenes remain and the player has spare hearts: she charges those instead
								globalShopArray[i].price = digHealth-1;
								itemPricePrefix = "";
								itemPriceSuffix = "-❤︎";
							}
							else if (globalShopArray[i].basePrice > 100) {
								//Big-ticket items scale with the player's wealth
								if (data.player.money > 600) {
									globalShopArray[i].price = Math.floor(data.player.money / 3);
								}
								else {
									globalShopArray[i].price = 200;
								}
							}
							else {
								//Fixed-price items (like the candy box) just cost their listed price
								globalShopArray[i].price = globalShopArray[i].basePrice;
							}
						}

						document.getElementById('output').innerHTML += `
							<div class = "shopItem" id="shopItem(`+i+`)" onclick = "buyItem(`+i+`)">
								<p class = "shopName">`+globalShopArray[i].name+`</p>
								<p class = "shopDesc">`+globalShopArray[i].desc+`</p>
								<p class = "shopPrice">`+itemPricePrefix+globalShopArray[i].price+itemPriceSuffix+`</p>
								<div class ="shopImage" style="overflow:hidden;">
									<img class ="shopImage" style="position:relative;border:none;border-radius:0px;margin-right:-5px;`+finalFilter+offset+`" src="`+finalImage+`">
								</div>
							</div>
							<br>
						`;
					}
				}
			}
		}
	}
}

//Sphinx scenes the player hasn't unlocked yet, from both her events and the player's
function getLegalSphinxScenes() {
	var legalSphinxScenes = [];
	for (let eventCharacterIndex = 0; eventCharacterIndex < globalEventArray.length; eventCharacterIndex++) {
		if (globalEventArray[eventCharacterIndex].index == "sphinx" || globalEventArray[eventCharacterIndex].index == "player") {
			for (let eventSceneIndex = 0; eventSceneIndex < globalEventArray[eventCharacterIndex].events.length; eventSceneIndex++) {
				if (checkFlag("player", globalEventArray[eventCharacterIndex].events[eventSceneIndex].index) != true && globalEventArray[eventCharacterIndex].events[eventSceneIndex].name.includes("Sphinx") == true) {
					legalSphinxScenes.push(globalEventArray[eventCharacterIndex].events[eventSceneIndex].index);
				}
			}
		}
	}
	return legalSphinxScenes;
}

function buyItem(index) {
	if (!digHealth) {
		digHealth = 1;
	}
	if (globalShopArray[index].category == "sphinx" && digHealth > 1) {
		var legalSphinxScenes = getLegalSphinxScenes();
		console.debug(legalSphinxScenes);
		if (legalSphinxScenes.length > 0) {
			writeScene("system", legalSphinxScenes[0]);
			writeHTML(`func writeScene('shopkeep', '`+globalShopArray[index].index+`'); Continue`);
		}
		else {
			purchaseItem(index);
		}
	}
	else {
		purchaseItem(index);
	}
}

function purchaseItem(index) {
	if (data.player.money >= globalShopArray[index].price || checkFlag("player", "money")) {
		globalShopArray[index].collected = true;
		if (globalShopArray[index].unique == true) {
			data.player.collected+=globalShopArray[index].key
		}
		if (checkFlag("player", "money") != true) {
			data.player.money -= globalShopArray[index].price;
		}
		flashMoney();

		if (globalShopArray[index].event == true) {
			writeScene(globalShopArray[index].character, globalShopArray[index].index);
		}
		else {
			wrapperBypass = 1;
			changeLocation(data.player.location);
			addItem(globalShopArray[index].index);
			soundEffectStart("purchase");
		}
	}
	else {
		writeSpecial(`<span style="color:red;">You can't afford that!</span>`)
	}
}

function refreshShops() {
	for (i = 0; i < globalShopArray.length; i++) {
		if (globalShopArray[i].collected == true && globalShopArray[i].unique != true) {
			globalShopArray[i].collected = false;
		}
	}
}

function flashMoney() {
	flashy();
	setTimeout(flashy, 1000);
}

function flashy() {
	var moneyEls = document.querySelectorAll('.playerMoney');
	var newColor = (moneyEls[0] && moneyEls[0].style.color == 'red') ? 'white' : 'red';
	moneyEls.forEach(el => el.style.color = newColor);
}

function checkItem(n) {
	//Exact-match against the recursively expanded inventory (defined in index.js),
	//so items condensed into superitems, or supers of superitems, still count
	return expandedOwnedItems().has(n);
}

function getItemName(index) {
	var itemToAdd = globalItemsArray.find(item => item.index === index);
	if (itemToAdd) {
		return itemToAdd.name;
	}
	else {
		console.error("Item " + index + " not found");
		return "";
	}
}

function addItem(index, hidden) {
	console.log("Adding item " + index);
	if (hidden) {
		var itemToAdd = globalItemsArray.find(item => item.index === index);
		if (!itemToAdd) {
			writeText("BEEP BOOP: Item " + index + " not found");
			return;
		}
		if (itemToAdd.category == "treasure" || itemToAdd.category == "fruit" || itemToAdd.category == "critter") {
			addFlag("player", index);
		}
		data.items.push(index);
	}
	else {
		var itemToAdd = globalItemsArray.find(item => item.index === index);
		if (!itemToAdd) {
			writeText("BEEP BOOP: Item " + index + " not found");
			return;
		}
		if (itemToAdd.category == "treasure" || itemToAdd.category == "fruit" || itemToAdd.category == "critter") {
			addFlag("player", index);
		}
		if (itemToAdd) {
			data.items.push(index);
			switch (itemToAdd.category) {
				case "tarot":
					writeSpecial("New tarot card obtained:")
					document.getElementById('output').innerHTML += `
						<img class="bigPicture" id = "` + cleanupImage(itemToAdd.image) + `" src="` + cleanupImage(itemToAdd.image) + `" onclick="scrapbookSave('`+cleanupImage(itemToAdd.image)+`', '`+cleanupImage(itemToAdd.image)+`')">
						<br>
					`;
					break;
				case "pogs":
					writeSpecial("New coin obtained:")
					var finalFrontColor = "red";
					var finalBackColor = "blue";
					for (characterCounter = 0; characterCounter < coreCharactersArray.length; characterCounter++) {
						if (itemToAdd.index.includes(coreCharactersArray[characterCounter].index) == true) {
							var finalFrontColor = coreCharactersArray[characterCounter].color;
							var finalBackColor = coreCharactersArray[characterCounter].color;
						}
					}
					var faceSize = coinSize*0.75;
					var faceOffset = coinSize*0.125;
					document.getElementById('output').innerHTML += `
						<div style="position:relative; height: `+coinSize+`px;transform: rotateY(0deg); width: `+coinSize+`px;margin:auto;">
							<div style="transition: transform 1s; transform-style: preserve-3d;margin-auto;">
								<div style="width: 100%; height: 100%; backface-visibility: hidden;">
									<div style = "position: absolute; background: `+finalFrontColor+`;clip-path:circle(48%);width: `+coinSize+`px; height: `+coinSize+`px; ">
										<img class="bigPicture" src="` + cleanupImage(itemToAdd.image) + `"
										style="filter:brightness(100%); border: none; max-width: none; width: `+faceSize+`px; height: `+faceSize+`px; top:`+faceOffset+`px; left:`+faceOffset+`px; position: absolute; clip-path: circle(50%); max-height:none;">
										<img class="bigPicture" src="`+cleanupImage("pogs/pogFront")+`"
										style="filter:brightness(100%); border: none; max-width: none; width: `+coinSize+`px; height: `+coinSize+`px; position: absolute; clip-path: circle(48.5%); max-height:none;">
									</div>
								</div>
							</div>
						</div>
						
					`;
					break;
				case "pocketmanz":
					writeSpecial("New bootleg pocketmanz card obtained:")
					for (collectableIndex = 0; collectableIndex < globalCollectablesArray.length; collectableIndex++) {
						if (itemToAdd.index.includes(globalCollectablesArray[collectableIndex].index) == true) {
							var finalColor = globalCollectablesArray[collectableIndex].color;
							if (globalCollectablesArray[collectableIndex].frame) {
								var finalRarity = globalCollectablesArray[collectableIndex].frame;
							}
							else {
								globalCollectablesArray[collectableIndex].frame = "common";
								var finalRarity = globalCollectablesArray[collectableIndex].frame;
							}
							if (finalRarity.includes("rare")) {
								var rarityBonus = `
									<img class="bigPicture shimmer" src="`+cleanupImage("pocketmanz/foilDotOuterBack")+`"
									
									style="opacity: 30%;width: 100%; height: 100%;max-height:none; max-width:none; cursor: pointer;position:absolute;border:none;border-radius:5%;">
									<img class="bigPicture" src="` + cleanupImage("pocketmanz/foilDotOuterFront") + `"
									
									style="width: 100%; height: 100%;max-height:none; max-width:none; cursor: pointer;position:absolute;border:none;border-radius:5%;">
								`;
							}
							else {
								var rarityBonus = "";
							}
						}
					}
					var size = window.matchMedia('(orientation: portrait)').matches ? "width: 90vw;" : "height: 70vh;";
					if (finalRarity.includes("vertical")) {
						document.getElementById('output').innerHTML += `
							<div
							style="background:`+finalColor+`;filter:brightness(100%);position:relative;`+size+`aspect-ratio:1/1.25;border-radius:15px;text-align:center;margin:auto;margin-bottom:2%;">
								`+rarityBonus+`
								<img class="bigPicture" src="` + cleanupImage(itemToAdd.image) + `"
								style="aspect-ratio:2/3;width: 70%; top: 11.5%; left: 15%;max-height:none; position:absolute;border:none;border-radius:initial;">
								<img class="bigPicture" src="` + cleanupImage("pocketmanz/frame-vertical") + `"
								style="width: 100%; max-width:none; max-height:none; position:absolute;border:none;border-radius:initial;">
								<p style="
									position:inherit;
									font-family: simple summer;
									color:#FFD800;
									font-size:var(--fs-huge, 3rem);
									text-shadow: 4px 4px black;
									top:7%;
								">`+itemToAdd.name+`</p>
							</div>
						`;
					}
					else {
						document.getElementById('output').innerHTML += `
							<div
							style="background:`+finalColor+`;filter:brightness(100%);position:relative;`+size+`aspect-ratio:1/1.25;border-radius:15px;text-align:center;margin:auto;margin-bottom:2%;">
								`+rarityBonus+`
								<img class="bigPicture" src="` + cleanupImage(itemToAdd.image) + `"
								style="width: 78%; top: 11.5%; left: 11%;max-height:none; position:absolute;border:none;border-radius:initial;">
								<img class="bigPicture" src="` + cleanupImage("pocketmanz/frame") + `"
								style="width: 100%; max-width:none; max-height:none; position:absolute;border:none;border-radius:initial;">
								<p style="
									position:inherit;
									font-family: simple summer;
									color:#FFD800;
									font-size:var(--fs-huge, 3rem);
									text-shadow: 4px 4px black;
									top:57%;
								">`+itemToAdd.name+`</p>
							</div>
						`;
					}
					break;
				case "magazine":
					writeSpecial("New magazine obtained:")
					document.getElementById('output').innerHTML += `
						<img class="bigPicture" id = "` + cleanupImage(itemToAdd.image) + `" src="` + cleanupImage(itemToAdd.image) + `" onclick="scrapbookSave('`+cleanupImage(itemToAdd.image)+`', '`+cleanupImage(itemToAdd.image)+`')">
						<br>
					`;
					break;
				case "jiggy":
					if (!itemToAdd.set) {
						itemToAdd.set = "Misc";
					}
					writeSpecial("You got a new jiggy, "+itemToAdd.set+" - "+itemToAdd.name+", you can assemble it back home!")
					break;
				default:
					if (itemToAdd.name) {
						writeSpecial(itemToAdd.name+" obtained!")
					}
					else {
						writeSpecial(itemToAdd.index+" obtained!")
					}
					
			}
		}
	}
	inventoryCleanup();
}

function raiseMoney(n) {
	data.player.money += n;
}

function inventoryCleanup() {

	//Convert data.items from an array of strings to an array of arrays that uses the second entry as the quantity of the item
	const stackedItems = [];
	for (let i = 0; i < data.items.length; i++) {
		//Do not stack if the entry is already an array
		if (!Array.isArray(data.items[i])) {
			const currentItem = data.items[i];
			let found = false;
			for (let j = 0; j < stackedItems.length; j++) {
				const stackedItem = stackedItems[j];
				if (stackedItem[0] === currentItem) {
					stackedItem[1]++;
					found = true;
					break;
				}
			}
			if (!found) {
				stackedItems.push([currentItem, 1]);
			}
		}
		else {
			stackedItems.push([data.items[i][0], data.items[i][1]]);
		}
	}
	data.items = stackedItems;

	//Cull any empty spaces
	data.items = data.items.filter(item => item[1] > 0);

	//Cull fruitCommon, fruitRare, bugCommon, bugRare, fishCommon, and fishRare placeholder test items
	data.items = data.items.filter(item => item[0] != "fruitCommon");
	data.items = data.items.filter(item => item[0] != "fruitRare");
	data.items = data.items.filter(item => item[0] != "bugCommon");
	data.items = data.items.filter(item => item[0] != "bugRare");
	data.items = data.items.filter(item => item[0] != "fishCommon");
	data.items = data.items.filter(item => item[0] != "fishRare");

	//Fix any nesting issues caused by stacking already stacked items
	for (let i = 0; i < data.items.length; i++) {
		const currentItem = data.items[i];
		if (Array.isArray(currentItem[0])) {
			currentItem[0] = currentItem[0][0];
		}
	}
}

function sellItem(i) {
	for (x = 0; x < data.items.length; x++) {
		if (data.items[x][0] == i) {
			var itemIdentity = globalItemsArray.find(item => item.index === i);
			data.player.money += parseInt(itemIdentity.value);
			if (data.player.shopkeepSales != null) {
				data.player.shopkeepSales += itemIdentity.value;
			}
			else {
				data.player.shopkeepSales = itemIdentity.value;
			}
			removeItem(data.items[x][0])
			break;
		}
	}
	wrapperBypass = 1;
	changeLocation(data.player.location);
	soundEffectStart("sell");
	inventoryCleanup();
}

function sellAllItem(i) {
	for (x = 0; x < data.items.length; x++) {
		if (data.items[x][0] == i) {
			var itemIdentity = globalItemsArray.find(item => item.index === i);
			data.player.money += itemIdentity.value*data.items[x][1];
			if (data.player.shopkeepSales != null) {
				data.player.shopkeepSales += itemIdentity.value*data.items[x][1];
			}
			else {
				data.player.shopkeepSales = itemIdentity.value*data.items[x][1];
			}
			removeAllItem(data.items[x][0])
			break;
		}
	}
	wrapperBypass = 1;
	changeLocation(data.player.location);
	soundEffectStart("sell");
	inventoryCleanup();
}

function removeItem(n) {
	for (let i = 0; i < data.items.length; i++) {
		if (data.items[i][0] == n) {
			data.items[i][1] -= 1;
			break;
		}
	}
	inventoryCleanup();
}

function removeAllItem(n) {
	for (let i = 0; i < data.items.length; i++) {
		if (data.items[i][0] == n) {
			data.items[i][1] = 0;
			break;
		}
	}
	inventoryCleanup();
}

//Wardrobe

//Which category tab is open. Stored because the search box and the sort button have to reprint
//the grid without being told which one they are looking at.
var wardrobeFilter = "hair";
//Lowercased, so the match below does not have to case fold on every garment it tests
var wardrobeSearchText = "";
var wardrobeSortMode = "default";
//In cycle order, which is the order the sort button walks through them
const wardrobeSortModes = ["default", "az", "za", "worn"];

function wardrobeSortLabel() {
	if (wardrobeSortMode == "az") {
		return "Sort: A to Z";
	}
	if (wardrobeSortMode == "za") {
		return "Sort: Z to A";
	}
	if (wardrobeSortMode == "worn") {
		return "Sort: Worn first";
	}
	return "Sort: Default";
}

//What a search tests against. The name is the obvious half; tags come along because a player
//hunting for underwear or a covering piece is asking something the name does not answer.
function wardrobeMatchesSearch(garment) {
	if (wardrobeSearchText == "") {
		return true;
	}
	var searchable = String(garment.index);
	//A variant with its own name has to be findable by it, not only by its garment's name
	if (garment.name && garment.name != garment.index) {
		searchable += " "+String(garment.name);
	}
	if (garment.tags) {
		searchable += " "+String(garment.tags);
	}
	return searchable.toLowerCase().includes(wardrobeSearchText);
}

//Orders a list of globalClothesArray indexes in place. Default is the order the clothing list is
//written in, which keeps a set's pieces together the way they were added. Sort is stable in
//every engine this runs on, so Worn first keeps that default order inside each group.
function sortWardrobeList(indexList) {
	if (wardrobeSortMode == "az") {
		indexList.sort(function(firstIndex, secondIndex) {
			return globalClothesArray[firstIndex].index.localeCompare(globalClothesArray[secondIndex].index);
		});
	}
	else if (wardrobeSortMode == "za") {
		indexList.sort(function(firstIndex, secondIndex) {
			return globalClothesArray[secondIndex].index.localeCompare(globalClothesArray[firstIndex].index);
		});
	}
	else if (wardrobeSortMode == "worn") {
		indexList.sort(function(firstIndex, secondIndex) {
			var firstWorn = checkWearing(globalClothesArray[firstIndex].index) == true ? 1 : 0;
			var secondWorn = checkWearing(globalClothesArray[secondIndex].index) == true ? 1 : 0;
			return secondWorn - firstWorn;
		});
	}
	return indexList;
}

//The search box and the sort button. Printed once when the wardrobe opens and deliberately not
//rebuilt by printWardrobeClothes: reprinting the box mid-search would throw away the keyboard
//focus and the caret on every keystroke.
function printWardrobeSearchBar() {
	var searchBar = document.getElementById("wardrobeSearchBar");
	if (!searchBar) {
		return;
	}
	//The sort button is a fixed width because its label changes length, and a button that
	//resizes as you press it is the same complaint the value labels drew
	searchBar.innerHTML = `
		<div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:10px; width:100%; margin-bottom:5px;">
			<input type="text" id="wardrobeSearchBox" placeholder="Search clothes..." value="`+wardrobeSearchText+`"
				style="width:24ch;max-width:40vw;font-family:inherit;" oninput="wardrobeSearchEdit()">
			<p class="choiceText" style="margin:0; width:17ch;" onclick="cycleWardrobeSort()">`+wardrobeSortLabel()+`</p>
			<p class="choiceText" style="margin:0;" onclick="clearWardrobeSearch()">Clear</p>
		</div>
	`;
}

function wardrobeSearchEdit() {
	var searchBox = document.getElementById("wardrobeSearchBox");
	if (!searchBox) {
		return;
	}
	wardrobeSearchText = String(searchBox.value).toLowerCase().trim();
	printWardrobeClothes(wardrobeFilter);
}

function clearWardrobeSearch() {
	wardrobeSearchText = "";
	wardrobeSortMode = "default";
	printWardrobeSearchBar();
	printWardrobeClothes(wardrobeFilter);
}

function cycleWardrobeSort() {
	var modeAt = wardrobeSortModes.indexOf(wardrobeSortMode);
	wardrobeSortMode = wardrobeSortModes[(modeAt + 1) % wardrobeSortModes.length];
	//Redrawing the bar retypes the search box from wardrobeSearchText, so the text survives.
	//Focus does not, but the player just clicked away from the box to press this.
	printWardrobeSearchBar();
	printWardrobeClothes(wardrobeFilter);
}

function printWardrobe(filter) {
	document.getElementById('output').innerHTML = ``;
	if (!filter) {
		filter = "hair";
	}
	//A search left over from last visit would look like half the wardrobe had gone missing
	wardrobeSearchText = "";
	wardrobeSortMode = "default";
	printWardrobeFilters()
	printWardrobeClothes(filter);
}

function printWardrobeFilters() {
	writeHTML(`button Back; changeLocation('playerHouse')`)
	if (window.matchMedia('(orientation: portrait)').matches) {
		document.getElementById('output').innerHTML += `
			<div id = "wardrobeFilterHolder" class="gridHolder" style="width: 100%; height: 80%; margin-bottom:40px;">
				<div id="wardrobeFilterMenu" class="phoneSelectionMenu" style="margin: 0px; justify-content:initial; grid-template-columns: repeat(4, 1fr);">
					<div class = "shopCategory" onClick = "printWardrobeClothes('hair')">
						<p class = "shopCategoryName">Hairstyles</p>
					</div>
					<div class = "shopCategory" onClick = "printWardrobeClothes('upperwear')">
						<p class = "shopCategoryName">Upperwear</p>
					</div>
					<div class = "shopCategory" onClick = "printWardrobeClothes('lowerwear')">
						<p class = "shopCategoryName">Lowerwear</p>
					</div>
					<div class = "shopCategory" onClick = "printWardrobeClothes('footwear')">
						<p class = "shopCategoryName">Footwear</p>
					</div>
					<div class = "shopCategory" onClick = "printWardrobeClothes('accessory')">
						<p class = "shopCategoryName">Accessories</p>
					</div>
					<div class = "shopCategory" onClick = "printWardrobeShuffle()">
						<p class = "shopCategoryName">Layers</p>
					</div>
					<div class = "shopCategory" onClick = "printWardrobeCustomize()">
						<p class = "shopCategoryName">Customize</p>
					</div>
					<div class = "shopCategory" onClick = "printWardrobeOutfits()">
						<p class = "shopCategoryName">Outfits</p>
				</div>
			</div>
		`;
	}
	else {
		document.getElementById('output').innerHTML += `
			<div id = "wardrobeFilterHolder" class="gridHolder" style="width: 100%; height: 80%; margin-bottom:40px;">
				<div id="wardrobeFilterMenu" class="phoneSelectionMenu" style="margin: 0px; justify-content:initial; grid-template-columns: repeat(4, 1fr);">
					<div class = "shopCategory" onClick = "printWardrobeClothes('hair')">
						<p class = "shopCategoryName">Hairstyles</p>
					</div>
					<div class = "shopCategory" onClick = "printWardrobeClothes('upperwear')">
						<p class = "shopCategoryName">Upperwear</p>
					</div>
					<div class = "shopCategory" onClick = "printWardrobeClothes('lowerwear')">
						<p class = "shopCategoryName">Lowerwear</p>
					</div>
					<div class = "shopCategory" onClick = "printWardrobeClothes('footwear')">
						<p class = "shopCategoryName">Footwear</p>
					</div>
					<div class = "shopCategory" onClick = "printWardrobeClothes('accessory')">
						<p class = "shopCategoryName">Accessories</p>
					</div>
					<div class = "shopCategory" onClick = "printWardrobeShuffle()">
						<p class = "shopCategoryName">Layers</p>
					</div>
					<div class = "shopCategory" onClick = "printWardrobeCustomize()">
						<p class = "shopCategoryName">Customize</p>
					</div>
					<div class = "shopCategory" onClick = "printWardrobeOutfits()">
						<p class = "shopCategoryName">Outfits</p>
					</div>
				</div>
			</div>
		`;
	}
	//Portrait fills the width with exactly three columns instead of packing fixed width boxes
	//in and leaving a gap down the right, so the boxes come out as large as three across allows
	if (window.matchMedia('(orientation: portrait)').matches) {
		var gridColumns = "repeat(var(--wardrobe-clothes-cols, 3), 1fr)";
	}
	else {
		var gridColumns = "repeat(auto-fill, 270px)";
	}
	//Search and sort sit above the portrait and outside everything printWardrobeClothes rebuilds,
	//so typing in the box does not destroy the box
	document.getElementById('output').innerHTML += `<div id="wardrobeSearchBar" style="width:100%;"></div>`;
	printWardrobeSearchBar();
	//Holds the player portrait and the strip button. Filled by printWardrobeClothes, because
	//the category buttons call that directly without coming back through here.
	document.getElementById('output').innerHTML += `<div id="wardrobeTopBar" style="width:100%;"></div>`;
	document.getElementById('output').innerHTML += `
		<div id = "wardrobeGridHolder" class="gridHolder" style="width: 100%; height: 80%;">
			<div id="wardrobeSelectionMenu" class="phoneSelectionMenu" style="margin: 0px; justify-content:initial; grid-template-columns: `+gridColumns+`;">
			</div>
			<p id = "variantText" class = "centeredText">Variants:</p>
			<div id="filterSelectionMenu" class="phoneSelectionMenu" style="margin: 0px; justify-content:initial; grid-template-columns: `+gridColumns+`;">
			</div>
		</div>
	`;
}

//The geometry of one clothing box. Portrait lets the grid column decide the width and takes
//the height from the aspect ratio, so three boxes fill the screen exactly; border-box keeps
//the border inside that width instead of pushing the third box onto the next row.
function wardrobeBoxStyle() {
	if (window.matchMedia('(orientation: portrait)').matches) {
		return "overflow:hidden;aspect-ratio:1/2;position:relative;background: #000;width: 100%;box-sizing: border-box;";
	}
	return "overflow:hidden;aspect-ratio:1/2;position:relative;background: #000;height: 100%;box-sizing: border-box;";
}

//Worn and unworn boxes. A recoloured border alone was not enough to pick worn clothes out of a
//full grid, so worn boxes also get an inner ring, an outer glow and rounded corners, while
//unworn ones are dimmed slightly. None of those affect layout: outline and box-shadow are
//drawn outside the box model entirely, and border-radius only changes the shape. That is the
//way to make the border look thicker without any of the boxes moving.
function wardrobeBoxClass(isWorn) {
	if (isWorn == true) {
		return "wardrobeBoxWorn";
	}
	return "wardrobeBox";
}

//The layer, customize and outfit menus all take over the wardrobe area, so they clear the top
//bar too rather than leaving a stale portrait and strip button floating above them. The search
//bar is hidden rather than emptied, because it holds the only copy of what is in the box and
//printWardrobeClothes expects to find it still there when a category tab is picked again.
function clearWardrobeTopBar() {
	if (document.getElementById("wardrobeTopBar")) {
		document.getElementById("wardrobeTopBar").innerHTML = ``;
	}
	if (document.getElementById("wardrobeSearchBar")) {
		document.getElementById("wardrobeSearchBar").style.display = "none";
	}
}

//Takes off everything in one category at once. With the empty sentinel garments gone there is
//no longer a "Bald" or "Topless" box to click, so removal needs its own button.
function stripAllCategory(filter) {
	stripCategory(filter);
	updateMenu();
	printWardrobeClothes(filter);
}

//Fills the top bar for a category: the player as they currently look, and a strip button.
//The portrait is portrait-orientation only, where the boxes are too small to read an outfit
//from and there is no room beside them for a preview.
function printWardrobeTopBar(filter) {
	if (!document.getElementById("wardrobeTopBar")) {
		return;
	}
	var categoryNames = {hair: "Hairstyles", upperwear: "Upperwear", lowerwear: "Lowerwear", footwear: "Footwear", accessory: "Accessories"};
	var categoryName = categoryNames[filter];
	if (!categoryName) {
		categoryName = filter;
	}
	var topBar = `<div style="display:flex; flex-direction:column; align-items:center; width:100%; margin:0;">`;
	if (window.matchMedia('(orientation: portrait)').matches) {
		topBar += `<div id="wardrobePortrait" class="selfImage" style="height:44vh; aspect-ratio:1/2; position:relative; background:#000; border-radius:var(--radius-md); overflow:hidden; margin: 0 auto;"></div>`;
	}
	topBar += `<p class="choiceText" style="margin:4px auto;" onclick="stripAllCategory('`+filter+`')">Strip all `+categoryName+`</p>`;
	topBar += `</div>`;
	document.getElementById("wardrobeTopBar").innerHTML = topBar;
	if (document.getElementById("wardrobePortrait")) {
		document.getElementById("wardrobePortrait").innerHTML = drawPlayer("playerSelf;");
	}
}

function printWardrobeClothes(filter) {
	//Remembered so the search box and the sort button can reprint the grid without being told
	//which tab is open. Scenes call wearClothes with an empty filter, which must not clobber it.
	if (filter) {
		wardrobeFilter = filter;
	}
	printWardrobeTopBar(filter);
	if (document.getElementById("wardrobeSearchBar")) {
		document.getElementById("wardrobeSearchBar").style.display = "";
	}
	if (document.getElementById("buttonArea")) {
		document.getElementById("buttonArea").remove();
	}
	if (document.getElementById("wardrobeSelectionMenu")) {
	document.getElementById('wardrobeSelectionMenu').innerHTML = ``;
	}
	if (document.getElementById("filterSelectionMenu")) {
	document.getElementById('filterSelectionMenu').innerHTML = ``;
	}
	var variantTotal = 0;

	//Work out which garments this tab shows before drawing any of them. The old loop drew as it
	//scanned, which left nothing to reorder and no point at which a name could be tested.
	var clothesToShow = [];
	for (i = 0; i < globalClothesArray.length; i++) {
		if (globalClothesArray[i].category != filter) {
			continue;
		}
		if (globalClothesArray[i].requirements != null) {
			var listRequirements = globalClothesArray[i].requirements;
		}
		else {
			var listRequirements = "?item "+globalClothesArray[i].index+";";
		}
		//Check if the player has the item, or if the player has the easy wardrobe flag, or if the item has no filter
		//A variant is let through here whatever its unlock says, because whether it is drawn at all
		//is decided by printVariants below: a swatch only ever shows while its garment is worn,
		//and wearing the garment already means owning it.
		if (checkRequirements(listRequirements) || checkFlag("player", "outfits") || isClothingVariant(globalClothesArray[i])) {
			//Variants share their base garment's name, so one test covers both grids
			if (wardrobeMatchesSearch(globalClothesArray[i]) == true) {
				clothesToShow.push(i);
			}
		}
	}
	sortWardrobeList(clothesToShow);

	for (var showCounter = 0; showCounter < clothesToShow.length; showCounter++) {
		i = clothesToShow[showCounter];
		if (globalClothesArray[i].requirements != null) {
			var finalRequirements = globalClothesArray[i].requirements;
		}
		else {
			var finalRequirements = "?item "+globalClothesArray[i].index+";";
		}
		console.log("Testing item "+i+" with requirements "+finalRequirements)
		//Set the final image and make replacements based on the player's bodytype, genitals, and
		//skintone. Reduced to the base body first, since the replacements below only convert away
		//from the base and cannot undo a path that already names some other body.
		var finalImage = clothingBaseVariants(cleanupImage(globalClothesArray[i].image));
		if (finalImage.includes("-masc") && data.player.gender != "masc") {
			finalImage = finalImage.replace("-masc", "-"+data.player.gender)
		}
		if (finalImage.includes("-penis") && data.player.genitals != "penis") {
			finalImage = finalImage.replace("-penis", "-"+data.player.genitals)
		}
		if (finalImage.includes("-light") && data.player.skin != "light") {
			finalImage = finalImage.replace("-light", "-"+data.player.skin)
		}

		//Check if the player is already wearing the clothing item. Set basic variables assuming "no"
		var isWorn = false;
		var targetFunction = "wearClothes"
		var printVariants = false;
		for (playerClothingIndex = 0; playerClothingIndex < data.player.clothes.length; playerClothingIndex++) {
			console.log(data.player.clothes[playerClothingIndex].image)
			//Clean up the worn and new clothing images to ensure they match regardless of player details 
			var wornClothingTrueName = data.player.clothes[playerClothingIndex].image.replace("-masc", "")
			wornClothingTrueName = wornClothingTrueName.replace("-fem", "")
			wornClothingTrueName = wornClothingTrueName.replace("-light", "")
			wornClothingTrueName = wornClothingTrueName.replace("-tan", "")
			wornClothingTrueName = wornClothingTrueName.replace("-dark", "")
			wornClothingTrueName = wornClothingTrueName.replace("-penis", "")
			wornClothingTrueName = wornClothingTrueName.replace("-pussy", "")
			wornClothingTrueName = wornClothingTrueName.replace(".webp", "")
			wornClothingTrueName = wornClothingTrueName.replace("images-webp", "")
			wornClothingTrueName = wornClothingTrueName.replace(".png", "")
			wornClothingTrueName = wornClothingTrueName.replace("images-png", "")
			var newClothingTrueName = finalImage.replace("-masc", "")
			newClothingTrueName = newClothingTrueName.replace("-fem", "")
			newClothingTrueName = newClothingTrueName.replace("-light", "")
			newClothingTrueName = newClothingTrueName.replace("-tan", "")
			newClothingTrueName = newClothingTrueName.replace("-dark", "")
			newClothingTrueName = newClothingTrueName.replace("-penis", "")
			newClothingTrueName = newClothingTrueName.replace(".webp", "")
			newClothingTrueName = newClothingTrueName.replace("images-webp", "")
			newClothingTrueName = newClothingTrueName.replace(".png", "")
			newClothingTrueName = newClothingTrueName.replace("images-png", "")
			//console.info(newClothingTrueName)
			if (wornClothingTrueName == newClothingTrueName || globalClothesArray[i].index == data.player.clothes[playerClothingIndex].index) {
				//If the player is wearing the item, allow for printing of variants of the item
				printVariants = true
				//Check if the player is wearing this exact version of the item, art and colour
				//both, to brighten the border and swap the click for one that takes it off
				if (isWearingExactly(data.player.clothes[playerClothingIndex], globalClothesArray[i]) && data.player.clothes[playerClothingIndex].category == filter) {
					isWorn = true;
					targetFunction = "emptyClothes"
				}
			}
		}
		//Check if the player is missing the item to print variants
		if (checkItem("clothingDye") != true && checkFlag("player", "outfits") != true) {
			printVariants = false;
		}
		//console.log("Test for item "+i+" printvariants "+printVariants)
		var targetElement = "wardrobeSelectionMenu";

		//Code for printing clothes to the screen
		if (printVariants == true || isClothingVariant(globalClothesArray[i]) != true) {
			//If the clothing article is a variant, ensure it's printed to the bottom level
			if (isClothingVariant(globalClothesArray[i])) {
				targetElement = "filterSelectionMenu"
				variantTotal += 1;
			}
			if (printVariants == true && isClothingVariant(globalClothesArray[i]) != true) {
				isWorn = true;
				targetFunction = "emptyClothes"
			}

			/*New full body code*/
			//Print the basic body framework and expression
			if (document.getElementById("filterSelectionMenu")) {
				document.getElementById(targetElement).innerHTML += `<div id="wardrobe-`+i+`-Item" class = "selfImage `+wardrobeBoxClass(isWorn)+`" style="`+wardrobeBoxStyle()+`"onclick="`+targetFunction+`(`+i+`,'`+filter+`')"></div>`;
				//No forcing of the genitals on for skirts any more. The box has to show exactly
				//what putting the garment on would give, or a piece previews one way and wears
				//another, which with several lowerwear pieces at once looked like clipping.
				var special = "";
				document.getElementById(`wardrobe-`+i+`-Item`).innerHTML = drawPlayer("playerSelf;clothes:"+i+";"+special)
				//Accessories have always needed a name to be identifiable. Once several pieces
				//per category can be worn at once, every box needs one for the same reason.
				if (globalClothesArray[i].category == "accessory" || fullControlEnabled() == true) {
					document.getElementById(`wardrobe-`+i+`-Item`).innerHTML+= `<span class="wardrobeLabel">`+clothingDisplayName(globalClothesArray[i])+`</span>`;
				}
			}
		}
	}
	//An empty grid after a search reads as a bug rather than a result, so say what happened
	if (clothesToShow.length == 0 && wardrobeSearchText != "" && document.getElementById("wardrobeSelectionMenu")) {
		document.getElementById("wardrobeSelectionMenu").innerHTML = `<p class="centeredText" style="grid-column: 1 / -1;">Nothing here matches "`+wardrobeSearchText+`".</p>`;
	}
	if (variantTotal == 0) {
		if (document.getElementById("variantText")) {
		document.getElementById("variantText").innerHTML = "";
		}
	}
	else {
		if (document.getElementById("variantText")) {
		document.getElementById("variantText").innerHTML = "Variants:";
		}
	}
}

function wearClothesByName(name) {
	//Take the first match rather than the last, and use a real not-found value. The old version
	//kept overwriting its target as it scanned, and tested it with a plain truthiness check that
	//silently failed for whatever sat at index 0.
	var clothesTarget = -1;
	for (var searchCounter = 0; searchCounter < globalClothesArray.length; searchCounter++) {
		if (globalClothesArray[searchCounter].index == name && clothesTarget < 0) {
			clothesTarget = searchCounter;
		}
	}
	if (clothesTarget >= 0) {
		wearClothes(clothesTarget, "");
	}
}

//Removes every worn piece with this name. Used by scenes that take a specific garment off.
function removeClothesByName(name) {
	for (var removeCounter = data.player.clothes.length - 1; removeCounter >= 0; removeCounter--) {
		if (isGenitalAnchor(data.player.clothes[removeCounter])) {
			continue;
		}
		if (data.player.clothes[removeCounter].index == name) {
			data.player.clothes.splice(removeCounter, 1);
		}
	}
	enforceClothingOrder(data.player.clothes);
	updateMenu();
}

function checkWearing(name) {
	for (var wearingCounter = 0; wearingCounter < data.player.clothes.length; wearingCounter++) {
		if (data.player.clothes[wearingCounter].index == name) {
			return true;
		}
	}
	return false;
}

function wearClothes(index, filter) {
	if (!globalClothesArray[index]) {
		return;
	}
	applyGarment(data.player.clothes, globalClothesArray[index]);
	updateMenu();
	printWardrobeClothes(filter)
}

//Takes off every worn piece sharing this garments name, whatever category it belongs to.
//This replaces the old trick of wearing an empty sentinel garment over the top of it.
function emptyClothes(index, filter) {
	if (!globalClothesArray[index]) {
		return;
	}
	var targetName = globalClothesArray[index].index;
	for (var removeCounter = data.player.clothes.length - 1; removeCounter >= 0; removeCounter--) {
		if (isGenitalAnchor(data.player.clothes[removeCounter])) {
			continue;
		}
		if (data.player.clothes[removeCounter].index == targetName) {
			data.player.clothes.splice(removeCounter, 1);
		}
	}
	enforceClothingOrder(data.player.clothes);
	updateMenu();
	printWardrobeClothes(filter)
}

function printWardrobeShuffle() {
	if (document.getElementById("buttonArea")) {
		document.getElementById("buttonArea").remove();
	}
	clearWardrobeTopBar();
	document.getElementById('wardrobeSelectionMenu').innerHTML = ``;
	document.getElementById('filterSelectionMenu').innerHTML = ``;
	//The genitals stop being welded to the lowerwear once Full Control is on, so the explanation
	//of what a layer even is has to change with the mode
	if (fullControlEnabled() == true) {
		document.getElementById("variantText").innerHTML = "If clothes are overlapping improperly, drag them up and down here to rearrange them!<br>Pieces at the bottom of the list sit over the pieces above them.<br>Drag the Genitals row to choose what your genitals are drawn over and under.";
	}
	else {
		document.getElementById("variantText").innerHTML = "If clothes are overlapping improperly, drag them up and down here to rearrange them!<br>Pieces at the bottom of the list sit over the pieces above them.<br>Genitals, underwear, and lowerwear, are all treated as the same layer.";
	}
	document.getElementById('output').innerHTML += `<div id="buttonArea" style="display:flex;"></div>`;
	//Print the basic body framework and expression
	document.getElementById("buttonArea").innerHTML += `<div id="wardrobe-Item" class = "selfImage" style="border-radius:25px;aspect-ratio:1/2;position:relative;background: #000;height: 500px;"></div>`;
	document.getElementById(`wardrobe-Item`).innerHTML = drawPlayer("playerSelf;");
	
	//Print a draggable row for each rearrangeable layer, in print order: the first row is
	//drawn first (behind everything), the bottom row is drawn last and sits on top. Each row's
	//id carries the item's TRUE index in data.player.clothes, so the drop can be read straight back in
	document.getElementById(`buttonArea`).innerHTML+= `<div id="buttonList"></div>`;
	for (clothesCounter = 0; clothesCounter < data.player.clothes.length; clothesCounter++) {
		if (layerIsDraggable(clothesCounter) == true) {
			//The anchor row doubles as the show/hide control for the genitals, so it carries its
			//state in the label. Tapping it toggles, which layerDragEnd handles: the drag needs
			//preventDefault on pointerdown, and that stops the browser ever firing a click here.
			var rowLabel = layerDisplayName(data.player.clothes[clothesCounter]);
			if (isGenitalAnchor(data.player.clothes[clothesCounter])) {
				if (genitalsVisible(data.player.clothes) == true) {
					rowLabel += " (shown)";
				}
				else {
					rowLabel += " (hidden)";
				}
			}
			document.getElementById(`buttonList`).innerHTML+= `<p class="choiceText" id="layerDrag-`+clothesCounter+`" style="touch-action: none; user-select: none; -webkit-user-select: none; cursor: grab;" onpointerdown="layerDragStart(event)">&#9776; `+rowLabel+`</p>`;
		}
	}
	if (window.matchMedia('(orientation: portrait)').matches) {
		var targetElement = "buttonList";
	}
	else {
		document.getElementById(`buttonArea`).innerHTML+= `<div id="buttonList2"></div>`;
		var targetElement = "buttonList2";
	}
	if (fullControlEnabled() == true) {
		document.getElementById(targetElement).innerHTML+= `
			<p class="choiceText" style="border-bottom: 3px solid #FCEBB5;" onclick="toggleFullControl()">Full Control: ON</p>
			<p class="rawText">Wear as many pieces per category as you like, and position the genital layer yourself.</p>
		`;
	}
	else {
		document.getElementById(targetElement).innerHTML+= `
			<p class="choiceText" onclick="toggleFullControl()">Full Control: OFF</p>
			<p class="rawText">Turn on to wear more than one hairstyle, top, bottom or pair of shoes at once.</p>
		`;
	}
	if (checkItem("skinDye") == true || checkFlag("player", "outfits") == true) {
		var skinTones = ["light", "tan", "dark"];
		for (skinCounter = 0; skinCounter < skinTones.length; skinCounter++) {
			if (data.player.skin != skinTones[skinCounter]) {
				skinToneName = skinTones[skinCounter].charAt(0).toUpperCase() + skinTones[skinCounter].slice(1);
				document.getElementById(targetElement).innerHTML+= `
					<p class="choiceText" onclick="changePlayer('skin', '`+skinTones[skinCounter]+`')">Change skin tone to `+skinToneName+`</p>
				`;
			}
		}
	}
	if (checkItem("genderDye") == true || checkFlag("player", "outfits") == true) {
		var genders = ["fem", "masc"];
		for (genderCounter = 0; genderCounter < genders.length; genderCounter++) {
			if (data.player.gender != genders[genderCounter]) {
				genderName = genders[genderCounter].charAt(0).toUpperCase() + genders[genderCounter].slice(1);
				document.getElementById(targetElement).innerHTML+= `
					<p class="choiceText" onclick="changePlayer('gender', '`+genders[genderCounter]+`')">Change upper bodytype to `+genderName+`</p>
				`;
			}
		}
	}
}

function printWardrobeCustomize() {
	if (document.getElementById("buttonArea")) {
		document.getElementById("buttonArea").remove();
	}
	clearWardrobeTopBar();
	document.getElementById('wardrobeSelectionMenu').innerHTML = ``;
	document.getElementById('filterSelectionMenu').innerHTML = ``;
	document.getElementById("variantText").innerHTML = "Here you can manually edit each piece of your outfit to your liking!";
	document.getElementById('output').innerHTML += `<div id="buttonArea" style="display:flex;"></div>`;

	//Print the basic body framework and expression
	document.getElementById("buttonArea").innerHTML += `<div id="wardrobe-Item" class = "selfImage" style="border-radius:25px;aspect-ratio:1/2;position:relative;background: #000;height: 500px;"></div>`;
	document.getElementById(`wardrobe-Item`).innerHTML = drawPlayer("playerSelf;");
	
	//Establish an array of all the clothes that will need printing
	var clothesToPrint = [];

	//Go through the clothing array and add each clothing item to the clothes to print array
	for (clothesCounter = 0; clothesCounter < data.player.clothes.length; clothesCounter++) {
		if (!data.player.clothes[clothesCounter].tags) {
			data.player.clothes[clothesCounter].tags = ""
		}
		const clothesToAdd = data.player.clothes[clothesCounter]
		clothesToPrint.push(clothesToAdd)
	}

	//Finally, print the full clothes to print array. Unlike the layers menu, hair and underwear are editable here too.
	document.getElementById(`buttonArea`).innerHTML+= `<div id="buttonList"></div>`;
	for (clothesCounter = 0; clothesCounter < clothesToPrint.length; clothesCounter++) {
		//The anchor has no art of its own, so there is nothing here to recolour or resize
		if (isGenitalAnchor(clothesToPrint[clothesCounter])) {
			continue;
		}
		document.getElementById(`buttonList`).innerHTML+= `<p class="choiceText" onclick="layerCustomize(`+clothesCounter+`)">`+layerDisplayName(clothesToPrint[clothesCounter])+`</p>`;
	}
	if (window.matchMedia('(orientation: portrait)').matches) {
		var targetElement = "buttonList";
	}
	else {
		document.getElementById(`buttonArea`).innerHTML+= `<div id="buttonList2"></div>`;
		var targetElement = "buttonList2";
	}
}

//Reads one filter function's value out of a filter string and normalizes it to a number
//IE getFilterValue("filter: brightness(70%) contrast(1.2)", "brightness") returns 0.7
//Returns null if the function isn't in the string at all
function getFilterValue(filterString, filterFunction) {
	if (!filterString.includes(filterFunction+"(")) {
		return null;
	}
	var rawValue = filterString.split(filterFunction+"(")[1].split(")")[0];
	if (rawValue.includes("%")) {
		return parseFloat(rawValue) / 100;
	}
	return parseFloat(rawValue);
}

var defaultFilter = ""
var defaultTransform = {scaleX: 1, scaleY: 1, offsetX: 0, offsetY: 0};

//The eight controls in the customize panel, in print order. One definition drives the row
//markup, the live redraw and the typed-value handler, so a bar and its box can never disagree
//about their range.
//
//factor is the conversion between what the bar stores and what the player reads and types:
//saturation is a 0-3 multiplier on the bar and a percentage in the box. Every step is fine
//enough that any value the player can type lands exactly on one, so typing a number never
//snaps it to a neighbour.
const wardrobeCustomizeControls = [
	{key: "Hue", label: "Hue", unit: "deg", min: -180, max: 180, step: 1, factor: 1},
	{key: "Saturation", label: "Saturation", unit: "%", min: 0, max: 3, step: 0.01, factor: 100},
	{key: "Brightness", label: "Brightness", unit: "%", min: 0, max: 3, step: 0.01, factor: 100},
	{key: "Contrast", label: "Contrast", unit: "%", min: 0, max: 3, step: 0.01, factor: 100},
	{key: "ScaleX", label: "Width", unit: "%", min: 0.25, max: 3, step: 0.01, factor: 100},
	{key: "ScaleY", label: "Height", unit: "%", min: 0.25, max: 3, step: 0.01, factor: 100},
	{key: "OffsetX", label: "Move sideways", unit: "%", min: -50, max: 50, step: 0.1, factor: 1},
	{key: "OffsetY", label: "Move up and down", unit: "%", min: -50, max: 50, step: 0.1, factor: 1},
];

function customizeControlFor(key) {
	for (var controlCounter = 0; controlCounter < wardrobeCustomizeControls.length; controlCounter++) {
		if (wardrobeCustomizeControls[controlCounter].key == key) {
			return wardrobeCustomizeControls[controlCounter];
		}
	}
	return null;
}

//Turns a bar value into the number the player reads. Rounded to two decimals, which is finer
//than any step here and keeps 0.05 * 100 from printing as 5.000000000000001.
function customizeDisplayValue(sliderValue, factor) {
	return Math.round(sliderValue * factor * 100) / 100;
}

//One labelled row: an editable number box, then the bar under it. The box is what makes the
//small steps usable, since a player who knows the value they want no longer has to land the
//bar on it by hand. The box is a fixed width in ch and the row is sized by its column, so
//neither changes size as the digits change and the buttons below stop shuffling.
function customizeRow(control, sliderValue, clothesCounter, rowStyle, barStyle) {
	var boxValue = customizeDisplayValue(sliderValue, control.factor);
	return `
		<p class="choiceText" style="`+rowStyle+`">
			`+control.label+`: <input type="text" inputmode="decimal" id="customize`+control.key+`Number" value="`+boxValue+`"
				style="width:5ch;max-width:20vw;font-family:inherit;font-size:inherit;text-align:center;"
				onchange="customizeNumberEdit(`+clothesCounter+`, '`+control.key+`')"
				onkeydown="if (event.key == 'Enter') { this.blur(); }">`+control.unit+`<br>
			<input type="range" id="customize`+control.key+`" style="`+barStyle+`"
				min="`+control.min+`" max="`+control.max+`" step="`+control.step+`" value="`+sliderValue+`"
				oninput="filterAdjust(`+clothesCounter+`)" onchange="updateMenu()">
		</p>
	`;
}

//Geometry for the customize editor, which is the one wardrobe screen that needs a big picture:
//the piece being nudged a percent at a time is often a few dozen pixels across.
//
//Landscape gets a preview roughly four times the old height, which no longer fits on screen, so
//the page scrolls it while the control column sticks to the top of the viewport and keeps its
//own scrollbar. That way the bars stay reachable whatever part of the body is being looked at,
//without pinning the whole editor to one screenful. The preview's height is capped against the
//window width as well as its height, so a wide doll can never push the controls off the side.
//
//Portrait has neither the width for two columns nor the pixels to spare, so it keeps the small
//preview and the bars it already had.
function customizeLayout() {
	if (window.matchMedia('(orientation: portrait)').matches) {
		return {
			area: "display:flex;",
			previewPane: "",
			preview: "border-radius:25px;aspect-ratio:1/2;position:relative;background: #000;height: 50vh;",
			panel: "",
			row: "margin:15px auto;",
			bar: "min-width:10vw;max-width:60vw;"
		};
	}
	return {
		area: "display:flex; align-items:flex-start; gap:15px; width:100%;",
		previewPane: "flex:1 1 auto; min-width:0;",
		preview: "border-radius:25px;aspect-ratio:1/2;position:relative;background: #000;height:min(200vh, 110vw);margin:0 auto;",
		panel: "flex:0 0 auto; width:min(32vw, 400px); box-sizing:border-box; position:sticky; top:10px; max-height:92vh; overflow-y:auto; overflow-x:hidden;",
		//Eleven rows at the wardrobe's usual button size overflow any normal window, and a
		//column the player has to scroll to reach Confirm is worse than smaller type. Tightened
		//so the whole editor fits a 720p window; the panel keeps its scrollbar for shorter ones.
		row: "width:100%; box-sizing:border-box; margin:2px 0; padding:4px 10px; font-size:var(--fs-medium);",
		bar: "width:100%; min-width:0; max-width:100%;"
	};
}

//Applies a value the player typed into one of the boxes. Out of range values clamp rather than
//being thrown away, so the box and the piece never end up showing different numbers.
function customizeNumberEdit(clothesCounter, key) {
	var control = customizeControlFor(key);
	var numberBox = document.getElementById("customize"+key+"Number");
	var slider = document.getElementById("customize"+key);
	if (!control || !numberBox || !slider) {
		return;
	}
	//An empty or unreadable box falls back to whatever the bar already holds, rather than
	//snapping the piece to zero
	var typedValue = readOutfitNumber(numberBox.value, customizeDisplayValue(parseFloat(slider.value), control.factor));
	var sliderValue = typedValue / control.factor;
	if (sliderValue < control.min) {
		sliderValue = control.min;
	}
	if (sliderValue > control.max) {
		sliderValue = control.max;
	}
	slider.value = sliderValue;
	//Read the bar back rather than trusting the typed number, so the box shows what was applied
	numberBox.value = customizeDisplayValue(parseFloat(slider.value), control.factor);
	filterAdjust(clothesCounter);
	updateMenu();
}
function layerCustomize(clothesCounter, keepDefault) {
	//Create labeled draggable bars for Hue, Saturation, Brightness, and Contrast
	//Example input: data.player.clothes[3].filter returns "filter: hue-rotate(100deg) grayscale(100%) brightness(70%) contrast(1.2)"
	//Worn clothes can be shared references into globalClothesArray (wearClothes' replace path),
	//so detach this item first or the sliders would rewrite the master clothing list too
	data.player.clothes[clothesCounter] = JSON.parse(JSON.stringify(data.player.clothes[clothesCounter]));
	if (!data.player.clothes[clothesCounter].filter) {
		data.player.clothes[clothesCounter].filter = "";
	}
	//Remember the filter as it was when the player opened the editor, so Undo can restore it
	if (keepDefault != true) {
		defaultFilter = data.player.clothes[clothesCounter].filter;
	}

	//Find the 4 core values
	var hue = getFilterValue(data.player.clothes[clothesCounter].filter, "hue-rotate");
	var saturation = getFilterValue(data.player.clothes[clothesCounter].filter, "saturate");
	var brightness = getFilterValue(data.player.clothes[clothesCounter].filter, "brightness");
	var contrast = getFilterValue(data.player.clothes[clothesCounter].filter, "contrast");
	var grayscale = getFilterValue(data.player.clothes[clothesCounter].filter, "grayscale");
	if (hue == null) {
		hue = 0;
	}
	if (saturation == null) {
		saturation = 1;
	}
	if (brightness == null) {
		brightness = 1;
	}
	if (contrast == null) {
		contrast = 1;
	}
	//Grayscale folds into the saturation bar, since grayscale(100%) is the same filter as saturate(0)
	if (grayscale != null) {
		saturation = saturation * (1 - grayscale);
	}
	//Keep hue on the slider's -180 to 180 range, IE hue-rotate(260deg) becomes -100deg
	hue = Math.round(((hue % 360) + 540) % 360 - 180);

	//Scale and offset live in their own fields rather than inside the filter string, so the
	//colour sliders below can rebuild the filter without wiping them out
	var scaleX = readOutfitNumber(data.player.clothes[clothesCounter].scaleX, 1);
	var scaleY = readOutfitNumber(data.player.clothes[clothesCounter].scaleY, 1);
	var offsetX = readOutfitNumber(data.player.clothes[clothesCounter].offsetX, 0);
	var offsetY = readOutfitNumber(data.player.clothes[clothesCounter].offsetY, 0);
	data.player.clothes[clothesCounter].scaleX = scaleX;
	data.player.clothes[clothesCounter].scaleY = scaleY;
	data.player.clothes[clothesCounter].offsetX = offsetX;
	data.player.clothes[clothesCounter].offsetY = offsetY;
	if (keepDefault != true) {
		defaultTransform = {scaleX: scaleX, scaleY: scaleY, offsetX: offsetX, offsetY: offsetY};
	}

	//Redraw the wardrobe area with the player preview and the slider panel
	if (document.getElementById("buttonArea")) {
		document.getElementById("buttonArea").remove();
	}
	clearWardrobeTopBar();
	document.getElementById('wardrobeSelectionMenu').innerHTML = ``;
	document.getElementById('filterSelectionMenu').innerHTML = ``;
	document.getElementById("variantText").innerHTML = "Editing "+data.player.clothes[clothesCounter].index+", changes apply as you drag!<br>Tap a number to type an exact value instead.";
	var layout = customizeLayout();
	document.getElementById('output').innerHTML += `<div id="buttonArea" style="`+layout.area+`"></div>`;
	//The preview sits in its own pane so the control column beside it can be the flex item that
	//sticks, rather than the picture
	document.getElementById("buttonArea").innerHTML += `
		<div id="wardrobePreviewPane" style="`+layout.previewPane+`">
			<div id="wardrobe-Item" class = "selfImage" style="`+layout.preview+`"></div>
		</div>
	`;
	document.getElementById(`wardrobe-Item`).innerHTML = drawPlayer("playerSelf;");

	//Same buttonList id as printWardrobeCustomize, so the panel sits beside the preview
	var sliderValues = {Hue: hue, Saturation: saturation, Brightness: brightness, Contrast: contrast,
		ScaleX: scaleX, ScaleY: scaleY, OffsetX: offsetX, OffsetY: offsetY};
	var panelRows = "";
	for (var controlCounter = 0; controlCounter < wardrobeCustomizeControls.length; controlCounter++) {
		var control = wardrobeCustomizeControls[controlCounter];
		panelRows += customizeRow(control, sliderValues[control.key], clothesCounter, layout.row, layout.bar);
	}
	document.getElementById(`buttonArea`).innerHTML += `
		<div id="buttonList" style="`+layout.panel+`">
			`+panelRows+`
			<p class="choiceText" style="`+layout.row+`" onclick="printWardrobeCustomize()">Confirm</p>
			<p class="choiceText" style="`+layout.row+`" onclick="layerReset(`+clothesCounter+`)">Undo My Changes</p>
			<p class="choiceText" style="`+layout.row+`border-bottom: 3px solid red; color: red;" onclick="layerRemove(`+clothesCounter+`)">Remove Clothing</p>
		</div>
	`;
}

function filterAdjust(clothesCounter) {
	//Read every bar in one pass and mirror it back into its number box, so dragging a bar keeps
	//the typed value in step. A box the player is currently in is left alone, or their half
	//typed number would be reformatted out from under the cursor.
	var barValues = {};
	for (var controlCounter = 0; controlCounter < wardrobeCustomizeControls.length; controlCounter++) {
		var control = wardrobeCustomizeControls[controlCounter];
		var slider = document.getElementById("customize"+control.key);
		if (!slider) {
			continue;
		}
		barValues[control.key] = parseFloat(slider.value);
		var numberBox = document.getElementById("customize"+control.key+"Number");
		if (numberBox && document.activeElement != numberBox) {
			numberBox.value = customizeDisplayValue(barValues[control.key], control.factor);
		}
	}
	var hue = barValues.Hue;
	var saturation = barValues.Saturation;
	var brightness = barValues.Brightness;
	var contrast = barValues.Contrast;

	//Size and position are stored as their own numbers, not folded into the filter string,
	//so rebuilding the filter below cannot destroy them
	data.player.clothes[clothesCounter].scaleX = readOutfitNumber(barValues.ScaleX, 1);
	data.player.clothes[clothesCounter].scaleY = readOutfitNumber(barValues.ScaleY, 1);
	data.player.clothes[clothesCounter].offsetX = readOutfitNumber(barValues.OffsetX, 0);
	data.player.clothes[clothesCounter].offsetY = readOutfitNumber(barValues.OffsetY, 0);

	//Rebuild the filter, skipping any bar still at its default so untouched clothes keep an empty filter
	var newFilter = "";
	if (hue != 0) {
		newFilter += " hue-rotate("+hue+"deg)";
	}
	if (saturation != 1) {
		newFilter += " saturate("+saturation+")";
	}
	if (brightness != 1) {
		newFilter += " brightness("+brightness+")";
	}
	if (contrast != 1) {
		newFilter += " contrast("+contrast+")";
	}
	if (newFilter != "") {
		newFilter = "filter:"+newFilter;
	}
	data.player.clothes[clothesCounter].filter = newFilter;

	//Redraw the preview so the new color shows in real time
	document.getElementById(`wardrobe-Item`).innerHTML = drawPlayer("playerSelf;");
}

function layerReset(clothesCounter) {
	//Restore the colour, size and position the item had when the editor was opened
	data.player.clothes[clothesCounter].filter = defaultFilter;
	data.player.clothes[clothesCounter].scaleX = defaultTransform.scaleX;
	data.player.clothes[clothesCounter].scaleY = defaultTransform.scaleY;
	data.player.clothes[clothesCounter].offsetX = defaultTransform.offsetX;
	data.player.clothes[clothesCounter].offsetY = defaultTransform.offsetY;
	updateMenu();
	layerCustomize(clothesCounter, true);
}

function layerRemove(clothesCounter) {
	//Take this piece of clothing off entirely. Every category comes off the same way now that
	//there are no empty sentinel garments to swap back in. The anchor is not a garment and
	//cannot be removed at all.
	if (data.player.clothes[clothesCounter] && isGenitalAnchor(data.player.clothes[clothesCounter]) != true) {
		data.player.clothes.splice(clothesCounter, 1);
		enforceClothingOrder(data.player.clothes);
		updateMenu();
	}
	printWardrobeCustomize();
}

var outfitDeleteArmed = -1;
function printWardrobeOutfits() {
	//Old saves from before this feature won't have the outfits array yet
	if (!data.player.outfits) {
		data.player.outfits = [];
	}
	outfitDeleteArmed = -1;
	if (document.getElementById("buttonArea")) {
		document.getElementById("buttonArea").remove();
	}
	clearWardrobeTopBar();
	document.getElementById('wardrobeSelectionMenu').innerHTML = ``;
	document.getElementById('filterSelectionMenu').innerHTML = ``;
	document.getElementById("variantText").innerHTML = "Save your favorite outfits here, then tap one to wear it!";

	//The save button gets the first cell of the grid. overflow:hidden clips the skewed banner label like the clothing grid does.
	document.getElementById("wardrobeSelectionMenu").innerHTML += `
		<div class = "selfImage" style="border: 3px solid;overflow:hidden;aspect-ratio:1/2;position:relative;background: #000;height: 100%;" onclick="saveOutfit()">
			<p class="centeredText" style="position:absolute;top:40%;width:100%;margin:0;font-size:3em;">+</p>
			<span class="accessoryText" style="background:#000000A0">Save Outfit</span>
		</div>
	`;

	//One cell per saved outfit, previewed on the player's current body
	for (outfitCounter = 0; outfitCounter < data.player.outfits.length; outfitCounter++) {
		normalizeClothesImages(data.player.outfits[outfitCounter].clothes);
		document.getElementById("wardrobeSelectionMenu").innerHTML += `<div id="outfit-`+outfitCounter+`-Item" class = "selfImage" style="border: 3px solid;overflow:hidden;aspect-ratio:1/2;position:relative;background: #000;height: 100%;" onclick="wearOutfit(`+outfitCounter+`)"></div>`;
		document.getElementById(`outfit-`+outfitCounter+`-Item`).innerHTML = drawPlayer("playerSelf;", data.player.outfits[outfitCounter].clothes);
		document.getElementById(`outfit-`+outfitCounter+`-Item`).innerHTML += `<span class="accessoryText" id="outfitName-`+outfitCounter+`" style="background:#000000A0" onclick="renameOutfit(`+outfitCounter+`, event)">`+data.player.outfits[outfitCounter].name+`</span>`;
		document.getElementById(`outfit-`+outfitCounter+`-Item`).innerHTML += `<span id="outfitDelete-`+outfitCounter+`" style="position:absolute;top:0px;right:0px;padding:5px 10px;background:#000000A0;border-radius:0px 0px 0px 10px;cursor:pointer;" onclick="deleteOutfit(`+outfitCounter+`, event)">&#10060;</span>`;
	}

	//Premade and community showcases below the header line. Premade outfits only list once every
	//piece is unlocked; community outfits are always listed, owned pieces or not.
	var premadeToPrint = [];
	var communityToPrint = [];
	for (outfitCounter = 0; outfitCounter < playerOutfitsArray.length; outfitCounter++) {
		if (playerOutfitsArray[outfitCounter].source == "community") {
			communityToPrint.push(outfitCounter);
		}
		else if (checkOutfitUnlocked(playerOutfitsArray[outfitCounter]) == true || checkFlag("player", "outfits") == true) {
			premadeToPrint.push(outfitCounter);
		}
	}
	printOutfitSection("Premade Outfits:", premadeToPrint);
	printOutfitSection("Community Outfits:", communityToPrint);

	//Sharing tools at the very bottom, for passing outfits around without trading whole save files.
	//The export and import boxes each live in their own sub-div so filling one never reprints the other.
	document.getElementById("filterSelectionMenu").innerHTML += `
		<div id="outfitTransferArea" style="grid-column: 1 / -1;">
			<p class="choiceText" id="outfitExportButton" onclick="exportOutfit()">Export Current Outfit</p>
			<div id="outfitExportArea"></div>
			<p class="choiceText" onclick="printImportBox()">Import an Outfit</p>
			<div id="outfitImportArea"></div>
		</div>
	`;
}

//Prints one showcase section (header plus outfit cells) into the lower wardrobe grid.
//These outfits live in the code, so no rename or delete buttons here.
function printOutfitSection(sectionTitle, outfitsToPrint) {
	if (outfitsToPrint.length == 0) {
		return;
	}
	//grid-column 1/-1 makes the header span the full grid row, pushing its outfits onto the next row
	document.getElementById("filterSelectionMenu").innerHTML += `<p class="centeredText" style="grid-column: 1 / -1; margin-bottom: 0px;">`+sectionTitle+`</p>`;
	for (var sectionCounter = 0; sectionCounter < outfitsToPrint.length; sectionCounter++) {
		var outfitIndex = outfitsToPrint[sectionCounter];
		document.getElementById("filterSelectionMenu").innerHTML += `<div id="premadeOutfit-`+outfitIndex+`-Item" class = "selfImage" style="border: 3px solid;overflow:hidden;aspect-ratio:1/2;position:relative;background: #000;height: 100%;" onclick="wearPremadeOutfit(`+outfitIndex+`)"></div>`;
		document.getElementById(`premadeOutfit-`+outfitIndex+`-Item`).innerHTML = drawPlayer("playerSelf;", buildOutfitClothes(playerOutfitsArray[outfitIndex]));
		document.getElementById(`premadeOutfit-`+outfitIndex+`-Item`).innerHTML += `<span class="accessoryText" style="background:#000000A0">`+playerOutfitsArray[outfitIndex].name+`</span>`;
	}
}

//Checks that every piece a premade outfit uses is unlocked, the same way the wardrobe grid does
function checkOutfitUnlocked(outfit) {
	for (var pieceCounter = 0; pieceCounter < outfit.clothes.length; pieceCounter++) {
		//The anchor marker and the retired sentinel garments are not clothing and have nothing
		//to unlock, so they are skipped rather than failing the whole outfit as unknown
		if (outfit.clothes[pieceCounter].index == anchorMarkerName
		|| legacySentinelNames.includes(outfit.clothes[pieceCounter].index)) {
			continue;
		}
		var foundPiece = globalClothesArray.find(item => item.index == outfit.clothes[pieceCounter].index);
		if (!foundPiece) {
			return false;
		}
		if (foundPiece.requirements != null) {
			var finalRequirements = foundPiece.requirements;
		}
		else {
			var finalRequirements = "?item "+foundPiece.index+";";
		}
		if (checkRequirements(finalRequirements) != true) {
			return false;
		}
	}
	return true;
}

//Developer check, run from the browser console: `await auditClothingSources()`. Lists every garment
//whose requirements nothing in the game can satisfy, and every premade outfit that inherits the
//problem. An item counts as obtainable if it is sold in a shop, is a non-event pickup, is handed out
//by quickerClothesAdderArray or the dig pool, or appears as a literal addItem("...") anywhere in the
//loaded scripts; flags need a literal addFlag, trophies need an achievement entry. Items granted
//through a computed name (addItem(someVariable)) are invisible to it, so treat results as leads.
//Needs the game served over http, since it fetches the loaded script files to read them.
async function auditClothingSources() {
	var scriptText = "";
	var scriptFiles = performance.getEntriesByType("resource").map(entry => entry.name)
		.filter(name => name.endsWith(".js") && !name.includes("/webui/") && !name.includes("jszip") && !name.includes("image-list"));
	for (var fileIndex = 0; fileIndex < scriptFiles.length; fileIndex++) {
		scriptText += "\n" + await (await fetch(scriptFiles[fileIndex])).text();
	}
	var grantedItems = new Set();
	for (var match of scriptText.matchAll(/addItem\(\s*["'`]([^"'`]+)["'`]/g)) grantedItems.add(match[1]);
	for (var match of digTreasureArray.map(entry => entry.content).join("\n").matchAll(/addItem\(\s*["'`]([^"'`]+)["'`]/g)) grantedItems.add(match[1]);
	quickerClothesAdderArray.forEach(entry => grantedItems.add(entry.index));
	globalShopArray.forEach(entry => grantedItems.add(entry.index));
	globalPickupArray.filter(entry => entry.event != true).forEach(entry => grantedItems.add(entry.index));
	var fullName = name => { var shortcut = characterShortcuts.find(entry => entry.index == name); return shortcut ? shortcut.full : name; };
	var grantedFlags = new Set();
	for (var match of scriptText.matchAll(/addFlag\(\s*["'`](\w+)["'`]\s*,\s*["'`]([^"'`]+)["'`]/g)) grantedFlags.add(fullName(match[1]) + " " + match[2]);
	for (var match of scriptText.matchAll(/addflag (\w+); (\w+)/g)) grantedFlags.add(fullName(match[1]) + " " + match[2]);
	var trophies = new Set(globalAchievementArray.map(entry => entry.index));
	var missingFor = requirements => {
		var missing = [];
		for (var match of requirements.matchAll(/\?item ([^;]+);/g)) if (!grantedItems.has(match[1].trim())) missing.push("item " + match[1].trim());
		for (var match of requirements.matchAll(/\?flag (\w+) ([^;]+);/g)) if (!grantedFlags.has(fullName(match[1]) + " " + match[2].trim())) missing.push("flag " + match[1] + " " + match[2].trim());
		for (var match of requirements.matchAll(/\?trophy ([^;]+);/g)) if (!trophies.has(match[1].trim())) missing.push("trophy " + match[1].trim());
		return missing;
	};
	var garments = [];
	globalClothesArray.filter(piece => isClothingVariant(piece) != true).forEach(piece => {
		var missing = missingFor(piece.requirements != null ? piece.requirements : "?item " + piece.index + ";");
		if (missing.length > 0) garments.push({garment: piece.index, category: piece.category, needs: missing.join(", ")});
	});
	var outfits = [];
	playerOutfitsArray.forEach(outfit => {
		outfit.clothes.forEach(spec => {
			if (spec.index == anchorMarkerName || legacySentinelNames.includes(spec.index)) return;
			var piece = globalClothesArray.find(entry => entry.index == spec.index);
			var problem = piece ? garments.find(entry => entry.garment == spec.index) : {needs: "no garment with this name"};
			if (problem) outfits.push({outfit: outfit.name, piece: spec.index, needs: problem.needs});
		});
	});
	console.table(garments);
	console.table(outfits);
	return {garments: garments, outfits: outfits};
}

//Builds a wearable clothes array from an outfit's piece list, premade or imported
function buildOutfitClothes(outfit) {
	var newClothes = [];
	//An outfit that names the anchor marker was written after Full Control, so every piece in it
	//sits where its author put it, hair included. Older outfits list their pieces in category
	//order and still need hair pulled to the back, so only the new marker counts here: the
	//Bottomless sentinel below builds the same anchor but comes from the old format.
	var authoredLayerOrder = false;
	for (var pieceCounter = 0; pieceCounter < outfit.clothes.length; pieceCounter++) {
		var spec = outfit.clothes[pieceCounter];
		if (spec.index == anchorMarkerName) {
			authoredLayerOrder = true;
		}
		//The anchor is not a garment, so it is never looked up in the clothing list. Outfits
		//written before Full Control mark its position with the old Bottomless sentinel.
		if (spec.index == anchorMarkerName || spec.index == "Bottomless") {
			var anchorToAdd = makeGenitalAnchor();
			if (spec.invisible != undefined && spec.invisible != "") {
				anchorToAdd.invisible = (spec.invisible == true || spec.invisible == "true");
			}
			newClothes.push(anchorToAdd);
			continue;
		}
		//The other three sentinels only ever meant "nothing worn here", so they just vanish
		if (legacySentinelNames.includes(spec.index)) {
			continue;
		}
		var foundPiece = globalClothesArray.find(item => item.index == spec.index);
		if (!foundPiece) {
			continue;
		}
		var pieceToAdd = JSON.parse(JSON.stringify(foundPiece));
		if (!pieceToAdd.tags) {
			pieceToAdd.tags = "";
		}
		//A piece can override the base item's filter to recolor it
		if (spec.filter != undefined) {
			pieceToAdd.filter = spec.filter;
		}
		//A piece can also override the base item's image entirely, for alt-art variants that
		//filters can't manage. An empty image means "keep the base item's art", unlike filter.
		if (spec.image != undefined && spec.image != "") {
			pieceToAdd.image = spec.image;
		}
		//A variant's own label, when the outfit was made from one
		if (spec.name != undefined && spec.name != "") {
			pieceToAdd.name = spec.name;
		}
		//Scale and offset are per piece, and default to untouched so older outfit strings and
		//shared codes that predate Full Control still import cleanly.
		//An older spec may carry a single scale, from before it was split into two axes.
		//What "untouched" means is the garment's OWN values, not a flat 1 and 0: a piece like a
		//hat can carry an alignment of its own, and an outfit that says nothing about it must
		//leave that alone rather than dropping the hat onto the face.
		pieceToAdd.scaleX = readOutfitNumber(spec.scaleX, readOutfitNumber(spec.scale, readOutfitNumber(foundPiece.scaleX, 1)));
		pieceToAdd.scaleY = readOutfitNumber(spec.scaleY, readOutfitNumber(spec.scale, readOutfitNumber(foundPiece.scaleY, 1)));
		pieceToAdd.offsetX = readOutfitNumber(spec.offsetX, readOutfitNumber(foundPiece.offsetX, 0));
		pieceToAdd.offsetY = readOutfitNumber(spec.offsetY, readOutfitNumber(foundPiece.offsetY, 0));
		pieceToAdd.image = pieceToAdd.image.replace("neo/", "player/");
		newClothes.push(pieceToAdd);
	}
	//No backfilling of empty sentinel garments any more: a category with no piece in it simply
	//has no piece in it. migrateClothes places the anchor and lifts underwear into position.
	newClothes = migrateClothes(newClothes, authoredLayerOrder != true);
	normalizeClothesImages(newClothes);
	return newClothes;
}

//Reads a numeric outfit field, tolerating strings from imported text and missing values from
//outfit codes written before scale and offset existed
function readOutfitNumber(value, fallback) {
	if (value == undefined || value == "") {
		return fallback;
	}
	var parsed = parseFloat(value);
	if (isNaN(parsed)) {
		return fallback;
	}
	return parsed;
}

function wearPremadeOutfit(outfitIndex) {
	data.player.clothes = buildOutfitClothes(playerOutfitsArray[outfitIndex]);
	updateMenu();
	printWardrobeOutfits();
}

//Strips body suffixes and file details from a clothing image path, so two bodytype
//variants of the same art compare as equal (same pattern printWardrobeClothes uses)
function clothingTrueName(imagePath) {
	var suffixesToStrip = ["-masc", "-fem", "-light", "-tan", "-dark", "-penis", "-pussy", ".webp", ".png", "images-webp", "images-png"];
	var trueName = imagePath;
	for (var stripCounter = 0; stripCounter < suffixesToStrip.length; stripCounter++) {
		trueName = trueName.split(suffixesToStrip[stripCounter]).join("");
	}
	return trueName;
}

//Turns the player's current clothes into a text block in the exact playerOutfitsArray format,
//ready to be pasted straight into the code or shared around and imported by other players
function outfitToText() {
	var exportName = data.player.name.split('"').join("")+"'s Outfit";
	var exportText = "\t{\n";
	exportText += "\t\tname: \""+exportName+"\",\n";
	exportText += "\t\tsource: \"community\",\n";
	exportText += "\t\tclothes: [\n";
	for (var clothesCounter = 0; clothesCounter < data.player.clothes.length; clothesCounter++) {
		var wornPiece = data.player.clothes[clothesCounter];
		//The anchor carries no art, only its place in the layer order, so it exports as a bare
		//marker. Without it a shared outfit would lose where the genitals sit in the stack.
		if (isGenitalAnchor(wornPiece)) {
			exportText += "\t\t\t{index: \""+anchorMarkerName+"\"";
			//Only written once the player has actually set it, so ordinary outfits stay short
			if (wornPiece.invisible != undefined) {
				exportText += ", invisible: \""+(wornPiece.invisible == true)+"\"";
			}
			exportText += "},\n";
			continue;
		}
		var filterValue = "";
		if (wornPiece.filter) {
			filterValue = wornPiece.filter;
		}
		//Only write an image override when the worn art actually differs from the base item's,
		//ignoring body suffixes, so ordinary pieces stay portable across bodytypes
		var imageOverride = "";
		var basePiece = globalClothesArray.find(item => item.index == wornPiece.index);
		if (!basePiece || clothingTrueName(basePiece.image) != clothingTrueName(wornPiece.image)) {
			imageOverride = wornPiece.image;
		}
		exportText += "\t\t\t{index: \""+wornPiece.index+"\", filter: \""+filterValue+"\", image: \""+imageOverride+"\"";
		//A variant can be labelled as its own thing, and that label is not derivable from the
		//index, so it has to travel with a shared outfit or the piece comes back under its
		//garment's name instead
		if (wornPiece.name && wornPiece.name != wornPiece.index) {
			exportText += ", name: \""+wornPiece.name+"\"";
		}
		//Scale and offset are only written when they are not at their defaults, so ordinary
		//outfits export as the same short lines they always did
		if (readOutfitNumber(wornPiece.scaleX, 1) != 1) {
			exportText += ", scaleX: \""+readOutfitNumber(wornPiece.scaleX, 1)+"\"";
		}
		if (readOutfitNumber(wornPiece.scaleY, 1) != 1) {
			exportText += ", scaleY: \""+readOutfitNumber(wornPiece.scaleY, 1)+"\"";
		}
		if (readOutfitNumber(wornPiece.offsetX, 0) != 0) {
			exportText += ", offsetX: \""+readOutfitNumber(wornPiece.offsetX, 0)+"\"";
		}
		if (readOutfitNumber(wornPiece.offsetY, 0) != 0) {
			exportText += ", offsetY: \""+readOutfitNumber(wornPiece.offsetY, 0)+"\"";
		}
		exportText += "},\n";
	}
	exportText += "\t\t],\n";
	exportText += "\t},";
	return exportText;
}

function exportOutfit() {
	var exportText = outfitToText();
	//Show the text in a box too, in case the player doesn't realize it's on their clipboard
	document.getElementById("outfitExportArea").innerHTML = `<textarea id="outfitExportBox" style="width: 95%; height: 200px;" readonly></textarea>`;
	document.getElementById("outfitExportBox").value = exportText;
	document.getElementById("outfitExportBox").select();
	document.execCommand("copy");
	//Newer clipboard API where available, the select-and-copy above is the fallback
	if (navigator.clipboard) {
		navigator.clipboard.writeText(exportText).catch(function(){});
	}
	document.getElementById("outfitExportButton").innerHTML = "Copied to clipboard!";
}

function printImportBox() {
	document.getElementById("outfitImportArea").innerHTML = `
		<p id="outfitImportMessage" class="centeredText">Paste an exported outfit below!</p>
		<textarea id="outfitImportBox" style="width: 95%; height: 200px;"></textarea>
		<p class="choiceText" onclick="importOutfit()">Confirm Import</p>
	`;
}

//Reads the first "quoted value" following a keyword, IE readImportValue('index: "Shirt",', "index:") returns Shirt.
//A plain split(keyword) would trip over filter values, which contain the text filter: inside the quotes themselves
function readImportValue(source, keyword) {
	if (source.includes(keyword) != true) {
		return null;
	}
	var afterKeyword = source.substring(source.indexOf(keyword) + keyword.length);
	if (afterKeyword.split('"').length < 3) {
		return null;
	}
	return afterKeyword.split('"')[1];
}

function importOutfit() {
	var importText = document.getElementById("outfitImportBox").value;
	var importedOutfit = {name: "Imported Outfit", clothes: []};
	var importedName = readImportValue(importText, "name:");
	if (importedName) {
		importedOutfit.name = importedName.split("<").join("").split(">").join("");
	}
	//Every index: in the text starts one clothing piece
	var pieceChunks = importText.split("index:");
	for (var chunkCounter = 1; chunkCounter < pieceChunks.length; chunkCounter++) {
		var pieceToAdd = {index: pieceChunks[chunkCounter].split('"')[1]};
		var importedFilter = readImportValue(pieceChunks[chunkCounter], "filter:");
		if (importedFilter != null) {
			pieceToAdd.filter = importedFilter;
		}
		var importedInvisible = readImportValue(pieceChunks[chunkCounter], "invisible:");
		if (importedInvisible != null) {
			pieceToAdd.invisible = importedInvisible;
		}
		var importedImage = readImportValue(pieceChunks[chunkCounter], "image:");
		if (importedImage != null) {
			pieceToAdd.image = importedImage;
		}
		//Only ever a variant's label. The outfit's own name: line sits ahead of the first index:,
		//so it belongs to chunk zero, which this loop skips.
		var importedPieceName = readImportValue(pieceChunks[chunkCounter], "name:");
		if (importedPieceName != null) {
			pieceToAdd.name = importedPieceName;
		}
		//Absent in anything exported before Full Control, so buildOutfitClothes defaults them
		var importedScaleX = readImportValue(pieceChunks[chunkCounter], "scaleX:");
		if (importedScaleX != null) {
			pieceToAdd.scaleX = importedScaleX;
		}
		var importedScaleY = readImportValue(pieceChunks[chunkCounter], "scaleY:");
		if (importedScaleY != null) {
			pieceToAdd.scaleY = importedScaleY;
		}
		//Codes shared before the split carry one scale for both axes
		var importedScale = readImportValue(pieceChunks[chunkCounter], "scale:");
		if (importedScale != null && importedScaleX == null && importedScaleY == null) {
			pieceToAdd.scaleX = importedScale;
			pieceToAdd.scaleY = importedScale;
		}
		var importedOffsetX = readImportValue(pieceChunks[chunkCounter], "offsetX:");
		if (importedOffsetX != null) {
			pieceToAdd.offsetX = importedOffsetX;
		}
		var importedOffsetY = readImportValue(pieceChunks[chunkCounter], "offsetY:");
		if (importedOffsetY != null) {
			pieceToAdd.offsetY = importedOffsetY;
		}
		if (pieceToAdd.index) {
			importedOutfit.clothes.push(pieceToAdd);
		}
	}
	if (importedOutfit.clothes.length == 0) {
		document.getElementById("outfitImportMessage").innerHTML = "Couldn't find any clothes in that text!";
		return;
	}
	//Imports respect unlocks, so shared outfits can't hand out clothes the player hasn't earned
	if (checkOutfitUnlocked(importedOutfit) != true && checkFlag("player", "outfits") != true) {
		document.getElementById("outfitImportMessage").innerHTML = "Some of those pieces are unknown or not unlocked yet!";
		return;
	}
	data.player.outfits.push({
		name: importedOutfit.name,
		clothes: buildOutfitClothes(importedOutfit)
	});
	printWardrobeOutfits();
}

//Rewrites clothing image paths to match the player's current bodytype, skintone, and genitals,
//the same way changePlayer does. Saved outfits keep the paths from when they were saved, so
//wearing or previewing one after a body change needs this cleanup first.
function normalizeClothesImages(clothesArray) {
	for (var normalizeCounter = 0; normalizeCounter < clothesArray.length; normalizeCounter++) {
		if (!clothesArray[normalizeCounter].image) {
			continue;
		}
		//Reduce to the base art first. The old version replaced only the first occurrence of one
		//suffix at a time, so a path that had already been through it once could not be moved to
		//a third skintone reliably.
		clothesArray[normalizeCounter].image = applyPlayerVariants(clothingBaseImage(clothesArray[normalizeCounter].image));
	}
}

function saveOutfit() {
	if (!data.player.outfits) {
		data.player.outfits = [];
	}
	data.player.outfits.push({
		name: "Outfit "+(data.player.outfits.length+1),
		clothes: JSON.parse(JSON.stringify(data.player.clothes))
	});
	printWardrobeOutfits();
}

function wearOutfit(outfitIndex) {
	data.player.clothes = JSON.parse(JSON.stringify(data.player.outfits[outfitIndex].clothes));
	normalizeClothesImages(data.player.clothes);
	updateMenu();
	printWardrobeOutfits();
}

function deleteOutfit(outfitIndex, event) {
	//Don't also trigger the cell's wearOutfit
	event.stopPropagation();
	//First tap arms the delete, a second tap on the same outfit confirms it
	if (outfitDeleteArmed == outfitIndex) {
		outfitDeleteArmed = -1;
		data.player.outfits.splice(outfitIndex, 1);
		printWardrobeOutfits();
	}
	else {
		outfitDeleteArmed = outfitIndex;
		document.getElementById("outfitDelete-"+outfitIndex).innerHTML = "Sure?";
	}
}

function renameOutfit(outfitIndex, event) {
	//Swap the name label into a text box. Tapping the name shouldn't also wear the outfit.
	event.stopPropagation();
	//If the box is already open, leave it alone so a stray tap doesn't wipe what's been typed
	if (document.getElementById("outfitNameEntry-"+outfitIndex)) {
		return;
	}
	document.getElementById("outfitName-"+outfitIndex).innerHTML = `<input type="text" id="outfitNameEntry-`+outfitIndex+`" style="width:60%;" value="`+data.player.outfits[outfitIndex].name+`" onclick="event.stopPropagation()" onkeydown="if(event.key=='Enter'){this.blur()}" onblur="saveOutfitName(`+outfitIndex+`)">`;
	document.getElementById("outfitNameEntry-"+outfitIndex).focus();
}

function saveOutfitName(outfitIndex) {
	var entryElement = document.getElementById("outfitNameEntry-"+outfitIndex);
	if (!entryElement) {
		return;
	}
	//Strip characters that would break the label's HTML when it gets reprinted
	var newName = entryElement.value.split('"').join("").split("<").join("").split(">").join("").trim();
	if (newName != "") {
		data.player.outfits[outfitIndex].name = newName;
	}
	printWardrobeOutfits();
}

function changePlayer(target, value) {
	if (target == "gender") {
		data.player.gender = value;
	}
	if (target == "skin") {
		data.player.skin = value;
	}
	//One definition of "point these clothes at the body they are on", shared with migration and
	//with wearing a saved outfit, so the three can never drift apart
	normalizeClothesImages(data.player.clothes);
	printWardrobeShuffle();
	updateMenu();
}

//Hair (always the base layer), underwear and genitals (drawn as part of the genital stack),
//and Back pieces (auto-mirrored behind the body) all have fixed draw positions, so they can't be dragged
function layerIsDraggable(clothesIndex) {
	var clothesItem = data.player.clothes[clothesIndex];
	if (!clothesItem) {
		return false;
	}
	if (!clothesItem.tags) {
		clothesItem.tags = "";
	}
	//The genital anchor is the whole reason this menu can position the genitals at all, so in
	//Full Control it is draggable like anything else. Simple mode hides it and keeps it pinned.
	if (isGenitalAnchor(clothesItem)) {
		return fullControlEnabled();
	}
	//A genitals piece supplies the anchor's art wherever it sits, so its position means nothing
	if (hasTag(clothesItem, "genitals")) {
		return false;
	}
	//Simple mode stacks underwear straight onto the anchor, so there is nothing to drag
	if (hasTag(clothesItem, "underwear") && fullControlEnabled() != true) {
		return false;
	}
	if (String(clothesItem.image).includes("Back") == true) {
		return false;
	}
	return true;
}

var layerDragElement = null;
var layerDragPointerId = null;
var layerDragStartX = 0;
var layerDragStartY = 0;
//How far the pointer may travel and still count as a tap rather than a drag. Small enough that
//a deliberate drag is never mistaken for a tap, large enough to survive a shaky finger.
const layerTapSlop = 8;
function layerDragStart(event) {
	//One drag at a time
	if (layerDragElement != null) {
		return;
	}
	//Stops the touch from scrolling the page or selecting text while dragging. It also stops the
	//browser ever firing a click on the row, which is why a row that has something to do when
	//tapped cannot use onclick and is handled in layerDragEnd instead.
	event.preventDefault();
	layerDragElement = event.currentTarget;
	layerDragPointerId = event.pointerId;
	layerDragStartX = event.clientX;
	layerDragStartY = event.clientY;
	layerDragElement.style.opacity = "0.5";
	layerDragElement.style.cursor = "grabbing";
	//Window-level capture-phase listeners see the whole drag no matter what's under the
	//pointer, without relying on setPointerCapture (which was silently dropping the drag)
	//and running ahead of any other drag system's document listeners, IE the jiggy minigame's
	window.addEventListener("pointermove", layerDragMove, true);
	window.addEventListener("pointerup", layerDragEnd, true);
	window.addEventListener("pointercancel", layerDragEnd, true);
}

function layerDragMove(event) {
	if (!layerDragElement || event.pointerId != layerDragPointerId) {
		return;
	}
	//Slot the dragged row in front of the first row whose middle sits below the pointer,
	//or after the last row when the pointer is below the whole list. The preview only
	//redraws when the row actually lands somewhere new, not on every pixel of movement
	var listRows = document.querySelectorAll(`[id^="layerDrag-"]`);
	for (var rowCounter = 0; rowCounter < listRows.length; rowCounter++) {
		if (listRows[rowCounter] == layerDragElement) {
			continue;
		}
		var rowRect = listRows[rowCounter].getBoundingClientRect();
		if (event.clientY < rowRect.top + rowRect.height / 2) {
			if (layerDragElement.nextElementSibling != listRows[rowCounter]) {
				listRows[rowCounter].parentNode.insertBefore(layerDragElement, listRows[rowCounter]);
				layerDragPreview();
			}
			return;
		}
	}
	var lastRow = listRows[listRows.length - 1];
	if (lastRow != layerDragElement && layerDragElement.previousElementSibling != lastRow) {
		lastRow.parentNode.insertBefore(layerDragElement, lastRow.nextSibling);
		layerDragPreview();
	}
}

//Redraws the player preview mid-drag so the layering change shows live, without
//committing anything to data.player.clothes until the row is actually dropped
function layerDragPreview() {
	document.getElementById(`wardrobe-Item`).innerHTML = drawPlayer("playerSelf;", layerDragOrder());
}

function layerDragEnd(event) {
	if (!layerDragElement || event.pointerId != layerDragPointerId) {
		return;
	}
	window.removeEventListener("pointermove", layerDragMove, true);
	window.removeEventListener("pointerup", layerDragEnd, true);
	window.removeEventListener("pointercancel", layerDragEnd, true);
	//A press that went nowhere is a tap on the row, not a reorder of it
	var travelled = Math.abs(event.clientX - layerDragStartX) + Math.abs(event.clientY - layerDragStartY);
	var tappedRow = layerDragElement;
	layerDragElement = null;
	if (travelled <= layerTapSlop) {
		layerRowTap(tappedRow);
		return;
	}
	layerDragCommit();
}

//What tapping a layer row does. Only the genital anchor has an action: it is the one row that
//stands for something that can be shown or hidden rather than a garment that can be taken off,
//so Full Control toggles it here. Every other row just redraws, which puts back the opacity the
//press dimmed it with.
function layerRowTap(tappedRow) {
	if (!tappedRow) {
		printWardrobeShuffle();
		return;
	}
	var rowIndex = parseInt(String(tappedRow.id).replace("layerDrag-", ""));
	if (isNaN(rowIndex) != true && isGenitalAnchor(data.player.clothes[rowIndex])) {
		toggleGenitalVisibility();
		return;
	}
	printWardrobeShuffle();
}

//Builds the full clothes array the current on-screen row order describes, without committing
//it. Only the draggable rows' slots get rearranged, so hair, underwear, genitals, and Back
//pieces keep their exact positions
function layerDragOrder() {
	//Which array slots hold draggable items, innermost first
	var draggableSlots = [];
	for (var slotCounter = 0; slotCounter < data.player.clothes.length; slotCounter++) {
		if (layerIsDraggable(slotCounter) == true) {
			draggableSlots.push(slotCounter);
		}
	}
	//Collect the rearranged items from the list. The rows read top to bottom in print order,
	//so the top row is the innermost layer and maps to the lowest array slot
	var listRows = document.querySelectorAll(`[id^="layerDrag-"]`);
	var newOrder = [];
	for (var rowCounter = 0; rowCounter < listRows.length; rowCounter++) {
		newOrder.push(data.player.clothes[parseInt(listRows[rowCounter].id.replace("layerDrag-", ""))]);
	}
	if (newOrder.length != draggableSlots.length) {
		console.error("Layer drag mismatch, keeping the old order");
		return data.player.clothes;
	}
	var newClothes = data.player.clothes.slice();
	for (var slotCounter = 0; slotCounter < draggableSlots.length; slotCounter++) {
		newClothes[draggableSlots[slotCounter]] = newOrder[slotCounter];
	}
	return newClothes;
}

function layerDragCommit() {
	data.player.clothes = layerDragOrder();
	//Idempotent, but it keeps a dropped anchor from ever landing in front of the hair
	enforceClothingOrder(data.player.clothes);
	printWardrobeShuffle();
	updateMenu();
}

function wardrobeMouseOver(wardrobeImage) {
	//console.log(document.getElementById(wardrobeImage).style.filter)
	document.getElementById(wardrobeImage).style.filter = "brightness(100%)"
}

function wardrobeMouseOut(wardrobeImage) {
	//console.log(document.getElementById(wardrobeImage).style.filter)
	document.getElementById(wardrobeImage).style.filter = "brightness(var(--card-brightness, 80%))";
}