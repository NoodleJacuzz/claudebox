
// Unicorn code
var playerUnits = []
var enemyUnits = []
var turn = 0
var unitArray = [
    {index: "Soldier1", img: "", name: "Soldier", tags: "infantry", 
        hp: 0, ap: 0, pp: 0, row: 0, col: 0, buffs: [], debuffs: [],
        maxhp: 60, maxap: 2, maxpp: 2, 
        patk: 29, pdef: 22, matk: 24, mdef: 24, accuracy: 140, evasion: 50, crit: 15, guard: 13, spd: 27,
        skills: ["Long Thrust", "Javelin", "First Aid", "Keen Call"],
        tempSkills: [],
        desc: "A soldier who is effective in the front or back lines. Can provide support to allies and heal wounds. Effective vs cavalry and flying units.",
    },
    {index: "Hoplite1", img: "", name: "Hoplite", tags: "infantry", 
        hp: 0, ap: 0, pp: 0, row: 0, col: 0, buffs: [], debuffs: [],
        maxhp: 72, maxap: 2, maxpp: 2, 
        patk: 25, pdef: 34, matk: 19, mdef: 7, accuracy: 140, evasion: 15, crit: 10, guard: 32, spd: 12,
        skills: ["Sting", "Row Protection", "Heavy Cover", "Guardian"],
        tempSkills: [],
        desc: "Boasts excellent physical defense. Possesses the ability to protect allies in battle. Vulnerable to anti-armor and magical attacks.",
    },
    {index: "Knight1", img: "", name: "Knight", tags: "cavalry", 
        hp: 0, ap: 0, pp: 0, row: 0, col: 0, buffs: [], debuffs: [],
        maxhp: 72, maxap: 2, maxpp: 2, 
        patk: 35, pdef: 25, matk: 23, mdef: 24, accuracy: 130, evasion: 22, crit: 20, guard: 20, spd: 25,
        skills: ["Assaulting Lance", "Wild Rush", "Quick Guard", "Cavalier Call"],
        tempSkills: [],
        desc: "Excels at offense and defense in equal measure. Effective vs infantry.",
    },
    {index: "Wizard1", img: "", name: "Wizard", tags: "infantry", 
        hp: 0, ap: 0, pp: 0, row: 0, col: 0, buffs: [], debuffs: [],
        maxhp: 47, maxap: 2, maxpp: 2, 
        patk: 11, pdef: 13, matk: 38, mdef: 34, accuracy: 130, evasion: 35, crit: 11, guard: 6, spd: 17,
        skills: ["Fireball", "Thunderous Strike", "Magic Counter", "Magic Pursuit"],
        tempSkills: [],
        desc: "Boasts excellent magical attack. Effective vs foes with low magic defense.",
    },
]

var skillsArray = [
    //To-do: Add default conditions to skills, signifying the default activation for when the AI should use the skill. Such as prioritizing flying enemies with Javelin, prioritizing armored enemies with Fireball, etc.
    //Each skill usually has one default conditions, but can have up to 2.
    //Skill conditions types are prioritize (does not preclude the use of the skill, but does prioritize some conditions over others) and preclude (does not use the skill if the condition is not met).
    //To-do: add a guard efficiency stat. Either 0%, 25% (for classes with a light guard skill), 50% (for classes with a heavy guard skill) (These need to be hardcoded as I may add heavy guard skills to classes with 25% guard efficiency).

    {index: "Long Thrust", name: "Long Thrust", desc: "Attacks a column of enemies with a piercing strike. Grants +50 potency vs. cavalry targets.", ppotency: 100, mpotency: 0, hits: 1, accuracy: 100, type: "ap", cost: 1, tags: "range:melee;area:column;target:enemy;", special: "?cavalry:damageBonus+50;",},
    {index: "Javelin", name: "Javelin", desc: "Attacks a single enemy. +50 potency vs. flying targets.", ppotency: 100, mpotency: 0, hits: 1, accuracy: 100, type: "ap", cost: 1, tags: "range:ranged;target:enemy;", special: "?flying:damageBonus+50;",},
    {index: "First Aid", name: "First Aid", desc: "Activates at the end of the battle. Restores 25% HP to an ally.", ppotency: 0, mpotency: 0, hits: 1, accuracy: 999, type: "pp", activation: "battleEnd", cost: 1, tags: "range:ranged;target:ally;damage:healing;", special: "heal:25%;",},
    {index: "Keen Call", name: "Keen Call", desc: "Activates before an ally uses an active attack skill. Grants 100% critical rate for an ally's next attack.", ppotency: 0, mpotency: 0, hits: 1, accuracy: 999, type: "pp", activation: "allyAttacking", cost: 1, tags: "range:ranged;target:ally;", special: "buff:critical+100,duration:1;",},

    {index: "Sting", name: "Sting", desc: "Attacks a single enemy. +50 potency if the user is below 50% HP.", ppotency: 100, mpotency: 0, hits: 1, accuracy: 100, type: "ap", cost: 1, tags: "range:melee;target:enemy;", special: "?userhp<50:damageBonus+50;",},
    {index: "Row Protection", name: "Row Protection", desc: "Grants allies in the user's row +50% physical defense.", ppotency: 0, mpotency: 0, hits: 1, accuracy: 999, type: "ap", cost: 1, tags: "target:ally;area:row;", special: "buff:pdef+50,duration:3;",},
    {index: "Heavy Cover", name: "Heavy Cover", desc: "Activates before an ally is attacked. Cover an ally with a heavy guard.", ppotency: 0, mpotency: 0, hits: 1, accuracy: 999, type: "pp", activation: "allyAttacked", cost: 1, tags: "target:ally;", special: "cover;guard:heavy;",},
    {index: "Guardian", name: "Guardian", desc: "Activates before being hit by a physical attack. Grants the user +20% physical attack and +20% guard rate.", ppotency: 0, mpotency: 0, hits: 1, accuracy: 999, type: "pp", activation: "selfAttacked", cost: 1, tags: "target:self;", special: "buff:patk+20,guard+20,duration:2;",},

    {index: "Assaulting Lance", name: "Assaulting Lance", desc: "Attacks a single enemy. Grants the user +1 AP if the target is defeated.", ppotency: 100, mpotency: 0, hits: 1, accuracy: 100, type: "ap", cost: 1, tags: "range:melee;target:enemy;", special: "?onDefeat:ap+1;",},
    {index: "Wild Rush", name: "Wild Rush", desc: "Attacks a column of enemies with a piercing strike. Inflicts stun.", ppotency: 80, mpotency: 0, hits: 1, accuracy: 100, type: "ap", cost: 1, tags: "range:melee;area:column;target:enemy;", special: "debuff:stun,duration:1;",},
    {index: "Quick Guard", name: "Quick Guard", desc: "Activates before being hit by a physical attack. Block an enemy attack with a medium guard.", ppotency: 0, mpotency: 0, hits: 1, accuracy: 999, type: "pp", cost: 1, activation: "selfAttacked", tags: "target:self;", special: "guard:medium;",},
    {index: "Cavalier Call", name: "Cavalier Call", desc: "Activates before attacking with an active skill. Grants cavalry allies in the user's row +20% attack.", ppotency: 0, mpotency: 0, hits: 1, accuracy: 999, type: "pp", cost: 1, activation: "selfAttacking", tags: "target:ally;area:row;", special: "?cavalry:buff:patk+20,duration:2;",},

    {index: "Fireball", name: "Fireball", desc: "Attack a single enemy with magic. Inflicts Burn.", ppotency: 0, mpotency: 40, hits: 3, accuracy: 100, type: "ap", cost: 1, tags: "range:ranged;target:enemy;", special: "debuff:burn,duration:3;",},
    {index: "Thunderous Strike", name: "Thunderous Strike", desc: "Attack a row of enemies with magic. Inflicts stun.", ppotency: 0, mpotency: 100, hits: 1, accuracy: 90, type: "ap", cost: 2, tags: "range:ranged;area:row;target:enemy;", special: "debuff:stun,duration:1;",},
    {index: "Magic Counter", name: "Magic Counter", desc: "Activates after an enemy attacks with an active skill. Counterattack a single enemy with magic.", ppotency: 0, mpotency: 150, hits: 1, accuracy: 100, type: "pp", cost: 1, activation: "selfAttacked,allyAttacked", tags: "range:ranged;target:enemy;", special: "",},
    {index: "Magic Pursuit", name: "Magic Pursuit", desc: "Activates after an ally uses a magic attack with an active skill. Follow-up attack a single enemy with magic.", ppotency: 0, mpotency: 100, hits: 1, accuracy: 999, type: "pp", cost: 1, activation: "allyAttacking(magic)", tags: "range:ranged;target:enemy;", special: "",},
]

var conditionsArray = [
    //To-do: fill with conditions
]

function initializeBattle() {
    turn = 0
    //To-do: change initialize unit to give unit names to make it easier to debug. Name and (instance of class) are enough. Player Soldier 1, etc.
    //Battlefield layout is:
    // row 0, col 0
    // row 0, col 1
    // row 1, col 0
    // row 1, col 1
    // row 2, col 0
    // row 2, col 1
    // col 0 is front line and is targetable by melee attacks
    // col 1 is back line and is targetable by ranged attacks only, unless no healthy units in front line
    playerUnits = []
    enemyUnits.push(initializeUnit(unitArray[1], 1, 0))
    enemyUnits.push(initializeUnit(unitArray[0], 0, 1))
    enemyUnits.push(initializeUnit(unitArray[0], 1, 1))
    enemyUnits.push(initializeUnit(unitArray[2], 2, 1))
    playerUnits.push(initializeUnit(unitArray[1], 1, 0))
    playerUnits.push(initializeUnit(unitArray[3], 0, 1))
    playerUnits.push(initializeUnit(unitArray[3], 1, 1))
    playerUnits.push(initializeUnit(unitArray[3], 2, 1))
    console.info("Battle initialized.");
    console.info("Player Team:", playerUnits.map(u => `${u.name} (${u.row},${u.col})`));
    console.info("Enemy Team:", enemyUnits.map(u => `${u.name} (${u.row},${u.col})`));
    
    // Trigger battle start passive skills
    triggerPassiveSkills("battleStart", null, null);
    
    battleStart()
}

function initializeUnit(template, row, col) {
    //Establishes a new unit onto a board
    // Create a deep copy to avoid reference issues
    var newUnit = JSON.parse(JSON.stringify(template));
    newUnit.hp = newUnit.maxhp
    newUnit.ap = newUnit.maxap
    newUnit.pp = newUnit.maxpp
    newUnit.row = row
    newUnit.col = col
    newUnit.buffs = []
    newUnit.debuffs = []
    return newUnit
}

function battleStart() {
    //Simulates a battle between playerUnits and enemyUnits. The battle continues until one side is defeated or a maximum of 100 rounds is reached.
    let rounds = 0;
    //To-do: check for battle start passive skill triggers
    while (true) {
        let alivePlayers = playerUnits.some(u => u.hp > 0);
        let aliveEnemies = enemyUnits.some(u => u.hp > 0);
        if (!alivePlayers || !aliveEnemies) break;

        let acted = executeRound();
        if (!acted) break;

        rounds++;
        if (rounds >= 100) break;
    }
    
    // Trigger battle end passive skills
    triggerPassiveSkills("battleEnd", null, null);

    //To-do: Give more info on winner, specifically total amount of damage dealt vs starting total health pool of each team.
    //To-do: Winner should be determined by comparing total amount of health lost across all units to their starting total health pool, or if one side has no remaining healthy units
    let winner = playerUnits.some(u => u.hp > 0) ? "Player Team" : "Enemy Team";
    console.info(`\nBattle ended in ${rounds} rounds. Winner: ${winner}`);
}


function executeRound() {
    //Simulates a turn in a battle between playerUnits and enemyUnits. It iterates through units in initiative order, allowing each living unit to perform a skill on a target if available. The function returns true if any unit acted during the turn, and false otherwise.
    console.info(`\n--- Turn ${turn + 1} ---`);
    let order = getInitiativeOrder();
    let acted = 0;

    for (let unit of order) {
        if (unit.hp <= 0) continue;
        
        //To-do: Move updating status effects to after a unit takes their turn, otherwise buffs and debuffs could fall off before the unit takes their turn.
        // Update buff/debuff timers
        updateStatusEffects(unit);
        
        let skill = selectSkill(unit);
        if (!skill) continue;

        let targets = selectTarget(unit, skill);
        if (targets.length === 0) continue;

        // Trigger pre-attack passive skills
        triggerPassiveSkills("selfAttacking", unit, skill);
        
        performSkill(unit, skill, targets);
        
        // Trigger post-attack passive skills
        triggerPassiveSkills("afterAttack", unit, skill);
        
        acted++;
    }

    turn++;
    return acted > 0;
}


function getInitiativeOrder() {
    let allUnits = [...playerUnits, ...enemyUnits];
    allUnits = allUnits.filter(u => u.hp > 0);
    return allUnits.sort((a, b) => {
        let aSpd = getEffectiveStat(a, 'spd');
        let bSpd = getEffectiveStat(b, 'spd');
        return bSpd - aSpd;
    });
}

function getEffectiveStat(unit, stat) {
    let base = unit[stat];
    let modifier = 0;
    
    // Apply buff/debuff modifiers
    unit.buffs.forEach(buff => {
        if (buff.stat === stat) modifier += buff.value;
    });
    unit.debuffs.forEach(debuff => {
        if (debuff.stat === stat) modifier -= debuff.value;
    });
    
    return Math.max(1, base + modifier);
}

function damageCalc(user, target, skill) {
    //returns the total damage dealt to the target.
    //calculates the hit chance based on the skill's accuracy, user's accuracy, and target's evasion.
    //If the hit chance is successful, it calculates the physical and magical damage dealt to the target.
    //Returns the total damage, rounded down to the nearest integer.
    let total = 0;
    let critBonus = 0;
    
    // Check for critical hit buffs
    user.buffs.forEach(buff => {
        if (buff.type === 'critical') critBonus += buff.value;
    });

    for (let i = 0; i < skill.hits; i++) {
        let hitChance = skill.accuracy + getEffectiveStat(user, 'accuracy') - getEffectiveStat(target, 'evasion');
        
        if (Math.random() * 100 <= hitChance) {
            let physical = 0;
            let magical = 0;
            
            if (skill.ppotency > 0) {
                physical = (getEffectiveStat(user, 'patk') - getEffectiveStat(target, 'pdef'));
                if (physical < 1) physical = 1;
                physical = physical * (skill.ppotency / 100);
            }
            
            if (skill.mpotency > 0) {
                magical = (getEffectiveStat(user, 'matk') - getEffectiveStat(target, 'mdef'));
                if (magical < 1) magical = 1;
                magical = magical * (skill.mpotency / 100);
            }

            // Check for critical hit
            let critChance = getEffectiveStat(user, 'crit') + critBonus;
            if (Math.random() * 100 <= critChance) {
                physical *= 1.5;
                magical *= 1.5;
                console.info("Critical Hit!");
            }

            //To-do: account for skills which guarentee evade and guard

            //To-do: roll for guard change (guard as %)

            //To-do: account for medium and heavy guard (reduces damage by 25% or 50%, + character's guard stat)

            //To-do: account for cover skills where damage is redirected

            //To-do: account for buffs and debuffs modifying damage

            // Apply activational damage bonuses
            let damageBonus = parseConditionalDamage(user, target, skill);
            physical *= (1 + damageBonus / 100);
            magical *= (1 + damageBonus / 100);

            //To-do: account for applying buffs and debuffs on hits

            let dmg = Math.max(0, physical + magical);
            total += dmg;
            console.info(`User P.Atk: ${user.patk}, Skill P.Potency: ${skill.ppotency}, Target P.Def: ${target.pdef}, Physical Damage: ${physical}, Magical Damage: ${magical}, Total Damage: ${total}`);
        }
        else {
            console.info("Attack missed!");
        }
    }

    return Math.floor(total);
}

function parseConditionalDamage(user, target, skill) {
    let bonus = 0;
    if (!skill.special) return bonus;

    //To-do: Rewrite code to allow for any checking basic stats to not need to be hardcoded
    
    let activations = skill.special.split(';');
    activations.forEach(activation => {
        if (activation.includes('?cavalry:damageBonus') && target.tags.includes('cavalry')) {
            let match = activation.match(/damageBonus\+(\d+)/);
            if (match) bonus += parseInt(match[1]);
        }
        if (activation.includes('?flying:damageBonus') && target.tags.includes('flying')) {
            let match = activation.match(/damageBonus\+(\d+)/);
            if (match) bonus += parseInt(match[1]);
        }
        if (activation.includes('?userhp<50:damageBonus') && (user.hp / user.maxhp < 0.5)) {
            let match = activation.match(/damageBonus\+(\d+)/);
            if (match) bonus += parseInt(match[1]);
        }
    });
    
    return bonus;
}

function selectSkill(unit) {
    //iterates through a unit's skills and returns the first skill that the unit has enough resources to use. 

    //to-do: Prevent using skills if at 0 hp, stunned, or frozen

    // Check if unit is stunned
    if (unit.debuffs.some(d => d.type === 'stun')) {
        console.info(`${unit.name} is stunned and cannot act!`);
        return null;
    }
    
    // Prioritize AP skills
    for (let skillName of unit.skills) {
        let skill = skillsArray.find(s => s.index === skillName);
        if (!skill) continue;
        if (skill.activation) continue; // Skip passive skills
        
        if (skill.type === "ap" && unit.ap >= skill.cost) return skill;
    }
    
    return null;
}

function performSkill(user, skill, targetList) {
    //Simulates a unit (user) using a skill on one or more targets (targetList). It deducts the skill's cost from the user's AP (Action Points) or PP (Power Points) depending on the skill type, calculates the damage dealt to each target, and updates the target's HP (Health Points). It also logs the action to the console.

    if (skill.type === "ap") user.ap -= skill.cost;
    if (skill.type === "pp") user.pp -= skill.cost;

    //To-do: Denote target of skill, not just attacker and skill used
    console.info(`${user.name} uses ${skill.name}!`);

    for (let target of targetList) {
        // Trigger pre-attack defensive passives
        triggerPassiveSkills("selfAttacked", target, skill);
        
        // To-do: prevent healing skills from being used on dead targets
        if (skill.tags.includes('damage:healing')) {
            // Healing skill
            let healAmount = Math.floor(target.maxhp * 0.25); // 25% heal from First Aid
            target.hp = Math.min(target.maxhp, target.hp + healAmount);
            console.info(`${target.name} recovers ${healAmount} HP. Current HP: ${target.hp}`);
        } else if (skill.ppotency > 0 || skill.mpotency > 0) {
            // Damage skill
            let dmg = damageCalc(user, target, skill);
            target.hp -= dmg;
            if (target.hp < 0) target.hp = 0;
            console.info(`${target.name} takes ${dmg} damage. Current HP: ${target.hp}`);
            
            // Check for on-defeat effects
            if (target.hp === 0 && skill.special.includes('?onDefeat:ap+1')) {
                user.ap += 1;
                console.info(`${user.name} gains 1 AP from defeating ${target.name}!`);
            }
        }
        
        // Apply status effects
        applyStatusEffects(user, target, skill);
    }
}

function applyStatusEffects(user, target, skill) {
    //To-do: Create array of basic status effects (poison, burn, stun, freeze, etc.) with durations.
    //To-do: Rewrite code to allow for any status effect changing basic stats to not need to be hardcoded.
    //To-do: Don't allow status effects to fall off unless they have a set duration.

    if (!skill.special) return;
    
    let effects = skill.special.split(';');
    effects.forEach(effect => {
        if (effect.includes('debuff:stun')) {
            let duration = 1;
            let match = effect.match(/duration:(\d+)/);
            if (match) duration = parseInt(match[1]);
            
            target.debuffs.push({type: 'stun', duration: duration});
            console.info(`${target.name} is stunned for ${duration} turn(s)!`);
        }
        
        if (effect.includes('debuff:burn')) {
            let duration = 3;
            let match = effect.match(/duration:(\d+)/);
            if (match) duration = parseInt(match[1]);
            
            target.debuffs.push({type: 'burn', duration: duration, damage: 5});
            console.info(`${target.name} is burned for ${duration} turn(s)!`);
        }
        
        if (effect.includes('buff:pdef')) {
            let value = 0, duration = 1;
            let valueMatch = effect.match(/pdef\+(\d+)/);
            let durationMatch = effect.match(/duration:(\d+)/);
            if (valueMatch) value = parseInt(valueMatch[1]);
            if (durationMatch) duration = parseInt(durationMatch[1]);
            
            target.buffs.push({type: 'pdef', stat: 'pdef', value: value, duration: duration});
            console.info(`${target.name} gains +${value} Physical Defense for ${duration} turn(s)!`);
        }
    });
}

function updateStatusEffects(unit) {
    // Process burn damage
    unit.debuffs.forEach(debuff => {
        if (debuff.type === 'burn') {
            unit.hp -= debuff.damage;
            if (unit.hp < 0) unit.hp = 0;
            console.info(`${unit.name} takes ${debuff.damage} burn damage! HP: ${unit.hp}`);
        }
    });
    
    // Decrease durations
    unit.buffs = unit.buffs.filter(buff => {
        buff.duration--;
        if (buff.duration <= 0) {
            console.info(`${unit.name}'s ${buff.type} buff expires.`);
            return false;
        }
        return true;
    });
    
    unit.debuffs = unit.debuffs.filter(debuff => {
        debuff.duration--;
        if (debuff.duration <= 0) {
            console.info(`${unit.name}'s ${debuff.type} debuff expires.`);
            return false;
        }
        return true;
    });
}

function triggerPassiveSkills(trigger, unit, skill) {
    //To-do: Make sure only one of each skill is used at a time. No "Knight uses Cavalier call! Knight uses Cavalier call!"
    //To-do: Make sure passive skills reduce PP appropriately
    let allUnits = [...playerUnits, ...enemyUnits];
    
    allUnits.forEach(u => {
        if (u.hp <= 0) return;
        
        u.skills.forEach(skillName => {
            let passiveSkill = skillsArray.find(s => s.index === skillName);
            if (!passiveSkill || !passiveSkill.activation) return;
            
            if (passiveSkill.activation === trigger && u.pp >= passiveSkill.cost) {
                // This is a simplified passive trigger - would need more complex logic for real implementation
                console.info(`${u.name} triggers passive skill ${passiveSkill.name}!`);
                u.pp -= passiveSkill.cost;
            }
        });
    });
}

function selectTarget(user, skill) {
    //to-do: Prevent using skills on dead targets
    let isPlayerUnit = playerUnits.includes(user);
    let enemyTeam = isPlayerUnit ? enemyUnits : playerUnits;
    let allyTeam = isPlayerUnit ? playerUnits : enemyUnits;
    
    let targetTeam = skill.tags.includes('target:enemy') ? enemyTeam : 
                     skill.tags.includes('target:ally') ? allyTeam : enemyTeam;
    
    let livingTargets = targetTeam.filter(u => u.hp > 0);
    
    // Handle area effects
    if (skill.tags.includes('area:column')) {
        return livingTargets.filter(t => t.col === user.col);
    }
    
    if (skill.tags.includes('area:row')) {
        return livingTargets.filter(t => t.row === user.row);
    }
    
    if (skill.tags.includes('target:self')) {
        return [user];
    }

    //To-do: Only allow melee to hit front row, unless no healthy units in front row
    
    // Default single target selection
    if (skill.tags.includes('range:melee')) {
        // Prefer front row targets in same column
        let preferred = livingTargets.find(t => t.row === 0 && t.col === user.col);
        if (preferred) return [preferred];
    }
    
    // Fallback to first available target
    if (livingTargets.length > 0) return [livingTargets[0]];
    
    return [];
}



//Digging minigame
// Global tile images array
const tileImages = [];
// Unique-per-run tracking + treasure image cache
let placedUniqueTreasures = new Set();
const treasureImageCache = new Map();

// Call this once when game initializes
function preloadTileImages() {
    for (let hp = 1; hp <= 5; hp++) {
        const img = new Image();
        img.src = cleanupImage("items/tile" + hp);
        tileImages[hp] = img;
    }
}
preloadTileImages();

//Establish global variables
var digHealth = 0;
var maxDigHealth = 0;
var digWidth = 16;
var digHeight = 10;
var digTiles = [];
var digTreasures = [];
var canvasMaxX = "90%";
var canvasMaxY = "60vh";
var digWeapon = "pick"

if (window.matchMedia('(orientation: portrait)').matches) {
    canvasMaxX = "100%";
    canvasMaxY = "50vh";
    digWidth = 10;
    digHeight = 16;
}

//Initialize 10x10 board
function digStart() {
    data.player.originalLocation = data.player.location;
    // reset unique placement for this run
    placedUniqueTreasures = new Set();

    digHealth = 0;
    digHealth += checkSkill("stamina");
    digWeapon = "pick";
    if (data.player.bonus == undefined) data.player.bonus = 0;
    if (checkItem("hammer") == true) {
        data.player.bonus += 10;
    }
    if (data.player.bonus > 0) {
        digHealth += data.player.bonus;
        data.player.bonus = 0;
    }
    maxDigHealth = digHealth;
    digTiles = [];
    digTreasures = [];

    // clear any previous UI for a fresh board
    const out = document.getElementById('output');
    const old = document.getElementById('digSpace');
    if (old) old.remove();

    // (re)build tiles
    for (let digX = 0; digX < digWidth; digX++) {
        for (let digY = 0; digY < digHeight; digY++) {
            let tileHP = 4;
            if (digX === 0 || digX === digWidth - 1 || digY === 0 || digY === digHeight - 1) tileHP = 5;
            digTiles.push({ x: digX, y: digY, hp: tileHP, treasure: "" }); // treasure: "" means empty
        }
    }

    digTilePattern();
    digTreasurePattern();
    exploredLocations = []
    digResume();
}

function digReturn() {
    grottoStarted = false
    removeFlag("player", "originallyHadClothing");
	soundEffectStart("talk");
    changeLocation(data.player.originalLocation);
	document.getElementById('output').innerHTML = '';
	wrapper.scrollTop = 0;
    digResume();
    exploredLocations = [];
    addFlag("player", "chuckster");
    grottoStarted = false;
}

function digResume() {
    grottoStarted = false
    const out = document.getElementById('output');
    const old = document.getElementById('digSpace');
    if (old) old.remove();
    var buttonSize = "200px";
    if (window.matchMedia('(orientation: portrait)').matches) {
        buttonSize = "150px";
    }
    else if (window.matchMedia('(max-height: 520px)').matches) {
        buttonSize = "120px";  // mobile landscape: short screen, shrink the tool buttons
    }
    out.innerHTML += `
        <div id="digSpace" style="height:${canvasMaxY}; position:relative;"></div>
        <div id="toolSpace" style="display:flex; flex-direction:row; justify-content:space-around;">
            <p style="font-size:var(--fs-xlarge, 2rem);"><span id="digHealth">${digHealth}</span>/${maxDigHealth}❤</p>
            <img id="pickButton" onclick="digSwap('pick')" style="max-width:`+buttonSize+`;filter:hue-rotate(0deg) brightness(100%);" src="${cleanupImage("items/tilePick.png")}">
            <img id="hammerButton" onclick="digSwap('hammer')" style="max-width:`+buttonSize+`;filter:hue-rotate(180deg) brightness(50%);" src="${cleanupImage("items/tileHammer.png")}">
        </div>
    `;
    if (checkItem("hammer") != true) {
        document.getElementById("hammerButton").style.display = "none";
    }
    setupDigCanvas();
    drawDigCanvas();
    setupOverlayCanvas();
    drawOverlayCanvas();
    enableDigInput();
}

function digSwap(weapon) {
    if (digWeapon != weapon) {
        digWeapon = weapon;
        if (weapon == "pick") {
            document.getElementById("pickButton").style.filter = "hue-rotate(0deg) brightness(100%)";
            document.getElementById("hammerButton").style.filter = "hue-rotate(180deg) brightness(50%)";
        }
        else {
            document.getElementById("pickButton").style.filter = "hue-rotate(180deg) brightness(50%)";
            document.getElementById("hammerButton").style.filter = "hue-rotate(0deg) brightness(100%)";
        }
    }
}

// Create canvas inside #output
function setupDigCanvas() {
    const outputDiv = document.getElementById("digSpace");

    // Remove old canvas if any
    let oldCanvas = document.getElementById("digCanvas");
    if (oldCanvas) oldCanvas.remove();

    // Create canvas
    const canvas = document.createElement("canvas");
    canvas.id = "digCanvas";
    canvas.style.position = "absolute";
    canvas.width = 500;
    canvas.height = 500; // square for now
    canvas.style.maxWidth = canvasMaxX;
    canvas.style.maxHeight = canvasMaxY;
    canvas.style.width = "100%";
    canvas.style.height = "auto";
    canvas.style.border = "2px solid black";
    canvas.style.display = "block";
    canvas.style.margin = "0 auto";

    outputDiv.appendChild(canvas);
    writeFunction("digFinish()", "Finish Early")
}

function getTreasureImage(src, onReady) {
    const url = cleanupImage(src);
    let rec = treasureImageCache.get(url);
    if (rec && rec.img.complete) return rec.img;

    if (!rec) {
        const img = new Image();
        rec = { img, loaded: false };
        treasureImageCache.set(url, rec);
        img.onload = () => {
            rec.loaded = true;
            if (typeof onReady === 'function') onReady();
        };
        img.src = url;
    } else if (!rec.loaded && typeof onReady === 'function') {
        rec.img.onload = () => {
            rec.loaded = true;
            onReady();
        };
    }
    return rec.img;
}

function drawDigCanvas() {
    const canvas = document.getElementById("digCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const tileW = canvas.width  / digWidth;
    const tileH = canvas.height / digHeight;

    let requestedRedraw = false;

    for (const tre of digTreasures) {
        const img = getTreasureImage(tre.image, () => {
            if (!requestedRedraw) {
                requestedRedraw = true;
                // schedule a single redraw after images load
                requestAnimationFrame(drawDigCanvas);
            }
        });
        if (img && img.complete) {
            const px = tre.x * tileW, py = tre.y * tileH;
            const w  = tre.size * tileW, h  = tre.size * tileH;
            ctx.drawImage(img, px, py, w, h);
        }
    }
}

function setupOverlayCanvas() {
    const outputDiv = document.getElementById("digSpace");

    // Treasure canvas (already exists)
    const baseCanvas = document.getElementById("digCanvas");

    // Remove old overlay if any
    let oldOverlay = document.getElementById("digOverlay");
    if (oldOverlay) oldOverlay.remove();

    // Create overlay canvas
    const overlay = document.createElement("canvas");
    overlay.id = "digOverlay";
    overlay.width = baseCanvas.width;
    overlay.height = baseCanvas.height;

    // Stack directly on top of digCanvas
    overlay.style.position = "absolute";
    overlay.style.width = baseCanvas.style.width;
    overlay.style.height = baseCanvas.style.height;
    overlay.style.maxWidth = canvasMaxX;
    overlay.style.maxHeight = canvasMaxY;
    overlay.style.width = "100%";
    overlay.style.height = "auto";
    overlay.style.margin = "0 auto";

    outputDiv.style.position = "relative"; // ensure stacking context
    outputDiv.appendChild(overlay);
}

function drawOverlayCanvas() {
    const overlay = document.getElementById("digOverlay");
    if (!overlay) return;
    const ctx = overlay.getContext("2d");

    const tileWidth = overlay.width / digWidth;
    const tileHeight = overlay.height / digHeight;

    ctx.clearRect(0, 0, overlay.width, overlay.height);

    for (let y = 0; y < digHeight; y++) {
        for (let x = 0; x < digWidth; x++) {
            let tile = getTile(x, y);

            if (tile.hp > 0) {
                const tileImg = tileImages[tile.hp];
                if (tileImg.complete) { // make sure image is loaded
                    ctx.drawImage(tileImg, x * tileWidth, y * tileHeight, tileWidth, tileHeight);
                }
            }
        }
    }
}

function enableDigInput() {
    console.info("Enabling dig input");
    const overlay = document.getElementById("digOverlay");
    if (!overlay) return;

    function handleInput(event) {
        event.preventDefault();

        const rect = overlay.getBoundingClientRect();

        let clientX, clientY;
        if (event.type.startsWith("touch")) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            clientX = event.clientX;
            clientY = event.clientY;
        }

        // Scale from CSS space to canvas space
        const scaleX = overlay.width / rect.width;
        const scaleY = overlay.height / rect.height;

        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;

        const tileWidth = overlay.width / digWidth;
        const tileHeight = overlay.height / digHeight;

        const tileX = Math.floor(x / tileWidth);
        const tileY = Math.floor(y / tileHeight);

        clickTile(tileX, tileY);
        console.log(`Digging tile at (${tileX}, ${tileY})`);
        drawOverlayCanvas();   // refresh visuals
    }

    overlay.addEventListener("click", handleInput);
    overlay.addEventListener("touchstart", handleInput);
}

function disableDigInput() {
    const overlay = document.getElementById("digOverlay");
    if (!overlay) return;
    overlay.replaceWith(overlay.cloneNode(true)); // easiest way to strip all listeners
}

//Select tile health pattern
function digTilePattern() {
    var randomPredugPatterns = [
        "griddy",
        "horizontalLines",
        "verticalLines",
        "centralCircle",
        "offCircle",
        "tinyCircles",
        "benis",
    ]
    var selectedPredug = [];
    selectedPredug.push(randomPredugPatterns[Math.floor(Math.random() * randomPredugPatterns.length)]);
    selectedPredug.push(randomPredugPatterns[Math.floor(Math.random() * randomPredugPatterns.length)]);
    for (predugItem of selectedPredug) {
        switch (predugItem) {
            case "griddy":
                for (let digX = 0; digX < digWidth; digX ++) {
                    for (let digY = 0; digY < digHeight; digY ++) {
                        if (digX == 0 || digX == 3 || digX == 6 || digX == 9) {
                            if (digY == 0 || digY == 3 || digY == 6 || digY == 9) {
                                digTile(digX, digY);
                            }
                        }
                    }
                }
            break;
            case "horizontalLines":
                for (let digX = 0; digX < digWidth; digX ++) {
                    for (let digY = 0; digY < digHeight; digY ++) {
                        if (digY == 3 || digY == 6) {
                            digTile(digX, digY);
                        }
                    }
                }
            break;
            case "verticalLines":
                for (let digX = 0; digX < digWidth; digX ++) {
                    for (let digY = 0; digY < digHeight; digY ++) {
                        if (digX == 3 || digX == 6) {
                            digTile(digX, digY);
                        }
                    }
                }
            break;
            case "centralCircle":
                for (let digX = 0; digX < digWidth; digX ++) {
                    for (let digY = 0; digY < digHeight; digY ++) {
                        if ((digX - 4) ** 2 + (digY - 4) ** 2 <= 4 ** 2) {
                            digTile(digX, digY);
                        }
                    }
                }
            break;
            case "offCircle":
                for (let digX = 0; digX < digWidth; digX ++) {
                    for (let digY = 0; digY < digHeight; digY ++) {
                        if ((digX - 4) ** 2 + (digY - 4) ** 2 <= 3 ** 2) {
                            digTile(digX, digY);
                        }
                    }
                }
            break;
        }
    }
}

//Treasure variables & array
var digTreasureArray = [
    {index: "artifact-chainsaw", originalRarity: 1, unique: true, size: 5, image: "treasure/chest-gold", requirements: "!item chainsaw; !flag tink chainsaw; !carnivore; ?trustMin tink 1;", content: `
        t Rare Artifact!
        player befuddled Eh?
        im tink/chainsaw0-0
        player curious A chainsaw?
        player happy It's completely busted, but maybe somebody would still want it.
        eval addItem('chainsaw');
    `,},
    {index: "artifact-clips", originalRarity: 1, unique: true, size: 2, image: "treasure/chest-gold", requirements: "!item clips; !flag tink clips; !carnivore; ?trustMin tink 1;", content: `
        t Rare Artifact!
        player befuddled Eh?
        im tink/clips0-0
        player curious Jumper cables? Well, just the clips.
        player happy It's completely busted, but maybe somebody would still want it.
        eval addItem('clips');
    `,},
    {index: "artifact-tv", originalRarity: 1, unique: true, size: 5, image: "treasure/chest-gold", requirements: "!flag player tvReady; !item tv;", content: `
        t Rare Artifact!
        player befuddled Eh?
        im artifacts/tv1
        player curious A monitor? No, it's a tv? What's it doing here in the dirt?<br>And what's this label on the back say?
        t "All the..." "most BRUTAL"... "Hardcore"...
        player worried I can barely read it. But I get the feeling this is no normal television set.
        player pout Something's fishy here! Maybe someone in town knows what this thing's deal is?
        eval addFlag('player', 'tvReady');
    `,},
    {index: "artifact-hole", originalRarity: 1, unique: true, size: 2, image: "treasure/chest-gold", requirements: "!flag player holeReady; !item hole;", content: `
        t Rare Artifact!
        player befuddled Eh?
        im artifacts/hole1
        player curious Eh? It's a-
        player scared Blegh! Gross, it's-
        t Instinctively, you toss the silicone tube aside, only to feel a sudden pain in the ass.
        player shock Ouch! What the heck?<br>... Huh. Now that I look at it, it's perfectly clean. Not even dirty, even though I dug it up...
        player worried Something's fishy here! Maybe someone in town knows what this thing's deal is.<br>shopF knows sex toys, maybe this is her wheelhouse?
        eval addFlag('player', 'holeReady');
    `,},
    {index: "artifact-pill", originalRarity: 1, unique: true, size: 5, image: "treasure/chest-gold", requirements: "!flag player pillReady; !item pill;", content: `
        t Rare Artifact!
        player befuddled Eh?
        im artifacts/pill1
        player curious A bottle? Is this milk, cum, or... No, it's too viscous, this is some kinda jelly...<br>And the warning sign, and is that a picture of... Testicles?
        player worried I should bring this to someone who might know what it is.
        eval addFlag('player', 'pillReady');
    `,},
    {index: "artifact-watch", originalRarity: 1, unique: true, size: 3, image: "treasure/chest-gold", requirements: "!flag player watchReady; !item watch;", content: `
        t Rare Artifact!
        player befuddled Eh?
        im artifacts/watch1
        player curious A watch? Looks kinda fancy. But it's stopped...<br>Oh, there's a button on top...
        t *CLICK*
        player joy Wow, it started! And it still works! But how is it still working after being buried for so long?
        t *CLICK*
        player curious Hmm. why would a stopwatch be this decorated?<br>Something's fishy here, I should bring this to someone, maybe someone in town dropped it?
        eval addFlag('player', 'watchReady');
    `,},
    {index: "artifact-cherry", originalRarity: 1, unique: true, size: 2, image: "treasure/chest-gold", requirements: "!flag player cherryReady; !item cherry;", content: `
        t Rare Artifact!
        im artifacts/cherry1
        player Holy macaroni, intact cherries!<br>With a star sticker on them? Well, I guess I've found weirder.
        player worried Actually, wait, that just makes these even weirder. Normal cherries, <i>here</i> Something's suspicious. I'll have to handle these carefully.
        player sleep Well, I guess "handle carefully" for me is really just "don't eat it straight off the ground".<br>It really is a miracle I haven't eaten an intact battery, or a bomb from a bomb factory yet.<br>In any case, I bet shopF would know what these things' deal are.
        eval addFlag('player', 'cherryReady');
    `,},

    {index: "mystery-mimicPurple", originalRarity: 5, unique: true, size: 5, image: "treasure/chest-blue-null", requirements: "!flag player mimic-p;", content: `
		define mimicp = sp Purple Mimic; im treasure/mystery/mimicp.png; altColor #9386A5;
        t Inside the chest is...
        im treasure/mystery/mimicPurple1
        t It's a mimic!
        mimicp Hehe, sorry bud, too slow~<br>I've been living in this box for awhile now.<br>How about you scram, yeah?
        eval writeFunction("writeScene('system', 'mimicPurple2')", "Self defense!");
        eval writeFunction("writeScene('system', 'mimicPurple3')", "Retreat!");
    `,},
    {index: "mystery-mimicBlue", originalRarity: 5, unique: true, size: 5, image: "treasure/chest-blue-null", requirements: "!flag player mimic-b; !vegetarian;", content: `
		define mimicb = sp Blue Mimic; im treasure/mystery/mimicb.png; altColor #7D9DBE;
        t Inside the chest is...
        im treasure/mystery/mimicBlue1
        t It's a mimic!
        mimicb Eh?! Eep!
        player shock Whoa!
        eval writeFunction("writeScene('system', 'mimicBlue2')", "Self defense!");
        eval writeFunction("writeScene('system', 'mimicBlue3')", "Retreat!");
    `,},
    {index: "mystery-mimicRed", originalRarity: 5, unique: true, size: 5, image: "treasure/chest-blue-null", requirements: "!flag player mimic-r; !carnivore;", content: `
		define mimicr = sp Red Mimic; im treasure/mystery/mimicr.png; altColor #A14A4D;
        t Inside the chest is...
        im treasure/mystery/mimicRed1
        t It's a mimic!
        mimicr Ohoh, a human! Gimme all your treasure!
        player shock Wah!
        eval writeFunction("writeScene('system', 'mimicRed2')", "Self defense!");
        eval writeFunction("writeScene('system', 'mimicRed3')", "Retreat!");
    `,},

    /*
    {index: "Cloak", originalRarity: 6, unique: true, size: 3, image: "treasure/chest-silver", requirements: "!item CLOTHING;", content: `
        t Uncommon clothing box: CLOTHING
        player happy Ooh! Flowy any red! And it's really clean too, somehow.
        eval addItem('CLOTHING', true);
        special CLOTHING obtained! You can put it on it at the wardrobe back at home.
    `,},
    {index: "Rose Uniform", originalRarity: 6, unique: true, size: 3, image: "treasure/chest-silver", requirements: "!item CLOTHING;", content: `
        t Uncommon clothing box: CLOTHING
        player happy A cool black dress with a cute ruffled red trim! This could be a great centerpiece to a new outfit.
        eval addItem('CLOTHING', true);
        special CLOTHING obtained! You can put it on it at the wardrobe back at home.
    `,},
    {index: "Gradient Hair", originalRarity: 6, unique: true, size: 2, image: "treasure/chest-silver", requirements: "!item CLOTHING;", content: `
        t Uncommon clothing box: CLOTHING
        player curious A hair styling guide? There's some hair dye in here too.
        eval addItem('CLOTHING', true);
        special CLOTHING obtained! You can put it on it at the wardrobe back at home.
    `,},
    {index: "Pantyhose", originalRarity: 6, unique: true, size: 2, image: "treasure/chest-silver", requirements: "!item CLOTHING;", content: `
        t Uncommon clothing box: CLOTHING
        player happy A pair of pantyhose! It's weird I call them a "pair" when there's just one.<br>Whatever you call them, they're extra stretchy.
        eval addItem('CLOTHING', true);
        special CLOTHING obtained! You can put it on it at the wardrobe back at home.
    `,},
    {index: "White Jacket", originalRarity: 6, unique: true, size: 3, image: "treasure/chest-silver", requirements: "!item CLOTHING;", content: `
        t Uncommon clothing box: CLOTHING
        player happy Wow, so fashionable! Although, without something underneath, it'll barely cover my chest pepperonis...
        eval addItem('CLOTHING', true);
        special CLOTHING obtained! You can put it on it at the wardrobe back at home.
    `,},
    {index: "Heiress Ponytail", originalRarity: 6, unique: true, size: 2, image: "treasure/chest-silver", requirements: "!item CLOTHING;", content: `
        t Uncommon clothing box: CLOTHING
        player curious A hair styling guide? There's some hair dye in here too.
        eval addItem('CLOTHING', true);
        special CLOTHING obtained! You can put it on it at the wardrobe back at home.
    `,},
    {index: "Pure Dress", originalRarity: 6, unique: true, size: 2, image: "treasure/chest-silver", requirements: "!item CLOTHING;", content: `
        t Uncommon clothing box: CLOTHING
        player happy What a refined dress! And it seems perfect for wearing underneath something else.
        eval addItem('CLOTHING', true);
        special CLOTHING obtained! You can put it on it at the wardrobe back at home.
    `,},
    {index: "High Heels", originalRarity: 6, unique: true, size: 2, image: "treasure/chest-silver", requirements: "!item CLOTHING;", content: `
        t Uncommon clothing box: CLOTHING
        player happy Just barely too low to be considered platform heels.
        eval addItem('CLOTHING', true);
        special CLOTHING obtained! You can put it on it at the wardrobe back at home.
    `,},
    {index: "Shinobi Garb", originalRarity: 6, unique: true, size: 3, image: "treasure/chest-silver", requirements: "!item CLOTHING;", content: `
        t Uncommon clothing box: CLOTHING
        player sparkle Nin nin!
        eval addItem('CLOTHING', true);
        special CLOTHING obtained! You can put it on it at the wardrobe back at home.
    `,},
    {index: "Colored Inner Hair", originalRarity: 6, unique: true, size: 2, image: "treasure/chest-silver", requirements: "!item CLOTHING;", content: `
        t Uncommon clothing box: CLOTHING
        player curious A hair styling guide? There's some hair dye in here too.
        eval addItem('CLOTHING', true);
        special CLOTHING obtained! You can put it on it at the wardrobe back at home.
    `,},
    {index: "Shiny Pants", originalRarity: 6, unique: true, size: 3, image: "treasure/chest-silver", requirements: "!item CLOTHING;", content: `
        t Uncommon clothing box: CLOTHING
        player shock Gyah! So... Shiny! Is this leather? Or latex?
        eval addItem('CLOTHING', true);
        special CLOTHING obtained! You can put it on it at the wardrobe back at home.
    `,},
    {index: "Belted Boots", originalRarity: 6, unique: true, size: 2, image: "treasure/chest-silver", requirements: "!item CLOTHING;", content: `
        t Uncommon clothing box: CLOTHING
        player happy A pair of boots, they use belts instead of laces.
        eval addItem('CLOTHING', true);
        special CLOTHING obtained! You can put it on it at the wardrobe back at home.
    `,},
    {index: "Tube Jacket", originalRarity: 6, unique: true, size: 2, image: "treasure/chest-silver", requirements: "!item CLOTHING;", content: `
        t Uncommon clothing box: CLOTHING
        player happy A jacket. I feel stronger just holding it!
        eval addItem('CLOTHING', true);
        special CLOTHING obtained! You can put it on it at the wardrobe back at home.
    `,},
    {index: "Goldie Locks", originalRarity: 6, unique: true, size: 2, image: "treasure/chest-silver", requirements: "!item CLOTHING;", content: `
        t Uncommon clothing box: CLOTHING
        player curious A hair styling guide? There's some hair dye in here too.
        eval addItem('CLOTHING', true);
        special CLOTHING obtained! You can put it on it at the wardrobe back at home.
    `,},
    {index: "Bootyshorts", originalRarity: 6, unique: true, size: 2, image: "treasure/chest-silver", requirements: "!item CLOTHING;", content: `
        t Uncommon clothing box: CLOTHING
        player happy Do I got the booty? I do!
        eval addItem('CLOTHING', true);
        special CLOTHING obtained! You can put it on it at the wardrobe back at home.
    `,},
    {index: "Cowboy Boots", originalRarity: 6, unique: true, size: 2, image: "treasure/chest-silver", requirements: "!item CLOTHING;", content: `
        t Uncommon clothing box: CLOTHING
        player happy A pair of cowboy boots. Yee-haw!
        eval addItem('CLOTHING', true);
        special CLOTHING obtained! You can put it on it at the wardrobe back at home.
    `,},
    {index: "Gauntlets", originalRarity: 6, unique: true, size: 2, image: "treasure/chest-silver", requirements: "!item CLOTHING;", content: `
        t Uncommon clothing box: CLOTHING
        player happy A pair of gauntlets! Made of metal, and colored bright yellow.
        eval addItem('CLOTHING', true);
        special CLOTHING obtained! You can put it on it at the wardrobe back at home.
    `,},
    */

    {index: "Hair Flower", originalRarity: 7, unique: true, size: 2, image: "treasure/chest-silver", requirements: "!item CLOTHING; ?location forestWilderness;", content: `
        t Uncommon clothing box: CLOTHING
        player happy What a pretty flower!<br>Oh, it's made of fabric. Still pretty though.
        eval addItem('CLOTHING', true);
        special CLOTHING obtained! You can put it on it at the wardrobe back at home.
    `,},
    {index: "Shades", originalRarity: 7, unique: true, size: 2, image: "treasure/chest-silver", requirements: "!item CLOTHING; ?location lakesideRuins;", content: `
        t Uncommon clothing box: CLOTHING
        player happy Sunglasses? They look modern, I wonder how these got here.
        eval addItem('CLOTHING', true);
        special CLOTHING obtained! You can put it on it at the wardrobe back at home.
    `,},
    {index: "Pelvic Curtain", originalRarity: 7, unique: true, size: 2, image: "treasure/chest-silver", requirements: "!item CLOTHING;", content: `
        t Uncommon clothing box: CLOTHING
        player happy A loincloth, it's really small though. Wearing just this might be a bit breezy.
        eval addItem('CLOTHING', true);
        special CLOTHING obtained! You can put it on it at the wardrobe back at home.
    `,},
    {index: "Greaves", originalRarity: 7, unique: true, size: 2, image: "treasure/chest-silver", requirements: "!item CLOTHING;", content: `
        t Uncommon clothing box: CLOTHING
        player happy A pair of armored boots! I wonder if these can be dyed...
        eval addItem('CLOTHING', true);
        special CLOTHING obtained! You can put it on it at the wardrobe back at home.
    `,},
    {index: "Full Poncho", originalRarity: 7, unique: true, size: 2, image: "treasure/chest-silver", requirements: "!item CLOTHING;", content: `
        t Uncommon clothing box: CLOTHING
        player happy A poncho! It's warm, but it's not too thick. Perfect for if I love wearing a shirt but hate sleeves.
        eval addItem('CLOTHING', true);
        special CLOTHING obtained! You can put it on it at the wardrobe back at home.
    `,},
    {index: "Half Poncho", originalRarity: 7, unique: true, size: 2, image: "treasure/chest-silver", requirements: "!item CLOTHING;", content: `
        t Uncommon clothing box: CLOTHING
        player happy A poncho! Or, half of one. More like a sarong for my upper body. Perfect for when I want to be just barely not naked.
        eval addItem('CLOTHING', true);
        special CLOTHING obtained! You can put it on it at the wardrobe back at home.
    `,},
    {index: "Jeans", originalRarity: 7, unique: true, size: 3, image: "treasure/chest-silver", requirements: "!item CLOTHING;", content: `
        t Uncommon clothing box: CLOTHING
        player befuddled A pair of denim jeans! How did a pair of pants end up in Syrup Town?<br>They're brand new, never worn. I guess that makes sense at least.
        eval addItem('CLOTHING', true);
        special CLOTHING obtained! You can put it on it at the wardrobe back at home.
    `,},
    {index: "Bikini Armor", originalRarity: 7, unique: true, size: 5, image: "treasure/chest-silver", requirements: "!item CLOTHING;", content: `
        t Uncommon clothing box: CLOTHING
        player happy A set of armor! Finally, something fitting for-
        player surprised Wait, this is a bikini! This won't protect my bits at all!<br>Well, unless it gives stat buffs. You never know with these things.<br>... Wait, I don't fight anything, why would it matter how much it protects?
        eval addItem('CLOTHING', true);
        special CLOTHING obtained! You can put it on it at the wardrobe back at home.
    `,},

    {index: "cheatMisc1c", originalRarity: 8, unique: true, size: 2, image: "treasure/chest-green-null", requirements: "!item CLOTHING; !vegetarian;", content: `
        t Uncommon jiggy box: Drago-Mama (C)
        player happy A new jiggy! I bet this'll be fun to assemble!
        eval addItem('CLOTHING', true);
        special Jiggy obtained! You can assemble it back at home.
    `,},
    {index: "cheatMisc1v", originalRarity: 8, unique: true, size: 2, image: "treasure/chest-green-null", requirements: "!item CLOTHING; !carnivore;", content: `
        t Uncommon jiggy box: Drago-Mama (V)
        player happy A new jiggy! I bet this'll be fun to assemble!
        eval addItem('CLOTHING', true);
        special Jiggy obtained! You can assemble it back at home.
    `,},
    {index: "cheatMisc2c", originalRarity: 8, unique: true, size: 2, image: "treasure/chest-green-null", requirements: "!item CLOTHING; !vegetarian;", content: `
        t Uncommon jiggy box: Gobbo Supremacy (C)
        player happy A new jiggy! I bet this'll be fun to assemble!
        eval addItem('CLOTHING', true);
        special Jiggy obtained! You can assemble it back at home.
    `,},
    {index: "cheatMisc2v", originalRarity: 8, unique: true, size: 2, image: "treasure/chest-green-null", requirements: "!item CLOTHING; !carnivore;", content: `
        t Uncommon jiggy box: Gobbo Supremacy (V)
        player happy A new jiggy! I bet this'll be fun to assemble!
        eval addItem('CLOTHING', true);
        special Jiggy obtained! You can assemble it back at home.
    `,},
    
    


    {index: "fallbackHuge", originalRarity: 9, unique: false, size: 5, image: "treasure/chest-bronze", requirements: "", content: `
        eval diggingFail('huge');
    `,},
    {index: "fallbackBig", originalRarity: 9, unique: false, name: "Big Test", size: 3, image: "treasure/chest-bronze", requirements: "", content: `
        eval diggingFail('big');
    `,},
    {index: "fallbackSmall", originalRarity: 9, unique: false, name: "Small Test", size: 2, image: "treasure/chest-bronze", requirements: "", content: `
        eval diggingFail('small');
    `,},
    {index: "mystery-foxm", originalRarity: 3, unique: true, size: 3, image: "treasure/chest-blue-null", requirements: "!vegetarian; ?flag foxf fun; !flag foxm mystery;", content: `
        eval writeScene("foxm", "mystery")
        trans resumeDigging; Back to digging
    `},
    {index: "mystery-foxf", originalRarity: 3, unique: true, size: 3, image: "treasure/chest-blue-null", requirements: "!carnivore; ?flag foxf fun; !flag foxf mystery;", content: `
        eval writeScene("foxf", "mystery")
        trans resumeDigging; Back to digging
    `},
    {index: "mystery-grotto", originalRarity: 3, unique: true, size: 3, image: "treasure/hole", requirements: "!holiday watch;", content: `
        eval digHealth += 1;
        eval grottoStart();
    `},
    {index: "mystery-hann-male", originalRarity: 5, unique: true, size: 2, image: "treasure/chest-blue-null", requirements: "!vegetarian; !flag player hanniwa;", content: `
        t Inside the chest is...
        im treasure/wilderness-misc-hann-male
        t It's a dancing haniwa!
        player happy What an unbothered little guy! Just seeing him try to dance fills me with energy!
        player confused But these are normally buried at grave sites, what's one doing here?
        eval digHealth += 5;
        eval data.player.bonus += 5;
        t You've gained a little extra health for this and your next dig!
        eval addFlag("player", "hanniwa");
        trans resumeDigging; Back to digging
    `},
    {index: "mystery-hann-female", originalRarity: 5, unique: true, size: 2, image: "treasure/chest-blue-null", requirements: "!carnivore; !flag player hanniwa;", content: `
        t Inside the chest is...
        im treasure/wilderness-misc-hann-female
        t It's a dancing haniwa!
        player happy A dancing little lady! Just seeing her try to dance fills me with energy!
        player confused But these are normally buried at grave sites, what's one doing here?
        eval digHealth += 5;
        eval data.player.bonus += 5;
        t You've gained a little extra health for this and your next dig!
        eval addFlag("player", "hanniwa");
        trans resumeDigging; Back to digging
    `},
    {index: "mystery-hann-male", originalRarity: 9, unique: true, size: 2, image: "treasure/chest-blue-null", requirements: "!vegetarian;", content: `
        t Inside the chest is...
        im treasure/wilderness-misc-hann-male
        t It's a dancing haniwa!
        player happy What an unbothered little guy! Just seeing him try to dance fills me with energy!
        player confused But these are normally buried at grave sites, what's one doing here?
        eval digHealth += 5;
        eval data.player.bonus += 5;
        t You've gained a little extra health for this and your next dig!
        eval addFlag("player", "hanniwa");
        trans resumeDigging; Back to digging
    `},
    {index: "mystery-hann-female", originalRarity: 9, unique: true, size: 2, image: "treasure/chest-blue-null", requirements: "!carnivore;", content: `
        t Inside the chest is...
        im treasure/wilderness-misc-hann-female
        t It's a dancing haniwa!
        player happy A dancing little lady! Just seeing her try to dance fills me with energy!
        player confused But these are normally buried at grave sites, what's one doing here?
        eval digHealth += 5;
        eval data.player.bonus += 5;
        t You've gained a little extra health for this and your next dig!
        eval addFlag("player", "hanniwa");
        trans resumeDigging; Back to digging
    `},
];

var quickerClothesAdderArray = [
	{index: "apothecarySet", name: "Apothecary Outfit", desc: "player happy Ooh! What a comfortable looking outfit!"},
	{index: "escortSet", name: "Escort Outfit", desc: "player happy Ooh! I bet the townsfolk would love to see me in this!", extraItems: ["Thong", "Fishnets"]},
	{index: "catSet", name: "Catty Outfit", desc: "player happy Ooh! I can have fluffy ears!"},
	{index: "crowSet", name: "Crow Outfit", desc: "player happy Ooh! So mysterious and cool-looking!"},
	{index: "fatedSet", name: "Frenchie Outfit", desc: "player happy Ooh! There's something really mischevious about this look!", size: 5},
	{index: "frogsuitSet", name: "Frogsuit", desc: "player happy Ooh! Super waterproof! Now if only I could swim...", size: 5},
	{index: "gollySet", name: "Goth Lolly Outfit", desc: "player happy Ooh! What a whimsical outfit!", size: 5},
	{index: "magicSet", name: "Magical Girl Outfit", desc: "player happy Ooh! Finally, some clothes that expose just the right amount of armpit!"},
	{index: "oobleSet", name: "Wicked Outfit", desc: "player happy Ooh! Very tight!"},
	{index: "princeSet", name: "Prince's Outfit", desc: "player happy Ooh! Such innocent-looking attire!"},
	{index: "rabbitSet", name: "Rabbit Hero Outfit", desc: "player happy Ooh! Finally, I can dress up as the animal-themed superhero of my dreams!"},
	{index: "sorceressSet", name: "Sorceress Outfit", desc: "player happy Ooh! I could look like a really cool witch in this outfit!", size: 3},
	{index: "spookySet", name: "Spooky Princess Outfit", desc: "player happy Ooh! This is definitely an outfit that oozes positive vibes!", size: 3},
	{index: "starSet", name: "Star Princess Outfit", desc: "player happy Ooh! This outfit would be perfect for birdwatching!"},
	{index: "witchySet", name: "Witch Outfit", desc: "player happy Ooh! I could look like a really cool sorceress in this outfit!"},
	{index: "roobSet", name: "Rose Outfit", desc: "player happy A cool black dress with a cute ruffled red trim, and a flowy red cape!", size: 5},
	{index: "heiressSet", name: "Heiress Outfit", desc: "player happy Wow, so fashionable! I'll look like the height of refinement!"},
	{index: "shinobiSet", name: "Shinobi Outfit", desc: "player happy Nin Nin!"},
	{index: "rowdySet", name: "Rowdy Outfit", desc: "player happy A cool looking jacket, a hair styling guide, a rad set of gauntlets, and a pair of cowboy boots. Yee-haw!"},
	{index: "brisketSet", name: "Sporty Outfit", desc: "player happy Ooh! Now I can look like I jog without the inconvenience of jogging!"},
	{index: "squigSet", name: "Wallflower Outfit", desc: "player happy Ooh! Perfect for standing quietly in a corner, looking extremely noticeable.", size: 3},
	{index: "ofudaSet", name: "Jiangshi Outfit", desc: "player happy Ooh! There's a paper stuck to the hat that says 'do not remove'. I won't. I respect paper.", size: 3},
	//Bonus from the v13 release letter (mailbox), so it is registered here but kept out of the dig pool
	{index: "ribbonSet", name: "Special Gift Outfit", desc: "player happy Ooh! It's just ribbons. That makes me the present. Happy birthday to everyone, I guess.", digPool: false},
	{index: "angelSet", name: "Angel Outfit", desc: "player happy Ooh! A halo and everything! Now nobody will suspect a thing.", digPool: false},
	{index: "devilSet", name: "Devil Outfit", desc: "player happy Ooh! Horns, wings and a pointy tail! I feel like I should be offering people contracts."},
	{index: "neetSet", name: "NEET Outfit", desc: "player happy Ooh! Comfy clothes for staying inside, found while digging outside. Ironic.", size: 5},
];

function quickerJiggyAdd() {
    for (let i = 0; i < globalItemsArray.length; i++) {
        if (globalItemsArray[i].set == "Core" || globalItemsArray[i].set == "Summertime") {
            var finalRequirements = "!item CLOTHING;";
            var decompiledRequirements = globalItemsArray[i].tags.split(", ");
            if (decompiledRequirements.length > 0) {
                for (let j = 0; j < decompiledRequirements.length; j++) {
                    finalRequirements += " ?"+decompiledRequirements[j]+";";
                }
            }
            var newJig = {
                index: globalItemsArray[i].index,
                originalRarity: 6,
                unique: true,
                size: 2,
                image: "treasure/chest-green-null",
                requirements: finalRequirements,
                content: `
                    t Uncommon jiggy box: `+globalItemsArray[i].set+` - `+getItemName(globalItemsArray[i].index)+`\n
                    player happy A new jiggy! I bet this'll be fun to assemble!\n
                    eval addItem('CLOTHING', true);\n
                    special Jiggy obtained! You can assemble it back at home.
                `,
            }
            digTreasureArray.push(newJig);
        }
    }
    //Shortcut to avoid repetitive clothing code
    for (let i = 0; i < digTreasureArray.length; i++) {
        if (digTreasureArray[i].content.includes("t Uncommon clothing box") || digTreasureArray[i].content.includes("t Uncommon jiggy box")) {
            digTreasureArray[i].content = digTreasureArray[i].content.replaceAll("CLOTHING", digTreasureArray[i].index);
            digTreasureArray[i].requirements = digTreasureArray[i].requirements.replaceAll("CLOTHING", digTreasureArray[i].index);
        }
    }

    //Quicker Clothes Adder
    for (let i = 0; i < quickerClothesAdderArray.length; i++) {
		if (!quickerClothesAdderArray[i].size) {
			quickerClothesAdderArray[i].size = 2;
		}
        var itemCheck = globalItemsArray.find(item => item.index == quickerClothesAdderArray[i].index);
            
        if (!itemCheck) {
            var newClothing = {
                index: quickerClothesAdderArray[i].index,
                name: quickerClothesAdderArray[i].name,
                category: "key",
                value: 0,
            }
            globalItemsArray.push(newClothing);
        }
		
		//Standalone garments an outfit also needs, such as the Escort Outfit's thong and fishnets, are
		//handed out alongside the set so the finished outfit is wearable straight out of the box
		var extraItemLines = "";
		if (quickerClothesAdderArray[i].extraItems) {
			quickerClothesAdderArray[i].extraItems.forEach(extraItem => {
				extraItemLines += `eval addItem('`+extraItem+`', true);\n`;
			});
		}

		var newDiggyAddition = {
		index: quickerClothesAdderArray[i].index,
		originalRarity: 4, unique: true, 
		size: quickerClothesAdderArray[i].size, 
		image: "treasure/chest-silver", 
		requirements: "!item "+quickerClothesAdderArray[i].index+";", 
		content: `
			t Uncommon clothing box: `+quickerClothesAdderArray[i].name+`
			`+quickerClothesAdderArray[i].desc+`
			eval addItem('`+quickerClothesAdderArray[i].index+`', true);
			`+extraItemLines+`
			special All the pieces of the `+quickerClothesAdderArray[i].name+` obtained! You can put it on it at the wardrobe back at home. Here's what it looks like:
			eval printNewOutfit('`+quickerClothesAdderArray[i].index+`');
		`,};
		
		if (quickerClothesAdderArray[i].digPool != false) {
			digTreasureArray.push(newDiggyAddition)
		}
	}
}

function printNewOutfit(index) {
	var clothesOverride = [];
	
	for (let j = 0; j < globalClothesArray.length; j++) {
        if (globalClothesArray[j].requirements == null) {
            globalClothesArray[j].requirements = "";
        }
		//The garment itself, never one of its colour swatches. This used to test for an empty
		//filter, which stopped meaning "not a variant" once variants inherit their garment's
		//fields and so can have an empty filter of their own.
		if (globalClothesArray[j].requirements.includes("?item "+index) && isClothingVariant(globalClothesArray[j]) != true) {
			clothesOverride.push(globalClothesArray[j]);
		}
	}
    //This used to test for categories called topwear and bottomwear, which do not exist, so it
    //appended both empty sentinels to every preview instead of only the missing halves. The
    //sentinels are gone and drawPlayer places the genital anchor itself, so nothing is needed.
    console.debug(index);
    
    document.getElementById("output").innerHTML += `<div id ="outfitHolder" style = "margin: auto;width:25%;"><div id="outfit-`+index+`Item" class = "playerSelf" style="width:100%;border: 3px solid;overflow:hidden;aspect-ratio:1/2;position:relative;background: #000;">`+drawPlayer("playerSelf;", clothesOverride)+`</div></div>`;
}

var finishedBatches = [];
var newestBatch = 7;
for (var i = 1; i < newestBatch; i++) {
    finishedBatches.push(i);
}

function randomJiggyObtain(count, set) {
    console.debug("randomJiggyObtain");
	//Grabs [COUNT] random unobtained jiggies from finished subscriber batches
    //Which batches still hold a jiggy this player can actually be given. The old code rolled a
    //batch that only had to be "incomplete", which ignored the content filters, so a batch whose
    //remaining jiggies were all filtered out could be picked and the purchase handed over nothing.
    function optionsInBatch(batchName) {
        var found = [];
        for (var optionIndex = 0; optionIndex < globalItemsArray.length; optionIndex++) {
            if (globalItemsArray[optionIndex].set == "Sub Batch "+batchName
                && checkItem(globalItemsArray[optionIndex].index) == false
                && fetishes(globalItemsArray[optionIndex].tags) == true) {
                found.push(globalItemsArray[optionIndex]);
            }
        }
        return found;
    }
	if (!set) {
        var stockedBatches = [];
        for (var batchIndex = 0; batchIndex < finishedBatches.length; batchIndex++) {
            if (optionsInBatch(finishedBatches[batchIndex]).length > 0) {
                stockedBatches.push(finishedBatches[batchIndex]);
            }
        }
        var selectedSet = stockedBatches[Math.floor(Math.random() * stockedBatches.length)];
        console.debug("selectedSet: "+selectedSet+" from stocked batches "+stockedBatches);
	}
    else {
        var selectedSet = set
    }
    var legalJiggyOptions = selectedSet == undefined ? [] : optionsInBatch(selectedSet);
    if (count > legalJiggyOptions.length) {
        count = legalJiggyOptions.length
    }
    //Nothing left to hand over. The listing is gated so this should not be reachable, but printing
    //"A new jiggy!" over an empty list is how the old bug looked from the player's side.
    if (count < 1) {
        console.error("randomJiggyObtain called with no jiggies left to give");
        return;
    }
    if (count > 1) {
        var finalOutput = `t A trove of jiggies! `
    }
    else {
        var finalOutput = `t A new jiggy! `
    }
    var selectedJiggies = [];
    var finalSuffix = "";
    for (var jiggyIndex = 0; jiggyIndex < count; jiggyIndex++) {
        selectedJiggies.push(legalJiggyOptions[Math.floor(Math.random() * legalJiggyOptions.length)]);
        legalJiggyOptions.splice(legalJiggyOptions.indexOf(selectedJiggies[jiggyIndex]), 1);
        if (jiggyIndex < count-1) {
            finalOutput += "☆<span style='color: green;'>"+selectedJiggies[jiggyIndex].name+ "</span>☆, ";
        }
        else {
            if (count > 1) {finalOutput += "and "};
            finalOutput += "☆<span style='color: green;'>"+selectedJiggies[jiggyIndex].name+ `</span>☆!`
        }
        finalSuffix += `\neval addItem("${selectedJiggies[jiggyIndex].index}", true);`
    }
    console.debug(selectedJiggies);
    finalOutput += "\nplayer sparkle Ooh!<br>The label says 'Funded by subscribers'... Neat!"
    if (count > 1) {finalSuffix += `\nspecial `+selectedJiggies.length+` New Jiggies obtained! You can assemble them back at home.`;}
    else {finalSuffix += `\nspecial New Jiggy obtained! You can assemble it back at home.`;};
    writeHTML(finalOutput);
    writeHTML(finalSuffix);
}

function randomJiggyNonSub(count, set) {
    console.debug("randomJiggyNonSub");
	//Grabs [COUNT] random unobtained jiggies from the named set
    var legalJiggyOptions = [];
    for (var jiggyIndex = 0; jiggyIndex < globalItemsArray.length; jiggyIndex++) {
        if (globalItemsArray[jiggyIndex].set == set && checkItem(globalItemsArray[jiggyIndex].index) == false && fetishes(globalItemsArray[jiggyIndex].tags) == true) {
            legalJiggyOptions.push(globalItemsArray[jiggyIndex]);
        }
    }
    if (count > legalJiggyOptions.length) {
        count = legalJiggyOptions.length
    }
    //Same guard as randomJiggyObtain: never announce a jiggy the player is not being given
    if (count < 1) {
        console.error("randomJiggyNonSub called with no jiggies left in set "+set);
        return;
    }
    if (count > 1) {
        var finalOutput = `t A trove of jiggies! `
    }
    else {
        var finalOutput = `t A new jiggy! `
    }
    var selectedJiggies = [];
    var finalSuffix = "";
    for (var jiggyIndex = 0; jiggyIndex < count; jiggyIndex++) {
        selectedJiggies.push(legalJiggyOptions[Math.floor(Math.random() * legalJiggyOptions.length)]);
        legalJiggyOptions.splice(legalJiggyOptions.indexOf(selectedJiggies[jiggyIndex]), 1);
        if (jiggyIndex < count-1) {
            finalOutput += "☆<span style='color: green;'>"+selectedJiggies[jiggyIndex].name+ "</span>☆, ";
        }
        else {
            if (count > 1) {finalOutput += "and "};
            finalOutput += "☆<span style='color: green;'>"+selectedJiggies[jiggyIndex].name+ `</span>☆!`
        }
        finalSuffix += `\neval addItem("${selectedJiggies[jiggyIndex].index}", true);`
    }
    console.debug(selectedJiggies);
    finalOutput += "\nplayer sparkle Ooh!<br>The label says 'Funded by subscribers'... Neat!"
    if (count > 1) {finalSuffix += `\nspecial `+selectedJiggies.length+` New Jiggies obtained! You can assemble them back at home.`;}
    else {finalSuffix += `\nspecial New Jiggy obtained! You can assemble it back at home.`;};
    writeHTML(finalOutput);
    writeHTML(finalSuffix);
}

function createShrinkingDotPattern() {
    const size = 1024;
    const spacing = 32; // distance between dot centers
    const maxRadius = spacing * 0.45;

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");

    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);

    const cols = Math.floor(size / spacing);
    const rows = Math.floor(size / spacing);

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * spacing + spacing / 2;
            const y = row * spacing + spacing / 2;

            // Normalize distance from bottom-left → top-right
            const nx = col / (cols - 1);
            const ny = 1 - (row / (rows - 1)); // invert Y so bottom is larger
            const t = (nx + ny) / 1.5; // blend both directions

            const radius = maxRadius * (1 - t);

            const circle = document.createElementNS(svgNS, "circle");
            circle.setAttribute("cx", x);
            circle.setAttribute("cy", y);
            circle.setAttribute("r", Math.max(radius, 0));
            circle.setAttribute("fill", "black");

            svg.appendChild(circle);
        }
    }

    const output = document.getElementById("output");
    output.appendChild(svg);
}

function downloadSVGAsPNG(svgElement, filename = "dot-pattern.png") {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);

    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 1024;

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height); // keep transparent
        ctx.drawImage(img, 0, 0);

        URL.revokeObjectURL(url);

        canvas.toBlob(function (pngBlob) {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(pngBlob);
            link.download = filename;
            link.click();
        }, "image/png");
    };

    img.src = url;
}

function wiggleTreasureArray() {
    for (var treasureIndex = 0; treasureIndex < digTreasureArray.length; treasureIndex++) {
        //Reset rarity back to original values (without altering originalRarity)
        digTreasureArray[treasureIndex].rarity = digTreasureArray[treasureIndex].originalRarity;
        //Wiggle by up to +2 to -2
        var wiggle = Math.floor(Math.random() * 5) - 2;
        digTreasureArray[treasureIndex].rarity = digTreasureArray[treasureIndex].rarity + wiggle;
        if (digTreasureArray[treasureIndex].rarity > 9) {
            digTreasureArray[treasureIndex].rarity = 9;
        }
        if (digTreasureArray[treasureIndex].rarity < 1) {
            digTreasureArray[treasureIndex].rarity = 1;
        }
    }
}

// choose a treasure of a given size: lowest rarity allowed, honor unique
function pickTreasure(size) {
    // filter by size
    let candidates = digTreasureArray.filter(t => t.size === size);

    // legal + unique gating
    candidates = candidates.filter(t => {
        // block duplicates if unique
        if (t.unique && placedUniqueTreasures.has(t.index)) {
            return false;
        }

        // check requirements if function exists
        if (typeof checkRequirements === "function") {
            return checkRequirements(t.requirements);
        }

        return true; // no requirements system, allow it
    });

    if (candidates.length === 0) return null;

    // lowest rarity bucket
    const lowest = Math.min(...candidates.map(t => t.rarity));
    const pool = candidates.filter(t => t.rarity === lowest);

    // random choice
    const choice = pool[Math.floor(Math.random() * pool.length)];
    if (choice.unique) placedUniqueTreasures.add(choice.index);
    console.info("picked:", choice);
    return choice;
}

// Select & place treasure using counts pattern + pickTreasure()
function digTreasurePattern() {
    const patterns = [
        "2,2,6","2,3,2",
        "1,3,6","1,3,6","1,3,6","1,3,6",
        "1,4,5","1,4,5",
        "0,5,6","0,4,8","0,3,10",
    ];

    const [hugeCount, bigCount, smallCount] =
        patterns[Math.floor(Math.random() * patterns.length)]
        .split(",").map(n => parseInt(n));

    const plan = [
        { count: hugeCount, size: 5 },
        { count: bigCount,  size: 3 },
        { count: smallCount,size: 2 },
    ].sort((a,b) => b.size - a.size); // largest first
    console.info("plan:", plan);

    wiggleTreasureArray();
    for (const {size, count} of plan) {
        for (let i = 0; i < count; i++) {
            const def = pickTreasure(size);
            if (!def) { console.warn("No legal treasure for size", size); continue; }

            let attempts = 100, placed = false;
            while (attempts-- > 0 && !placed) {
                const x = Math.floor(Math.random() * digWidth);
                const y = Math.floor(Math.random() * digHeight);
                if (canPlaceTreasure(x, y, size)) {
                    placeTreasure(x, y, def);
                    placed = true;
                }
            }
            if (!placed) console.warn("Failed to place treasure:", def.index);
        }
    }
    console.info("digTreasures:", digTreasures);
}

function canPlaceTreasure(x, y, size) {
    if (x + size > digWidth || y + size > digHeight) return false;
    for (let dx = 0; dx < size; dx++) {
        for (let dy = 0; dy < size; dy++) {
            const t = getTile(x + dx, y + dy);
            if (!t || t.treasure) return false; // occupied if non-empty
        }
    }
    return true;
}

function placeTreasure(x, y, def) {
    //console.info("Placing:", def);
    const id = `tre_${digTreasures.length}`;
    const tre = {
        id,
        index: def.index,         // e.g. "artifact-hole"
        image: cleanupImage(def.image),         // e.g. "items/treasure" or "items/random"
        size: def.size,
        unique: !!def.unique,
        x, y,
    };
    digTreasures.push(tre);

    // mark tiles as occupied by this treasure
    for (let dx = 0; dx < def.size; dx++) {
        for (let dy = 0; dy < def.size; dy++) {
            const tile = getTile(x + dx, y + dy);
            if (tile) tile.treasure = id; // any non-empty truthy marker works
        }
    }
}

//Helper functions for treasure placement
function getTile(x, y) {
    return digTiles.find(t => t.x === x && t.y === y);
}

//Tile digging
function clickTile(x, y) {
    if (digHealth <= 0) return; // no action if out of digHealth

    // Helper to safely apply damage to a tile
    if (digWeapon == "pick") {
        // Center tile
        digTile(x, y, 2);
        // Cardinally adjacent
        digTile(x + 1, y, 1);
        digTile(x - 1, y, 1);
        digTile(x, y + 1, 1);
        digTile(x, y - 1, 1);

        digHealth -= 1;
    } else {
        // 3x3 grid
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                let dmg = 0;
                if (dx === 0 && dy === 0) dmg = 2; // center
                else if (dx === 0 || dy === 0) dmg = 2; // cardinal
                else dmg = 1; // corners
                digTile(x + dx, y + dy, dmg);
            }
        }
        digHealth -= 2;
    }

    // Refresh visuals
    drawOverlayCanvas();
    document.getElementById('digHealth').innerHTML = digHealth;

    //Check for any mystery chests due to open
    for (const treasure of digTreasures) {
        if (treasure.index.includes("mystery-") && isTreasureUncovered(treasure)) {
            disableDigInput();
            if (digHealth < 1) {
                digHealth = 1;
            }
            document.getElementById('output').innerHTML = "";
            var reward = digTreasureArray.find(r => r.index === treasure.index);
            if (reward) {
                writeHTML(reward.content);
            }
            digTreasures = digTreasures.filter(t => t.index !== treasure.index);
        }
    }

    // Check for end of dig
    if (digHealth <= 0) {
        digFinish();
    }
    if (digWeapon == "pick") {
        soundEffectStart("button");
    }
    else {
        soundEffectStart("hammer");
    }
}

function digTile(digX, digY, damage) {
    if (damage === undefined) damage = 1;
    let tile = getTile(digX, digY);
    if (!tile) return;
    tile.hp -= damage;
    if (tile.hp < 0) tile.hp = 0;
    console.log("Tile ("+digX+", "+digY+") HP: "+tile.hp);
}

function isTreasureUncovered(treasure) {
    const { x, y, size } = treasure;
    for (let dx = 0; dx < size; dx++) {
        for (let dy = 0; dy < size; dy++) {
            let tile = getTile(x + dx, y + dy);
            if (tile.hp > 0) return false; // still covered
        }
    }
    return true;
}


function digFinish() {
    grottoStarted = false
    grottoPosition = "";
    grottoInitialLocation = "";
    maxDigHealth = 0;
    const foundTreasures = [];
    for (const tre of digTreasures) {
        if (isTreasureUncovered(tre)) {
            foundTreasures.push(tre.index);
        }
    }
    //Sort treasure by size (smallest to largest)
    foundTreasures.sort((a, b) => {
        if (a.size > b.size) return -1;
        if (a.size < b.size) return 1;
        return 0;
    })
    disableDigInput();
    document.getElementById('output').innerHTML = "";
    if (foundTreasures.length === 0) {
        writeHTML(`
            t You found nothing of value, you're all dirty for nothing.
        `);
        if (checkItem("hammer") != true) {
            writeHTML(`
                player tired Maybe someone in town knows more about this kinda stuff...<br>I should probably get some kind of tool to make things easier.
            `);
        }
    }
    else {
        writeHTML(`
            t Exhausted after a hard day's work, you check what you managed to find...
        `);
    }

    for (foundTreasure of foundTreasures) {
        const reward = digTreasureArray.find(r => r.index === foundTreasure);
        if (reward) {
            if (reward.index.includes("mystery-") !== true) {
                writeHTML(`t ...`);
                writeHTML(reward.content);
            }
        }
    }
    if (data.player.holiday != "watch") {
        passTime();
    }
    else {
        writeHTML(`t With time still stopped, the sun hasn't moved a bit since you started digging.`)
    }
    writeHTML(`
        finish
    `);
}

var diggingJunkArray = [
    {index: "ruins-dildo-stone", size: "small", content: `
        t Small treasure: Stone dildo
        player tired A really old stone dildo, it even has moss growing on it. I don't think it's worth anything.
    `, desc: "A stone dildo from an older time. Mossy, and not worth anything."},
    {index: "ruins-dildo-stone", size: "small", content: `
        t Small treasure: Stone dildo
        player tired A really old stone dildo, it even has moss growing on it. I don't think it's worth anything.
    `},
    {index: "ruins-dildo-stone", size: "small", content: `
        t Small treasure: Stone dildo
        player tired A really old stone dildo, it even has moss growing on it. I don't think it's worth anything.
    `},
    {index: "ruins-dildo-bronze", size: "small", content: `
        t Small treasure: Bronze dildo
        player tired A dildo with a knotted shape, though it's really old and worn. Guess it's worth at least one muns. Mun? Munny?
        
    `, desc: "A bronze dildo from an older time. Modelled in a canine shape."},
    {index: "ruins-dildo-bronze", size: "small", content: `
        t Small treasure: Bronze dildo
        player tired A dildo with a knotted shape, though it's really old and worn. Guess it's worth at least one muns. Mun? Munny?
        
    `},
    {index: "ruins-dildo-glass", size: "small", content: `
        t Small treasure: Glass dildo
        player befuddled A glass penis. Hopefully it's not the fragile kind.
        
    `, desc: "A glass dildo from an older time. Blown at least once."},
    {index: "ruins-dildo-silver", size: "small", content: `
        t Small treasure: Silver dildo
        player tired A super tiny novelty dildo, made of sterling silver. I could see shopF buying this.
        
    `, desc: "A silver dildo from an older time. Has an equine shape."},
    {index: "ruins-dildo-gold", size: "small", content: `
        t Small treasure: Gold dildo
        player tired A dildo made of gold. Heavy!
        
    `, desc: "A gold dildo from an older time. Has a medial ring."},
    {index: "ruins-chalice-bronze-male", size: "big", content: `
        t Small treasure: Bronze Chalice
        player tired An old drinking cup. I wouldn't put this anywhere near these lips.
        
    `, desc: "An old drinking cup made of bronze. Clearly not shaped for easy drinking."},
    {index: "ruins-chalice-bronze-male", size: "big", content: `
        t Small treasure: Bronze Chalice
        player tired An old drinking cup. I wouldn't put this anywhere near these lips.
        
    `},
    {index: "ruins-chalice-bronze-female", size: "big", content: `
        t Small treasure: Bronze Chalice
        player tired An old drinking cup. I wouldn't put this anywhere near these lips.
        
    `, desc: "An old drinking cup made of bronze. Clearly not shaped for easy drinking."},
    {index: "ruins-chalice-bronze-female", size: "big", content: `
        t Small treasure: Bronze Chalice
        player tired An old drinking cup. I wouldn't put this anywhere near these lips.
        
    `},
    {index: "ruins-chalice-silver-male", size: "big", content: `
        t Small treasure: Silver Chalice
        player tired An old drinking cup. I wouldn't put this anywhere near these lips.
        
    `, desc: "An old drinking cup made of silver. Don't drink from silver cups!"},
    {index: "ruins-chalice-silver-female", size: "big", content: `
        t Small treasure: Silver Chalice
        player tired A silver chalice. I wish it was as soft as it looked.
        
    `, desc: "An old drinking cup made of silver. Don't drink from silver cups!"},
    {index: "ruins-chalice-gold-male", size: "big", content: `
        t Small treasure: Gold Chalice
        player happy A golden chalice? No, just a gold-plated one. I wonder what cup-size it is.
        
    `, desc: "An old drinking cup plated with gold. F-cup."},
    {index: "ruins-chalice-gold-female", size: "big", content: `
        t Small treasure: Gold Chalice
        player happy A golden chalice? No, just a gold-plated one. I wonder what cup-size it is.
        
    `, desc: "An old drinking cup plated with gold. F-Cup"},
    {index: "ruins-shield-bronze-male", size: "big", content: `
        t Small treasure: Bronze Shield
        player tired A really old, worn shield. It brings to mind shields where someone was strapped to the front.
        
    `, desc: "A really old, worn shield made from bronze. Designed to look like someone was strapped to the front."},
    {index: "ruins-shield-bronze-male", size: "big", content: `
        t Small treasure: Bronze Shield
        player tired A really old, worn shield. It brings to mind shields where someone was strapped to the front.
        
    `},
    {index: "ruins-shield-bronze-female", size: "big", content: `
        t Small treasure: Bronze Shield
        player tired A really old, worn shield. It brings to mind shields where someone was strapped to the front.
        
    `},
    {index: "ruins-shield-bronze-female", size: "big", content: `
        t Small treasure: Bronze Shield
        player tired A really old, worn shield. It brings to mind shields where someone was strapped to the front.
        
    `, desc: "A really old, worn shield made from bronze. Designed to look like someone was strapped to the front."},
    {index: "ruins-shield-silver-male", size: "big", content: `
        t Small treasure: Silver Shield
        player confused A steel shield with silver plating. It almost seems like somebody's stuck in it.
        
    `, desc: "A steel shield with silver plating. It's a puckered buckler!"},
    {index: "ruins-shield-silver-female", size: "big", content: `
        t Small treasure: Silver Shield
        player confused A steel shield with silver plating. It almost seems like somebody's stuck in it.
        
    `, desc: "A steel shield with silver plating. It's a puckered buckler!"},
    {index: "ruins-shield-gold-male", size: "big", content: `
        t Small treasure: Gold Shield
        player happy A golden shield. The detail is immaculate, there are so many tiny imperfections!
        
    `, desc: "A golden shield. Somebody sure liked dicks."},
    {index: "ruins-shield-gold-female", size: "big", content: `
        t Small treasure: Gold Shield
        player happy A golden shield. The detail is immaculate, there are so many tiny imperfections!
        
    `, desc: "A golden shield. Somebody sure liked vaginas."},
    {index: "ruins-trophy-bronze-male", size: "huge", content: `
        t Small treasure: Bronze Trophy
        player happy A bronze trophy. It has some weight to it, and a really cheeky design!
        
    `, desc: "A bronze trophy. It has some weight to it, and a really cheeky design!"},
    {index: "ruins-trophy-bronze-female", size: "huge", content: `
        t Small treasure: Bronze Trophy
        player happy A bronze trophy. It has some weight to it, and a really cheeky design!
        
    `, desc: "A bronze trophy. It has some weight to it, and a really cheeky design!"},
    {index: "ruins-trophy-silver-male", size: "huge", content: `
        t Small treasure: Silver Trophy
        player tired A silver trophy. After all that work, I get second place.
        
    `, desc: "A silver trophy. Quite the sterling shaft."},
    {index: "ruins-trophy-silver-female", size: "huge", content: `
        t Small treasure: Silver Trophy
        player tired A silver trophy. After all that work, I get second place.
        
    `, desc: "A silver trophy. Go ahead, take second place."},
    {index: "ruins-trophy-gold-male", size: "huge", content: `
        t Small treasure: Gold Trophy
        player sleep A golden trophy! Finally, I get to feel like number one!
        
    `, desc: "A golden trophy, proof you're number one."},
    {index: "ruins-trophy-gold-female", size: "huge", content: `
        t Small treasure: Gold Trophy
        player sleep A golden trophy! Finally, I get to feel like number one!
        
    `, desc: "A golden trophy, proof you're number one."},
    {index: "wilderness-fruit-red-male", size: "small", content: `
        t Small treasure: Napple
        player happy A shiny red fruit!<br>Are those... Nipples?
        
    `, desc: "A shiny red fruit, the little nubs resemble nipples.<br>Can be eaten for a little stamina."},
    {index: "wilderness-fruit-red-female", size: "small", content: `
        t Small treasure: Cleftberry
        player happy A shiny red fruit!<br>Ooh, it's pretty juicy!
        
    `, desc: "A shiny red fruit, it's quite juicy.", tags: "weird",},
    {index: "wilderness-fruit-red-null", size: "small", content: `
        t Small treasure: Rosepuff
        player happy A shiny red fruit!<br>There's a puffy hole on one side, but it doesn't seem to be because of a worm.
        
    `, desc: "A shiny red fruit, there's a puffy hole on one side.<br>Can be eaten for a little stamina.", tags: "weird",},
    {index: "wilderness-fruit-green-male", size: "big", content: `
        t Small treasure: Pearnuts
        player happy A tough green fruit.<br>Oh, I get it. It's a <i>pear</i> of nuts.
        
    `, desc: "A tough green fruit, it's a pear of nuts.<br>Can be eaten for some stamina.", tags: "weird",},
    {index: "wilderness-fruit-green-female", size: "big", content: `
        t Small treasure: Peasucker
        player happy A tough green fruit.<br>Very tender to the touch.
        
    `, desc: "A tough green fruit, it's tender to the touch.<br>Can be eaten for some stamina.", tags: "weird",},
    {index: "wilderness-fruit-green-null", size: "big", content: `
        t Small treasure: Celu Fruit
        player happy A tough green fruit.<br>Probably tastes like ass, but in a good way!
        
    `, desc: "A tough green fruit, probably tastes like ass, but in a good way!<br>Can be eaten for some stamina."},
    {index: "wilderness-fruit-blue-male", size: "big", content: `
        t Small treasure: Starschmeat Plant
        player befuddled Huh? But this isn't a fruit...
        player amused Oh, it must just <i>look</i> like an eggplant. I bet the taste will be out of this world!
        
    `, desc: "A strange looking fruit, the taste is out of this world.<br>Can be eaten for a bunch of stamina."},
    {index: "wilderness-fruit-blue-female", size: "big", content: `
        t Small treasure: Boobberry Bushel
        player happy Booberry, my favorite!
        
    `, desc: "A strange looking handful of berries.<br>Can be eaten for a bunch of stamina."},
    {index: "wilderness-fruit-blue-null", size: "big", content: `
        t Small treasure: Buttkin
        player surprised It's the size of a whole pumpkin, but in the shape of a peach! I wonder which one it tastes like...?
        
    `, desc: "A strange looking fruit, it resembles a peach, has the size of a pumpkin, and is blue.<br>Can be eaten for a bunch of stamina."},
    {index: "wilderness-misc-pot-male", size: "small", content: `
        t Small treasure: Stone Plant-Pot
        player tired A potted plant? No idea what's sprouting, but maybe I can get something for the pot.
        
    `, desc: "A small testicle-shaped pot with a plant in it."},
    {index: "wilderness-misc-pot-female", size: "small", content: `
        t Small treasure: Stone Plant-Pot
        player tired A potted plant? No idea what's sprouting, but maybe I can get something for the pot.
        
    `, desc: "A small boobie-shaped pot with a plant in it."},
    {index: "wilderness-misc-shell-male", size: "small", content: `
        t Small treasure: Giant Mollusk
        player tired Looks like some kind of sea creature? I have no idea how to tell if it's even alive. I can't sell this guy...
    `, desc: "A big shell with a big hole in it.", tags: "weird",},
    {index: "wilderness-misc-shell-female", size: "small", content: `
        t Small treasure: Giant Mollusk
        player tired Even the snails here have huge boobs. Even if I had somewhere to sell this, that shell looks heavy...
    `, desc: "A big shell with a boobie-shaped creature vibing inside.", tags: "weird",},
    {index: "wilderness-sculpture-stone-male", size: "big", content: `
        t Medium treasure: Stone Sculpture
        player surprised I've heard of sculpted abs, but this is on a whole other level!<br>I wonder if shopF will buy this?
        
    `, desc: "An extremely lifelike carving of a penis."},
    {index: "wilderness-sculpture-stone-female", size: "big", content: `
        t Medium treasure: Stone Sculpture
        player amused Looks like some stonecarver wanted to try making some glass-cutters.<br>I wonder if shopF will buy this?
        
    `, desc: "An extremely lifelike carving of a pair of breasts."},
    {index: "wilderness-sculpture-stone-null", size: "big", content: `
        t Medium treasure: Stone Sculpture
        player befuddled What sort of person decides one day to pick up a rock and sculpt a butthole into it?<br>I wonder if shopF will buy this?
        
    `, desc: "An extremely lifelike carving of a butthole."},
    {index: "wilderness-statue-stone-male", size: "big", content: `
        t Medium treasure: Stone Statue
        player happy Now here's a guy who knows the meaning of rock hard!<br>If I drop it on the way to the shop, I'll just tell shopF I found it like this.
        
    `, desc: "A cracked stone statue of a boy flaunting himself."},
    {index: "wilderness-statue-stone-female", size: "big", content: `
        t Medium treasure: Stone Statue
        player happy Despite some damage, I can tell this statue was super lifelike.<br>If I drop it on the way to the shop, I'll just tell shopF I found it like this.
        
    `, desc: "A cracked stone statue of a girl flaunting herself."},
    {index: "wilderness-statue-marble-male", size: "big", content: `
        t Medium treasure: Marble Statue
        player happy I can really feel the sculptor's passion coming through. I know it's made of rock, but that butthole looks as soft as a pillow!
        
    `, desc: "A beutiful marble statue of a boy's rear end."},
    {index: "wilderness-statue-marble-female", size: "big", content: `
        t Medium treasure: Marble Statue
        player happy I can really feel the sculptor's passion coming through. I know it's made of rock, but that butthole looks as soft as a pillow!
        
    `, desc: "A beutiful marble statue of a girl's rear end."},
    {index: "wilderness-statue-glass-male", size: "huge", content: `
        t Huge treasure: Glass Statue
        player happy Now here's a guy who knows the meaning of glasscutters!<br>If I drop it on the way to the shop, I'll just tell shopF I found it like this.
        
    `, desc: "A headless, armless glass statue of a boy."},
    {index: "wilderness-statue-glass-female", size: "huge", content: `
        t Huge treasure: Glass Statue
        player happy Despite some damage, I can tell this statue was super lifelike.<br>If I drop it on the way to the shop, I'll just tell shopF I found it like this.
        
    `, desc: "A headless, armless glass statue of a girl."},
    {index: "wilderness-statue-gold-male", size: "huge", content: `
        t Huge treasure: Gold Statue
        player sparkle Solid gold?!
        player tired Aw man, no, this is fool's gold. Well, maybe I can sell it for something.
        
    `, desc: "A pyrite statue of a boy flaunting himself."},
    {index: "wilderness-statue-gold-female", size: "huge", content: `
        t Huge treasure: Gold Statue
        player sparkle Solid gold?!
        player tired Aw man, no, this is fool's gold. Well, maybe I can sell it for something.
        
    `, desc: "A pyrite statue of a girl flaunting herself."},
];

function diggingFail(size) {
    grottoStarted = false
    grottoPosition = "";
    var moneyStart = data.player.money.toString() ;
    moneyStart = parseInt(data.player.money);
    if (data.player.bonus == undefined) data.player.bonus = 0;
    //Get a random junk item of the specified size
    var legalJunk = diggingJunkArray.filter(j => j.size === size);
    //Remove any wilderness junk if player location isn't forestWilderness
    if (data.player.location != "forestWilderness") {
        for (junkIndex = 0; junkIndex < legalJunk.length; junkIndex++) {
            if (legalJunk[junkIndex].index.includes("wilderness")) {
                legalJunk.splice(junkIndex, 1);
                junkIndex--;
            }
        }
    }
    if (data.player.location != "lakesideRuins") {
        for (junkIndex = 0; junkIndex < legalJunk.length; junkIndex++) {
            if (legalJunk[junkIndex].index.includes("ruins")) {
                legalJunk.splice(junkIndex, 1);
                junkIndex--;
            }
        }
    }
    console.info("legalJunk:", legalJunk);
    //Remove any "male" in vegetarian mode, and any "female" in carnivore mode
    for (junkIndex = 0; junkIndex < legalJunk.length; junkIndex++) {
        if (legalJunk[junkIndex].index.includes("male") && data.player.vegetarian == true) {
            legalJunk.splice(junkIndex, 1);
            junkIndex--;
        }
        if (junkIndex < 0) {
            junkIndex = 0;
        }
        if (legalJunk[junkIndex].index.includes("female") && data.player.carnivore == true) {
            legalJunk.splice(junkIndex, 1);
            junkIndex--;
        }
    }
    var junk = legalJunk[Math.floor(Math.random() * legalJunk.length)];
    console.info("junk:", junk);

    if (junk) {
        writeHTML(`im treasure/`+junk.index);
        writeHTML(junk.content);
    }
    if (data.player.money > moneyStart) {
        //writeHTML(`special Gained `+finalMoney+` muns!`);
    }
    if (data.player.bonus > 0) {
        //writeHTML(`special You gained `+data.player.bonus+` bonus health for your next dig!`);
    }
    addItem(junk.index.replace("ruins-", "").replace("wilderness-", ""));
    writeHTML(`
       eval updateMenu(); 
    `);
}



//Chess code layout
//Establish variables
var chessCatalog = [
	//Pawns
	{index: "pawnBasic", category: "pawn", name: "Basic Pawn", image: "chess/INDEX", 
	cost: 0, atk: 1, hp: 2, tags: ['haste']},
	{index: "pawnSpecial", category: "pawn", name: "Special Pawn", image: "chess/INDEX", 
	cost: 0, atk: 2, hp: 2, tags: []},
	
	{index: "rookBasic", category: "rook", name: "Basic Rook", image: "chess/INDEX", 
	cost: 1, atk: 1, hp: 4, tags: []},
	{index: "rookSpecial", category: "rook", name: "Special Rook", image: "chess/INDEX", 
	cost: 2, atk: 2, hp: 4, tags: []},
	
	{index: "knightBasic", category: "knight", name: "Basic Knight", image: "chess/INDEX", 
	cost: 2, atk: 3, hp: 2, tags: ['haste','no-king-target']},
	{index: "knightSpecial", category: "knight", name: "Special Knight", image: "chess/INDEX", 
 	cost: 2, atk: 3, hp: 2, tags: ['knight-move','bishop-capture']},
	
	{index: "bishopBasic", category: "bishop", name: "Basic Bishop", image: "chess/INDEX", 
	cost: 1, atk: 3, hp: 1, tags: []},
	{index: "bishopSpecial", category: "bishop", name: "Special Bishop", image: "chess/INDEX", 
 	cost: 1, atk: 1, hp: 3, tags: ["king-heal-start"]},
	
	{index: "queenBasic", category: "queen", name: "Basic Queen", image: "chess/INDEX", 
	cost: 3, atk: 4, hp: 4, tags: []},
	{index: "queenSpecial", category: "queen", name: "Special Queen", image: "chess/INDEX", 
	cost: 3, atk: 3, hp: 3, tags: ["free-move"]},
	
	{index: "kingBasic", category: "king", name: "Basic King", image: "chess/INDEX", 
	cost: 0, atk: 1, hp: 10, tags: []},
	{index: "kingSpecial", category: "king", name: "Special King", image: "chess/INDEX", 
	cost: 0, atk: 0, hp: 10, tags: ['steal-to-hand']},
]
var chessCounts = {
    pawn: 8,
    knight: 2,
    rook: 2,
    bishop: 2,
    queen: 1,
    king: 1
}
var testOpponentList = ["pawnBasic", "knightBasic", "bishopBasic", "queenBasic", "kingBasic"]

//Deck builder screen
function chessBuilderScene() {
	//Reset variables
	//Print header
	//Print info box
	//Print stats box
	//Print chosen pieces list
	//Print card catalog
	//Print continue button
	//Print reset button
}

function chessBuilderInfoUpdate() {

}

function chessBuilderList(category) {

}

function chessBuilderSelect(card) {

}

function chessBuilderReset() {

}

function chessHover(card) {

}

function chessAssemble(card) {
	//Get card details
	//Assemble object (image in frame, with name and stats)
}

//Game scene
function chessGameScene() {
	
}

//Board variables
function chessGameUpdate() {
	//Update each zone with image and health
	//Update any cards in player's hand
	//Highlight a selected card/space
}

function chessGameDraw(player) {

}

//Selecting a card in your own hand
	//Logic for if card is a legal selection
	
//Selecting a space on the board
	//Selecting an empty space
	//Selecting a friendly piece
	//Selecting an enemy piece
	//Selecting a friendly king
	//Selecting an enemy king

//Playing a card from hand

//Creating a piece

//Clash

//Moving a piece

//Destroying a piece

//Game end

//GROTTO
var grottoStarted = false
var grottoPosition = "";
var grottoInitialLocation = "";
function grottoStart() {
    if (checkRequirements("!nude;") == true) {
        addFlag("player", "originallyHadClothing");
    }
    grottoStarted = true;
    if (data.player.location == "lakesideRuins") {
        var legalLocations = ["ruinsEmpty1", "ruinsEmpty2", "ruinsEmpty3"];
    }
    if (data.player.location == "forestWilderness") {
        var legalLocations = ["forestEmpty1", "forestEmpty2", "forestEmpty3"];
    }
    grottoInitialLocation = legalLocations[Math.floor(Math.random() * legalLocations.length)]
    if (checkFlag("player", "grottoStart")) {
        grottoMove(grottoInitialLocation);
    }
    else {
        data.player.location = grottoInitialLocation;
        grottoPosition = data.player.location;
        writeHTML(`
            player befuddled Eh?
            player sparkle A cave!<br>An unexplored treasury of mystery and adventure!
            t Fully digging up a cave entrance will take you inside a grotto. Your starting location is semi-random and is based on where you started digging, don't feel the need to explore the whole thing at once!
            special Important note: You can't load a save while exploring a grotto, so refreshing or loading will drop you off at whatever location you started digging.
            eval addFlag("player", "grottoStart");
            finish
        `);
    }
}

const grottoLocations = [
    {index: "ruinsEmpty1", name: "Ruins - Dungeon", events: []},
    {index: "ruinsEmpty2", name: "Ruins - The Orb", events: []},
    {index: "ruinsEmpty3", name: "Ruins - Crossroad", events: [
		{index: "deityArtifact", requirements: "?flag deity prelude1; !flag deity artifact;"},
	]},
    {index: "ruinsGather1", name: "Ruins - Library", events: []},
    {index: "ruinsGather2", name: "Ruins - Treasure Room", events: []},
    {index: "ruinsGather3", name: "Ruins - Glowing Altar", events: []},
    {index: "ruinsPool", name: "Ruins - Pool", events: [
		{index: "ruinsPoolIntro", requirements: "!flag player ruinsPool;"},
		{index: "ruinsPoolRepeat", requirements: "?flag player ruinsPool; !flag player poolReady;"},
	]},
    {index: "ruinsTrap", name: "Ruins - Silks Room", events: [
		{index: "ruinsTrap", requirements: ""},
	]},
    {index: "ruinsHole", name: "Ruins - Hole", events: [
		{index: "ruinsHoleIntro", requirements: "!flag player ruinsHole;"},
		{index: "ruinsHoleRepeat", requirements: "?flag player ruinsHole; !flag player holeReady;"},
	]},
    {index: "ruinsMimic", name: "Ruins - Altar", events: [
		{index: "ruinsMimic", requirements: ""},
	]},
    {index: "ruinsSlime", name: "Ruins - Gooey Room", events: [
		{index: "ruinsSlimeBlueMeat", requirements: "!vegetarian; !flag player ruinsSlimeBlueMeatFinished;"},
		{index: "ruinsSlimeBlueMeat", requirements: "!vegetarian; ?flag player ruinsSlimeBlueMeatFinished; ?flag player ruinsSlimeBlueVeggieFinished; ?flag player ruinsSlimeWhiteFinished;"},
		{index: "ruinsSlimeBlueVeggie", requirements: "!carnivore; !flag player ruinsSlimeBlueVeggieFinished;"},
		{index: "ruinsSlimeBlueVeggie", requirements: "!carnivore; ?flag player ruinsSlimeBlueVeggieFinished; ?flag player ruinsSlimeBlueMeatFinished; ?flag player ruinsSlimeWhiteFinished;"},
		{index: "ruinsSlimeWhite", requirements: "?weird; ?flag player ruinsSlimeBlueMeatFinished; ?nutmeg;"},
		{index: "ruinsSlimeWhite", requirements: "?weird; ?flag player ruinsSlimeBlueVeggieFinished; ?nutmeg;"},
	]},

    {index: "forestEmpty1", name: "Forest - Weeds", events: []},
    {index: "forestEmpty2", name: "Forest - Gazebo", events: []},
    {index: "forestEmpty3", name: "Forest - Tower", events: []},
    {index: "forestGather1", name: "Forest - Pond", events: []},
    {index: "forestGather2", name: "Forest - Fruit Tree", events: []},
    {index: "forestGather3", name: "Forest - Glowstone", events: []},
    {index: "forestJuice", name: "Forest - Picnic Basket", events: [
		{index: "forestJuiceIntro", requirements: "!flag player forestJuice;"},
		{index: "forestJuiceRepeat", requirements: "?flag player forestJuice; !flag player juiceReady;"},
	]},
    {index: "forestSleep", name: "Forest - Blue Garden", events: [
		{index: "forestSleep", requirements: "?nutmeg;"},
		{index: "forestSleep", requirements: "?nutmeg;"},
		{index: "none", requirements: "!nutmeg;"},
		{index: "none", requirements: "!nutmeg;"},
		{index: "forestChuckster", requirements: "?flag player chuckster; !carnivore;"},
		/*{index: "forestSleepGoblinFirst", requirements: "!flag player forestSleepGoblin; !carnivore;"},
		{index: "forestSleepGoblinRepeat", requirements: "?flag player forestSleepFairy; !carnivore; ?flag player forestSleepGoblin;"},*/
	]},
    {index: "forestFlowers", name: "Forest - Plucky Garden", events: [
		{index: "forestFlowersIntro", requirements: "!flag player forestFlowers;"},
		{index: "forestFlowersRepeat", requirements: "?flag player forestFlowers; !flag player flowersReady;"},
	]},
    {index: "forestSpores", name: "Forest - Shroom Area", events: [
		{index: "forestSpores", requirements: ""},
		{index: "forestSpores", requirements: ""},
		{index: "forestChuckster", requirements: "?flag player chuckster; !carnivore;"},
	]},
    {index: "forestTentacles", name: "Forest - Wiggly Garden", events: [
		{index: "forestTentacles", requirements: ""},
		{index: "forestTentacles", requirements: ""},
		{index: "forestChuckster", requirements: "?flag player chuckster; !carnivore;"},
	]},
    {index: "forestTrap", name: "Forest - Tentacle Pit", events: [
		{index: "forestTrapFoxF", requirements: "!flag foxf trap; ?girls;"},
		{index: "forestTrapFoxFRepeat", requirements: "?flag foxf trap; ?flag foxm trap; ?girls;"},
		{index: "forestTrapFoxM", requirements: "!flag foxm trap; ?boys;"},
		{index: "forestTrapFoxMRepeat", requirements: "?flag foxf trap; ?flag foxm trap; ?boys;"},
	]},

    {index: "centralSphinx", name: "Sphinx's Tunnel", events: [
		{index: "centralSphinxFirst", requirements: "!flag player centralSphinx;"},
		{index: "centralSphinxRepeat", requirements: "?flag player centralSphinx;"},
	]},
    {index: "centralStatue", name: "Statue Area", events: [
		{index: "centralStatueIntro", requirements: "!flag player centralStatue;"},
	]},
]

function buildGrotto() {
    for (var locationIndex = 0; locationIndex < grottoLocations.length; locationIndex++) {
        var newLocation = grottoLocations[locationIndex]
        newLocation.image = "locations/grotto/" + newLocation.index
        locationArray.push(newLocation);
    }
}

buildGrotto();

const grottoConnections = {
    // Ruins Sector
    "ruinsEmpty1": ["ruinsGather1", "ruinsSlime"],
    "ruinsEmpty2": ["ruinsGather1", "ruinsPool", "ruinsTrap"],
    "ruinsEmpty3": ["forestFlowers", "centralSphinx", "ruinsGather2"],
    "ruinsGather1": ["ruinsEmpty1", "ruinsEmpty2", "ruinsSlime", "ruinsTrap"],
    "ruinsGather2": ["ruinsPool", "ruinsTrap", "ruinsMimic", "ruinsEmpty3"],
    "ruinsGather3": ["ruinsSlime", "ruinsHole", "ruinsMimic"],
    "ruinsPool": ["ruinsEmpty2", "ruinsGather2", "ruinsTrap"],
    "ruinsTrap": ["ruinsGather1", "ruinsEmpty2", "ruinsPool", "ruinsGather2"],
    "ruinsHole": ["ruinsSlime", "ruinsGather3", "ruinsMimic"],
    "ruinsMimic": ["ruinsGather2", "ruinsGather3", "ruinsHole"],
    "ruinsSlime": ["ruinsEmpty1", "ruinsGather1", "ruinsGather3", "ruinsHole"],

    // Forest Sector
    "forestEmpty1": ["forestFlowers", "forestSleep", "forestGather1"],
    "forestEmpty2": ["forestGather1" , "forestJuice", "forestSleep"],
    "forestEmpty3": ["forestJuice", "forestSpores", "forestGather3"],
    "forestGather1": ["forestEmpty1", "forestEmpty2", "forestSpores"],
    "forestGather2": ["forestFlowers", "forestSpores", "forestTentacles"],
    "forestGather3": ["forestEmpty3", "forestSpores", "forestTentacles"],
    "forestJuice": ["forestEmpty2", "forestEmpty3", "forestSleep"],
    "forestSleep": ["forestEmpty1", "forestJuice", "forestGather1"],
    "forestFlowers": ["forestEmpty1", "forestGather2", "ruinsEmpty3"],
    "forestSpores": ["forestGather1", "forestGather2", "forestGather3", "forestSleep"],
    "forestTentacles": ["forestGather2", "forestGather3", "forestTrap"],
    "forestTrap": ["forestTentacles", /*"centralStatue"*/],

    // Central Sector
    "centralSphinx": ["ruinsEmpty3", /*"centralStatue"*/],
    //"centralStatue": ["centralSphinx", "forestTrap"]
};

function getAvailableExits(currentRoom) {
    return grottoConnections[currentRoom] || [];
};

var exploredLocations = [];
var collectedGatherSpots = [];

function grottoMove(target) {
	//Simple cleanup if target is an object instead of a string (use n.index)
	if (typeof target === "object") {
		target = target.index;
	}
    var startingHealth = digHealth;
    timeBypass = true;
    data.player.location = target;
    changeLocation(target);
    
    digHealth-= 1;
    if (digHealth < 1) {
        digHealth = 1;
    }

    // 1. Grabbing the connections
    var grottoPaths = getAvailableExits(target); 

    // 2. Create a Flexbox container to hold the buttons
    var buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'center'; // Centers the buttons
    buttonContainer.style.alignItems = 'center';
    buttonContainer.style.gap = '20px'; // Space between buttons
    buttonContainer.style.padding = '15px'; 
    buttonContainer.style.width = '100%';
    buttonContainer.style.height = '100%'; 
    buttonContainer.style.flexWrap = 'wrap';       // Allows buttons to spill onto a new row
    buttonContainer.style.alignContent = 'center'; // Packs the multiple rows tightly in the vertical center
    buttonContainer.style.zIndex = '1';
    buttonContainer.style.position = 'absolute';

    // 3. Generate the navigation buttons
    isGatherNode = false;
    if (target.includes('Gather')) {
        if (!collectedGatherSpots.includes(target)) isGatherNode = true;
    }
    var targetLocation = grottoLocations.find(location => location.index === target);
    var legalEvents = targetLocation.events;
    if (legalEvents) {
        if (legalEvents.includes(target+"Intro")) {
            if (!checkFlag("player", target+"Intro")) {
                if (!collectedGatherSpots.includes(target)) isGatherNode = true;
            }
        }
    }
    
    if (collectedGatherSpots.includes(target)) isGatherNode = false;
    let totalButtons = grottoPaths.length + (isGatherNode ? 1 : 0);
    let columns = totalButtons >= 4 ? Math.ceil(totalButtons / 2) : totalButtons;
    let buttonWidth = 85 / columns;

    if (totalButtons === 4) {
        buttonContainer.style.gap = '50px';
    } 

    // Position the button container (should always be in the middle of the screen)
    for (let i = 0; i < grottoPaths.length; i++) {
        let pathTarget = grottoPaths[i];

        // Create the rounded box
        let navBtn = document.createElement('div');
        navBtn.classList.add('grottoBtn');
        navBtn.style.border = '4px solid #FCEBB5';
        navBtn.style.borderRadius = '15px'; 
        navBtn.style.cursor = 'pointer';
        navBtn.style.overflow = 'hidden'; 
        
        // Apply the dynamic size limits
        navBtn.style.width = buttonWidth + '%'; 
        navBtn.style.maxWidth = 'var(--grotto-btn-max, 30%)';  // Caps it so a room with 1 exit doesn't get a giant button (portrait raises the cap so they aren't tiny)
        navBtn.style.aspectRatio = '1'; // Forces a perfect square
        navBtn.style.flexShrink = '0';  

        // Create the image
        let navImg = document.createElement('img');
        navImg.src = cleanupImage("locations/grotto/" + pathTarget);
        navImg.style.width = '100%';
        navImg.style.height = '100%';
        navImg.style.objectFit = 'cover'; 
        navImg.style.display = 'block';

        // Assemble and add the click event
        navBtn.appendChild(navImg);
        navBtn.onclick = function() {
            grottoMove(pathTarget);
        };

        // Add to our flex container
        buttonContainer.appendChild(navBtn);
    }
    isGatherNode = false;
    // 4. Check if we need the gather button, and apply the SAME dynamic sizing to it
    if (isGatherNode) {
        let gatherBtn = document.createElement('div');
        gatherBtn.style.cursor = 'pointer';
        
        // Use the exact same sizing logic as the navigation buttons
        gatherBtn.style.width = buttonWidth + '%';
        gatherBtn.style.maxWidth = '30%';
        gatherBtn.style.aspectRatio = '1';
        gatherBtn.style.flexShrink = '0';

        let gatherImg = document.createElement('img');
        gatherImg.src = cleanupImage("items/question");
        gatherImg.style.width = '100%';
        gatherImg.style.height = '100%';
        gatherImg.style.objectFit = 'contain';
        gatherImg.style.display = 'block';

        //Draw white border around gather image
        gatherImg.style.filter = 'drop-shadow(5px 5px 1px white)';

        gatherBtn.appendChild(gatherImg);
        gatherBtn.onclick = function() {
            writeScene('system', target + 'Gather');
        };

        buttonContainer.appendChild(gatherBtn);
    }

    var targetLocation = grottoLocations.find(location => location.index === target);
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
    writeBar("player", targetLocation.name, digHealth, maxDigHealth)
    HTMLContainer = "output";
    grottoPosition = target;
    if (grottoPosition == grottoInitialLocation) {
        writeFunction("digReturn()", "Leave the grotto and resume the dig");
    }
    else {
        writeFunction("grottoScene('grottoEscape')", "Admit you're lost");
    }

    data.player.location = data.player.originalLocation;
	saveSlot(10);

    if (!exploredLocations.includes(target)) {
        grottoEventCheck(target);
    }

    exploredLocations.push(target);

    // 5. Place the whole container into the navigation window
    if (digHealth > 1) {
        var navigationWindow = document.getElementsByClassName('backgroundBorder')[0];
        if (navigationWindow) {
         navigationWindow.insertBefore(buttonContainer, navigationWindow.firstChild);
        }
    }
    //console.debug(data.player.location);
	soundEffectStart("unused-moveALT");
}

function grottoEventCheck(target) {
    var targetLocation = grottoLocations.find(location => location.index === target);
    var originalEvents = targetLocation.events;
    var legalEvents = [];
    if (!originalEvents) {return}
    var finalScene = "";
    // 1: Remove events that don't meet requirements
    for (let eventIndex = 0; eventIndex < originalEvents.length; eventIndex++) {
        if (checkRequirements(originalEvents[eventIndex].requirements) == true) {
            legalEvents.push(originalEvents[eventIndex]);
        }
    }
    console.debug(legalEvents);
    // 2: pick remaining event at random
    if (legalEvents.length > 0) {
        finalScene = legalEvents[Math.floor(Math.random() * legalEvents.length)];
        grottoScene(finalScene);
        digHealth += 1;
    }
}

function grottoScene(index) {
    data.player.currentCharacter = "system";
    if (!index.index || index.index == undefined) {
        index = {index: index};
    }
    console.debug(index.index);
	soundEffectStart("talk");
	document.getElementById('output').innerHTML = '';
	wrapper.scrollTop = 0;
    switch (index.index) {
        case "deityArtifact": {
            writeScene("deity", "plug1");
            break;
        }
        case "ruinsOrb": {
            writeHTML(`
                player sleep Oh random orb I found on the floor, bless me with your wisdom!
                t Before your eyes, the reflection within the crystal ball begins to swirl, it's sending you a message!
            `)
            var eventContainer = globalEventArray.find(character => character.index === "player");
            var unlockedScenes = 0;
            var totalScenes = 0;
            for (eventIndex = 0; eventIndex < eventContainer.events.length; eventIndex++) {
                if (eventContainer.events[eventIndex].image.includes("misc/grotto/")) {
                    unlockedScenes++;
                    totalScenes++;
                    if (fetishes(eventContainer.events[eventIndex].tags) == true) {
                        if (galleryCheck("player", eventContainer.events[eventIndex].index) == false) {
                            unlockedScenes--;
                            writeHTML(`t ${eventContainer.events[eventIndex].name}...`);
                        }
                    }
                    else {
                        totalScenes--;
                        unlockedScenes--;
                    }
                }
            }
            writeHTML(`special You have ${unlockedScenes} out of ${totalScenes} scenes within the grotto unlocked.`);
            if (unlockedScenes == totalScenes) {
                addFlag("player", "grottoComplete");
            }
            if (checkRequirements("?weird;") == false) {
                writeHTML(`
                    t Weird stuff is disabled... 
                `)
            }
            writeHTML(`
                player happy Thank you, oh orb!
                finish 
            `)
            break;
        }
        case "ruinsPoolIntro": {
            writeHTML(`
                im locations/grotto/`+grottoPosition+`
                player joy Ooh! What pretty water!<br>No fish, no algae, it looks totally clean and crystal clear!
                player amused Which is great, because I don't think I've taken a bath since I arrived here in town.
                player sleep ... Unless tongue baths count. But I'm pretty sure they don't.
                finish 
            `)
            addFlag("player", "poolReady");
            addFlag("player", "ruinsPool");
            break;
        }
        case "ruinsPoolRepeat": {
            console.debug("Pool repeat");
            addFlag("player", "poolReady");
            grottoMove(grottoPosition);
            break;
        }
		case "ruinsPool": {
			if (checkFlag("player", index.index+"Finished") == false) {
				writeHTML(`
                    eval stripPlayer();
				    eval cleanPlayer();
					player pent Ahhhh~
                    im misc/grotto/ruinsPool1-1-light
                    player sleep Now this is the life...!
                    t You take a nice, refreshing soak in the water. It's a miracle just how pristine this spot is!
                    t ...
                    foxf love Hohhh~<3
                    foxm annoyed Hey, I can't see!
                    foxf blushy Shh! Okay, I'll scooch, just stay quiet.<br>And make sure all those gummies don't melt together.
                    foxm worried You really think *he'll get lost?
                    foxf worried ... Well we aren't exactly peeping because we're hooked on *his sense of direction, are we?
                    foxm excited R-right. Hey, don't forget to put aside a few bottles of the bathwater aside afterwards. We don't want to sell <i>all</i> of it.
                    foxf excited And <i>you</i> shouldn't forget to return the clothes once we're done with... Y'know. ?flah 
                    t ...
                    player amused That was nice.
				`)
			}
			else {
				writeHTML(`
                    eval stripPlayer();
				    eval cleanPlayer();
					player pent Ahhhh~
					im misc/grotto/ruinsPool1-1-light
					player sleep This is the life.
					t You decided to take another relaxing bath. It's nice to take a moment just for yourself, completely unmolested.
					t ...
					player amused That was nice.
				`)
			}
			writeHTML(`
				special You've regained a bit of stamina!
				finish
			`);
			digHealth +=10
			clothesStolen();
			addFlag("player", index.index+"Finished")
            removeFlag("player", "poolReady");
            break;
        }
		case "ruinsTrap": {
			if (checkFlag("player", index.index+"Finished") == false) {
				writeHTML(`
					player sleep Hmm hmm hmm~
					player shock Wah! Sticky goo! Get it off, get it off!
					t You must have accidentally triggered some diabolical trap, covering you in some kind of strange white goo! You flail and flail, getting off of your body.
					t ...
                    eval stripPlayer();
					player pent ... Alright, I think that's all of it.
					im misc/grotto/ruinsTrap1-1-light
					player tired I wonder what kind of sinister, brilliant mind could have placed such a dangerous, completely undetectable trap...
				`)
			}
			else {
				writeHTML(`
					player sleep Hmm hmm hmm~
					player shock Wah!
					t You triggered the strange sticky trap again! It takes a moment to get it all off... 
                    t ...
                    eval stripPlayer();
					player pent ... Alright, I think that's all of it.
					im misc/grotto/ruinsTrap1-1-light
				`)
			}
			writeHTML(`
				t You feel a little bit more tired than before...
				eval digHealth -=3
                player pent Ugh, I still have to clean off my... ?flag player originallyHadClothing;
				eval clothesStolen();
				finish
			`);
			addFlag("player", index.index+"Finished")
            break;
        }
        case "ruinsHoleIntro": {
            writeHTML(`
                player curious Hmm?
                im locations/grotto/`+grottoPosition+`
                t Before you is a roughly fist-sized hole in the wall at about waist height, with absolutely no indication of what it could be for, aside from the mysterious dripping bits of blue goo.
                player befuddled Interesting...
                player sleep Okay, being serious for a second, it feels pretty obvious what this is for, but a quick examination...
                t You very slowly prod into the darkness of the hole with a finger, only to feel a gentle resistance, like gelatin, and your finger comes back quite moist.
                player happy Okay, good to know it's not dangerous.<br>I could just ignore it. But I didn't get this far by <i>not</i> investigating weird tight holes.
                finish
            `)
            addFlag("player", "holeReady");
            addFlag("player", "ruinsHole");
            break;
        }
        case "ruinsHoleRepeat": {
            addFlag("player", "holeReady");
            grottoMove(grottoPosition);
            break;
        }
		case "ruinsHole": {
			if (checkFlag("player", index.index+"Finished") == false) {
				writeEvent("player", index.index);
			}
			else {
				writeHTML(`
					player sleep Hmph. As if I'd fall for a trap like that again. I know that thing's not a stamina recovery hole.
					player befuddled Unless... Wait, is this even the same place?<br>No, this is a completely new cave, after all, I should investigate properly!
					player amused After all, what are the chances that this one's a trap too?
					t ...
                    eval stripPlayer();
					player orgasm Ghouhhhh~<3
					im misc/grotto/ruinsHole1-1-light
					player aftermath Ghummminggg~
					im misc/grotto/ruinsHole1-2-light ?weird;
					player pent *Huff*...<br>Another trapped hole... Clever, clever...<br>But at this rate, the next one is sure to be legit!
				`)
			}
			writeHTML(`
                t You feel a little bit more tired than before...
                eval digHealth -=3
				eval clothesStolen();
				finish
			`);
			addFlag("player", index.index+"Finished")
            removeFlag("player", "holeReady");
            break;
        }
        case "ruinsMimic": {
            if (checkFlag("player", index.index+"Finished") == false) {
                writeEvent("player", index.index);
            }
            else {
                writeHTML(`
                    player sparkle A chest! Oh boy oh boy!
                    player smile Hmm. I feel like I'm forgetting something...<br>Oh well, it can't be that important.<br>Alrighty, let's see what's
                    player scared Ah, right.
                    t  ...
                    im misc/grotto/ruinsMimic1-1-light
                    eval writeBig("misc/grotto/ruinsMimic1-eBack", "player:4-+12-1.5#expression:orgasm#overlay:misc/grotto/ruinsMimic1-eFront#")
                    im misc/grotto/ruinsMimic1-2-light
                    player panic MPHHHH~?! ?atwt;
			        im misc/grotto/ruinsMimic1-3-light; ?atwt;
                    t ...
                    eval stripPlayer();
                    player tired Urrp... Geez... That stuff's saliva seems to mess with my body somehow.
                    player sleep Glad it's temporary at least. Alright, I got off lucky this time, but I'll <i>definitely</i> approach any future chests more carefully!
                `)
            }
            writeHTML(`
                t You feel a little bit more tired than before...
                eval digHealth -=3
                player pent Ugh, I still have to clean off my... ?flag player originallyHadClothing;
                eval clothesStolen();
                finish
            `);
            addFlag("player", index.index+"Finished")
            break;
        }
        case "ruinsSlimeBlueMeat": {
			if (checkFlag("player", index.index+"Finished") == false) {
				writeEvent("player", index.index);
			}
			else {
				writeHTML(`
					player shock Wah!
					im misc/grotto/ruinsSlimeBlueMeat1-1-light
					t Another slime attacks! Glurgly giggling is quickly followed by a shift in position, once you're thoroughly pinned to the ground.
					im misc/grotto/ruinsSlimeBlueMeat1-2-light
					t It seems to take great delight in clapping against your flesh, maybe you're so soft and jiggly it's mistaken you for one of its own kind?
					im misc/grotto/ruinsSlimeBlueMeat1-3-light
					t And once again you are slickly straddled until its needs are satisfied. 
                    eval stripPlayer();
                    t ...
				`)
			}
			writeHTML(`
				t You feel a little bit more tired than before...
				eval digHealth -=3
				eval clothesStolen();
				finish
			`);
			addFlag("player", index.index+"Finished")
            break;
        }
        case "ruinsSlimeBlueVeggie": {
			if (checkFlag("player", index.index+"Finished") == false) {
				writeEvent("player", index.index);
			}
			else {
				writeHTML(`
					player shock Wah!
					im misc/grotto/ruinsSlimeBlueMeat1-1-light
					t Another slime attacks! Glurgly giggling is quickly followed by a shift in position, once you're thoroughly pinned to the ground.
					im misc/grotto/ruinsSlimeBlueMeat1-2-light
					t It seems to take great delight in clapping against your flesh, maybe you're so soft and jiggly it's mistaken you for one of its own kind?
					im misc/grotto/ruinsSlimeBlueMeat1-3-light
					t And once again you are slickly straddled until its needs are satisfied.  
                    t ...
                    eval stripPlayer();
				`)
			}
			writeHTML(`
				t You feel a little bit more tired than before...
				eval digHealth -=3
				eval clothesStolen();
				finish
			`);
			addFlag("player", index.index+"Finished")
            break;
        }
        case "ruinsSlimeWhite": {
			if (checkFlag("player", index.index+"Finished") == false) {
				writeHTML(`
					player sleep Doot dee doot, exploring all the roo-ins, doot da dee dee da dee dum dum, explor-
					player shock Wah!
					im misc/grotto/ruinsSlimeWhite1-1
					player tired ... Oh. It's not attacking.
					t It seems you've encountered some sort of slime creature, but it doesn't pay you any mind. With how some kind of white fluid swirls within, it seems like it's in the middle of digesting something.
					t Now, while you <i>could</i> have fun with it, being a certified monster fucker and all, there's no obvious place where it's ready for penetration. It's crotch is featureless and the chest is flat.
					t So it seems like your only option is to leave it be and hope you get ambushed by a hungrier slime next time, right?
					trans ruinsSlimeWhiteFollowup; ( ͡° ͜ʖ ͡°) ?weird;
					finish 
				`)
			}
			else {
				writeHTML(`
					im misc/grotto/ruinsSlimeWhite1-1
					t Expecting another trap, you relax when you realize it's a familiar semi-white slime, clearly midway through digestion.
					t Without any actual holes, it clearly isn't taking a form built for sex. Not much you can do besides leave it alone.
					t Unless...?
					trans ruinsSlimeWhiteFollowup; ( ͡° ͜ʖ ͡°)
					finish 
				`)
			}
			addFlag("player", index.index+"Finished")
            break;
        }
        case "forestShrine": {
            var specialCards = ["pocket-eev-v-0", "pocket-eev-j-0", "pocket-eev-f-0"]
            var transformedCardsOwned = 0;
            for (var specialCardIndex = 0; specialCardIndex < specialCards.length; specialCardIndex++) {
                if (checkItem(specialCards[specialCardIndex].replace("-0", "-1")) == true) {
                    transformedCardsOwned++;
                }
            }
            if (transformedCardsOwned >= specialCards.length) {
                writeHTML(`
                    t You already have all the cards this shrine can offer you.
                    finish
                `)
            }
            else {
                writeHTML(`
                    t Taking a look, it seems there's an indent in the shrine, about the size of a pocketmanz card. But you have a funny feeling in your head that only certain cards are meant to be placed here. Do you have all of them?
                `)
                appendGrids("pocketmanz");
                var requirementString = "";
                for (var specialCardIndex = 0; specialCardIndex < specialCards.length; specialCardIndex++) {
                    var cardToPrint = globalCollectablesArray.find(item => item.index === ""+specialCards[specialCardIndex]);
                    if (cardToPrint == undefined) {
                        break
                    }
                    printCard(cardToPrint, "galleryGrid")
                    requirementString += `?item `+specialCards[specialCardIndex]+`;`
                }
                writeHTML(`
                    trans forestShrineTransform; Offer these cards to the altar `+requirementString+`
                    finish
                `)
            }
            break;
        }
        case "forestShrineTransform": {
            var specialCards = ["pocket-eev-v-0", "pocket-eev-j-0", "pocket-eev-f-0"]
            writeHTML(`
                t Placing all ${specialCards.length} cards on the altar, the shrine is filled with a strange light.
                t Suddenly, new cards appear before you!
            `)
            appendGrids("pocketmanz");
            var requirementString = "";
            for (var specialCardIndex = 0; specialCardIndex < specialCards.length; specialCardIndex++) {
                var cardToPrint = globalCollectablesArray.find(item => item.index === specialCards[specialCardIndex].replace("-0", "-1"));
                addItem(cardToPrint.index, true);
                printCard(cardToPrint, "galleryGrid")
            }
            writeHTML(`
                special Jiggies for each of the unlocked cards have been obtained!
                finish
            `)
            break;
        }
        case "forestJuiceIntro": {
            writeHTML(`
                player befuddled ...
                im locations/grotto/`+grottoPosition+`
                player worried Is that... A picnic basket?<br>I mean, if it were a treasure chest I'd open it right away, but a strange basket is just too suspicious.
                player sleep ...
                player amused Okay, just a liiiittle peek...
                t You gingerly raise the basket's lid, ready for rooty tentacles to assault you or something like that, but...
                player confused Huh. Just a juicebox.<br>Well, it's not mine, so I'll leave it here.<br>If I get really thirsty I guess I could drink it and leave a few muns behind.
                player sleep Unless it's a trap. But, I mean, what kind of monster would trap a juicebox?
                finish
            `)
            addFlag("player", "juiceReady");
            addFlag("player", "forestJuice");
            break;
        }
        case "forestJuiceRepeat": {
            addFlag("player", "juiceReady");
            grottoMove(grottoPosition);
            break;
        }
        case "forestJuice": {
			if (checkFlag("player", index.index+"Finished") == false) {
				writeEvent("player", index.index);
			}
			else {
				writeHTML(`
					player sparkle Oh boy, another juicebox!
					player sleep Spspsp*<br>*Slrrrrrp*<br>*Slrrrrrrp*
					player tired ... This is the exact same flavor as that trapped one.
					t Once again, everything suddenly feels hot!
					t Sweat suddenly pouring from your pores, you quickly toss your clothes aside. ?flag player originallyHadClothing;
				    eval stripPlayer();
					im misc/grotto/forestJuice1-1-light
					player forced Ghh, what kind of freaky juice is th-
					im misc/grotto/forestJuice1-2-light
					player torogao -!!!
					im misc/grotto/forestJuice1-3-light-masc
					player broken !!!
					t Your mind goes completely blank, feeling like the entirety of your brain just fired out of your dick like a cannon.
					t ...
					t When you come to, it feels like you were rolled over by a large heavy set of wheels, then decided to stand up, stretch, and then lay back down on the road to be rolled over again. 
				`)
			}
			writeHTML(`
				t You feel a little bit more tired than before...
				eval digHealth -=3
				eval clothesStolen();
				finish
			`);
			addFlag("player", index.index+"Finished")
            removeFlag("player", "juiceReady");
            break;
        }
        case "forestChuckster": {
            removeFlag("player", "chuckster");
            grottoPosition = grottoLocations[Math.floor(Math.random() * grottoLocations.length)].index
            while (grottoPosition == "centralSphinx" || grottoPosition == "centralStatue") {
                grottoPosition = grottoLocations[Math.floor(Math.random() * grottoLocations.length)].index
            }
            writeHTML(`
                player sleep Hmm hmm hmm~
                player befuddled Huh? Do I hear footsteps?<br>Hello?
                t You call out, not expecting a response, but you can just barely manage to hear someone saying something, and the sound of footsteps grows louder.
                player worried Sorry, I didn't catch that, who are you?
                t Once again, it's just barely inaudible, but they're repeating... Something. And getting cl-
                im misc/grotto/forestSleepChuckster1-1
                t "I'M a ChUcKsTeR~!"
                player panic Wh- WAAAAAAAAAAAH-
                t ...
                t What happened next was a blur, all you know for sure is that you're somewhere else now, and your head hurts.
                finish    
            `)
            break;
        }
        case "forestSleep": {
			if (checkFlag("player", index.index+"Finished") == false) {
				writeHTML(`
					player awe Whoaaaa...
					im locations/grotto/`+grottoPosition+`
					player Such a pretty tree...<br>Such a cool-looking mist...<br>And such beautiful flowers! I absolutely gotta know what they smell like!
					player happy Hmm... *Sniff* *Sniff*<br>Interesting, smells kinda like a special sleep-inducing pollen. It's a weirdly specific-
					player sleep Zzz...
					t ... 
				`)
			}
			else {
				writeHTML(`
					player awe Whoaaaa...
					im locations/grotto/`+grottoPosition+`
					player happy Hey, this place looks kinda familiar! And so do those flowers!<br>I wonder if they smell the same as the flowers from that other cave I explored?<br>*Sniff* *Sniff*...<br>Yup, same smell, it's-
					player sleep Zzz... 
				`)
			}
			
			var legalSleepEvents = [
				{index: "forestSleepFairy", requirements: "?female;"},
			];
			for (let eventIndex = 0; eventIndex < legalSleepEvents.length; eventIndex++) {
				if (!checkRequirements(legalSleepEvents[eventIndex].requirements)) {
                    legalSleepEvents.splice(eventIndex, 1);
                    eventIndex--;
                    if (legalSleepEvents.length == 0) {
                        console.error("No legal sleep events found!");
                        break;
                    }
				}
			}
			//Every candidate can be filtered out (e.g. female content disabled), and indexing an
			//empty list threw mid-scene — the sleep text printed but no finish button ever did,
			//softlocking the grotto. Fall through to the "what happened?" fallback instead.
			var actualEvent = null;
			if (legalSleepEvents.length > 0) {
				var selectedEvent = legalSleepEvents[Math.floor(Math.random() * legalSleepEvents.length)].index;
				var eventContainer = globalEventArray.find(character => character.index === "player");
				actualEvent = eventContainer.events.find(scene => scene.index === selectedEvent);
			}
            console.debug(actualEvent);
			if (actualEvent) {
				writeEvent("player", actualEvent.index);
			}
			else {
				writeHTML(`
					player tired Mrgggh... What happened?
					t You rub your head, feeling like you just tried to read a math textbook while practicing kegel exercises.
					player pent Why on earth do I feel so drained?<br>And is it just me, or is my body kinda... Sticky?
					player tired ... Oh well. Nothing for it.
				`)
			}
			writeHTML(`
				t You feel a little bit more tired than before...
				eval digHealth -=3
				eval clothesStolen();
				finish
			`);
			addFlag("player", index.index+"Finished")
            break;
        }
        case "forestFlowersIntro": {
            writeHTML(`
                player awe Ooh-
                im locations/grotto/`+grottoPosition+`
                player happy This whole area's covered in flowers! I really love smelling them, and-
                player annoyed Heeey, wait a second, I'm no dummy, some of these flowers are some kind of camoflague, there's no pollen or nectar inside them!
                player worried Or, I could be wrong. I could always pluck one and see if it's some kinda veggie.
                finish    
            `)
            addFlag("player", "flowersReady");
            addFlag("player", "forestFlowers");
            break;
        }
        case "forestFlowersRepeat": {
            addFlag("player", "flowersReady");
            grottoMove(grottoPosition);
            break;
        }
        case "forestFlowers": {
			var legalSleepEvents = [
				{index: "pikRed", requirements: "?weird;"},
				{index: "pikBlue", requirements: "?female;"},
				{index: "pikYellow", requirements: "?male;"},
			];
			for (let eventIndex = 0; eventIndex < legalSleepEvents.length; eventIndex++) {
				if (checkRequirements(legalSleepEvents[eventIndex].requirements) == false) {
                    console.info("Removing event", legalSleepEvents[eventIndex].index);
                    legalSleepEvents.splice(eventIndex, 1);
                    eventIndex--;
                    if (legalSleepEvents.length == 0) {
                        break;
                    }
				}
			}
			var selectedEvent = legalSleepEvents[Math.floor(Math.random() * legalSleepEvents.length)].index;
            console.info("Selected event", selectedEvent);
			switch (selectedEvent) {
				case "pikRed": {
					if (!checkFlag("player", selectedEvent)) {
						writeHTML(`
							player sparkle Alright, flower-pulling time!<br>After all, you don't get glutes this maximized without a little bit of healthy eating!
							player pent Whup... Ho!<br>Whup... Ho!
							player confused Whup... Ho?<br>I keep pulling, but... It's.. In there... Wah!
							im misc/grotto/forestPikminRed1-1-light
							t It's a red picked-mini! Of course, named for being miniature creatures who are picked out of the ground, and nothing else.
							t This one seems to be being, well, the only word that comes to mind is "Schlorkled", by a species known as a Wormb.
							player awe Wow, it's the circle of life. Tiny creature lives underground, tiny creature gets succ'd by slurpy worms, and then probably something else happens.<br>Well, more like triangle of life. Sorry to disturb you, I'll leave you guys to it.
							t You replant the creature where you found it. Symbiotic relationships are a precious thing in nature, after all.
						`);
						addFlag("player", selectedEvent)
					}
					else {
						writeHTML(`
							player sparkle Alright, flower-pulling time!<br>After all, you don't get glutes this maximized without a little bit of healthy eating!
							player pent Whup... Ho!<br>Whup... Ho!
							im misc/grotto/forestPikminRed1-1-light
							player happy Ah, another one of you guys! And looks like you already have a friend.<br>I'll leave you guys to it.
						`);
					}
					break;
				}
				case "pikBlue": {
					if (!checkFlag("player", selectedEvent)) {
						writeHTML(`
							player sparkle Alright, veggie-plucking time!<br>After all, you don't get thighs this jiggly without a little bit of healthy eating!
							player pent Whup... Ho!
							im misc/grotto/forestPikminBlue1-1-light
							t It's a blue picked-mini! Of course, named for being miniature creatures who are picked out of the ground, and nothing else.
							player confused This thing looks kinda familiar. And yet somehow it feels like it's either too big, or too small.
							t This particular species looks like it's ideal for swimming, on account of having absolutely fantastic glute muscles. But it seems to be mid-hibernation.
							player tired Shame I've been banned for six consecutive lifetimes from carrying a whistle.
							t Unable to wake it up, surely there's nothing you can do with this creature aside from put it back. Right?
							trans pikBlueFollowup; ( ͡° ͜ʖ ͡°)
						`);
					}
					else {
						writeHTML(`
						
						`);
					}
					break;
				}
				case "pikYellow": {
					if (!checkFlag("player", selectedEvent)) {
						writeHTML(`
							player sparkle Alright, veggie-plucking time!<br>After all, you don't get thighs this jiggly without a little bit of healthy eating!
							player pent Whup... Ho!
							im misc/grotto/forestPikminYellow1-1-light
							t It's a yellow picked-mini! Of course, named for being miniature creatures who are picked out of the ground, and nothing else.
							player confused This thing looks kinda familiar. And yet somehow it feels like it's either too big, or too small.
							t This particular species looks to have a great deal of insulation that could protect it from electricity, mostly in the cheeks. 
							t ... It also seems to be pretty light at the same time. And have a decent build for digging. And might be using some of that extra head size to house a pretty smart brain. Surely with all these evolutionary adaptations, this creature must be an absolutely incredible master of its environment! There's no way this creature could ever be considered weak!
							t But for now at least, it seems to be mid-hibernation.
							player tired Shame I've been banned for six consecutive lifetimes from carrying a whistle.
							t Unable to wake it up, surely there's nothing you can do with this creature aside from put it back. Right?
							trans pikYellowFollowup; ( ͡° ͜ʖ ͡°)
						`);
					}
					else {
						writeHTML(`
						
						`);
					}
					break;
				}
				default: {
					writeHTML(`
						player sparkle Alright, veggie-plucking time!<br>After all, you don't get thighs this jiggly without a little bit of healthy eating!
						player pent Whup... Ho!
						player panic ... Nothing?! what the heck, what a waste!
					`);
				}
			}
			writeHTML(`
				finish
			`);
            removeFlag("player", "flowersReady");
            break;
        }
		case "forestSpores": {
			if (checkFlag("player", index.index+"Finished") == false) {
				writeEvent("player", index.index);
			}
			else {
				writeHTML(`
					player happy Oh, more mushrooms.
					im locations/grotto/`+grottoPosition+`
					player excited Ehehe, oh no, I'm getting real close to them again, I sure hope somebody saves me!
					t *FLUMPHSSSSHHHH*
				    eval stripPlayer();
					player pent ... Hm. Suddenly I... I don't really want to move away again. I...
					im misc/grotto/forestSpores1-1-light
					player Mmm. Why did I... Why did I care... So much about fluff anyways...?
					im misc/grotto/forestSpores1-2-light-masc
					t And once again, your vision fades away, but just at the last second you're pulled back.
					player perverted Gotcha! I may be blind for a second, but I still pulled a fast one on ya!<br>Gimme those tails! Mofu mofu!
					foxf special secret; Wah!
					foxm special secret; H-hey!
				`)
			}
			writeHTML(`
				eval digHealth +=10
                t ...
                t You wake up again, feeling sore from the mushroom's effects... 
				special But feeling even <i>more</i> rejuvenated through the healing power of fluffy tails!
				eval clothesStolen();
				finish
			`);
			addFlag("player", index.index+"Finished")
            break;
        }
		case "forestTentacles": {
			if (checkFlag("player", index.index+"Finished") == false) {
				writeEvent("player", index.index);
			}
			else {
				writeHTML(`
					player surprise Oh!
					im locations/grotto/`+grottoPosition+`
					player worried Tentacles, I'd better turn back. Wait, if they're that obvious over there, then over here-
					player scared Oh no! 
				    eval stripPlayer();
					im misc/grotto/forestTentacles1-1-light
					player panic Aww man, not again!
					im misc/grotto/forestTentacles1-2-light !urethral;
					im misc/grotto/forestTentacles1-2-urethral-light ?urethral;
					player torogao Ffff-fine! Take it! Ch... Choke on it!
					im misc/grotto/forestTentacles1-3-light-masc 
					t Overwhelmed by a sudden blast of salty fluid, the tentacle realizes it tried to swallow more than it could chew, and retreats.
					player pent Hoo... Another risky maneuver, but it paid off. 
				`)
			}
			writeHTML(`
				t You feel a little bit more tired than before...
				eval digHealth -=3
				eval clothesStolen();
				finish
			`);
			addFlag("player", index.index+"Finished")
            break;
        }
        case "centralSphinxFirst": {
            writeHTML(`
                define sphinx = sp sphinx; altName Sphinx; altImage locations/grotto/centralSphinx; altColor #EB6707;
                player Hmm deedy doo, ghosts don't say "boo"~<br>Hmm dah-dee dee, they don't need to pee~
                sphinx special secret; What a lovely tune...
                player scared ...!
                im locations/grotto/centralSphinx
                sphinx Oh, a human. It's been quite a while since a sacrifice wandered into my lap on its own accord~
                player panic I'm not a sacrifice! Don't eat me, I'm not tasty!
                player worried ... Well, okay, that's obviously a lie. My nickname in grade school was "Snackrifice", actually 
                player panic But still!
                sphinx Oh dear, a worrier~<br>Don't worry, you'll be perfectly fine. If you can solve just one simple riddle~<br>Are you ready?
                player scared *Gulp*
                sphinx What has three legs in the morning, and just two legs after I finish cranking *his fat. Fucking. Hog~?
                player scared ...
                player worried ...
                player befuddled ...?
                sphinx ... Are you going to-
                player annoyed Shh! I'm thinking!
                sphinx It was-
                player angry Stop it! Thinking's really hard for me, I'm not very smart, so if you distract me I'll get it wrong, and a sphinx lady will eat me!
                sphinx ... Alright. Just... Okay.
                t You press your hands to your temples, probably burning up more than a few calories from the precious fat reserves you keep stored in your cheeks.
                trans centralSphinxFollowup; But finally, it hits you!
            `)
            addFlag("player", "centralSphinx");
            break;
        }
        case "centralSphinxRepeat": {
            writeHTML(`
                define sphinx = sp sphinx; altName Lamy; altImage locations/grotto/centralSphinx; altColor #EB6707;
                im locations/grotto/centralSphinx
                sphinx My my, if it isn't my favorite human.
                player blushy D'aww, shucks... I'm the only human around though...
                player panic Wait, doesn't that mean I'm your least favorite too?
                sphinx No, I knew a few long, long ago. They were not nearly as pleasant, or as jiggly as you are.<br>Now, would you care to make a trade?
                finish
            `)
            break;
        }
        case "centralStatueIntro": {
            writeHTML(`
                t Placeholder for `+index.index+`
                finish    
            `)
            //addFlag("player", "centralStatue");
            break;
        }
        case "none": {
            exploredLocations.push(grottoPosition);
            grottoMove(grottoPosition);
            break;
        }
        case "forestTrapFoxF": {
            addFlag("foxf", "trap");
            writeEvent("foxf", "trap");
            writeHTML(`finish`)
            break;
        }
        case "forestTrapFoxFRepeat": {
            writeEvent("foxf", "trap");
            writeHTML(`finish`)
            break;
        }
        case "forestTrapFoxM": {
            addFlag("foxm", "trap");
            writeEvent("foxm", "trap");
            writeHTML(`finish`)
            break;
        }
        case "forestTrapFoxMRepeat": {
            writeEvent("foxm", "trap");
            writeHTML(`finish`)
            break;
        }
    }
    if (index.index == "grottoEscape") {
        if (!checkFlag("player", "grottoEscape")) {
            writeHTML(`
                player happy ...
                player worried ...
                player crying ... I'm lost! I'm trapped, I'm doomed!<br>I always knew I'd die down in some cave, I just thought my thighs would get me stuck!<br>I'll never see all my friends again, I'll starve-
                t *Woosh*
                player worried *Sniff*<br>Huh? It felt like something with a fluffy tail just darted past me-<br>Wait!
                t Out of nowhere, on a small scrap of paper in front of you, is a pristine, completely out-of-place-
                player joy Gummy candy!<br>Oh thank goodness, at least I won't starve hungry! Yummy!
                player sparkle Ooh! Wait, over there's another one! Yummy!<br>Ooh, and another one! Yummy!<br>Ooh, and...
                t ...
                player sparkle -nd another one! Yummy! Ooh-
                player befuddled Hey, wait a second, I recognize that rock. Wait...
                player sparkle I know where I am again! Yippee!
                special Whenever you become lost, you can instantly return to your starting location at the cost of 10 stamina.<br>You can't go below 1, so feel free to use this as a quick way to exit if you don't care about having a lot of stamina for digging afterwards.
                eval addFlag('player', 'grottoEscape');
            `)
        }
        else {
            writeHTML(`
                player worried Ohh... I'm getting hungry again, and I think I've been going in circles...
                t *Woosh*
                player joy Ooh! A gummy candy! Yummy!
                t ...
            `);
        }
        digHealth -= 10;
        writeFunction("grottoMove(grottoInitialLocation)", "Continue");
    }
    if (digHealth > maxDigHealth) {
        digHealth = maxDigHealth
    }
}

var ruinsGatheringArray = [	
    {index: "dildo-glass", type: "collectable", requirements: "!location forestEmpty1; !location forestEmpty2; !location forestEmpty3;",},
	{index: "dildo-gold", type: "collectable", requirements: "!location forestEmpty1; !location forestEmpty2; !location forestEmpty3;",},
	{index: "chalice-gold-male", type: "collectable", requirements: "?vegetarian; !location forestEmpty1; !location forestEmpty2; !location forestEmpty3;",},
	{index: "chalice-gold-female", type: "collectable", requirements: "?carnivore; !location forestEmpty1; !location forestEmpty2; !location forestEmpty3;",},
	{index: "trophy-gold-male", type: "collectable", requirements: "?vegetarian; !location forestEmpty1; !location forestEmpty2; !location forestEmpty3;",},
	{index: "trophy-gold-female", type: "collectable", requirements: "?carnivore; !location forestEmpty1; !location forestEmpty2; !location forestEmpty3;",},
	{index: "shield-gold-male", type: "collectable", requirements: "?vegetarian; !location forestEmpty1; !location forestEmpty2; !location forestEmpty3;",},
	{index: "shield-gold-female", type: "collectable", requirements: "?carnivore; !location forestEmpty1; !location forestEmpty2; !location forestEmpty3;",},
	
	{index: "misc-shell-male", type: "collectable", requirements: "?vegetarian; ?weird; !location ruinsEmpty1; !location ruinsEmpty2; !location ruinsEmpty3;",},
	{index: "misc-shell-female", type: "collectable", requirements: "?carnivore; ?weird; !location ruinsEmpty1; !location ruinsEmpty2; !location ruinsEmpty3;",},
	{index: "fruit-blue-male", type: "collectable", requirements: "?vegetarian; !location ruinsEmpty1; !location ruinsEmpty2; !location ruinsEmpty3;",},
	{index: "fruit-blue-female", type: "collectable", requirements: "?carnivore; !location ruinsEmpty1; !location ruinsEmpty2; !location ruinsEmpty3;",},
	{index: "statue-glass-male", type: "collectable", requirements: "?vegetarian; !location ruinsEmpty1; !location ruinsEmpty2; !location ruinsEmpty3;",},
	{index: "statue-glass-female", type: "collectable", requirements: "?carnivore; !location ruinsEmpty1; !location ruinsEmpty2; !location ruinsEmpty3;",},
	{index: "statue-gold-male", type: "collectable", requirements: "?vegetarian; !location ruinsEmpty1; !location ruinsEmpty2; !location ruinsEmpty3;",},
	{index: "statue-gold-female", type: "collectable", requirements: "?carnivore; !location ruinsEmpty1; !location ruinsEmpty2; !location ruinsEmpty3;",},

	{index: "bug-lurm", type: "common", requirements: "?location forestWilderness; ?weird;",},
	{index: "fish-fooba", type: "common", requirements: "?location lakesideRetreat; ?weird;",},
	{index: "fruit-assple-seed", type: "common", requirements: "?location forestWilderness;",},
	{index: "fruit-assple-seed", type: "common", requirements: "?location lakesideRetreat;",},

    {index: `mayor-core1`, type: "collectable", requirements: "",},
	{index: "shopkeep-core1", type: "collectable", requirements: "",},
    {index: `carpenter-core1`, type: "collectable", requirements: "",},
    {index: `wolf-core1`, type: "collectable", requirements: "?female;",},
    {index: `sadogato-core1`, type: "collectable", requirements: "?female;",},
    {index: `milf-core1`, type: "collectable", requirements: "?female; ?pregnancy;",},
    {index: `nun-core1`, type: "collectable", requirements: "?female;",},
    {index: `fashionista-core1`, type: "collectable", requirements: "?male;",},
    {index: `mesu-core1`, type: "collectable", requirements: "?male;",},
    {index: `hyena-core1`, type: "collectable", requirements: "?dickgirl;",},
    {index: `doe-core1`, type: "collectable", requirements: "?dickgirl;",},

    {index: `mayor-fles`, type: "collectable", requirements: "",},
	{index: "shopkeep-fles", type: "collectable", requirements: "",},
    {index: `carpenter-fles`, type: "collectable", requirements: "",},
    {index: `foxf-fles`, type: "collectable", requirements: "?female;",},
    {index: `foxm-fles`, type: "collectable", requirements: "?male;",},
    {index: `wolf-fles`, type: "collectable", requirements: "?female;",},
    {index: `sadogato-fles`, type: "collectable", requirements: "?female;",},
    {index: `milf-fles`, type: "collectable", requirements: "?female; ?pregnancy;",},
    {index: `nun-fles`, type: "collectable", requirements: "?female;",},
    {index: `fashionista-fles`, type: "collectable", requirements: "?male;",},
    {index: `mesu-fles`, type: "collectable", requirements: "?male;",},
    {index: `hyena-fles`, type: "collectable", requirements: "?dickgirl;",},
    {index: `doe-fles`, type: "collectable", requirements: "?dickgirl;",},
]

function ruinsGathering(n) {
	//Make a list of each ruinsGatheringArray entries that are collectable or events where we meet the requirements
	var possibleEvents = []
	for (gatheringIndex = 0; gatheringIndex < ruinsGatheringArray.length; gatheringIndex++) {
		if (ruinsGatheringArray[gatheringIndex].type == "collectable") {
			if (ruinsGatheringArray[gatheringIndex].requirements.includes("!item "+ruinsGatheringArray[gatheringIndex].index+";") == false) {
				ruinsGatheringArray[gatheringIndex].requirements += "!item "+ruinsGatheringArray[gatheringIndex].index+";"
			}
		}
		if (checkRequirements(ruinsGatheringArray[gatheringIndex].requirements) && ruinsGatheringArray[gatheringIndex].type != "common") {
			var addItemToList = true;

			var actionsList = ["hunting", "gathering", "fishing"];
			for (actionsIndex = 0; actionsIndex < actionsList.length; actionsIndex++) {
				if (ruinsGatheringArray[gatheringIndex].index.toLowerCase().includes(actionsList[actionsIndex])) {
					addItemToList = false;
					console.log(ruinsGatheringArray[gatheringIndex].index.toLowerCase());
					if (n.toLowerCase().includes(actionsList[actionsIndex])) {
						addItemToList = true;
					}
				}
			}
			
			if (ruinsGatheringArray[gatheringIndex].type == "event" && addItemToList == true) {
				addItemToList = true;
				for (eventCounter = 0; eventCounter < data.player.pickupLog.length; eventCounter++) {
					if (data.player.pickupLog[eventCounter][0] == ruinsGatheringArray[gatheringIndex].index) {
						addItemToList = false;
					}
				}
			}
			
			if (addItemToList == true) {
				possibleEvents.push(ruinsGatheringArray[gatheringIndex])
			}
		}
	}

	
	for (eventCounter = 0; eventCounter < data.player.pickupLog.length; eventCounter++) {
		if (data.player.pickupLog[eventCounter][1] > 0) {
			data.player.pickupLog[eventCounter][1] -= 1;
			if (data.player.pickupLog[eventCounter][1] === 0) {
				data.player.pickupLog.splice(eventCounter, 1);
			}
		}
	}

	console.log(possibleEvents)
	if (possibleEvents.length != 0) {
		//Select a random event from the list of possible events
		var randomEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
		for (priorityCounter = 0; priorityCounter < 7; priorityCounter++) {
			if (randomEvent.index.includes("Pog")) {
				randomEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
			}
			if (randomEvent.index.includes("jiggy")) {
				randomEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
			}
			if (randomEvent.index.includes("Magazine")) {
				randomEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
			}
		}
		console.log(randomEvent)
		if (randomEvent.type == "collectable") {
			writeHTML(`t You explore around for a while, eventually finding something nice!`)
			ruinsGatherItem("GatheringFishingHunting");
			console.info(randomEvent.index)
			addItem(randomEvent.index)
			writeHTML(`finish`)
		}
		else {
			var logEntry = [randomEvent.index, getRandomInt(18)+7];
			data.player.pickupLog.push(logEntry);
			//randomEvent.triggered = true;
			gatherEvent(randomEvent.index);
		}
	}
	else {
		grottoMove(grottoPosition);
		ruinsGatherItem("GatheringFishingHunting");
	}
}

function ruinsGatherItem(action) {
	//Make a new list searching for only common events
	var possibleEvents = [];
	for (gatheringIndex = 0; gatheringIndex < ruinsGatheringArray.length; gatheringIndex++) {
		if (checkRequirements(ruinsGatheringArray[gatheringIndex].requirements) && ruinsGatheringArray[gatheringIndex].type == "common") {
			var addItemToList = true;
			//console.info(action)
			if (ruinsGatheringArray[gatheringIndex].index.includes("fruit")) {
				addItemToList = false;
				if (action.includes("Gathering")) {
					addItemToList = true;
				}
			}
			if (ruinsGatheringArray[gatheringIndex].index.includes("bug")) {
				addItemToList = false;
				if (action.includes("Hunting")) {
					addItemToList = true;
				}
			}
			if (ruinsGatheringArray[gatheringIndex].index.includes("fish")) {
				addItemToList = false;
				if (action.includes("Fishing")) {
					addItemToList = true;
				}
			}
			if (addItemToList == true) {
				possibleEvents.push(ruinsGatheringArray[gatheringIndex])
			}
		}
	}
	if (possibleEvents.length != 0) {
		console.log(possibleEvents)
		var randomEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
		soundEffectStart("pickup");
		console.log(randomEvent.index);
		addItem(randomEvent.index);
	}
}
