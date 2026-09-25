/**
 * Card art prompt pass for Honeycomb Catacombs (round 07 A, Brienne rewritten session 23).
 *
 * Not part of the game. Writes `CARD-PROMPTS-01.md`: one prompt line per draftable card.
 *
 * A line is the webui v2 shortcut the art pipeline already uses:
 *
 *   .hcKnightV, default, <camera>, <pose>, <expression>, <lewd>, <lighting>, <background>
 *
 * `.hcKnightV, default` already loads identity and outfit. Do not restate hair, armour, or body.
 * The first tag after `default` is a camera (`cowboy shot` / `upper body only` / `full body` /
 * `chest up`) so the engine crops. Horizontal cards want cowboy or upper; vertical cards want
 * full body. Hand-size art has to read in one glance: one silhouette, one colour, one angle.
 *
 * Usage:  node "!designDocs/honeycomb/tools/card-prompts.js"
 * Exits 0. The load order mirrors test-honeycomb.js; UI/scene files are omitted.
 */
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..", "..", "scripts", "misc");
const OUT = path.join(__dirname, "..", "art_pipeline", "CARD-PROMPTS-01.md");
const FILES = [
	"honeycomb.js",
	"honeycomb/honeycomb-tuning.js",
	"honeycomb/honeycomb-state.js",
	"honeycomb/honeycomb-effects.js",
	"honeycomb/honeycomb-entities.js",
	"honeycomb/honeycomb-tags.js",
	"honeycomb/honeycomb-content-statuses.js",
	"honeycomb/honeycomb-content-cards.js",
	"honeycomb/honeycomb-content-characters.js",
	"honeycomb/honeycomb-content-abilities.js",
	"honeycomb/honeycomb-abilities.js",
	"honeycomb/honeycomb-content-enemies.js",
	"honeycomb/honeycomb-content-map.js",
	"honeycomb/honeycomb-content-lust-events.js",
	"honeycomb/honeycomb-progression.js",
	"honeycomb/honeycomb-combat.js",
	"honeycomb/honeycomb-text-tooltips.js",
	"honeycomb/honeycomb-tooltip.js",
	"honeycomb/honeycomb-choices.js",
	"honeycomb/honeycomb-forecast.js",
	"honeycomb/honeycomb-map.js",
	"honeycomb/honeycomb-overlays-map.js",
	"honeycomb/honeycomb-lust-events.js",
	"honeycomb/honeycomb-art.js",
];

function newEngine() {
	const store = {};
	const sandbox = {
		console: { log() {}, warn() {}, debug() {}, info() {}, error() {} },
		localStorage: {
			getItem: (key) => (key in store ? store[key] : null),
			setItem: (key, value) => { store[key] = String(value); },
			removeItem: (key) => { delete store[key]; },
		},
		Date, Math, JSON, encodeURI, encodeURIComponent, decodeURIComponent,
		Object, Array, String, Number, Infinity, parseInt, parseFloat, setTimeout, clearTimeout,
		document: {
			getElementById: () => null,
			createElement: () => ({ style: { setProperty() {} }, appendChild() {}, classList: { add() {}, remove() {} } }),
			body: null,
		},
	};
	sandbox.window = sandbox;
	vm.createContext(sandbox);
	for (const file of FILES) {
		vm.runInContext(fs.readFileSync(path.join(ROOT, file), "utf8"), sandbox, { filename: file });
	}
	return sandbox.honeycomb;
}

//The webui v2 entry per art folder, from Archive/demo1/art_pipeline/CATCH-UP.md "Codenames". Typed as `<Entry>V` for
//the standing (female) line and `<Entry>C` for the male line, exactly as the refs are generated.
const ENTRY = {
	knight: ".hcKnightV",
	necro: ".hcNecroV",
	vamp: ".hcVampV",
	lancer: ".hcLancerV",
	priest: ".hcPriestV",
	seer: ".hcSeerV",
};

//WHAT THE CARD LOOKS LIKE IT IS DOING, by its own derived type. First type with an entry wins.
const ACTION_BY_TYPE = {
	damage: "attacking, weapon trail, motion blur",
	negative: "casting a hex, dark aura, glowing eyes",
	support: "casting a blessing, light from both hands",
	passive: "standing tall, magic aura gathering",
	lewd: "seductive pose, heavy blush, half-lidded eyes",
	curse: "clutching head, uneasy, shadow across the face",
};

//THE SETTING, by the card's sister mechanic (archetypeArray). A card with no archetype falls back to a
//default scene. One row moves a card's whole setting.
const SCENE_BY_ARCHETYPE = {
	armament: "battlefield, dust, sparks, weight behind the swing",
	sentinel: "narrow pass, braced stance, shield forward",
	tithe: "open palms, coins, soft gold light",
	rupture: "swamp, bursting spores, rotting plants",
	contagion: "mushroom grove, creeping fog, drifting spores",
	venom: "dark undergrowth, dripping poison, green haze",
	feast: "moonlit ruin, low crouch, bared fangs",
	bloodletting: "dark chapel, red wine read as blood, candlelight",
	transfusion: "wound held shut, red light passing hand to hand",
	charge: "burning ground, forward lunge, embers in the air",
	formation: "line of allies, raised banner, ordered ranks",
	devotion: "cathedral light, kneeling, hands folded",
	rapture: "pink light, arched back, blushing",
	sanctuary: "ring of light, arms spread, serene face",
	hex: "candle circle, blue flame, chalk marks",
	turncoat: "spinning coin, stolen blade, smirk over the shoulder",
	repertoire: "floating cards, glowing runes, one hand raised",
};

//THE BACKGROUND, by the run's own regions. A card names its scene as the region its art belongs in, so
//the pass reads as one world; a special card may override the row.
const BACKGROUND_BY_REGION = {
	upperCatacombs: "cave interior, giant mushrooms, purple glow, stone arches",
	floodedVault: "flooded stone vault, teal water light, rusted chains",
};

//PER-CARD OVERRIDES, keyed by card index. The place to fix a line without touching the tables above:
//  prompt              replace the whole tail after `.hcKnightV, <outfit>,`
//  outfit              `default` or `nude` (lust cards drop the bodysuit; do not fight it with clothes tags)
//  glance              one-glance silhouette, for the review table
//  scene / background  replace the derived row
//  action              replace the derived action
//  skip                leave the card out with a note
//
//BRIENNE (session 23, pass 3). Seen as a stamp in the card window (`_source/cards/outputTest.jpg`).
//Cave clones and solo standing shots mush. Flat colour fields look like a prototype. Rules:
//  - A real scene with a dominant colour cast, not `simple background`.
//  - She fights or grabs someone/something. A second mass in the frame is the other read.
//  - Lust cards (Steady, Shelter, Alms, Reliquary) use outfit `nude`, not `default`.
//  - No cave, no mushrooms, no blood or gore.
const OVERRIDE = {
	brienneCleave: {
		glance: "burning field, slash through a monster",
		prompt: "cowboy shot, from side, action pose, dynamic, fighting, slashing, holding sword, duo, monster, claws, motion lines, determined, outdoors, fire, sunset, smoke",
	},
	brienneGrit: {
		glance: "gold chapel, covering someone behind her",
		prompt: "cowboy shot, from front, standing in front, protecting, arms spread, duo, faceless female, looking at viewer, determined, indoors, church, gold lighting, window light",
	},
	brienneBulwark: {
		glance: "snow rampart, arms as a wall",
		prompt: "cowboy shot, from front, arms spread, standing, protecting, duo, silhouette, looking at viewer, determined, outdoors, snow, castle, overcast",
	},
	brienneSteady: {
		outfit: "nude",
		glance: "pink bedchamber, nude pinning him",
		prompt: "cowboy shot, from above, pinning down, sitting on person, duo, faceless male, 1boy, looking down at viewer, heavy blush, sweat, open mouth, saliva, 'horny', pussy juice, indoors, bedroom, pink lighting, silk",
	},
	brienneShelter: {
		outfit: "nude",
		glance: "candle tent, nude wrapping around someone",
		prompt: "full body, from below, standing, hugging, protecting, duo, faceless male, 1boy, heavy blush, sweat, 'nipples', 'pussy', indoors, tent, candlelight, gold lighting",
	},
	brienneRally: {
		glance: "sunset battlements, sword over an army",
		prompt: "full body, from below, arm up, holding sword, open mouth, crowd, silhouette, looking at viewer, determined, outdoors, castle, sunset, orange lighting",
	},
	brienneShieldBash: {
		glance: "night rain, buckler into a monster's face",
		prompt: "cowboy shot, from front, action pose, dynamic, fighting, leaning forward, duo, monster, foreshortening, clenched teeth, angry, outdoors, night, rain, dark",
	},
	brienneRiposte: {
		glance: "moonlit courtyard, back-slash catching a blade",
		prompt: "cowboy shot, from behind, looking back, slashing, holding sword, fighting, duo, faceless male, 1boy, 'smirk', ass focus, motion lines, outdoors, night, full moon, ruins",
	},
	brienneCrushingWeight: {
		glance: "muddy arena, boot on a monster",
		prompt: "cowboy shot, from below, looking down, stepping on, one leg up, duo, monster, determined, cameltoe, outdoors, dirt, dust cloud, arena",
	},
	brienneTemperedPlate: {
		glance: "forge, hammers working her plate",
		prompt: "full body, standing, closed eyes, sweat, shiny clothes, hammers, sparks, fire, steam, indoors, forge, orange lighting",
	},
	brienneLendSteel: {
		glance: "blue armoury, two hands on one sword",
		prompt: "upper body only, from front, holding sword, duo, faceless male, 1boy, hands, looking at viewer, determined, indoors, armoury, blue lighting, weapon racks",
	},
	brienneUnstoppable: {
		glance: "sunlit dust, walking through monsters",
		prompt: "full body, from below, walking, walking toward viewer, fighting, duo, monster, determined, motion lines, outdoors, daytime, dust cloud, sunlight",
	},
	brienneChallenge: {
		glance: "throne room, pointing down a hall",
		prompt: "upper body only, from front, pointing at viewer, duo, faceless male, 1boy, v-shaped eyebrows, angry, clenched teeth, indoors, throne room, red lighting, columns",
	},
	brienneIntercept: {
		glance: "purple dusk pass, yanking someone behind her",
		prompt: "cowboy shot, from side, action pose, dynamic, grabbing, protecting, duo, faceless female, running, motion lines, looking to the side, outdoors, evening, purple lighting, fog",
	},
	brienneThornArmour: {
		glance: "overgrown garden, monster stuck in her vines",
		prompt: "full body, standing, duo, monster, vines, grabbing, looking at viewer, 'nipple slip', crotch tear, torn clothes, outdoors, garden, plants, green lighting",
	},
	brienneIronRetort: {
		glance: "armoury sparks, punch landing",
		prompt: "cowboy shot, from front, wince, clenched teeth, one eye closed, duo, faceless male, 1boy, punching, fighting, sparks, indoors, armoury, steel, dramatic lighting",
	},
	brienneHoldTheLine: {
		glance: "storm gate, planted, arrows bouncing",
		prompt: "full body, from below, planted sword, standing, determined, arrows, motion lines, looking at viewer, outdoors, rain, storm, castle",
	},
	brienneShieldWall: {
		glance: "castle gate, her body as the wall",
		prompt: "full body, from below, standing, arm up, protecting, duo, silhouette, looking at viewer, determined, outdoors, castle, sky, dramatic lighting",
	},
	brienneTithe: {
		glance: "stained-glass chapel, hands taking coins",
		prompt: "upper body only, looking down, open palm, duo, hands, money, cleavage, indoors, church, window light, gold lighting",
	},
	brienneRansom: {
		glance: "treasury, pulling gold off someone else",
		prompt: "cowboy shot, leaning forward, grabbing, duo, faceless male, 1boy, money, looking at viewer, narrowed eyes, indoors, treasure, gold lighting, coins",
	},
	brienneGildedStrike: {
		glance: "gold sunset, slash exploding through a monster",
		prompt: "cowboy shot, from side, action pose, dynamic, fighting, slashing, holding sword, duo, monster, arched back, motion lines, outdoors, sunset, gold lighting, fire",
	},
	brienneAlms: {
		outfit: "nude",
		glance: "pink chapel, nude kneeling, hands taking",
		prompt: "cowboy shot, kneeling, from front, palms up, looking up, duo, hands, heavy blush, open mouth, tongue out, saliva, 'horny', 'nipples', 'pussy', indoors, church, pink lighting, stained glass",
	},
	brienneReliquary: {
		outfit: "nude",
		glance: "gold shrine, nude statue, hands reaching",
		prompt: "full body, standing, hands cupped, looking down, duo, hands, 'nipples', 'pussy', steam, indoors, shrine, gold lighting, candles",
	},
	nettleLastBloom: { action: "petals bursting outward, arms wide, eyes closed" },
	severineNightfall: { background: "night sky, blood moon, ruined balcony" },
	cinderCometLance: { action: "mid-lunge, trailing fire, one hand forward" },
	clemenceSanctuary: { action: "arms wide, halo of light, tears on her cheeks" },
	cassadoraMirror: { action: "looking into a floating mirror, two reflections" },
};

function main() {
	const hc = newEngine();
	const characterByIndex = {};
	for (const character of hc.characterArray) characterByIndex[character.index] = character;

	const lineArray = [];
	lineArray.push("# Honeycomb — card art prompts (round 07 A, Brienne rewritten)");
	lineArray.push("");
	lineArray.push("> Write a first pass of art prompts for each card to be sent through the WEBUI engine using the");
	lineArray.push("> character's characterDB entry, the default costume, scene, and background tags.");
	lineArray.push("");
	lineArray.push("Generated by `card-prompts.js`. Each line is a webui v2 shortcut: the character's charactersDB");
	lineArray.push("entry, `default`, then the rest. Identity and outfit are already in those two tokens — do not");
	lineArray.push("restate them. Send a line through `refs-generate.js` the same way a pose slot is sent; the");
	lineArray.push("character's `-basic-a` is the ControlNet reference as always.");
	lineArray.push("");
	lineArray.push("**Brienne is hand-authored (session 23, pass 3).** The card window is a stamp (`outputTest.jpg`):");
	lineArray.push("a real scene with a dominant colour cast, a second mass (monster / hands / body), and lust");
	lineArray.push("cards replace `default` with `nude`. No caves, no flat colour fields. Horizontal → `Landscape`;");
	lineArray.push("vertical → `Portrait`. Fighting shots want the reference window at 0.3–0.8; nude shots skip");
	lineArray.push("ControlNet so the clothed `-basic-a` does not put the suit back on.");
	lineArray.push("");
	lineArray.push("Anything with a `†` was shaped by a per-card override. Scope: draftable character cards");
	lineArray.push("(starter / common / rare), the neutral pool and the specials. Enemy moves and broken forms are");
	lineArray.push("out of this pass.");
	lineArray.push("");

	for (const character of hc.characterArray) {
		const cardArray = hc.cardArray
			.filter((card) => card.characterIndex === character.index && ["starter", "common", "rare", "special"].indexOf(card.rarity) >= 0)
			.sort((left, right) => String(left.rarity).localeCompare(String(right.rarity)) || String(left.name).localeCompare(String(right.name)));
		if (cardArray.length === 0) continue;
		const authored = cardArray.some((card) => OVERRIDE[card.index] && OVERRIDE[card.index].prompt);
		lineArray.push("## " + character.name + " (" + (ENTRY[character.artFolder] || ".hc?") + ")");
		lineArray.push("");
		if (authored) {
			lineArray.push("| Card | rarity | layout | glance | prompt |");
			lineArray.push("|---|---|---|---|---|");
		} else {
			lineArray.push("| Card | rarity | prompt |");
			lineArray.push("|---|---|---|");
		}
		for (const card of cardArray) {
			const override = OVERRIDE[card.index] || {};
			if (override.skip) continue;
			const typeArray = hc.cardTypeIndexArray(card);
			const action = override.action != null ? override.action
				: (typeArray.map((type) => ACTION_BY_TYPE[type]).find((entry) => entry != null) || ACTION_BY_TYPE.passive);
			const scene = override.scene != null ? override.scene
				: (SCENE_BY_ARCHETYPE[card.archetype] || "dark catacomb, torch light");
			const background = override.background != null ? override.background : BACKGROUND_BY_REGION.upperCatacombs;
			const tail = override.prompt != null ? override.prompt : action + ", " + scene + ", " + background;
			const outfit = override.outfit != null ? override.outfit : "default";
			const prompt = (ENTRY[character.artFolder] || ".hc?") + ", " + outfit + ", " + tail;
			const mark = Object.keys(override).length > 0 ? " †" : "";
			if (authored) {
				const layout = card.layout || "horizontal";
				const glance = override.glance || "";
				lineArray.push("| " + card.name + mark + " | " + card.rarity + " | " + layout + " | " + glance + " | `" + prompt + "` |");
			} else {
				lineArray.push("| " + card.name + mark + " | " + card.rarity + " | `" + prompt + "` |");
			}
		}
		lineArray.push("");
	}

	//The neutral pool and the specials are owned by nobody, so they get a neutral prompt line rather
	//than a character entry.
	const neutralArray = hc.cardArray.filter((card) =>
		card.characterIndex === "neutral" && ["starter", "common", "rare", "special"].indexOf(card.rarity) >= 0);
	if (neutralArray.length > 0) {
		lineArray.push("## Neutral");
		lineArray.push("");
		lineArray.push("| Card | rarity | prompt |");
		lineArray.push("|---|---|---|");
		for (const card of neutralArray) {
			const typeArray = hc.cardTypeIndexArray(card);
			const action = typeArray.map((type) => ACTION_BY_TYPE[type]).find((entry) => entry != null) || ACTION_BY_TYPE.passive;
			lineArray.push("| " + card.name + " | " + card.rarity + " | `neutral card art, no character, " + action + "` |");
		}
		lineArray.push("");
	}

	lineArray.push("## Sending a batch");
	lineArray.push("");
	lineArray.push("1. Paste a prompt line into the webui engine (or extend `refs-generate.js`'s slot list) as");
	lineArray.push("   the clean prompt; the engine compiles it exactly as it compiles a pose slot.");
	lineArray.push("2. Reference: the character's `-basic-a` (ControlNet `reference_only`, 0.7–1.0, style 0.5).");
	lineArray.push("3. Size `Portrait` (832×1216) for a vertical card, `Landscape` (1216×832) for a horizontal");
	lineArray.push("   one. Action poses want the ControlNet reference window at 0.3–0.8 so they do not freeze");
	lineArray.push("   on `-basic-a`. The card frame's window rectangles are in `tuning.art.cardFrame`.");
	lineArray.push("4. Keep what passes review in `v13 spire images/cards/art/<cardIndex>.webp`; the game picks it");
	lineArray.push("   up with no code change.");
	lineArray.push("");
	lineArray.push("*Generated from " + hc.cardArray.length + " cards; " + neutralArray.length + " neutral in the pass, the rest by character.*");

	fs.writeFileSync(OUT, lineArray.join("\n") + "\n", "utf8");
	console.log("wrote " + OUT + " (" + lineArray.length + " lines)");
}

module.exports = { OVERRIDE, ENTRY };
if (require.main === module) main();
