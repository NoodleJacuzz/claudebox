//Clacks workspace
//Physics minigame. Full design notes live in CLACKS_DESIGN.md.
//
//Split out of test.js 2026-07-26. Nothing here runs until the "clacksTest" scene is entered, so its
//position in index.html's script list doesn't matter -- it only has to be present.
//
//SIM SPACE: the arena declares its size in sim units and the canvas backing store is set to exactly
//that, so one sim unit == one canvas pixel. CSS then scales the whole canvas down to fit whatever
//viewport we're on. The simulation is therefore identical on every screen, and there is no resize
//handler to write -- the browser does the scaling for free.

const CLACKS_TICK_MS = 10;               //100 ticks per second (CLACKS_DESIGN.md section 2)
const CLACKS_MAX_TICKS_PER_FRAME = 240;  //ceiling on catch-up work, so a slow frame can't spiral
//---------------------------------------------------------------------------------------------------
//Physics constants
//---------------------------------------------------------------------------------------------------
//Modelled on a reference engine, converted from its 1000x1000 arena at 60 ticks/sec to our 800x800 at
//100. Velocity scales by (size ratio x tick ratio) and acceleration by (size ratio x tick ratio^2):
//    speed    13.5  x 0.8 x 0.6  = 6.48   -- both work out to 0.81 arena-widths/sec
//    gravity  0.535 x 0.8 x 0.36 = 0.154  -- both work out to 1.93 arena-heights/sec^2
//Redo that arithmetic if the arena size or CLACKS_TICK_MS ever change, or the feel will drift.
const CLACKS_DEFAULT_SPEED = 6.5;        //sim units per tick == 650/sec, ~1.2s to cross the arena
const CLACKS_MAX_SPEED = 40;             //hard safety cap on ANY speed, well above the band below.
                                         //Exists to stop a runaway tunnelling entities through walls.

//The energy band. Speed is regulated at collisions rather than by friction: each entity is held inside
//a band, and the pair is held inside a wider one. Both are needed -- the individual band alone still
//permits both balls sitting at the ceiling (an unreadable blur) or both at the floor (a stalemate).
//Gravity can push an entity past the ceiling mid-fall, which is intended; the band bites on contact.
const CLACKS_SPEED_BAND_MIN = 4;
const CLACKS_SPEED_BAND_MAX = 16;        //~= the speed a full-height fall generates, so it isn't fighting gravity
const CLACKS_PAIR_BAND_MIN = 11;         //deliberately tighter than 2x the individual band, or it never binds
const CLACKS_PAIR_BAND_MAX = 24;

//Collisions kick speed by a random amount, biased by where the entity sits in its band: near the floor
//it is more likely to speed up, near the ceiling more likely to slow down. This is what stops a duel
//settling into a metronome, and it is why collisions consume RNG (see clacksNudgeSpeed).
const CLACKS_COLLISION_JITTER = 0.15;    //+/-15% speed change per collision at the middle of the band
const CLACKS_ENERGY_BIAS = 0.6;          //0 = unbiased, 1 = the band edges fully dictate the direction

//Gravity pulls everything toward vertical motion, and two balls bouncing straight up and down never
//meet. A floor under |vx| is what keeps them crossing paths.
const CLACKS_MIN_X_SPEED = 1.5;

//1 = the reference engine's perfectly elastic wall. Drop below 1 to bleed speed on every wall hit.
const CLACKS_WALL_RESTITUTION = 1;

//Entity size is the primary PACING knob, not just a look: contact rate scales with combined radius, so
//this and the arena size together decide how often anything happens. Radius also sets MASS (see
//clacksMassOf), so it now drives how hard an entity shrugs off a collision as well as how often it has one.
const CLACKS_DEFAULT_RADIUS = 60;

//---------------------------------------------------------------------------------------------------
//Weapon constants
//---------------------------------------------------------------------------------------------------
//MUST stay BELOW CLACKS_DEFAULT_RADIUS: CLACKS_REFERENCE_MASS is derived from it, and `const` has no
//hoisting to save us -- ordering these the other way round throws before the file finishes loading.
//
//A weapon is one or more thick line segments rotating around their owner. Note what ISN'T here: a hit
//cadence. Damage lands on the RISING EDGE of contact (clacksWeaponHit) rather than on a refresh timer,
//exactly like the "closing" test that makes body contact fire once per collision -- so there is no
//magic number to tune, and a faster spin lands more hits for free.
const CLACKS_MAX_RESIST = 0.9;           //Wings' damage reduction ceiling; scaling must never reach 100%
const CLACKS_GOLDEN_ANGLE = 2.399963;    //spreads starting blade angles by id -- see clacksMakeEntity

//Weapon impulses are MASS-WEIGHTED, exactly like a body collision, which is what stops a blade feeling
//like a damage tick with a decoration attached. A part's `knockback` is authored as the velocity change
//a DEFAULT-SIZED entity would feel, so the numbers in clacksPartArray stay readable; the reference mass
//below is what converts that back into a real impulse. A small entity gets flung, a big one shrugs.
const CLACKS_REFERENCE_MASS = CLACKS_DEFAULT_RADIUS * CLACKS_DEFAULT_RADIUS;
//Newton's third law says this would be 1 -- the wielder takes the same impulse the target does. It sits
//below 1 because the blade is bolted to a robot that is bracing against it, not swinging it free-hand.
//A feel knob: at 0 weapons are reactionless, at 1 a heavy swing visibly shoves its own owner around.
const CLACKS_WEAPON_RECOIL = 0.5;
//A parry has no impulse constant on purpose. Two blades meeting run the SAME elastic exchange two
//bodies do (clacksExchangeMomentum), so a clash reads as the balls themselves colliding with the
//weapons acting as extensions of them. A hand-tuned shove here would be a second physics competing
//with the first, and would look wrong next to it.
const CLACKS_BLADE_COLOR = "#eef3f8";    //armed
const CLACKS_BLADE_IDLE_COLOR = "rgba(238,243,248,0.28)";   //present but not dealing damage

//---------------------------------------------------------------------------------------------------
//Object constants (projectiles and hazards)
//---------------------------------------------------------------------------------------------------
//An "object" is the shared machinery behind a PROJECTILE and a HAZARD (CLACKS_DESIGN.md section 2).
//They are one type with flags rather than two, because they differ in only three answers -- does it
//move, does it care about walls, does it survive damaging something -- and share everything else.
//An OBSTACLE is deliberately NOT one of these: section 2 calls it a neutral entity, so it is an entity
//on a neutral team and needs no new type at all.
const CLACKS_SHOT_TICKS = 12;            //how long the attacking phase lasts for a "count" part. Not a
                                         //duration stat: attackLength is a volley count for those, so the
                                         //flash needs its own length -- long enough to see, short enough
                                         //that the wind-up still owns the pacing.
const CLACKS_HAZARD_COLOR = "rgba(255,148,58,0.42)";
const CLACKS_HAZARD_CORE_COLOR = "rgba(255,226,150,0.8)";
const CLACKS_PROJECTILE_COLOR = "#ffe8a8";
//How much of a blade's knockback goes into a deflected projectile. Above 1 because a bullet weighs
//nothing next to a robot, so the same swing that staggers a body should hurl a bullet outright.
const CLACKS_DEFLECT_BOOST = 1.15;

//Arena size is the other half of that knob. Keep it comfortably above the largest size the board is
//ever RENDERED at (~566px wide on desktop) -- until then CSS is shrinking the canvas to fit, so making
//the arena smaller costs no on-screen board size, it only makes entities a larger share of the board.
var clacksArena = {
	name: "Simple Rectangle",
	shape: "rect",
	width: 800,      //sim units
	height: 800,
	wall: 6,         //wall thickness; the playfield is this far in from the canvas edge
	gravity: 0.154   //units/tick^2, pulling toward +y (down). Lives on the arena because a Racetrack or
	                 //a Big Rock plausibly wants a different pull than a Simple Square.
};

var clacksEntities = [];

//Projectiles and hazards. A separate list from clacksEntities on purpose: everything in here is
//weightless, has no health, and must never meet the energy band or the |vx| floor -- both of those exist
//to keep a DUEL readable and neither has any business steering a bullet.
var clacksObjects = [];

//Loop state
var clacksSpeed = 1;        //ticks consumed per frame multiplier; 0 = paused
var clacksRafId = null;
var clacksLastFrame = 0;
var clacksAccumulator = 0;  //unspent sim time, in ms
var clacksTickCount = 0;
var clacksFps = 0;
var clacksReadoutDue = 0;
var clacksPalette = null;

//Match state. null when no game is running; clacksStartGame() builds it.
var clacksMatch = null;

//Entity identity counter. Reset per match so a replay of the same seed produces the same ids.
var clacksNextId = 0;
//Objects count SEPARATELY, and that is load-bearing rather than tidiness: entity ids feed the golden-angle
//fan-out in clacksMakeEntity, so letting a mid-match fireball consume an id would silently change the
//starting blade angle of every enemy spawned after it.
var clacksNextObjectId = 0;

//---------------------------------------------------------------------------------------------------
//Deterministic RNG
//---------------------------------------------------------------------------------------------------
//The simulation seeds every random choice (starting direction, spawn placement) from here rather than
//Math.random(). Two reasons, both load-bearing:
//  1. It's the only way to PROVE a fast-forwarded match plays out identically to a real-time one --
//     same seed at 1x and 4x must give the same result, tick for tick.
//  2. Balance testing becomes repeatable. "That loadout felt strong" is worth a lot more when the
//     same seed can be replayed against a changed stat.
//mulberry32: tiny, fast, and far better distributed than anything hand-rolled.
var clacksSeed = 0;
var clacksRngState = 0;

function clacksSeedRng(seed) {
	clacksSeed = seed >>> 0;
	clacksRngState = clacksSeed;
}

function clacksRandom() {
	clacksRngState = (clacksRngState + 0x6D2B79F5) >>> 0;
	let t = clacksRngState;
	t = Math.imul(t ^ (t >>> 15), t | 1);
	t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

//---------------------------------------------------------------------------------------------------
//Definition tables
//---------------------------------------------------------------------------------------------------
//Plain globals rather than the engine's initialXArray -> globalXArray copy: nothing here is save data,
//so there's nothing to reset per playthrough. A mod that wants to add a part can push to the array.

//Attack part definitions (CLACKS_DESIGN.md section 5). "none" MUST stay index 0 -- it's the fallback
//for an unimplemented or corrupted part, and the reason an entity with no parts still has a working
//stat block to hold mods on.
//
//A part is DECLARATIVE, not a bag of callbacks, because mods have to be able to reach in and edit it:
//
//  weapon   -- the weapon template at size 1, whose `shape` is a LIST OF SEGMENTS in the weapon's own
//              polar frame: { angle, inner, length, width }. angle is the offset from the weapon's
//              rotation, inner is how far past the entity's edge the segment starts. Two segments at 0
//              and PI make Wings; a shaft plus a short fat segment further out makes a hammer; a stubby
//              one makes a gun barrel. Anything buildable out of thick line segments is expressible,
//              which is the reason this is a list and not a blade count.
//              A spin of 0 means the weapon does not rotate and sits at a FIXED world angle (see
//              clacksBladeAngle) -- that is what makes Wings horizontal rather than wherever the
//              previous part happened to leave the rotation.
//  phases   -- per-phase OVERRIDES, resolved fresh every tick by clacksResolvePart(). "weapon" and
//              "armed" are booleans (present at all / deals damage); everything else is a MULTIPLIER on
//              the template. Omitted phase = the template unchanged. This is the whole of "charging and
//              attacking behaviour differences" for parts that don't spawn anything.
//  scaling  -- a map of target -> rate per scaling point. A map rather than a single target because
//              Fury feeds two at once. RATES ARE PLACEHOLDERS -- CLACKS_DESIGN.md section 6 defers
//              growth rates to balance testing on purpose. Recognised targets:
//                 damage        weapon damage, and the damage of anything it spawns
//                 size          weapon length and width, and the size of anything it spawns
//                 chargeLength  DIVIDES, so more scaling = shorter wind-up
//                 contactDamage the entity's own body damage
//                 bounce        the entity's bounce speed off other entities
//                 count         how many objects one volley creates
//  scalingGain -- what MAKES scaling grow, keyed by trigger. See clacksGainScaling().
//  spawn    -- what the part CREATES on entering its attacking phase (a projectile or a hazard). Also
//              declarative, resolved through the same scaling path a weapon's numbers take, so a mod that
//              edits part.size makes bigger fireballs for free. See clacksRunSpawns().
//  attackMode -- "duration" (default) reads attackLength as a phase length. "count" reads it as a NUMBER
//              OF VOLLEYS instead: the part loops charging -> attacking -> charging that many times before
//              advancing, which is section 4's alternate reading and what makes the wand fire three
//              separate fireballs on one selection rather than holding one open for three seconds.
var clacksPartArray = [
	{
		index: "none",
		name: "None",
		scalingLabel: "",
		size: 1,
		damage: 1,
		chargeLength: 100,
		attackLength: 100,
		cooldown: 20,
		modSlots: 3
	},
	//Reach here is deliberate: radius 60 + length 70 = 130, against a body-contact distance of 120. The
	//blade lands before the balls touch, so a sword duel doesn't just look like the unarmed one.
	{
		index: "shortsword",
		name: "Short Sword",
		scalingLabel: "Sword Damage",
		size: 1,
		damage: 1,
		chargeLength: 100,
		attackLength: 100,
		cooldown: 20,
		modSlots: 3,
		scaling: { damage: 0.25 },
		weapon: {
			spin: 0.025, damage: 4, knockback: 2,
			shape: [{ angle: 0, inner: 0, length: 70, width: 16 }]
		}
		//No phases block at all: Short Sword behaves identically in both states by design (section 5).
	},
	//The mirror image of Short Sword -- nothing during the long charge, then a big fast blade for a
	//short window. Same total commitment, spikier delivery.
	{
		index: "longsword",
		name: "Long Sword",
		scalingLabel: "Attack Speed",
		size: 1,
		damage: 1,
		chargeLength: 160,
		attackLength: 70,
		cooldown: 20,
		modSlots: 3,
		scaling: { chargeLength: 0.1 },
		weapon: {
			spin: 0.07, damage: 9, knockback: 4,
			//Two segments: a thin shaft and a wider tip. Not decoration -- it proves the shape list
			//carries per-segment widths through hit detection and drawing, which a hammer or an axe
			//will need for real.
			shape: [
				{ angle: 0, inner: 0, length: 100, width: 14 },
				{ angle: 0, inner: 100, length: 30, width: 22 }
			]
		},
		phases: {
			charging: { weapon: false },
			cooldown: { weapon: false }
		}
	},
	//Wings don't spin. Retracted while charging (armed:false, so they're a shield rather than a blade),
	//snapped out wide during the attack.
	{
		index: "wings",
		name: "Wings",
		scalingLabel: "Wing Size",
		size: 1,
		damage: 1,
		chargeLength: 120,
		attackLength: 45,
		cooldown: 15,
		modSlots: 3,
		scaling: { size: 0.15 },
		weapon: {
			spin: 0, damage: 5, knockback: 3,
			shape: [
				{ angle: 0, inner: 0, length: 55, width: 22 },
				{ angle: Math.PI, inner: 0, length: 55, width: 22 }
			]
		},
		phases: {
			charging:  { armed: false, length: 0.3, resistPerScaling: 0.1 },
			attacking: { length: 1.6 },
			cooldown:  { armed: false, length: 0.6 }
		}
	},
	//The first part that CREATES something. Its weapon is `fixed` -- section 5 says attack size and damage
	//must not touch the wand itself, because those stats belong to the fireball it produces. The wand is an
	//aiming device that happens to be able to poke someone.
	{
		index: "wand",
		name: "Wand",
		scalingLabel: "Fireball Size/Damage",
		size: 1,
		damage: 1,
		chargeLength: 90,
		attackLength: 3,      //VOLLEYS, not ticks -- see attackMode below
		cooldown: 25,
		modSlots: 3,
		attackMode: "count",
		scaling: { size: 0.2, damage: 0.3 },
		weapon: {
			spin: 0.02, damage: 2, knockback: 1, fixed: true,
			shape: [{ angle: 0, inner: 0, length: 34, width: 10 }]
		},
		//A hazard rather than a projectile: a fireball is a patch of the arena the enemy now has to avoid,
		//and it stays put until it burns out. `life` is authored here in ticks. Section 5 suggested reading
		//it off attackLength, which is no longer possible -- attackLength is the volley count for this part,
		//so the two readings collided and this one lost.
		spawn: {
			kind: "hazard",
			origin: "weapon",
			radius: 34,
			damage: 7,
			life: 130
		}
	},
	//The projectile counterpart, and the part that resolves section 5's three-way fight over bullet count:
	//`count` owns "three bullets" and is what Magazine Size grows, attackLength owns how many volleys one
	//selection fires. Two stats, two meanings, no overlap.
	{
		index: "gun",
		name: "Gun",
		scalingLabel: "Magazine Size",
		size: 1,
		damage: 1,
		chargeLength: 70,
		attackLength: 2,      //VOLLEYS
		cooldown: 25,
		modSlots: 3,
		attackMode: "count",
		//A MULTIPLIER like every other scaling target, not a flat "+1 per N". 0.112/point works out to one
		//extra bullet per 3 points on a base of 3, and stays sensible if a mod raises that base -- six
		//bullets would gain two per 3 points rather than still crawling up one at a time.
		scaling: { count: 0.112 },
		weapon: {
			spin: 0.03, damage: 2, knockback: 1, fixed: true,
			shape: [{ angle: 0, inner: 0, length: 26, width: 18 }]
		},
		//wallBounces 0 = dies on the first wall it meets, which is what makes a gun a commitment rather
		//than filling the arena with permanent ricochets. The fan is derived from count, never rolled.
		spawn: {
			kind: "projectile",
			origin: "weapon",
			aim: "weapon",
			radius: 11,
			damage: 5,
			knockback: 1.5,
			speed: 14,        //twice a robot's cruising speed, so a bullet reads as a bullet
			life: 200,        //backstop only; the wall gets it first at this speed
			count: 3,
			spread: 0.36,
			wallBounces: 0
		}
	},
	//The part that makes scaling GROW, and the reason the scalingGain hooks exist. No weapon at all --
	//Fury just turns the robot itself into the weapon, feeding on every enemy it slams into.
	{
		index: "fury",
		name: "Fury",
		scalingLabel: "Speed/Damage",
		size: 1,
		damage: 1,
		chargeLength: 100,
		attackLength: 100,
		cooldown: 20,
		modSlots: 3,
		scaling: { contactDamage: 0.5, bounce: 0.04 },
		scalingGain: { perEnemyContact: 1 }
	}
];

//Preset enemies. The three dummies exist for the Milestone 3 win/draw/loss test and are deliberately
//identical apart from health -- see clacksApplyContactDamage() for why those exact numbers work.
//They must stay PARTLESS: the regression only holds while nothing but contact damage is in play.
var clacksEnemyArray = [
	{ index: "dummy99",  name: "Dummy 99",  maxHealth: 99,  radius: CLACKS_DEFAULT_RADIUS, color: "#7ea8d8", parts: [] },
	{ index: "dummy100", name: "Dummy 100", maxHealth: 100, radius: CLACKS_DEFAULT_RADIUS, color: "#7ea8d8", parts: [] },
	{ index: "dummy101", name: "Dummy 101", maxHealth: 101, radius: CLACKS_DEFAULT_RADIUS, color: "#7ea8d8", parts: [] },
	//Armed sparring partners for the weapon tests. Fatter health pools because a blade hits far harder
	//than a body does, and a 100hp duel with swords would be over before anything is observable.
	{ index: "punchbag",  name: "Punchbag",  maxHealth: 250, radius: CLACKS_DEFAULT_RADIUS, color: "#7ea8d8", parts: [] },
	{ index: "swordbot",  name: "Swordbot",  maxHealth: 250, radius: CLACKS_DEFAULT_RADIUS, color: "#7ea8d8", parts: ["shortsword"] },
	//Shoots back, so the deflection pass has something to deflect. The only enemy whose damage can arrive
	//from across the arena, which also makes it the one that proves objects respect teams.
	{ index: "gunner",    name: "Gunner",    maxHealth: 250, radius: CLACKS_DEFAULT_RADIUS, color: "#7ea8d8", parts: ["gun"] }
];

//Game modes (CLACKS_DESIGN.md section 8). waves is an array of enemy arrays; each entry carries only
//an enemy index and a quantity.
//
//playerParts and playerHealth are OPTIONAL and override the saved Clacker for that mode. They exist
//because there is no customisation UI yet and the weapon tests need a known loadout, but they survive
//that: a tutorial or a fixed-loadout challenge mode wants exactly this.
//
//The armed matchups raise playerHealth to match their opponent. A blade hits several times harder than
//a body does, so the stock 100hp against an armed 250hp sparring partner isn't a duel to watch, it's a
//countdown to a guaranteed loss.
var clacksModeArray = [
	{
		index: "duel99",
		name: "Duel — 99hp",
		endless: false,
		maxEntities: 0,   //0 = uncapped
		waves: [[{ enemy: "dummy99", quantity: 1 }]]
	},
	{
		index: "duel100",
		name: "Duel — 100hp",
		endless: false,
		maxEntities: 0,
		waves: [[{ enemy: "dummy100", quantity: 1 }]]
	},
	{
		index: "duel101",
		name: "Duel — 101hp",
		endless: false,
		maxEntities: 0,
		waves: [[{ enemy: "dummy101", quantity: 1 }]]
	},
	//Weapon test matchups. Each isolates one thing: does the blade damage the enemy (and not its owner),
	//do two blades parry, does a weapon that comes and goes behave, does a non-spinning double weapon.
	{
		index: "sword",
		name: "Sword — vs Punchbag",
		endless: false,
		maxEntities: 0,
		playerParts: ["shortsword"],
		waves: [[{ enemy: "punchbag", quantity: 1 }]]
	},
	{
		index: "clash",
		name: "Clash — sword vs sword",
		endless: false,
		maxEntities: 0,
		playerParts: ["shortsword"],
		playerHealth: 250,
		waves: [[{ enemy: "swordbot", quantity: 1 }]]
	},
	{
		index: "longsword",
		name: "Long Sword — vs Punchbag",
		endless: false,
		maxEntities: 0,
		playerParts: ["longsword"],
		waves: [[{ enemy: "punchbag", quantity: 1 }]]
	},
	{
		index: "wings",
		name: "Wings — vs Swordbot",
		endless: false,
		maxEntities: 0,
		playerParts: ["wings"],
		playerHealth: 250,
		waves: [[{ enemy: "swordbot", quantity: 1 }]]
	},
	//The only matchup where scaling grows on its own, so it's the one that proves the growth hooks work
	//without touching the Scale +/- buttons.
	{
		index: "fury",
		name: "Fury — scaling growth",
		endless: false,
		maxEntities: 0,
		playerParts: ["fury"],
		playerHealth: 250,
		waves: [[{ enemy: "punchbag", quantity: 1 }]]
	},
	//The object-layer matchups. Wand isolates hazards, Gun isolates projectiles, and Deflect is the only
	//one where a blade and a bullet meet -- it also proves a deflected bullet changes hands, because the
	//Gunner can be killed by its own ammunition.
	{
		index: "wand",
		name: "Wand — vs Punchbag",
		endless: false,
		maxEntities: 0,
		playerParts: ["wand"],
		waves: [[{ enemy: "punchbag", quantity: 1 }]]
	},
	{
		index: "gun",
		name: "Gun — vs Punchbag",
		endless: false,
		maxEntities: 0,
		playerParts: ["gun"],
		waves: [[{ enemy: "punchbag", quantity: 1 }]]
	},
	{
		index: "deflect",
		name: "Deflect — sword vs Gunner",
		endless: false,
		maxEntities: 0,
		playerParts: ["shortsword"],
		playerHealth: 250,
		waves: [[{ enemy: "gunner", quantity: 1 }]]
	},
	//Three parts on one robot, so the cycle actually wraps and every phase difference is visible in
	//sequence. The only test that exercises clacksNextPart().
	{
		index: "cycle",
		name: "Cycle — all three parts",
		endless: false,
		maxEntities: 0,
		playerParts: ["shortsword", "longsword", "wings"],
		playerHealth: 250,
		waves: [[{ enemy: "swordbot", quantity: 1 }]]
	}
];

function clacksFindDefinition(array, index) {
	for (const entry of array) {
		if (entry.index == index) {
			return entry;
		}
	}
	return null;
}

//Always returns something. An unknown part index falls back to "none" rather than throwing, so a
//corrupted save or a mod that removed a part can't hard-crash a match.
function clacksGetPart(index) {
	const found = clacksFindDefinition(clacksPartArray, index);
	if (found != null) {
		return found;
	}
	return clacksPartArray[0];
}

//---------------------------------------------------------------------------------------------------
//Entity + part construction
//---------------------------------------------------------------------------------------------------
//One factory, so the player, enemies, and anything an attack part spawns later all share a shape.
//Everything in CLACKS_DESIGN.md section 3 is present from the start even where nothing reads it yet --
//parts and mods will expect these fields to exist, and adding them later means auditing every
//construction site.
function clacksMakeEntity(options) {
	const settings = options || {};
	const maxHealth = (settings.maxHealth != undefined) ? settings.maxHealth : 100;
	clacksNextId++;
	return {
		//Identity, not an array position: weapons remember who they are already touching, and array
		//positions shift the moment clacksResolveDeaths() filters the list. Only ever used as a key,
		//never iterated, so it cannot influence simulation order.
		id: clacksNextId,
		name: settings.name || "Entity",
		team: settings.team || 0,             //0 = player, 1 = enemies, others = neutral/chaotic
		maxHealth: maxHealth,
		health: (settings.health != undefined) ? settings.health : maxHealth,
		radius: settings.radius || CLACKS_DEFAULT_RADIUS,
		x: settings.x || 0,
		y: settings.y || 0,
		//VELOCITY IS A VECTOR, and it is the truth: direction and speed are derived from it, never
		//stored. Momentum transfer only works on vectors -- the old direction+speed pair could not
		//represent "some of your momentum is now mine" without throwing one of the two away.
		vx: settings.vx || 0,
		vy: settings.vy || 0,
		//Per-entity restitution MULTIPLIERS on top of the global constants, not absolute speeds. Kept
		//separate on purpose so a mod can touch one without the other (section 3). 1 = no change.
		wallBounce: (settings.wallBounce != undefined) ? settings.wallBounce : 1,
		entityBounce: (settings.entityBounce != undefined) ? settings.entityBounce : 1,
		scaling: 0,
		states: [],                           //temporary states: piercing, invincible, ...
		parts: settings.parts || [],
		partSlots: settings.partSlots || 5,
		activePart: 0,
		noPart: null,                         //lazy "none" instance; see clacksActivePart()
		//Must carry the SAME keys clacksResolvePart() produces, with neutral values. Today the resolver
		//runs for everything before any collision, so this is only ever read on the first frame -- but an
		//entity spawned MID-tick (a projectile, a summon) would reach clacksSettlePair() on this stub,
		//and a missing `bounce` multiplies its velocity into NaN with nothing thrown to say so.
		resolved: {
			part: null, definition: null, weapon: null, spawn: null,
			resist: 0, contactDamage: 1, bounce: 1
		},
		//Weapon rotation lives on the ENTITY, not on the part, so a blade that vanishes and comes back
		//(Long Sword) resumes where it was instead of snapping to zero, and so a parry has somewhere
		//stable to flip the direction. weaponSpin is the sign only; the rate comes from the part.
		//
		//Neither of these two defaults is cosmetic. Give every entity the same start angle and the same
		//spin, and two robots carrying the SAME part hold their blades permanently parallel -- they
		//rotate in lockstep forever and can never cross, so a mirror matchup produces exactly zero
		//parries. So: the angle is fanned out by id using the golden angle (the standard way to spread N
		//things around a circle without them clumping), and the two sides turn opposite ways, which
		//guarantees relative rotation between any player blade and any enemy blade.
		//Derived, never rolled -- adding an RNG call here would shift the whole random sequence and
		//invalidate every balance figure on record.
		weaponAngle: (settings.weaponAngle != undefined)
			? settings.weaponAngle
			: (clacksNextId * CLACKS_GOLDEN_ANGLE) % (Math.PI * 2),
		weaponSpin: (settings.weaponSpin != undefined) ? settings.weaponSpin : ((settings.team) ? -1 : 1),
		weaponHits: {},                       //target id -> currently overlapped, for rising-edge damage
		weaponClashes: {},                    //other entity id -> blades currently crossed
		//"Global" modifiers multiplied by the active part's equivalents. globalDamage doubles as the
		//entity's basic contact damage (section 3).
		globalSize: 1,
		globalDamage: 1,
		color: settings.color || "#de93ac",
		alive: true
	};
}

//Look up a live entity by id. Objects hold an ownerId rather than a reference so that a bullet can outlive
//the robot that fired it without keeping a corpse alive, and without ever crediting scaling to one.
function clacksFindEntity(id) {
	for (const entity of clacksEntities) {
		if (entity.id == id) {
			return entity;
		}
	}
	return null;
}

//A projectile or a hazard. One factory for both: `kind` decides only whether it moves, whether walls
//matter, and how it draws -- everything else is the same flags on the same fields.
//
//Note what ISN'T here: health, mass, parts, states, resolved. An object is not a lightweight entity, it is
//a different thing, and keeping it out of clacksEntities is what guarantees it can never wander into the
//energy band, the |vx| floor, or clacksJudgeMatch()'s enemy count.
function clacksMakeObject(options) {
	const settings = options || {};
	clacksNextObjectId++;
	return {
		id: clacksNextObjectId,
		kind: settings.kind || "projectile",
		//Whose it is. Team decides who it damages (section 2); ownerId only credits scaling gains, and is
		//reassigned when a blade deflects it -- at which point it belongs to whoever swatted it.
		ownerId: settings.ownerId || 0,
		team: settings.team || 0,
		x: settings.x || 0,
		y: settings.y || 0,
		vx: settings.vx || 0,
		vy: settings.vy || 0,
		radius: settings.radius || 10,
		damage: (settings.damage != undefined) ? settings.damage : 1,
		knockback: settings.knockback || 0,
		life: (settings.life != undefined) ? settings.life : 100,   //ticks; ALWAYS finite, nothing lives forever
		gravity: settings.gravity == true,
		//A BUDGET, not a flag. 0 dies on the first wall (a bullet); a few lets a thrown potion rattle around
		//before it goes off. Hazards ignore walls entirely, so this is unread for them.
		wallBounces: settings.wallBounces || 0,
		//Does it survive damaging something. False = a bullet, true = a hazard you can walk through.
		pierce: settings.pierce == true,
		hits: {},        //target id -> currently overlapped, for rising-edge damage
		deflects: {},    //entity id -> currently overlapping that entity's blade
		color: settings.color || null,
		alive: true
	};
}

//An attack part INSTANCE carried by an entity: the definition's numbers copied in, plus the per-match
//state that changes as it cycles. Copied rather than referenced so mods can alter one entity's part
//without editing the shared definition.
function clacksMakePart(index) {
	const definition = clacksGetPart(index);
	return {
		definition: definition.index,
		state: "charging",
		timer: 0,
		size: definition.size,
		damage: definition.damage,
		chargeLength: definition.chargeLength,
		attackLength: definition.attackLength,
		cooldown: definition.cooldown,
		//Volleys fired so far this selection, for attackMode "count" only. Reset when the part advances, so
		//the part is already primed the next time the cycle comes round to it.
		shots: 0,
		//Set when the part ENTERS its attacking phase, consumed by clacksRunSpawns(). A flag rather than a
		//direct call because entity.resolved still describes last tick inside clacksAdvancePart().
		spawnPending: false,
		mods: []
	};
}

//---------------------------------------------------------------------------------------------------
//Attack part cycle
//---------------------------------------------------------------------------------------------------
//An entity ALWAYS has an active part instance. With parts[] empty that is a lazily built "none", which
//is what lets the phase cycle keep running on a bare robot (CLACKS_DESIGN.md section 5) and gives mods
//somewhere to live before any attack part is equipped.
function clacksActivePart(entity) {
	const part = entity.parts[entity.activePart];
	if (part != undefined) {
		return part;
	}
	if (entity.parts.length > 0) {
		entity.activePart = 0;   //index fell out of range; a mod removing a part is the likely cause
		return entity.parts[0];
	}
	if (entity.noPart == null) {
		entity.noPart = clacksMakePart("none");
	}
	return entity.noPart;
}

//charging -> attacking -> cooldown -> the next part's charging, wrapping at the end of the array.
function clacksAdvancePart(entity) {
	const part = clacksActivePart(entity);
	const definition = clacksGetPart(part.definition);
	//Timepiece's trigger. Expressed per SECOND rather than per tick so the number in a definition stays
	//legible -- CLACKS_TICK_MS is the only place that knows how long a tick is.
	clacksGainScaling(entity, "perSecond", CLACKS_TICK_MS / 1000);
	part.timer++;
	//A LOOP, not a single if: the Null mod sets charge and attack length to zero, and a zero-length
	//phase has to fall straight through to the next one inside the same tick. The guard is what stops an
	//all-zero part spinning forever -- a mod is allowed to be silly, it is not allowed to hang the game.
	for (let guard = 0; guard < 8; guard++) {
		if (part.timer < clacksPhaseLength(entity, part)) {
			return;
		}
		if (part.state == "charging") {
			part.state = "attacking";
			part.timer = 0;
			//The ONE place a spawn is armed. Everything without a `spawn` block sets this and has it
			//harmlessly cleared -- cheaper than asking the definition, and it keeps the trigger in one spot.
			part.spawnPending = true;
		}
		else if (part.state == "attacking") {
			part.timer = 0;
			//attackMode "count" loops back through charging instead of finishing, attackLength times. This is
			//section 4's alternate reading of attackLength, and it is why a wand fires three separate
			//fireballs on one selection rather than holding one open for three seconds. Falls through to
			//cooldown on the last volley, so the tail of the cycle is unchanged.
			if (definition.attackMode == "count" && part.shots + 1 < part.attackLength) {
				part.shots++;
				part.state = "charging";
				continue;   //not a return: a zero-length charge (the Null mod) must fall straight through
			}
			part.shots = 0;
			part.state = "cooldown";
		}
		else {
			//Reset the part we're leaving as well as the one we're joining, so it is already primed the
			//next time the cycle comes round to it.
			part.state = "charging";
			part.timer = 0;
			if (entity.parts.length > 0) {
				entity.activePart = (entity.activePart + 1) % entity.parts.length;
				const next = clacksActivePart(entity);
				next.state = "charging";
				next.timer = 0;
			}
			return;   //the incoming part gets its own tick; don't run its phases in this one too
		}
	}
}

function clacksPhaseLength(entity, part) {
	if (part.state == "charging") {
		return clacksChargeLength(entity, part);
	}
	if (part.state == "attacking") {
		//In count mode attackLength is a volley COUNT, so it cannot also be this phase's duration. The flash
		//gets a fixed length instead -- see CLACKS_SHOT_TICKS.
		if (clacksGetPart(part.definition).attackMode == "count") {
			return CLACKS_SHOT_TICKS;
		}
		return part.attackLength;
	}
	return part.cooldown;
}

//Charge length is the one phase length scaling can touch (Long Sword), and it DIVIDES -- more scaling
//means a shorter wind-up, never a longer one.
function clacksChargeLength(entity, part) {
	const definition = clacksGetPart(part.definition);
	return part.chargeLength / clacksScalingFactor(definition, "chargeLength", entity.scaling);
}

//1 when the part doesn't scale that target at all, so every caller can multiply (or divide) blind.
function clacksScalingFactor(definition, target, scaling) {
	if (definition.scaling == undefined || definition.scaling[target] == undefined) {
		return 1;
	}
	return 1 + (definition.scaling[target] * scaling);
}

//What makes scaling GROW. Every source in CLACKS_DESIGN.md section 6 is one of these triggers:
//Timepiece is perSecond, Megabouncer is perWallBounce, Punished Bot is perDamageTaken, and Fury is
//perEnemyContact. Parts declare them today; mods will write the same keys onto a part instance.
//Deliberately RNG-free, like the rest of the part path.
function clacksGainScaling(entity, trigger, amount) {
	const definition = entity.resolved.definition;
	if (definition == null || definition.scalingGain == undefined) {
		return;
	}
	const rate = definition.scalingGain[trigger];
	if (rate == undefined) {
		return;
	}
	entity.scaling += rate * ((amount == undefined) ? 1 : amount);
}

//Flattens definition -> part instance -> entity globals -> phase override -> scaling into the numbers
//this tick actually uses, and parks the result on entity.resolved.
//
//Rebuilt every tick rather than cached on phase change, because three separate inputs -- the phase, the
//entity's scaling, and (later) mods -- can all move at any moment. It is a handful of multiplies.
function clacksResolvePart(entity) {
	const part = clacksActivePart(entity);
	const definition = clacksGetPart(part.definition);
	const phase = (definition.phases != undefined) ? definition.phases[part.state] : undefined;
	const resolved = {
		part: part,
		definition: definition,
		weapon: null,
		spawn: null,
		resist: 0,
		//Entity-level multipliers, which is how a weaponless part like Fury does anything at all.
		contactDamage: clacksScalingFactor(definition, "contactDamage", entity.scaling),
		bounce: clacksScalingFactor(definition, "bounce", entity.scaling)
	};

	//Wings' charging phase. Capped, or enough scaling would make an entity flatly unkillable.
	if (phase != undefined && phase.resistPerScaling != undefined) {
		resolved.resist = Math.min(CLACKS_MAX_RESIST, phase.resistPerScaling * entity.scaling);
	}

	const template = definition.weapon;
	if (template != undefined && (phase == undefined || phase.weapon != false)) {
		//A `fixed` weapon is a PROP, not a blade: section 5 says the wand and the gun must be untouched by
		//attack size and damage, because those stats belong to what they create. Phase multipliers still
		//apply -- those are authoring, not player stats, and a part must always be able to hide its own prop.
		//Size and damage multipliers are folded in ONCE here and baked into every segment, so nothing
		//downstream -- hit detection, parries, drawing -- has to know scaling or phases exist.
		const fixed = (template.fixed == true);
		const size = fixed ? 1 : (part.size * entity.globalSize
			* clacksScalingFactor(definition, "size", entity.scaling));
		const lengthScale = size * clacksPhaseMultiplier(phase, "length");
		const widthScale = size * clacksPhaseMultiplier(phase, "width");
		const shape = [];
		for (const segment of template.shape) {
			shape.push({
				angle: segment.angle,
				inner: segment.inner * lengthScale,
				length: segment.length * lengthScale,
				width: segment.width * widthScale
			});
		}
		const damageStats = fixed ? 1 : (part.damage * entity.globalDamage
			* clacksScalingFactor(definition, "damage", entity.scaling));
		resolved.weapon = {
			shape: shape,
			spin: template.spin * clacksPhaseMultiplier(phase, "spin"),
			damage: template.damage * damageStats * clacksPhaseMultiplier(phase, "damage"),
			knockback: template.knockback * clacksPhaseMultiplier(phase, "knockback"),
			//Present but harmless: a retracted wing is a shield, and it should not parry either.
			armed: (phase == undefined || phase.armed != false)
		};
	}

	//What the part CREATES. Resolved here rather than at spawn time so a fireball's size and damage come
	//through exactly the same definition -> instance -> globals -> scaling path a weapon's numbers do --
	//which is what makes a mod that edits part.size produce bigger fireballs without knowing spawns exist.
	//Resolved every tick even outside the attacking phase; it costs a handful of multiplies and means
	//clacksRunSpawns() never has to care which phase armed it.
	const spawnTemplate = definition.spawn;
	if (spawnTemplate != undefined) {
		const spawnSize = part.size * entity.globalSize
			* clacksScalingFactor(definition, "size", entity.scaling);
		const spawnDamage = part.damage * entity.globalDamage
			* clacksScalingFactor(definition, "damage", entity.scaling);
		//Rounded and floored at 1: scaling "Magazine Size" has to land on whole bullets, and a rate that
		//rounds down to zero must still fire something.
		const count = Math.max(1, Math.round((spawnTemplate.count || 1)
			* clacksScalingFactor(definition, "count", entity.scaling)));
		resolved.spawn = {
			kind: spawnTemplate.kind || "projectile",
			origin: spawnTemplate.origin || "center",
			aim: spawnTemplate.aim || "weapon",
			radius: (spawnTemplate.radius || 10) * spawnSize,
			damage: ((spawnTemplate.damage != undefined) ? spawnTemplate.damage : 1) * spawnDamage,
			knockback: spawnTemplate.knockback || 0,
			speed: spawnTemplate.speed || 0,
			life: spawnTemplate.life || 100,
			gravity: spawnTemplate.gravity == true,
			wallBounces: spawnTemplate.wallBounces || 0,
			//A hazard defaults to piercing because it is a SPACE -- walking through one must not consume it.
			pierce: (spawnTemplate.pierce != undefined)
				? spawnTemplate.pierce
				: (spawnTemplate.kind == "hazard"),
			spread: spawnTemplate.spread || 0,
			count: count
		};
	}
	entity.resolved = resolved;
}

function clacksPhaseMultiplier(phase, key) {
	if (phase == undefined || phase[key] == undefined) {
		return 1;
	}
	return phase[key];
}

//---------------------------------------------------------------------------------------------------
//Clacker save data
//---------------------------------------------------------------------------------------------------
//loadSlot() does `data = newSave`, replacing the whole object, and updateSave() is a no-op that only
//autosaves -- so there is NO migration hook in this engine. Any save written before Clacks existed
//simply won't have data.clacker. Hence lazy defaulting: never read data.clacker directly, always come
//through here, and an old save heals itself the first time Clacks is opened.
function clacksGetClacker() {
	if (data.clacker == undefined) {
		data.clacker = {
			name: "Clacker",
			color: "#de93ac",
			parts: []
		};
	}
	return data.clacker;
}

//Scene entry point -- the "clacksTest" scene in globalSceneArray is just "eval clacksTest();".
function clacksTest() {
	openButton();
	clacksStop();   //re-entering the scene must never leave a second loop running
	clacksBuildBoard();
	clacksSetSpeed(1);
	clacksStart();
	clacksStartGame("duel100");   //dev default: the draw case, the fussiest of the three
}

function clacksBuildBoard() {
	//Appending here is safe: writeHTML writes each scene line straight to the DOM as it processes
	//it, and "eval clacksTest();" is the scene's only line, so nothing afterward reassigns
	//output.innerHTML.
	document.getElementById("output").innerHTML += `
		<div id="clacksSpace">
			<canvas id="clacksCanvas" width="${clacksArena.width}" height="${clacksArena.height}"></canvas>
		</div>
		<div id="clacksReadout">
			<p id="clacksStatus">&nbsp;</p>
			<p id="clacksScaling">&mdash;</p>
			<p id="clacksVars">&nbsp;</p>
		</div>
		<div id="clacksSpeedBar">
			<h4 class="button clacksSpeedButton" id="clacksSpeed0" onclick="clacksSetSpeed(0)">&#10074;&#10074;</h4>
			<h4 class="button clacksSpeedButton" id="clacksSpeed1" onclick="clacksSetSpeed(1)">1&times;</h4>
			<h4 class="button clacksSpeedButton" id="clacksSpeed2" onclick="clacksSetSpeed(2)">2&times;</h4>
			<h4 class="button clacksSpeedButton" id="clacksSpeed4" onclick="clacksSetSpeed(4)">4&times;</h4>
		</div>
		<div id="clacksTestBar">
			<h4 class="button clacksSpeedButton" onclick="clacksStartGame('duel99')">Duel 99</h4>
			<h4 class="button clacksSpeedButton" onclick="clacksStartGame('duel100')">Duel 100</h4>
			<h4 class="button clacksSpeedButton" onclick="clacksStartGame('duel101')">Duel 101</h4>
			<h4 class="button clacksSpeedButton" onclick="clacksStartGame('sword')">Sword</h4>
			<h4 class="button clacksSpeedButton" onclick="clacksStartGame('clash')">Clash</h4>
			<h4 class="button clacksSpeedButton" onclick="clacksStartGame('longsword')">Long</h4>
			<h4 class="button clacksSpeedButton" onclick="clacksStartGame('wings')">Wings</h4>
			<h4 class="button clacksSpeedButton" onclick="clacksStartGame('fury')">Fury</h4>
			<h4 class="button clacksSpeedButton" onclick="clacksStartGame('cycle')">Cycle</h4>
			<h4 class="button clacksSpeedButton" onclick="clacksStartGame('wand')">Wand</h4>
			<h4 class="button clacksSpeedButton" onclick="clacksStartGame('gun')">Gun</h4>
			<h4 class="button clacksSpeedButton" onclick="clacksStartGame('deflect')">Deflect</h4>
			<h4 class="button clacksSpeedButton" onclick="clacksDevScaling(1)">Scale +</h4>
			<h4 class="button clacksSpeedButton" onclick="clacksDevScaling(-1)">Scale &minus;</h4>
		</div>
	`;
}

//---------------------------------------------------------------------------------------------------
//Starting a match
//---------------------------------------------------------------------------------------------------
//Seed is optional; pass one to replay a match exactly. Omit it and we take a time-based seed but still
//record it in clacksMatch.seed, so an interesting match can always be reproduced afterwards.
function clacksStartGame(modeIndex, seed) {
	const mode = clacksFindDefinition(clacksModeArray, modeIndex);
	if (mode == null) {
		console.error("Clacks: unknown game mode " + modeIndex);
		return;
	}
	if (seed == undefined) {
		seed = (Date.now() & 0xFFFFFFFF) >>> 0;
	}
	clacksSeedRng(seed);
	clacksNextId = 0;
	clacksNextObjectId = 0;
	clacksObjects = [];   //a fireball must never outlive the match that lit it

	const clacker = clacksGetClacker();
	//A mode may pin the loadout; otherwise it's whatever the player saved.
	let loadout = clacker.parts;
	if (mode.playerParts != undefined) {
		loadout = mode.playerParts;
	}
	const player = clacksMakeEntity({
		name: clacker.name,
		team: 0,
		maxHealth: (mode.playerHealth != undefined) ? mode.playerHealth : 100,
		radius: CLACKS_DEFAULT_RADIUS,
		color: clacker.color,
		parts: loadout.map(index => clacksMakePart(index))
	});
	clacksPlaceEntity(player, 0.3);

	clacksEntities = [player];
	clacksMatch = {
		mode: mode.index,
		modeName: mode.name,
		seed: seed,
		state: "running",   //running / won / lost / draw
		wave: 0,
		tick: 0,
		collisions: 0,
		player: player
	};
	clacksSpawnWave(0);
}

//Spawns every enemy listed in a wave. maxEntities isn't honoured yet -- that's the "Entity cap" item
//in the game-mode milestone -- but waves are already the shape section 8 describes.
function clacksSpawnWave(waveNumber) {
	const mode = clacksFindDefinition(clacksModeArray, clacksMatch.mode);
	const wave = mode.waves[waveNumber];
	if (wave == undefined) {
		return;
	}
	for (const entry of wave) {
		const template = clacksFindDefinition(clacksEnemyArray, entry.enemy);
		if (template == null) {
			console.error("Clacks: unknown enemy " + entry.enemy);
			continue;
		}
		for (let n = 0; n < entry.quantity; n++) {
			const enemy = clacksMakeEntity({
				name: template.name,
				team: 1,
				maxHealth: template.maxHealth,
				radius: template.radius,
				color: template.color,
				parts: template.parts.map(index => clacksMakePart(index))
			});
			clacksPlaceEntity(enemy, 0.7);
			clacksEntities.push(enemy);
		}
	}
}

//Drops an entity at a horizontal fraction of the playfield with a random heading, clamped so it can
//never start clipping a wall. Vertical placement is randomised so a duel doesn't open with the two
//entities on a perfectly level line every single time.
function clacksPlaceEntity(entity, widthFraction) {
	const minX = clacksArena.wall + entity.radius;
	const maxX = clacksArena.width - clacksArena.wall - entity.radius;
	const minY = clacksArena.wall + entity.radius;
	const maxY = clacksArena.height - clacksArena.wall - entity.radius;
	entity.x = minX + ((maxX - minX) * widthFraction);
	entity.y = minY + ((maxY - minY) * clacksRandom());
	clacksSetVelocity(entity, clacksRandom() * Math.PI * 2, CLACKS_DEFAULT_SPEED);
	clacksEnforceMinimumX(entity);   //a near-vertical opening heading would stall the first contact
}

//---------------------------------------------------------------------------------------------------
//Velocity helpers
//---------------------------------------------------------------------------------------------------
//vx/vy are stored; speed and direction are computed on demand. Everything that wants to think in
//"heading and speed" -- attack parts like Lance, entity placement -- comes through these, so there is
//exactly one place that knows how the two representations convert.

function clacksSpeedOf(entity) {
	return Math.sqrt((entity.vx * entity.vx) + (entity.vy * entity.vy));
}

function clacksDirectionOf(entity) {
	return Math.atan2(entity.vy, entity.vx);
}

function clacksSetVelocity(entity, direction, speed) {
	entity.vx = Math.cos(direction) * speed;
	entity.vy = Math.sin(direction) * speed;
}

//Rescales to an exact speed while preserving heading. A stationary entity has no heading to preserve,
//so it is left alone -- clacksEnforceMinimumX() is what gets it moving again.
function clacksSetEntitySpeed(entity, speed) {
	const current = clacksSpeedOf(entity);
	if (current == 0) {
		return;
	}
	const capped = Math.min(speed, CLACKS_MAX_SPEED);
	entity.vx = (entity.vx / current) * capped;
	entity.vy = (entity.vy / current) * capped;
}

//Mass is derived from area rather than stored. Uniform density means the constant factor cancels out
//of every collision, so radius alone decides who shoves whom -- a big entity shrugs off a small one
//and sends it flying, which is free variety for horde mode and for boss enemies.
function clacksMassOf(entity) {
	return entity.radius * entity.radius;
}

//Canvas can't read CSS variables, so pull the brand palette off :root once and cache it. Keeps
//Clacks on the same colours as the rest of the game instead of hardcoding hexes in two places.
function clacksGetPalette() {
	if (clacksPalette != null) {
		return clacksPalette;
	}
	const root = getComputedStyle(document.documentElement);
	function swatch(name, fallback) {
		const value = root.getPropertyValue(name).trim();
		if (value == "") {
			return fallback;
		}
		return value;
	}
	clacksPalette = {
		wall:   swatch("--c-cream", "#fcebb5"),
		floor:  "rgba(0,0,0,0.45)",
		player: swatch("--c-pink", "#de93ac"),
		text:   "#ffffff"
	};
	return clacksPalette;
}

function clacksStart() {
	clacksLastFrame = performance.now();
	clacksAccumulator = 0;
	clacksTickCount = 0;
	clacksFps = 0;
	clacksRafId = requestAnimationFrame(clacksLoop);
}

function clacksStop() {
	if (clacksRafId != null) {
		cancelAnimationFrame(clacksRafId);
	}
	clacksRafId = null;
}

function clacksLoop(now) {
	//Scene-exit guard. writeScene() clears #output, so the canvas going missing is our signal that
	//the player left Clacks. Same self-terminating pattern the title screen timeouts use, and the
	//reason buttonsRise() blew up in Milestone 1 -- a loop must never outlive its scene.
	const canvas = document.getElementById("clacksCanvas");
	if (!canvas) {
		clacksRafId = null;
		return;
	}

	let elapsed = now - clacksLastFrame;
	clacksLastFrame = now;

	//Measure the frame rate from the RAW delta, before the clamp below. Clamping first would peg the
	//readout at a permanent 4fps (1000/250) and hide the fact that anything is struggling at all.
	if (elapsed > 0) {
		const instant = 1000 / elapsed;
		if (clacksFps == 0) {
			clacksFps = instant;
		}
		else {
			clacksFps = (clacksFps * 0.9) + (instant * 0.1);
		}
	}

	//A backgrounded tab hands back an enormous delta on return. Simulating all of it at once would
	//lock the page up, so drop the missing time rather than try to catch up on it. Below ~4fps this
	//means the sim knowingly runs in slow motion -- correctness of each tick is never traded away.
	if (elapsed > 250) {
		elapsed = 250;
	}

	//Speed scales how many ticks get consumed, never how long a tick is, so fast-forward stays
	//deterministic (CLACKS_DESIGN.md section 2).
	clacksAccumulator += elapsed * clacksSpeed;
	let ticks = 0;
	while (clacksAccumulator >= CLACKS_TICK_MS && ticks < CLACKS_MAX_TICKS_PER_FRAME) {
		clacksTick();
		clacksAccumulator -= CLACKS_TICK_MS;
		ticks++;
	}
	if (ticks >= CLACKS_MAX_TICKS_PER_FRAME) {
		clacksAccumulator = 0;   //we're behind and losing; drop the backlog instead of compounding it
	}

	clacksDraw(canvas);
	clacksUpdateReadout(now);
	clacksRafId = requestAnimationFrame(clacksLoop);
}

//---------------------------------------------------------------------------------------------------
//Simulation
//---------------------------------------------------------------------------------------------------
//One simulation step. Order matters: move everything, resolve entity contacts (which bank damage),
//THEN resolve deaths, THEN judge the match. See clacksApplyContactDamage() for why deaths can't be
//resolved inline.
function clacksTick() {
	clacksTickCount++;
	if (clacksMatch == null || clacksMatch.state != "running") {
		return;
	}
	clacksMatch.tick++;

	//Parts first so entity.resolved describes THIS tick before anything reads it, then movement, then
	//weapons, then objects, then bodies. Deaths stay last and stay collective -- see
	//clacksApplyContactDamage(). Spawning sits inside the resolve loop so a new object gets moved on the
	//very tick it was born rather than hanging motionless for one frame.
	for (const entity of clacksEntities) {
		clacksAdvancePart(entity);
		clacksResolvePart(entity);
		clacksRunSpawns(entity);
	}
	for (const entity of clacksEntities) {
		clacksMoveEntity(entity);
		clacksSpinWeapon(entity);
	}
	clacksWeaponCollisions();
	clacksUpdateObjects();
	//Deflections BEFORE damage, so a bullet a blade just swatted away is not also allowed to land on the
	//body behind it in the same tick. Same reasoning as clashes running before weapon hits.
	clacksWeaponDeflections();
	clacksObjectCollisions();
	clacksEntityCollisions();
	clacksResolveDeaths();
	clacksCullObjects();
	clacksJudgeMatch();
}

//---------------------------------------------------------------------------------------------------
//Weapons
//---------------------------------------------------------------------------------------------------
//Nothing in here consumes RNG, on purpose. The 99/100/101 regression only holds while the random
//sequence is untouched, so weapons had to be fully deterministic or every balance number on record
//would have needed re-taking.

function clacksSpinWeapon(entity) {
	const weapon = entity.resolved.weapon;
	if (weapon == null) {
		//Blade gone. Forget who it was overlapping, so when it returns (Long Sword's attack phase) it can
		//land a fresh hit on someone it happens to reappear inside of.
		entity.weaponHits = {};
		entity.weaponClashes = {};
		return;
	}
	entity.weaponAngle += weapon.spin * entity.weaponSpin;
	//Kept in [0, 2pi) so the number can't drift into a range where float precision starts costing us
	//angular resolution over a long match.
	if (entity.weaponAngle >= Math.PI * 2) {
		entity.weaponAngle -= Math.PI * 2;
	}
	else if (entity.weaponAngle < 0) {
		entity.weaponAngle += Math.PI * 2;
	}
}

//A spin of 0 means a FIXED weapon, and fixed means fixed in world space -- Wings must be horizontal
//whatever rotation the part before them left behind, so they ignore entity.weaponAngle entirely.
function clacksBladeAngle(entity, weapon, segment) {
	let base = entity.weaponAngle;
	if (weapon.spin == 0) {
		base = 0;
	}
	return base + segment.angle;
}

//One shape segment placed in world space. `inner` is measured from the entity's EDGE, not its centre,
//so a segment at inner 0 reads as something bolted on rather than something skewering the robot, and a
//segment further out is a head or a tip attached to whatever precedes it.
function clacksBladeSegment(entity, weapon, segment) {
	const angle = clacksBladeAngle(entity, weapon, segment);
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	const inner = entity.radius + segment.inner;
	const outer = inner + segment.length;
	return {
		x1: entity.x + (cos * inner),
		y1: entity.y + (sin * inner),
		x2: entity.x + (cos * outer),
		y2: entity.y + (sin * outer),
		width: segment.width,
		cos: cos,
		sin: sin
	};
}

//How far the weapon reaches from the entity's CENTRE, taking the furthest segment. Used to place whatever
//the part spawns at the tip -- a fireball has to leave the wand, not the middle of the robot holding it.
function clacksWeaponReach(entity, weapon) {
	let reach = 0;
	for (const segment of weapon.shape) {
		reach = Math.max(reach, segment.inner + segment.length);
	}
	return entity.radius + reach;
}

function clacksPointSegmentDistance(px, py, segment) {
	const dx = segment.x2 - segment.x1;
	const dy = segment.y2 - segment.y1;
	const lengthSquared = (dx * dx) + (dy * dy);
	let t = 0;
	if (lengthSquared > 0) {
		t = (((px - segment.x1) * dx) + ((py - segment.y1) * dy)) / lengthSquared;
		t = Math.max(0, Math.min(1, t));
	}
	const cx = segment.x1 + (t * dx);
	const cy = segment.y1 + (t * dy);
	return Math.sqrt(((px - cx) * (px - cx)) + ((py - cy) * (py - cy)));
}

//Sign of the cross product of (line -> point). Zero means collinear.
function clacksCrossSign(x1, y1, x2, y2, px, py) {
	return ((x2 - x1) * (py - y1)) - ((y2 - y1) * (px - x1));
}

function clacksSegmentsCross(first, second) {
	const a = clacksCrossSign(second.x1, second.y1, second.x2, second.y2, first.x1, first.y1);
	const b = clacksCrossSign(second.x1, second.y1, second.x2, second.y2, first.x2, first.y2);
	const c = clacksCrossSign(first.x1, first.y1, first.x2, first.y2, second.x1, second.y1);
	const d = clacksCrossSign(first.x1, first.y1, first.x2, first.y2, second.x2, second.y2);
	return ((a > 0) != (b > 0)) && ((c > 0) != (d > 0));
}

//The crossing test is not an optimisation, it's a correctness fix: two blades meeting in a clean X have
//all four endpoints far from the other segment, so the endpoint minimum alone would report a healthy
//gap for the single most common way blades meet.
function clacksSegmentDistance(first, second) {
	if (clacksSegmentsCross(first, second)) {
		return 0;
	}
	return Math.min(
		clacksPointSegmentDistance(first.x1, first.y1, second),
		clacksPointSegmentDistance(first.x2, first.y2, second),
		clacksPointSegmentDistance(second.x1, second.y1, first),
		clacksPointSegmentDistance(second.x2, second.y2, first)
	);
}

function clacksWeaponCollisions() {
	//Clashes before hits: a blade knocked into reverse should be reversed before we ask whether it also
	//landed on a body this tick.
	for (let a = 0; a < clacksEntities.length; a++) {
		for (let b = a + 1; b < clacksEntities.length; b++) {
			clacksClashWeapons(clacksEntities[a], clacksEntities[b]);
		}
	}
	//Not a triangular loop like the body pass: weapons are one-directional, so A's blade hitting B and
	//B's blade hitting A are two separate questions and both have to be asked.
	for (const attacker of clacksEntities) {
		for (const target of clacksEntities) {
			clacksWeaponHit(attacker, target);
		}
	}
}

function clacksWeaponHit(attacker, target) {
	const weapon = attacker.resolved.weapon;
	if (weapon == null || !weapon.armed) {
		return;
	}
	//A weapon never damages its owner (section 2), and never anything sharing its team.
	if (target == attacker || target.team == attacker.team) {
		return;
	}

	//Per-segment width, which is the point of the shape list: a fat hammer head has to reach further
	//than the thin shaft carrying it.
	let touching = false;
	let struck = null;
	for (const segment of weapon.shape) {
		const blade = clacksBladeSegment(attacker, weapon, segment);
		if (clacksPointSegmentDistance(target.x, target.y, blade) < target.radius + (blade.width / 2)) {
			touching = true;
			struck = blade;
			break;   //two wings overlapping the same target is still one hit
		}
	}

	if (!touching) {
		delete attacker.weaponHits[target.id];
		return;
	}
	//THE RISING EDGE. Damage lands on the tick contact begins, never on every tick the blade spends
	//buried in the target -- the same principle as the "closing" test in clacksCollidePair(), and for
	//the same reason: at 100 ticks/sec, per-tick weapon damage would erase an entity in under a second.
	if (!attacker.weaponHits[target.id]) {
		clacksWeaponStrike(attacker, target, weapon, struck);
	}
	attacker.weaponHits[target.id] = true;
}

function clacksWeaponStrike(attacker, target, weapon, blade) {
	if (!clacksHasState(target, "invincible")) {
		target.health -= weapon.damage * (1 - target.resolved.resist);
	}
	clacksGainScaling(attacker, "perWeaponHit");
	clacksGainScaling(target, "perDamageTaken");   //Punished Bot's trigger

	//Knockback runs along the blade's SWING -- perpendicular to the blade, in whichever direction the
	//rotation is going. A weapon that doesn't spin (Wings) has no swing, so it shoves straight outward.
	let kx;
	let ky;
	if (weapon.spin != 0) {
		let direction = 1;
		if (attacker.weaponSpin < 0) {
			direction = -1;
		}
		kx = -blade.sin * direction;
		ky = blade.cos * direction;
	}
	else {
		kx = blade.cos;
		ky = blade.sin;
	}
	//Equal and opposite, both divided by their own mass. The reaction on the wielder is what makes a
	//weapon feel like it has mass rather than being a free damage aura -- and it means a heavy swing
	//against a heavy target shoves the attacker off course, which is a cost worth paying attention to.
	clacksApplyImpulse(target, kx, ky, weapon.knockback);
	clacksApplyImpulse(attacker, -kx, -ky, weapon.knockback * CLACKS_WEAPON_RECOIL);
}

//The one place an outside force enters the physics. `strength` is a velocity change expressed for a
//default-sized entity; dividing by real mass is what makes size mean weight.
//
//Only the hard backstop is applied, never the energy band -- the same trade gravity gets (section 11).
//The band is a rule about what two BODIES leave a collision with; clamping here would delete the shove
//we just spent a hit earning. The next body contact pulls the pair back into range.
function clacksApplyImpulse(entity, dx, dy, strength) {
	const factor = strength * (CLACKS_REFERENCE_MASS / clacksMassOf(entity));
	entity.vx += dx * factor;
	entity.vy += dy * factor;
	if (clacksSpeedOf(entity) > CLACKS_MAX_SPEED) {
		clacksSetEntitySpeed(entity, CLACKS_MAX_SPEED);
	}
}

//Blades meeting reverse both spins. Purely a direction flip: weapons have no health and nothing here
//touches the entities themselves.
function clacksClashWeapons(first, second) {
	const firstWeapon = first.resolved.weapon;
	const secondWeapon = second.resolved.weapon;
	if (firstWeapon == null || secondWeapon == null) {
		return;
	}
	if (!firstWeapon.armed || !secondWeapon.armed || first.team == second.team) {
		return;
	}

	let touching = false;
	for (const firstSegment of firstWeapon.shape) {
		const bladeA = clacksBladeSegment(first, firstWeapon, firstSegment);
		for (const secondSegment of secondWeapon.shape) {
			const bladeB = clacksBladeSegment(second, secondWeapon, secondSegment);
			if (clacksSegmentDistance(bladeA, bladeB) < (bladeA.width + bladeB.width) / 2) {
				touching = true;
				break;
			}
		}
		if (touching) {
			break;
		}
	}

	if (!touching) {
		delete first.weaponClashes[second.id];
		delete second.weaponClashes[first.id];
		return;
	}
	//Rising edge again, and here it is doing real work: blades that stay crossed after a reversal would
	//otherwise flip direction 100 times a second and simply vibrate in place.
	if (!first.weaponClashes[second.id]) {
		first.weaponSpin = -first.weaponSpin;
		second.weaponSpin = -second.weaponSpin;
		//And the OWNERS collide -- a real elastic exchange, not an invented shove, so a clash reads as
		//the two BALLS hitting each other with the blades acting as extensions of them. Same maths as
		//body contact, which is why a head-on parry between equal robots swaps their speeds outright
		//while a glancing one barely registers.
		//
		//Normal is the line of centres, because crossed segments have coincident closest points and so
		//offer no usable contact normal -- but "these two robots just braced against each other" always
		//has a direction. It is also the normal two balls of (radius + reach) would have used, which is
		//exactly the fiction we want.
		const dx = second.x - first.x;
		const dy = second.y - first.y;
		const distance = Math.sqrt((dx * dx) + (dy * dy));
		if (distance > 0) {
			const nx = dx / distance;
			const ny = dy / distance;
			if (clacksExchangeMomentum(first, second, nx, ny)) {
				clacksSettlePair(first, second, false);
			}
		}
	}
	first.weaponClashes[second.id] = true;
	second.weaponClashes[first.id] = true;
}

//---------------------------------------------------------------------------------------------------
//Objects: projectiles and hazards
//---------------------------------------------------------------------------------------------------
//The second damage layer, and deliberately a much simpler physics than the entity one. An object has no
//mass, no health and no bands: it flies where it was sent, hurts what it touches, and expires. Everything
//that makes a duel readable -- the energy band, the pair band, the |vx| floor -- is a rule about two
//ROBOTS and would be actively wrong applied to a bullet.
//
//RNG: only `aim: "random"` (Potion, later) ever touches clacksRandom(). The fan across a multi-shot volley
//is DERIVED from the count, so the wand and the gun are as RNG-free as the weapon path, and the 99/100/101
//canary is untouched by anything in this section.

//Fires whatever the active part creates, once per entry into its attacking phase. Runs after
//clacksResolvePart() -- that ordering is the whole reason spawnPending is a flag rather than a direct call
//from clacksAdvancePart(), where entity.resolved still describes the previous tick.
function clacksRunSpawns(entity) {
	const part = entity.resolved.part;
	if (part == null || !part.spawnPending) {
		return;
	}
	part.spawnPending = false;
	const spawn = entity.resolved.spawn;
	if (spawn == null) {
		return;   //a part with an attack phase but nothing to create: every sword ever
	}

	//Aim. "weapon" is the default and the interesting one -- firing along the barrel means a slowly
	//rotating gun sprays the arena over a match without a single random number being drawn.
	let aim = entity.weaponAngle;
	if (spawn.aim == "velocity") {
		aim = clacksDirectionOf(entity);
	}
	else if (spawn.aim == "random") {
		aim = clacksRandom() * Math.PI * 2;
	}
	else if (entity.resolved.weapon != null && entity.resolved.weapon.shape.length > 0) {
		aim = clacksBladeAngle(entity, entity.resolved.weapon, entity.resolved.weapon.shape[0]);
	}

	for (let n = 0; n < spawn.count; n++) {
		let angle = aim;
		//Evenly fanned across `spread`, centred on the aim. One shot ignores spread entirely rather than
		//dividing by zero.
		if (spawn.count > 1 && spawn.spread != 0) {
			angle = aim - (spawn.spread / 2) + ((spawn.spread * n) / (spawn.count - 1));
		}
		clacksSpawnObject(entity, spawn, angle);
	}
}

function clacksSpawnObject(entity, spawn, angle) {
	let distance = 0;
	if (spawn.origin == "weapon" && entity.resolved.weapon != null) {
		//Clear of the tip by the object's own radius, so a fireball doesn't appear half-swallowed by the
		//wand that made it.
		distance = clacksWeaponReach(entity, entity.resolved.weapon) + spawn.radius;
	}
	let x = entity.x + (Math.cos(angle) * distance);
	let y = entity.y + (Math.sin(angle) * distance);
	//A hazard ignores walls -- it is a space, not a thing in flight -- but one born half outside the arena
	//reads as a bug rather than as a design. Clamp the centre in. A projectile is NOT clamped: dying on the
	//wall is its entire job.
	if (spawn.kind == "hazard") {
		x = Math.max(clacksArena.wall, Math.min(clacksArena.width - clacksArena.wall, x));
		y = Math.max(clacksArena.wall, Math.min(clacksArena.height - clacksArena.wall, y));
	}
	clacksObjects.push(clacksMakeObject({
		kind: spawn.kind,
		ownerId: entity.id,
		team: entity.team,
		x: x,
		y: y,
		vx: Math.cos(angle) * spawn.speed,
		vy: Math.sin(angle) * spawn.speed,
		radius: spawn.radius,
		damage: spawn.damage,
		knockback: spawn.knockback,
		life: spawn.life,
		gravity: spawn.gravity,
		wallBounces: spawn.wallBounces,
		pierce: spawn.pierce
	}));
}

function clacksUpdateObjects() {
	for (const object of clacksObjects) {
		object.life--;
		if (object.life <= 0) {
			object.alive = false;
			continue;
		}
		if (object.kind == "hazard") {
			continue;   //a hazard doesn't move, doesn't fall, and doesn't care about walls
		}
		if (object.gravity) {
			object.vy += clacksArena.gravity;
		}
		object.x += object.vx;
		object.y += object.vy;
		clacksBounceObject(object);
	}
}

//Walls, for projectiles only. Plain reflection with no restitution and no speed regulation of any kind:
//see the section header for why none of the entity machinery belongs here.
function clacksBounceObject(object) {
	const minX = clacksArena.wall + object.radius;
	const maxX = clacksArena.width - clacksArena.wall - object.radius;
	const minY = clacksArena.wall + object.radius;
	const maxY = clacksArena.height - clacksArena.wall - object.radius;
	let bounced = false;

	if (object.x < minX) {
		object.x = minX;
		object.vx = -object.vx;
		bounced = true;
	}
	else if (object.x > maxX) {
		object.x = maxX;
		object.vx = -object.vx;
		bounced = true;
	}
	if (object.y < minY) {
		object.y = minY;
		object.vy = -object.vy;
		bounced = true;
	}
	else if (object.y > maxY) {
		object.y = maxY;
		object.vy = -object.vy;
		bounced = true;
	}

	if (!bounced) {
		return;
	}
	//The budget runs out on the wall that would have been the next bounce, not one later.
	if (object.wallBounces <= 0) {
		object.alive = false;
		return;
	}
	object.wallBounces--;
}

//The blade-vs-object pass, and the reason it exists: before this a weapon only ever looked at bodies and
//other blades, so a bullet flew straight through a sword.
//
//A DEFLECTION, not the parry's momentum exchange, and that difference is deliberate. A parry runs the full
//elastic swap because two robots braced against each other are comparable masses. A bullet against a robot
//is not, and the LIMIT of that exchange as one mass goes to nothing is exactly a mirror reflection off the
//blade plus a nudge to the wielder -- so this is the same physics, evaluated where it is cheap.
function clacksWeaponDeflections() {
	for (const entity of clacksEntities) {
		const weapon = entity.resolved.weapon;
		if (weapon == null || !weapon.armed) {
			continue;   //a retracted wing is a shield against bodies, not a racket
		}
		for (const object of clacksObjects) {
			//Hazards are spaces: there is nothing there for a sword to hit.
			if (!object.alive || object.kind != "projectile" || object.team == entity.team) {
				continue;
			}
			let struck = null;
			for (const segment of weapon.shape) {
				const blade = clacksBladeSegment(entity, weapon, segment);
				if (clacksPointSegmentDistance(object.x, object.y, blade) < object.radius + (blade.width / 2)) {
					struck = blade;
					break;
				}
			}
			if (struck == null) {
				delete object.deflects[entity.id];
				continue;
			}
			//Rising edge, like every other contact in the sim. Mostly belt-and-braces here, because a
			//deflected object changes team below and so stops being a candidate for this blade at all.
			if (!object.deflects[entity.id]) {
				clacksDeflectObject(object, entity, weapon, struck);
			}
			object.deflects[entity.id] = true;
		}
	}
}

function clacksDeflectObject(object, entity, weapon, blade) {
	//The blade's own direction is (cos, sin), so its surface normal is the perpendicular, and reflecting
	//about that normal is what "it bounced off the sword" means.
	const nx = -blade.sin;
	const ny = blade.cos;
	const along = (object.vx * nx) + (object.vy * ny);
	object.vx -= 2 * along * nx;
	object.vy -= 2 * along * ny;
	//The swing, so a spinning blade hurls a bullet back rather than merely mirroring it. A fixed weapon
	//(Wings) has no swing and reflects cleanly, which is the same distinction clacksWeaponStrike() draws.
	if (weapon.spin != 0) {
		const direction = (entity.weaponSpin < 0) ? -1 : 1;
		const swing = weapon.knockback * CLACKS_DEFLECT_BOOST * direction;
		object.vx += nx * swing;
		object.vy += ny * swing;
	}
	//It CHANGES HANDS. A deflected bullet belongs to whoever swatted it, so it can go on to kill the robot
	//that fired it -- which is the payoff for carrying a blade against a gun, and the reason the Deflect
	//test mode can be won by the player without ever landing a sword hit.
	object.team = entity.team;
	object.ownerId = entity.id;
	object.hits = {};
	//And the wielder feels it, mass-weighted, exactly as a strike's recoil does. The push follows the
	//momentum the object just gave up, so the sign has to track which way it was travelling.
	const push = (along > 0) ? 1 : -1;
	clacksApplyImpulse(entity, nx * push, ny * push, weapon.knockback * CLACKS_WEAPON_RECOIL);
}

function clacksObjectCollisions() {
	for (const object of clacksObjects) {
		if (!object.alive) {
			continue;
		}
		for (const entity of clacksEntities) {
			if (entity.team == object.team) {
				continue;   //same team never trades damage (section 2)
			}
			const dx = entity.x - object.x;
			const dy = entity.y - object.y;
			const distance = Math.sqrt((dx * dx) + (dy * dy));
			if (distance >= entity.radius + object.radius) {
				delete object.hits[entity.id];
				continue;
			}
			//RISING EDGE, same as a blade and for the same reason: a hazard bites you on the way in, not 100
			//times a second. It also means a lingering fireball has no damage cadence to balance -- the only
			//knobs are its size and how long it lasts.
			if (!object.hits[entity.id]) {
				clacksObjectStrike(object, entity, dx, dy, distance);
			}
			object.hits[entity.id] = true;
			if (!object.pierce) {
				object.alive = false;
				break;   //spent; whoever else it was overlapping got lucky
			}
		}
	}
}

function clacksObjectStrike(object, entity, dx, dy, distance) {
	if (!clacksHasState(entity, "invincible")) {
		entity.health -= object.damage * (1 - entity.resolved.resist);
	}
	clacksGainScaling(entity, "perDamageTaken");   //Punished Bot's trigger
	//Credited to whoever owns the object NOW, which after a deflection is not who fired it. Absent owners
	//are normal and fine: a bullet routinely outlives its shooter.
	const owner = clacksFindEntity(object.ownerId);
	if (owner != null) {
		clacksGainScaling(owner, "perWeaponHit");
	}

	if (object.knockback == 0) {
		return;
	}
	//A projectile shoves along its own flight. A standing hazard has no flight, so it pushes radially out
	//of itself instead -- the same fallback clacksWeaponStrike() uses for a weapon with no swing.
	let kx = object.vx;
	let ky = object.vy;
	let length = Math.sqrt((kx * kx) + (ky * ky));
	if (length == 0) {
		if (distance == 0) {
			return;   //dead centre offers no direction to push in
		}
		kx = dx;
		ky = dy;
		length = distance;
	}
	clacksApplyImpulse(entity, kx / length, ky / length, object.knockback);
}

//Objects are culled AFTER clacksResolveDeaths(), so a bullet and the robot it killed leave the board on
//the same tick and the readout never shows one without the other.
function clacksCullObjects() {
	if (clacksObjects.length == 0) {
		return;
	}
	clacksObjects = clacksObjects.filter(object => object.alive);
}

//Semi-implicit Euler: gravity updates velocity first, then velocity moves the entity. Doing it in this
//order is what keeps a bouncing ball's height stable over thousands of ticks instead of slowly
//climbing, which matters here because a match runs for tens of thousands of them.
function clacksMoveEntity(entity) {
	entity.vy += clacksArena.gravity;   //+y is down on a canvas
	entity.x += entity.vx;
	entity.y += entity.vy;
	clacksWallBounce(entity);
	//Enforced every tick, not just on contact: gravity is continuously bending motion back toward
	//vertical, so a floor applied only at collisions would let two entities bounce past each other
	//for a long time before anything corrected it.
	clacksEnforceMinimumX(entity);
}

//Walls reflect the entity's velocity component along that axis, conserving momentum rather than
//setting speed to a stat as the pre-momentum model did. Position is clamped back to the wall face in
//the same step so an entity can never come to rest inside a wall.
function clacksWallBounce(entity) {
	const minX = clacksArena.wall + entity.radius;
	const maxX = clacksArena.width - clacksArena.wall - entity.radius;
	const minY = clacksArena.wall + entity.radius;
	const maxY = clacksArena.height - clacksArena.wall - entity.radius;
	const restitution = CLACKS_WALL_RESTITUTION * entity.wallBounce;
	let bounced = false;

	if (entity.x < minX) {
		entity.x = minX;
		entity.vx = -entity.vx * restitution;
		bounced = true;
	}
	else if (entity.x > maxX) {
		entity.x = maxX;
		entity.vx = -entity.vx * restitution;
		bounced = true;
	}
	if (entity.y < minY) {
		entity.y = minY;
		entity.vy = -entity.vy * restitution;
		bounced = true;
	}
	else if (entity.y > maxY) {
		entity.y = maxY;
		entity.vy = -entity.vy * restitution;
		bounced = true;
	}

	//Only the hard safety cap here, NOT the energy band. Clamping to the band on every wall hit would
	//shave the speed gravity just spent a whole fall building, flattening the arcs into a uniform
	//crawl. The band is a collision rule; free flight is allowed to exceed it.
	if (bounced && clacksSpeedOf(entity) > CLACKS_MAX_SPEED) {
		clacksSetEntitySpeed(entity, CLACKS_MAX_SPEED);
	}
	if (bounced) {
		clacksGainScaling(entity, "perWallBounce");   //Megabouncer's trigger
	}
}

//Gravity steers everything toward vertical, and two entities bouncing straight up and down never meet.
//Raising |vx| to a floor is what keeps them crossing paths. Only ever raises, never lowers.
function clacksEnforceMinimumX(entity) {
	if (Math.abs(entity.vx) >= CLACKS_MIN_X_SPEED) {
		return;
	}
	let sign = 1;
	if (entity.vx < 0) {
		sign = -1;
	}
	else if (entity.vx == 0 && clacksRandom() < 0.5) {
		sign = -1;   //dead vertical has no side to keep, so pick one rather than always drifting right
	}
	entity.vx = sign * CLACKS_MIN_X_SPEED;
}

function clacksEntityCollisions() {
	for (let a = 0; a < clacksEntities.length; a++) {
		for (let b = a + 1; b < clacksEntities.length; b++) {
			clacksCollidePair(clacksEntities[a], clacksEntities[b]);
		}
	}
}

function clacksCollidePair(first, second) {
	const dx = second.x - first.x;
	const dy = second.y - first.y;
	const distance = Math.sqrt((dx * dx) + (dy * dy));
	const contact = first.radius + second.radius;
	if (distance >= contact || distance == 0) {
		return;
	}

	//Unit normal along the line of centres.
	const nx = dx / distance;
	const ny = dy / distance;

	//Only collide when the two are CLOSING. Once they've bounced they're separating, so this test
	//goes false and the pair can't re-trigger while still overlapped. That is what makes contact
	//damage fire exactly once per collision instead of once per tick -- and at 100 ticks/sec, once
	//per tick would delete both entities almost instantly.
	const closing = ((second.vx - first.vx) * nx) + ((second.vy - first.vy) * ny);
	if (closing > 0) {
		return;
	}

	const firstMass = clacksMassOf(first);
	const secondMass = clacksMassOf(second);
	const totalMass = firstMass + secondMass;

	//Push them apart so they don't sit fused together while separating. Split by mass, so the heavy
	//one barely gives ground and the light one is the one that moves.
	const overlap = contact - distance;
	first.x -= nx * overlap * (secondMass / totalMass);
	first.y -= ny * overlap * (secondMass / totalMass);
	second.x += nx * overlap * (firstMass / totalMass);
	second.y += ny * overlap * (firstMass / totalMass);

	clacksExchangeMomentum(first, second, nx, ny);
	clacksSettlePair(first, second, true);

	clacksMatch.collisions++;
	clacksApplyContactDamage(first, second);
}

//THE MOMENTUM TRANSFER. Standard elastic impulse along a normal, mass-weighted:
//    v1' = v1 + (2*m2 / (m1+m2)) * (relative velocity . n) * n
//    v2' = v2 - (2*m1 / (m1+m2)) * (relative velocity . n) * n
//Only the component ALONG the normal is exchanged; the tangential component passes through untouched.
//That is what produces the variety -- a glancing hit barely alters either entity, a head-on hit between
//equal masses swaps their speeds outright, and either one can come out slower than it went in.
//
//Shared with the blade parry, and that sharing is the point: a clash is meant to feel like the two
//BALLS hit each other, so it must not be a second, invented physics sitting next to this one.
//Returns false when the pair is already separating, in which case nothing was changed.
function clacksExchangeMomentum(first, second, nx, ny) {
	const closing = ((second.vx - first.vx) * nx) + ((second.vy - first.vy) * ny);
	if (closing > 0) {
		return false;
	}
	const firstMass = clacksMassOf(first);
	const secondMass = clacksMassOf(second);
	const impulse = (2 * closing) / (firstMass + secondMass);
	first.vx += impulse * secondMass * nx;
	first.vy += impulse * secondMass * ny;
	second.vx -= impulse * firstMass * nx;
	second.vy -= impulse * firstMass * ny;
	return true;
}

//Everything that has to happen after two entities exchange momentum, in the one order that works: the
//per-entity restitution multiplier, then the random kick, then the bands. THE BANDS MUST HAVE THE LAST
//WORD or a nudge could leave an entity outside them.
//
//`nudge` is false for parries. Not a balance choice -- clacksNudgeSpeed() is the only thing here that
//consumes RNG, and keeping the weapon path RNG-free is what protects the 99/100/101 canary and every
//balance figure on record (see CLACKS_DESIGN.md section 11).
function clacksSettlePair(first, second, nudge) {
	const firstBounce = first.entityBounce * first.resolved.bounce;
	const secondBounce = second.entityBounce * second.resolved.bounce;
	if (firstBounce != 1) {
		clacksSetEntitySpeed(first, clacksSpeedOf(first) * firstBounce);
	}
	if (secondBounce != 1) {
		clacksSetEntitySpeed(second, clacksSpeedOf(second) * secondBounce);
	}
	if (nudge) {
		clacksNudgeSpeed(first);
		clacksNudgeSpeed(second);
	}
	clacksConstrainSpeed(first);
	clacksConstrainSpeed(second);
	clacksConstrainPair(first, second);
	clacksEnforceMinimumX(first);
	clacksEnforceMinimumX(second);
}

//The random kick that stops a duel settling into a metronome. Biased by where the entity sits in its
//speed band -- near the floor it is more likely to speed up, near the ceiling more likely to slow
//down -- so the fight keeps moving between fast and slow phases instead of picking one and staying.
function clacksNudgeSpeed(entity) {
	const speed = clacksSpeedOf(entity);
	if (speed == 0) {
		return;
	}
	let position = (speed - CLACKS_SPEED_BAND_MIN) / (CLACKS_SPEED_BAND_MAX - CLACKS_SPEED_BAND_MIN);
	position = Math.max(0, Math.min(1, position));
	//+CLACKS_ENERGY_BIAS at the bottom of the band, -CLACKS_ENERGY_BIAS at the top.
	const bias = (0.5 - position) * 2 * CLACKS_ENERGY_BIAS;
	const roll = (clacksRandom() * 2) - 1;
	clacksSetEntitySpeed(entity, speed * (1 + ((roll + bias) * CLACKS_COLLISION_JITTER)));
}

function clacksConstrainSpeed(entity) {
	const speed = clacksSpeedOf(entity);
	if (speed < CLACKS_SPEED_BAND_MIN) {
		clacksSetEntitySpeed(entity, CLACKS_SPEED_BAND_MIN);
	}
	else if (speed > CLACKS_SPEED_BAND_MAX) {
		clacksSetEntitySpeed(entity, CLACKS_SPEED_BAND_MAX);
	}
}

//The pair band catches what individual bands cannot: both entities drifting to the ceiling together
//(an unreadable blur) or both to the floor together (a stalemate). Scaling both by the same factor
//preserves the ratio between them, so whoever won the exchange still comes out ahead.
function clacksConstrainPair(first, second) {
	const total = clacksSpeedOf(first) + clacksSpeedOf(second);
	if (total == 0) {
		return;
	}
	let scale = 1;
	if (total < CLACKS_PAIR_BAND_MIN) {
		scale = CLACKS_PAIR_BAND_MIN / total;
	}
	else if (total > CLACKS_PAIR_BAND_MAX) {
		scale = CLACKS_PAIR_BAND_MAX / total;
	}
	if (scale != 1) {
		clacksSetEntitySpeed(first, clacksSpeedOf(first) * scale);
		clacksSetEntitySpeed(second, clacksSpeedOf(second) * scale);
	}
}

//Contact damage is SYMMETRIC and SIMULTANEOUS: both entities take the other's damage from the same
//collision, and neither death is processed until every pair this tick has been handled (see
//clacksResolveDeaths, called after the collision pass).
//
//That ordering is not an aesthetic choice, it's what makes the 99/100/101 test meaningful. With a
//100hp player and 1 damage per contact, after N collisions the player is on 100-N and the enemy on
//X-N, so the enemy's starting health alone decides the outcome:
//    99hp  -> enemy dies on collision 99, player survives on 1   -> WIN
//    100hp -> both reach 0 on collision 100                      -> DRAW
//    101hp -> player dies on collision 100, enemy survives on 1  -> LOSS
//Resolve a death inline and the draw case would collapse into a win or a loss purely on array order.
function clacksApplyContactDamage(first, second) {
	if (first.team == second.team) {
		return;   //same team never trades damage (section 2)
	}
	//Fury's whole identity: every slam into an enemy makes the next one hurt more. The gain lands on
	//entity.scaling, but resolved.contactDamage below was computed at the top of this tick -- so it is
	//the NEXT collision that feels it, not this one. That one-tick lag is deliberate: resolving once per
	//tick is what keeps mods, phases and scaling from having to be re-flattened mid-collision.
	clacksGainScaling(first, "perEnemyContact");
	clacksGainScaling(second, "perEnemyContact");

	//contactDamage is the scaling multiplier on the entity's own body damage (Fury); resist is Wings'
	//retracted-charge reduction. Both are 1 and 0 for everything else -- which is why the 99/100/101
	//numbers above still hold: the dummies are partless, so both sides read 1 flat.
	const fromFirst = first.globalDamage * first.resolved.contactDamage * (1 - second.resolved.resist);
	const fromSecond = second.globalDamage * second.resolved.contactDamage * (1 - first.resolved.resist);
	if (!clacksHasState(first, "invincible")) {
		first.health -= fromSecond;
	}
	if (!clacksHasState(second, "invincible")) {
		second.health -= fromFirst;
	}
}

function clacksHasState(entity, state) {
	return entity.states.indexOf(state) != -1;
}

//Runs once per tick, after every collision has banked its damage.
function clacksResolveDeaths() {
	for (const entity of clacksEntities) {
		if (entity.health <= 0) {
			entity.health = 0;
			entity.alive = false;
		}
	}
	clacksEntities = clacksEntities.filter(entity => entity.alive);
}

function clacksJudgeMatch() {
	const playerAlive = clacksMatch.player.alive;
	let enemiesAlive = 0;
	for (const entity of clacksEntities) {
		if (entity.team != 0) {
			enemiesAlive++;
		}
	}
	if (playerAlive && enemiesAlive > 0) {
		return;
	}

	if (!playerAlive && enemiesAlive == 0) {
		clacksMatch.state = "draw";
	}
	else if (!playerAlive) {
		clacksMatch.state = "lost";
	}
	else {
		//Player standing with the board clear. Later waves hook in here.
		clacksMatch.state = "won";
	}
	clacksReadoutDue = 0;   //show the result on the very next frame
}

function clacksDraw(canvas) {
	const ctx = canvas.getContext("2d");
	const palette = clacksGetPalette();
	const wall = clacksArena.wall;

	ctx.clearRect(0, 0, clacksArena.width, clacksArena.height);

	//Arena floor and walls. A stroke is centred on its path, so running the path half a wall in
	//puts the wall's inner face exactly at "wall" -- and that inner rectangle is the playfield.
	ctx.fillStyle = palette.floor;
	ctx.fillRect(wall, wall, clacksArena.width - (wall * 2), clacksArena.height - (wall * 2));
	ctx.strokeStyle = palette.wall;
	ctx.lineWidth = wall;
	ctx.lineCap = "butt";   //explicit: the weapon pass below leaves it on "round"
	ctx.strokeRect(wall / 2, wall / 2, clacksArena.width - wall, clacksArena.height - wall);

	//Hazards go under everything: a hazard is a patch of the arena rather than a thing in flight, so bodies
	//and blades have to read on top of it.
	for (const object of clacksObjects) {
		if (object.kind == "hazard") {
			clacksDrawObject(ctx, object);
		}
	}

	//Every weapon before any body, so a blade tucks under the robot it's bolted to instead of appearing
	//to run through it.
	for (const entity of clacksEntities) {
		clacksDrawWeapon(ctx, entity);
	}

	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font = "bold 34px railway, sans-serif";
	for (const entity of clacksEntities) {
		ctx.fillStyle = entity.color;
		ctx.beginPath();
		ctx.arc(entity.x, entity.y, entity.radius, 0, Math.PI * 2);
		ctx.fill();

		//Health label. Sized in sim units so it scales with the board along with everything else --
		//the --fs- tiers apply to the DOM readout below the board, not to anything drawn in here.
		//Rounded UP: weapon damage and Wings' resist both make health fractional, and a robot on 0.4hp
		//is alive, so it must not read "0".
		ctx.fillStyle = palette.text;
		ctx.fillText(Math.ceil(entity.health), entity.x, entity.y);
	}

	//Projectiles over everything, because they ARE in flight -- and a bullet hidden behind a robot is a
	//bullet the player never saw coming.
	for (const object of clacksObjects) {
		if (object.kind == "projectile") {
			clacksDrawObject(ctx, object);
		}
	}
}

function clacksDrawObject(ctx, object) {
	ctx.beginPath();
	ctx.arc(object.x, object.y, object.radius, 0, Math.PI * 2);
	if (object.kind != "hazard") {
		ctx.fillStyle = object.color || CLACKS_PROJECTILE_COLOR;
		ctx.fill();
		return;
	}
	ctx.fillStyle = object.color || CLACKS_HAZARD_COLOR;
	ctx.fill();
	//A brighter core inside the translucent field, so a big hazard still has an obvious centre to read once
	//CSS has shrunk the board to phone size.
	ctx.fillStyle = CLACKS_HAZARD_CORE_COLOR;
	ctx.beginPath();
	ctx.arc(object.x, object.y, object.radius * 0.45, 0, Math.PI * 2);
	ctx.fill();
}

function clacksDrawWeapon(ctx, entity) {
	const weapon = entity.resolved.weapon;
	if (weapon == null) {
		return;
	}
	//Unarmed blades are drawn ghosted rather than hidden: a retracted Wing is still doing something
	//(soaking damage), and the player has to be able to see the difference between the two phases.
	ctx.strokeStyle = weapon.armed ? CLACKS_BLADE_COLOR : CLACKS_BLADE_IDLE_COLOR;
	ctx.lineCap = "round";
	//lineWidth is set per segment, not per weapon -- that is what lets a compound shape actually look
	//like one rather than a uniform stick.
	for (const segment of weapon.shape) {
		const blade = clacksBladeSegment(entity, weapon, segment);
		ctx.lineWidth = blade.width;
		ctx.beginPath();
		ctx.moveTo(blade.x1, blade.y1);
		ctx.lineTo(blade.x2, blade.y2);
		ctx.stroke();
	}
}

//Throttled: the board redraws every frame, but rewriting DOM text 60 times a second is layout
//churn for digits nobody can read that fast.
function clacksUpdateReadout(now) {
	if (now < clacksReadoutDue) {
		return;
	}
	clacksReadoutDue = now + 200;

	const status = document.getElementById("clacksStatus");
	const scaling = document.getElementById("clacksScaling");
	const vars = document.getElementById("clacksVars");
	if (!status || !scaling || !vars) {
		return;
	}

	if (clacksMatch == null) {
		status.textContent = "No match running";
		status.className = "";
		scaling.textContent = "Scaling: —";
		vars.textContent = clacksSpeed + "× · " + Math.round(clacksFps) + " fps";
		return;
	}

	const results = { running: "", won: "VICTORY", lost: "DEFEAT", draw: "DRAW" };
	if (clacksMatch.state == "running") {
		status.textContent = clacksMatch.modeName;
		status.className = "";
	}
	else {
		status.textContent = clacksMatch.modeName + " — " + results[clacksMatch.state];
		status.className = "clacksResult " + clacksMatch.state;
	}

	//Each attack part supplies its own scaling label (CLACKS_DESIGN.md section 5). With no parts
	//equipped there is nothing to name yet. The phase readout beside it is the only window onto the
	//cycle until the part icons in the UI milestone land.
	const player = clacksMatch.player;
	const resolved = player.resolved;
	const definition = resolved.definition;
	//Rounded for display only: Timepiece-style per-second growth makes scaling fractional, and a readout
	//flickering through 14 decimal places is unreadable.
	const shown = Math.round(player.scaling * 10) / 10;
	let line = "Scaling: " + shown;
	if (definition != null && definition.scalingLabel != "") {
		line = definition.scalingLabel + ": " + shown;
	}
	if (definition != null && definition.index != "none") {
		line += " · " + definition.name + " " + resolved.part.state + " "
			+ Math.round(resolved.part.timer) + "/"
			+ Math.round(clacksPhaseLength(player, resolved.part));
	}
	scaling.textContent = line;

	//Health for every entity on the board, player first, so the numbers on the balls have a legible
	//counterpart underneath at small board sizes.
	let healths = player.name + " " + Math.ceil(player.health) + "/" + player.maxHealth;
	for (const entity of clacksEntities) {
		if (entity.team != 0) {
			healths += " · " + entity.name + " " + Math.ceil(entity.health) + "/" + entity.maxHealth;
		}
	}
	//Live object count, shown only when there are any: it's the one window onto the spawn layer until the
	//part icons land, and an always-present "0 obj" would be noise on a line that's already long.
	let objects = "";
	if (clacksObjects.length > 0) {
		objects = " · " + clacksObjects.length + " obj";
	}
	vars.textContent = healths
		+ " — tick " + clacksMatch.tick
		+ " · " + clacksMatch.collisions + " hits"
		+ objects
		+ " · " + clacksSpeed + "×"
		+ " · " + Math.round(clacksFps) + " fps"
		+ " · seed " + clacksMatch.seed;
}

//Dev scaffolding. Nothing GROWS scaling yet -- every source of growth in CLACKS_DESIGN.md is a mod
//(Timepiece, Megabouncer, Punished Bot) or Fury, all of which come later -- so this is how the scaling
//pipeline gets exercised: bump it mid-match and watch the sword get fatter or the Long Sword wind up
//faster. Delete once mods can drive it.
function clacksDevScaling(amount) {
	if (clacksMatch == null) {
		return;
	}
	clacksMatch.player.scaling = Math.max(0, clacksMatch.player.scaling + amount);
	clacksReadoutDue = 0;
}

function clacksSetSpeed(speed) {
	clacksSpeed = speed;
	const buttons = document.querySelectorAll("#clacksSpeedBar .clacksSpeedButton");
	for (const button of buttons) {
		button.classList.toggle("active", button.id == "clacksSpeed" + speed);
	}
	clacksReadoutDue = 0;   //reflect the new speed now rather than up to 200ms from now
}