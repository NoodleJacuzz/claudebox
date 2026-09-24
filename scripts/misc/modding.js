//Functions for quickly adding content to or replacing content for an existing character
function newEncounter(character, content) {
    /*Examples:
    var newEncounters = [
        //Example for encounter tab which appears below navigation area, using Helena's intro encounter:
        {index: `intro1`, name: `"Hey, you!"`, requirements: "?location pineconePlaza; ?trust hyena 0; !flag player intro;", altName: "", altImage: "",},

        //Example for navigation button, using the Town Hall button from intro:
        {name: "Town Hall", index: "intro1", top: 35, left: 20, type:"button", target: "townHall", time: "MorningEvening", requirements: "?flag player intro; !flag mayor mayorIntro;"},

        //Example for encounter that triggers immediately after entering an area:
        {index: "pounce", type:"walking", requirements: "?trustMin mayor 7; ?location townHall; !flag mayor pounce;"},
    ];

    //Function for actually adding the new encounters
    for (var i = 0; i < newEncounters.length; i++) {
        newEncounter("CODENAME", newEncounters[i]);
    }
    */

    var encounterToAdd = content;
    encounterToAdd.character = character;
    for (var encounterIndex = 0; encounterIndex < globalEncounterArray.length; encounterIndex++) {
        if (globalEncounterArray[encounterIndex].character == character && globalEncounterArray[encounterIndex].index == content.index) {
            globalEncounterArray[encounterIndex] = encounterToAdd;
            return;
        }
    }
    globalEncounterArray.push(encounterToAdd);
}

function newScene(character, content) {
    /*Examples:
	var newScenes = [
		{index: `date1Intro`,
		content: `
			im date2-1
			wolf sparkle playerF! Yoo-hoo, over here~!
			wolf happy Have you considered my offer? I know it must feel quite sudden but I'd absolutely love to get to know you better!		
			trans date1Start; Accept and become wolfF's *boyfriend
			trans cancel; Need more time
		`,},
	]
	
	//Function for actually adding the new scenes
    for (var i = 0; i < newScenes.length; i++) {
        newScene("CODENAME", newScenes[i]);
    }
    */
    var sceneToAdd = content;
    sceneToAdd.character = character;
    for (var characterIndex = 0; characterIndex < globalSceneArray.length; characterIndex++) {
        if (globalSceneArray[characterIndex].index == character) {
            for (var sceneIndex = 0; sceneIndex < globalSceneArray[sceneIndex].scenes.length; sceneIndex++) {
                if (globalSceneArray[characterIndex].scenes[sceneIndex].index == content.index) {
                    globalSceneArray[sceneIcharacterIndexndex].scenes[sceneIndex] = sceneToAdd;
                    console.log("Scene replaced:", globalSceneArray[characterIndex].scenes[sceneIndex].index);
                    return;
                }
            }
            globalSceneArray[characterIndex].scenes.push(sceneToAdd);
        }
    }
}

function newEvent(character, content) {
    /*Examples:
    var newEvents = [
        {index: "wolf-date1", name: "First Date", image: "wolf/date1-4alt",
        content: `
            player excited W-well...
            im date1-2
            player excited Okay...!
            im date1-3
            wolf happy Ah, there you go!<br>Granted, I'm not sure that...<br>Hmm...
            wolf worried <i>Goodness, my heart started racing.<br>And what's this scent in the air now? I-</i>
            im date1-4
            t *SPANK*
            wolf shock ...!
            player shock Whoa! Sorry, I couldn't resist... Plus, you said I could...
            player worried wolfF?
            wolf shock ...
            im date1-5
            t Losing herself for just a moment as her cheeks stop their jiggling, wolfF barely moves aside from a small shudder as her pussy squirts a small line of femcum.
            wolf I...
            wolf excited I need to go, darling. Let's meet again soon, okay? Tomorrow if p-possible~
            player worried Sure thing.
            wolf T-toodles~
        `},
    ]

    //Function for actually adding the new events
    for (var i = 0; i < newEvents.length; i++) {
        newEvent("CODENAME", newEvents[i]);
    }
    */

    var eventToAdd = content;
    eventToAdd.character = character;
    for (var characterIndex = 0; characterIndex < globalEventArray.length; characterIndex++) {
        if (globalEventArray[characterIndex].index == character) {
            for (var eventIndex = 0; eventIndex < globalEventArray[eventIndex].events.length; eventIndex++) {
                if (globalEventArray[eventIndex].events[eventIndex].index == content.index) {
                    globalEventArray[eventIndex].events[eventIndex] = eventToAdd;
                    console.log("Event replaced:", globalEventArray[eventIndex].events[eventIndex].index);
                    return;
                }
            }
            globalEventArray[characterIndex].events.push(eventToAdd);
            console.log("Event added:", globalEventArray[characterIndex].events[globalEventArray[characterIndex].events.length - 1].index);
        }
    }
}


function newSale(character, content) {
    /*Examples:
    var newSales = [
        //Example where event is triggered after purchase
        {index: "pet1", name: "Pet the Cat", price: 100, unique: false, event: true, image:"shopkeep/pet1-1", 
        requirements: "?location store; ?flag shopkeep petIntro; !flag shopkeep pet1; !flag shopkeep pet3;",
        desc: "If you wanna huff this fluff, it'll cost you!",},

        //Example where no event is triggered
        {index: "rod", name: "Fishing Rod", price: 10, unique: true, image:"items/rod", 
        requirements: "?location store;",
        desc: "A cool fishing rod. Allows you to collect fish and other items from the water.<br>Reliable. It'll never break!",},
    ]

    //Function for actually adding the new sales
    for (var i = 0; i < newSales.length; i++) {
        newSale("CODENAME", newSales[i]);
    }
    */

    var saleToAdd = content;
    saleToAdd.character = character;
    for (var saleIndex = 0; saleIndex < globalShopArray.length; saleIndex++) {
        if (globalShopArray[saleIndex].character == character && globalShopArray[saleIndex].index == content.index) {
            globalShopArray[saleIndex] = saleToAdd;
            return;
        }
    }
    globalShopArray.push(saleToAdd);
}

function newPickup(character, content) {
    /*Examples:
    var newPickups = [
        {index: "gathering", requirements: "?location lavenderLane; ?flag carpenter orchard;", top: 10, left: 78, event: true, size: 10, image: "items/fruit/generic"},

        {index: "wolfClothes", requirements: "?flag wolf House; !item Dress;", top: 30, left: 20, event: true, size: 10, image: "items/question"},
    ]

    //Function for actually adding the new pickups
    for (var i = 0; i < newPickups.length; i++) {
        newPickup("CODENAME", newPickups[i]);
    }
    */

    var pickupToAdd = content;
    pickupToAdd.character = character;
    for (var pickupIndex = 0; pickupIndex < globalPickupArray.length; pickupIndex++) {
        if (globalPickupArray[pickupIndex].character == character && globalPickupArray[pickupIndex].index == content.index) {
            globalPickupArray[pickupIndex] = pickupToAdd;
            return;
        }
    }
    globalPickupArray.push(pickupToAdd);
}

function newMorning(character, content) {
    /*Examples:
    var newMornings = [
	    {index: "morning1", priority: 70, requirements: "?trustMin wolf 7;", unique: true,},
    ]

    //Function for actually adding the new mornings
    for (var i = 0; i < newMornings.length; i++) {
        newMorning("CODENAME", newMornings[i]);
    }
    */

    var morningToAdd = content;
    morningToAdd.character = character;
    for (var morningIndex = 0; morningIndex < globalMorningArray.length; morningIndex++) {
        if (globalMorningArray[morningIndex].character == character && globalMorningArray[morningIndex].index == content.index) {
            globalMorningArray[morningIndex] = morningToAdd;
            return;
        }
    }
    globalMorningArray.push(morningToAdd);
}

function newTrophy(character, content) {
    /*Trophies are sorted alphabetically, the character is used to determine the trophy color and whether it is disabled based on toggled fetishes
    
    Examples:
    var newTrophies = [
	    {index:"4wolfFriend", frame: "ultraRare", name: "Fashionista's BFF", requirements: "?trustMin wolf 7;", description: "Teach wolfF what it means to have a *boyfriend and become best friends.<br>Reward: New clothes for you and wolfF", image: "wolf/achievement1",},
    ]

    //Function for actually adding the new trophies
    for (var i = 0; i < newTrophies.length; i++) {
        newTrophy("CODENAME", newTrophies[i]);
    }
    */

    var trophyToAdd = content;
    trophyToAdd.character = character;
    for (var trophyIndex = 0; trophyIndex < globalAchievementArray.length; trophyIndex++) {
        if (globalAchievementArray[trophyIndex].character == character && globalAchievementArray[trophyIndex].index == content.index) {
            globalAchievementArray[trophyIndex] = trophyToAdd;
            return;
        }
    }
    globalAchievementArray.push(trophyToAdd);
}

function newItem(content) {
    /*Note that this function refers to inventory items, not the actual clothes you wear or the jiggies you can select in the collectables section.
    Also note you can mostly copypaste clothes and jiggies from this function and the newClothing and newJiggy functions
    
    Examples:
    var newItems = [
	    {index: "Shirt", category: "upperwear", filter: "", image: "player/upperwear/shirt-masc"},

        {category: `jiggy`, set: "Misc", index: `holofuta1`, image: `magazine/holofuta-0-1`, pieces: 100, name: `Holofuta: Fan Meet-Up`, desc: `A bonus jiggy from the Holofuta magazine.`, requirements: `?item holoMagazine1;`, tags: "dickgirl",},
    ]

    //Function for actually adding the new items
    for (var i = 0; i < newItems.length; i++) {
        newItem(newItems[i]);
    }
    */

    var itemToAdd = content;
    for (var itemIndex = 0; itemIndex < globalItemsArray.length; itemIndex++) {
        if (globalItemsArray[itemIndex].index == content.index) {
            globalItemsArray[itemIndex] = itemToAdd;
            return;
        }
    }
    globalItemsArray.push(itemToAdd);
}

function newCollectable(content) {
    /*Examples:
    var newCollectables = [
        {category: `jiggy`, set: "Misc", index: `holofuta1`, image: `magazine/holofuta-0-1`, pieces: 100, name: `Holofuta: Fan Meet-Up`, desc: `A bonus jiggy from the Holofuta magazine.`, requirements: `?item holoMagazine1;`, tags: "dickgirl",},
    ]

    //Function for actually adding the new collectables
    for (var i = 0; i < newCollectables.length; i++) {
        newCollectable(newCollectables[i]);
    }
    */

    var collectableToAdd = content;
    for (var collectableIndex = 0; collectableIndex < globalCollectablesArray.length; collectableIndex++) {
        if (globalCollectablesArray[collectableIndex].index == content.index) {
            globalCollectablesArray[collectableIndex] = collectableToAdd;
            return;
        }
    }
    globalCollectablesArray.push(collectableToAdd);
}

function newClothing(content) {
    /*Note that clothes with no filter will appear in the wardrobe, if anything is written in the filter section it is considered a recolor, and will appear at the bottom once the clothing dye is obtained.
    
    Examples:
    var newClothes = [
	    {index: "Shirt", category: "upperwear", filter: "", image: "player/upperwear/shirt-masc"},
        {index: "Ponytail", category: "hair", filter: "filter: hue-rotate(100deg) contrast(1.4)", image: "player/hair/ponytailFront"},
        {index: "Ponytail", category: "hair", filter: "filter: grayscale(100%) brightness(180%) contrast(1.2)", image: "player/hair/ponytailFront"},
        {index: "Ponytail", category: "hair", filter: "filter: grayscale(100%) brightness(70%) contrast(1.2)", image: "player/hair/ponytailFront"},
    ]

    //Function for actually adding the new clothes
    for (var i = 0; i < newClothes.length; i++) {
        newClothing(newClothes[i]);
    }
    */

    var clothingToAdd = content;
    for (var clothingIndex = 0; clothingIndex < globalClothesArray.length; clothingIndex++) {
        if (globalClothesArray[clothingIndex].index == content.index) {
            globalClothesArray[clothingIndex] = clothingToAdd;
            return;
        }
    }
    globalClothesArray.push(clothingToAdd);
}

function newLocation(content) {
    /*Examples:
    var newLocations = [
        {index: "townHall", image: "interiorMayor", name: "Mayor's Office", buttons: [
            {name: "Head Outside", top: 63, left: 0, type: "location", target: "pineconePlaza", time: "MorningEvening",},
        ],},
    ]

    //Function for actually adding the new locations
    for (var i = 0; i < newLocations.length; i++) {
        newLocation(newLocations[i]);
    }
    */

    var locationToAdd = content;
    for (var locationIndex = 0; locationIndex < locationArray.length; locationIndex++) {
        if (locationArray[locationIndex].index == content.index) {
            locationArray[locationIndex] = locationToAdd;
            console.error("Location updated: " + content.index);
            return;
        }
    }
    locationArray.push(locationToAdd);
    console.error("New location added: " + content.index);
}

function newTravelButton(btn) {
    var reqs = btn.requirements || "";
    
    // Extract the parent location from the requirement string
    var match = reqs.match(/\?location\s+([a-zA-Z0-9_]+);/);
    
    if (match) {
        var parentLocation = match[1];
        
        // Find the target location in the global array
        for (var i = 0; i < locationArray.length; i++) {
            if (locationArray[i].index === parentLocation) {
                // Ensure the buttons array exists, then push
                if (!locationArray[i].buttons) {
                    locationArray[i].buttons = [];
                }
                locationArray[i].buttons.push(btn);
                console.log("New travel button added to: " + parentLocation);
                return;
            }
        }
        console.warn("Modding: Could not find location '" + parentLocation + "' for travel button.");
    } else {
        console.warn("Modding: Travel button missing ?location requirement:", btn.name);
    }
}

//UI for loading mods
function generateModHub() {
    data.player.currentScene = "modHub";
    document.getElementById("output").innerHTML = "";
    writeHTML(`t Installed Mods:`);
    document.getElementById("output").innerHTML += "<div id='modList'></div>";
    document.getElementById("output").innerHTML += "<div id='modHub'></div>";
    writeHTML(`trans modFAQ; Frequent Questions (Where to find more mods, how to, etc...)`);
    writeHTML(`trans modFleshy; Non-furry version`);
    if (webuiShortcut == true) {
        writeHTML(`trans txt2img; Webui`)
        writeHTML(`trans honeycombTest; Test honeycomb game`)
    }
    if (restartNeeded) {
        writeHTML(`
            t You've disabled one or more mods, you'll need to refresh the game otherwise the mod's effects will stay active!
            func refresh(); Refresh
        `);
    }
    else {
        writeHTML(`trans start; Back to Title`);
    }
    generateModList();
    createModUploader();
}

function refresh() {
    location.reload();
}

function generateModList() {
    const globalModlist = getGlobalModlist();

    if (!globalModlist || !globalModlist.length) return;

    for (const mod of globalModlist) {

        const id = mod.name.replace(/\s+/g,"_");

        // Build a richer body: author + description when we have them (older installs predating the
        // metadata capture simply omit those lines).
        let body = "";
        if (mod.author) body += `By ${mod.author}<br>`;
        body += `Version: ${mod.version}<br>`;
        if (mod.modDesc) body += `<span class="textContentSyrup">${mod.modDesc}</span><br>`;
        body += `<p id="${id}Text" class="textContentSyrup switch" onclick="removeMod('${mod.name}')">Remove</p>`;

        writeSpeech(
            mod.name,
            // Pass the RAW logical path. writeSpeech -> resolveAvatarHTML already runs
            // cleanupImage once; cleaning it here too double-processes the lazy-load
            // placeholder into a broken path on first render.
            mod.thumbnailPath,
            body,
            "",
            "",
            "target; modList"
        );

    }
}

var restartNeeded = false;

function removeMod(name) {
    const globalModlist = getGlobalModlist();
    const modIndex = globalModlist.findIndex(mod => mod.name === name);

    if (modIndex === -1) return;
    globalModlist.splice(modIndex, 1);
    saveGlobalModlist(globalModlist);
    restartNeeded = true;

    // Deliberate removal — drop the save's mod fingerprint too, so boot doesn't nag
    // about a mod the player chose to uninstall.
    if (typeof data !== "undefined" && data && data.player && Array.isArray(data.player.modsUsed)) {
        data.player.modsUsed = data.player.modsUsed.filter(n => n !== name);
    }

    // The modlist edit above only removes the mod from the UI. bootInstalledMods executes
    // whatever sits in the mod_scripts store, so the stored records must go too or the mod
    // keeps running on every boot as a "ghost". Fire-and-forget: the boot-time filter in
    // bootInstalledMods catches anything a mid-purge refresh leaves behind.
    purgeModData([name]).catch(e => console.warn("Couldn't purge stored data for removed mod:", name, e));

    generateModHub();
}

// Delete every stored record belonging to the given mod names: cached script text
// (mod_scripts), image blobs (mod_images), and the saved zip (mods). mod_scripts and
// mod_images are keyed by logicalPath with the owning mod only in the modId field, and
// there's no index on modId — so those two are walked with a cursor. Cursor values hand
// blobs back as lazy handles, so no image bytes are read into memory.
async function purgeModData(names) {
    if (!names || !names.length) return;
    const nameSet = new Set(names);
    const db = await openModDB();

    // Zips are keyed by mod name directly.
    await new Promise(resolve => {
        const tx = db.transaction("mods", "readwrite");
        const store = tx.objectStore("mods");
        nameSet.forEach(n => store.delete(n));
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
        tx.onabort = () => resolve();
    });

    for (const storeName of ["mod_scripts", "mod_images"]) {
        await new Promise(resolve => {
            const tx = db.transaction(storeName, "readwrite");
            const req = tx.objectStore(storeName).openCursor();
            req.onsuccess = () => {
                const cursor = req.result;
                if (!cursor) return;
                if (cursor.value && nameSet.has(cursor.value.modId)) {
                    cursor.delete();
                    // Un-register the image key so cleanupImage stops resolving to it.
                    if (storeName === "mod_images" && window.knownModFiles) {
                        window.knownModFiles.delete(cursor.value.logicalPath);
                    }
                }
                cursor.continue();
            };
            tx.oncomplete = () => resolve();
            tx.onerror = () => resolve();
            tx.onabort = () => resolve();
        });
    }

    console.info("🧹 Purged stored data for removed mod(s):", [...nameSet].join(", "));
}

//Core mod-loading scripts
// modImages lives on window so this file and scenewriting.js share ONE object.
// (A stray `const modImages` used to shadow window.modImages, so resolved blob URLs
//  were written to window.modImages but read back from this const — i.e. never seen.)
window.modImages = window.modImages || {};
// Registry of every mod image's logical path. Initialised here AND in scenewriting.js
// with a || guard so it always exists regardless of script load order. Previously it
// was only ever created inside bootInstalledMods(), which nothing called, so
// `window.knownModFiles.add(...)` below threw on the first image of every load.
window.knownModFiles = window.knownModFiles || new Set();
var uploadedImages = {};
var uploadedImageMap = {};

// Inline placeholder shown for image slots the modder hasn't filled in yet. It's a data-URI SVG
// (a blue cross), so: (a) it needs no network fetch and works on local file:// builds, and (b) it is
// NOT a stored blob, so empty slots can never spawn orphan images. A logical path registered in
// placeholderImagePaths resolves to this SVG via cleanupImage until a real image is uploaded for it.
window.PLACEHOLDER_IMAGE_SVG = "data:image/svg+xml;utf8," + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
    `<rect width="100" height="100" fill="#15151f"/>` +
    `<line x1="50" y1="28" x2="50" y2="72" stroke="#5fa8e6" stroke-width="9" stroke-linecap="round"/>` +
    `<line x1="28" y1="50" x2="72" y2="50" stroke="#5fa8e6" stroke-width="9" stroke-linecap="round"/>` +
    `</svg>`
);
window.placeholderImagePaths = new Set();

// Register/unregister a logical image path as an unfilled placeholder. Keys are normalised with
// getCleanKey so they match what cleanupImage looks up.
function markPlaceholderPath(path) {
    if (path) window.placeholderImagePaths.add(getCleanKey(path));
}
function clearPlaceholderPath(path) {
    if (path) window.placeholderImagePaths.delete(getCleanKey(path));
}

// Rebuild placeholderImagePaths from the current workspace. Placeholders aren't blobs and the set is
// in-memory, so after a draft restore or a mod import (which only rehydrate REAL image blobs) any
// referenced image path that has no blob is, by definition, an unfilled placeholder. Without this,
// cleanupImage would resolve those slots to non-existent files (broken images) instead of the cross.
function rebuildPlaceholderPaths() {
    window.placeholderImagePaths = new Set();
    const mark = (path) => {
        if (typeof path !== "string" || !path) return;
        const clean = getCleanKey(path);
        if (!uploadedImageMap[clean]) window.placeholderImagePaths.add(clean);
    };
    const scanImageFields = (entry, tabKey) => {
        const cfg = tabConfig[tabKey];
        if (!cfg || !entry) return;
        cfg.card.editor.forEach(f => {
            if (f.inputType && f.inputType.includes("image")) mark(entry[f.origin || f.key]);
        });
    };

    (storageArray.customCharacters || []).forEach(char => {
        (char.expressions || []).forEach(em => mark(`${char.index}/expressions/${em}`));
        ["encounters", "pickups", "sales", "mornings"].forEach(tab => (char[tab] || []).forEach(e => scanImageFields(e, tab)));
    });
    [["items", "customItems"], ["collectables", "customCollectables"],
     ["locations", "customLocations"], ["travelButton", "customTravel"]]
        .forEach(([tabKey, arrKey]) => (storageArray[arrKey] || []).forEach(e => scanImageFields(e, tabKey)));
}

// --- Keep the real save clean while modding -------------------------------------------------------
// Debug/test actions can leave mod-only references in `data` (e.g. testScene sets currentCharacter to
// a custom character, testing a travel button moves the player to a custom location). Those would be
// written into the real save slot and could break a normal playthrough. saveSlot runs the data it
// persists through here first, on a CLONE, so the live debug session keeps its test state but the
// stored save never contains mod-only content — letting a player create a mod and play at the same
// time. (Custom characters are not added to data.story by the editor, but we filter them too as a
// belt-and-suspenders against any legacy/installed-mod leftovers carrying a matching index.)
function modContaminationPresent(d) {
    if (!d || !d.player || typeof storageArray === "undefined" || !storageArray.modName) return false;
    const customChars = (storageArray.customCharacters || []).map(c => c.index);
    const customLocs = (storageArray.customLocations || []).map(l => l.index);
    if (customChars.includes(d.player.currentCharacter)) return true;
    if (customLocs.includes(d.player.location)) return true;
    if (Array.isArray(d.story) && d.story.some(c => customChars.includes(c.index))) return true;
    return false;
}

function stripModContaminationFromData(d) {
    if (!d || !d.player) return d;
    const customChars = (storageArray.customCharacters || []).map(c => c.index);
    const customLocs = (storageArray.customLocations || []).map(l => l.index);

    if (customChars.includes(d.player.currentCharacter)) d.player.currentCharacter = "system";
    if (customLocs.includes(d.player.location)) d.player.location = ""; // "" = safe title/start state
    if (Array.isArray(d.story)) d.story = d.story.filter(c => !customChars.includes(c.index));

    return d;
}

function createModUploader() {

    const wrapper = document.createElement("div");
    wrapper.className = "modUploadWrapper";

    const dropZone = document.createElement("div");
    dropZone.className = "modUploadZone";
    dropZone.innerText = "Upload ZIP\n(click or drag & drop)";

    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".zip";
    input.style.display = "none";

    input.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        loadModZip(file);
    });

    // click support
    dropZone.addEventListener("click", () => {
        input.click();
    });

    // drag & drop support
    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("dragHover");
    });

    dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("dragHover");
    });

    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragHover");

        const file = e.dataTransfer.files[0];
        if (!file) return;

        if (!file.name.endsWith(".zip")) {
            if (file.name.endsWith(".rar")) {
                generateWindow("rarFailure");
                return
            }
            alert("Please upload a ZIP file.");
            return;
        }

        loadModZip(file);
    });

    wrapper.appendChild(dropZone);
    wrapper.appendChild(input);

    document.getElementById("modHub").appendChild(wrapper);
}

// In-memory cache of every installed mod's script TEXT, in execution order
// (core scripts first, then character scripts). Populated once at boot (or when a
// mod is imported mid-session). initializeArrays() wipes the global content arrays
// on every save-load and rebuilds them from the initial arrays + character files;
// without replaying these, mod-added content would only exist on the very first
// boot and vanish the first time a save is loaded. This holds plain strings only,
// so it's cheap to keep around and re-run.
var cachedModScripts = [];

// Re-run the cached mod scripts to re-add their content after the global arrays are
// rebuilt. The modding helpers (newEncounter, newItem, newSale, ...) all replace by
// index rather than blindly pushing, so replaying is idempotent — no duplicates.
// executeModScript appends an inline <script>, which runs synchronously, so this
// finishes before initializeArrays() returns. Mirrors how loadCoreCharacters() keeps
// built-in character content alive across loads.
function reapplyModScripts() {
    if (!Array.isArray(cachedModScripts) || cachedModScripts.length === 0) return;
    for (var i = 0; i < cachedModScripts.length; i++) {
        executeModScript(cachedModScripts[i]);
    }
    console.info("✅ Re-applied " + cachedModScripts.length + " mod script(s) after array rebuild.");
}

// Run on startup. Lightweight: reads cached script TEXT + image KEYS from IndexedDB.
// It never opens a zip, so it cannot reintroduce the multi-hundred-MB startup lag.
async function bootInstalledMods() {
    if (!window.knownModFiles) window.knownModFiles = new Set();

    const db = await openModDB();
    // 1. Registry: record which mod image files exist (keys only — no blobs decoded).
    await new Promise(resolve => {
        const req = db.transaction("mod_images", "readonly")
                      .objectStore("mod_images").getAllKeys();
        req.onsuccess = () => {
            (req.result || []).forEach(k => window.knownModFiles.add(k));
            resolve();
        };
        req.onerror = () => resolve();
    });

    // Keys with an extension or folder prefix were written by an OLDER loader — the
    // current one strips both, so cleanupImage lookups can never match them. If any
    // exist, treat the registry as broken and let the rebuild below rewrite it.
    const legacyImageKeys = [...window.knownModFiles].some(k =>
        typeof k === "string" && (/\.(webp|png)$/i.test(k) || k.includes("images-webp/")));
    // Healthy registry — re-arm the one-shot image-rebuild self-heal below.
    if (window.knownModFiles.size > 0 && !legacyImageKeys) localStorage.removeItem("syrupModImagesRebuilt");

    // 2. Scripts: pull the cached text.
    const cachedScriptRecords = await new Promise(resolve => {
        const req = db.transaction("mod_scripts", "readonly")
                      .objectStore("mod_scripts").getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
    });

    const installed = getGlobalModlist();

    // RECOVERY: the modlist is gone but saved zips still exist in the mods store. This is
    // what a lost or never-migrated modlist looks like — game versions that tracked mods
    // in data.player.modlist, or localStorage cleared while IndexedDB survived. Rebuild
    // everything from the zips: loadModZip re-extracts the mod info, stores scripts +
    // image blobs, executes the scripts, and re-creates the modlist entries.
    if (installed.length === 0) {
        const storedZips = await new Promise(resolve => {
            const req = db.transaction("mods", "readonly").objectStore("mods").getAll();
            req.onsuccess = () => resolve(req.result || []);
            req.onerror = () => resolve([]);
        });
        const usable = storedZips.filter(z => z && z.fileData);
        if (usable.length > 0) {
            console.warn("No modlist but " + usable.length + " saved mod zip(s) found — restoring them.");
            for (const rec of usable) {
                try {
                    await loadModZip(rec.fileData);
                } catch (e) {
                    console.error("Couldn't restore saved mod zip:", rec.filename, e);
                }
            }
            console.info("✅ Mods restored from saved zips:", getGlobalModlist().map(m => m.name).join(", ") || "(none)");
            return;
        }
    }

    // Only run scripts whose mod is still in the modlist. removeMod used to leave the
    // mod_scripts records behind, so a removed mod's script kept executing here on every
    // boot (a "ghost mod"). Skip those, and purge them so old installs self-heal.
    // Records without a modId can't be attributed to a mod, so they're kept.
    const installedNames = new Set(installed.map(m => m.name));
    const scripts = [];
    const ghostMods = new Set();
    for (const obj of cachedScriptRecords) {
        if (!obj.modId || installedNames.has(obj.modId)) scripts.push(obj);
        else ghostMods.add(obj.modId);
    }
    // With an EMPTY modlist every attributed record would count as a ghost — that state
    // is ambiguous (lost modlist vs. genuinely no mods), so never purge from it. The
    // recovery above handles the lost-modlist case; a truly modless install has nothing
    // worth purging anyway. Purging here used to DESTROY recoverable mod data.
    if (ghostMods.size && installed.length > 0) {
        console.warn("Found cached data for removed mod(s) — purging:", [...ghostMods].join(", "));
        purgeModData([...ghostMods]).catch(e => console.warn("Ghost-mod purge failed:", e));
    }

    // Self-heal / one-time migration, for two shapes of broken stored data:
    //   1. No cached script text (data created before this loader was fixed) — the mods
    //      wouldn't run at all without a rebuild.
    //   2. Scripts cached but ZERO image keys registered — old-loader data that saved
    //      script text without image blobs. The fast path above then runs the mods fine
    //      while every mod image misses the registry and 404s (the "all mod images are
    //      broken links" reports). Guarded by a one-shot flag (re-armed on any healthy
    //      boot above) so a genuinely image-less mod list can't rebuild every boot.
    // checkInstalledMods() re-runs loadModZip, which stores blobs + scripts AND executes
    // them, so future boots use the fast path above.
    const imageKeysMissing = (window.knownModFiles.size === 0 || legacyImageKeys) &&
        localStorage.getItem("syrupModImagesRebuilt") !== "1";
    if ((scripts.length === 0 || imageKeysMissing) && installed.length > 0) {
        if (imageKeysMissing) localStorage.setItem("syrupModImagesRebuilt", "1");
        console.warn("Mod cache incomplete (scripts: " + scripts.length + ", image keys: " + window.knownModFiles.size + ") — rebuilding from saved zips.");
        const missing = await checkInstalledMods();
        // Mods whose zip was ALSO gone couldn't be rebuilt — their data was cleared by the
        // browser while the modlist entry survived. Tell the player so they can re-import.
        if (missing && missing.length) notifyModsCleared(missing);
        console.info("✅ Mods finished loading (rebuilt from zips):", installed.map(m => m.name).join(", ") || "(none)");
        return;
    }

    // 3. Execute: core scripts first (they define globals like customCharacters),
    //    then every character script.
    const cores = [];
    const chars = [];
    for (const obj of scripts) {
        const lower = (obj.logicalPath || "").toLowerCase();
        if (lower.includes("scripts/characters/")) chars.push(obj);
        else cores.push(obj);
    }
    // Cache the script text (cores first, then chars) so initializeArrays() can replay
    // it on every save-load and keep mod content from being wiped. Must match the
    // execution order below.
    cachedModScripts = cores.map(obj => obj.content).concat(chars.map(obj => obj.content));

    cores.forEach(obj => executeModScript(obj.content));
    chars.forEach(obj => executeModScript(obj.content));

    // Clear, easy-to-spot confirmation on every boot (console.log is too noisy to find).
    console.info("✅ Mods finished loading from cache:", installed.map(m => m.name).join(", ") || "(none)");
}

async function loadModZip(file, nestingDepth) {
    if (nestingDepth == undefined) nestingDepth = 0;
    if (data.player.currentScene != "start") {
        writeScene("system", "modLoading");
    }

    // Make sure the registry exists no matter how we got here (upload before boot,
    // migration, etc.). Previously this was undefined and the .add() below threw.
    if (!window.knownModFiles) window.knownModFiles = new Set();

    const zip = await JSZip.loadAsync(file);

    // Hosts like MEGA offer "download as zip", which wraps the mod's own .zip inside a
    // second zip. A real mod always carries at least one .js, so a zip with no scripts but
    // nested .zip entries is a wrapper: unwrap and load each nested zip as its own mod
    // (multi-select downloads can hold several). Rebuilt as named Files so extractModInfo's
    // version string and the stored rebuild zip both see the INNER zip, not the wrapper.
    let wrapperHasScripts = false;
    const nestedZipEntries = [];
    zip.forEach((path, entry) => {
        if (entry.dir) return;
        const lower = path.toLowerCase();
        if (lower.endsWith(".js")) wrapperHasScripts = true;
        else if (lower.endsWith(".zip")) nestedZipEntries.push(entry);
    });
    if (!wrapperHasScripts && nestedZipEntries.length > 0) {
        if (nestingDepth >= 3) {
            console.error("Mod zip is nested too deeply — giving up:", file.name || "(unnamed zip)");
            alert("This zip only contains other zips several layers deep, so it doesn't look like a Syrup Town mod. Please import the mod's own .zip file directly.");
            return;
        }
        console.info("Wrapper zip detected (" + (file.name || "unnamed") + ") — unwrapping " + nestedZipEntries.length + " nested zip(s).");
        for (const nestedEntry of nestedZipEntries) {
            const nestedBlob = await nestedEntry.async("blob");
            const nestedName = nestedEntry.name.split("/").pop();
            await loadModZip(new File([nestedBlob], nestedName, { type: "application/zip" }), nestingDepth + 1);
        }
        // Older builds imported wrapper zips as a broken "Unknown Mod" entry (no scripts,
        // wrapper stored as its rebuild zip). Now that the real mod inside is installed
        // under its own name, drop that ghost — otherwise a future cache rebuild loads the
        // wrapper AGAIN alongside the real entry and executes the mod's scripts twice.
        // ("Unknown Mod" can only come from the no-.js fallback; the creation tools reject
        // spaces in mod names, so no legitimate mod can carry it.)
        const ghostList = getGlobalModlist();
        if (ghostList.some(m => m.name === "Unknown Mod")) {
            saveGlobalModlist(ghostList.filter(m => m.name !== "Unknown Mod"));
            purgeModData(["Unknown Mod"]).catch(e => console.warn("Couldn't purge legacy wrapper-zip ghost entry:", e));
        }
        return;
    }

    const modInfo = extractModInfo(zip, file);

    // Pull author + description from the mod's root .txt so the installed-mods list can show them.
    // (extractModInfo only reads the .js/images; the .txt holds the human-facing metadata.)
    try {
        let infoEntry = null;
        zip.forEach((p, e) => {
            const lp = p.toLowerCase();
            if (!e.dir && lp.endsWith(".txt") && !lp.includes("scripts/") && !lp.includes("images")) infoEntry = e;
        });
        if (infoEntry) {
            const txt = await infoEntry.async("text");
            const authorMatch = txt.match(/authorName:\s*(.*)/);
            const descMatch = txt.match(/modDesc:\s*\n([\s\S]*)/);
            if (authorMatch) modInfo.author = authorMatch[1].trim();
            if (descMatch) modInfo.modDesc = descMatch[1].trim();
        }
    } catch (e) {
        console.warn("Couldn't read mod info text for", modInfo.name, e);
    }

    const imageJobs = [];   // each resolves to { key, blob }
    const scriptJobs = [];  // each resolves to { path, code }
    const sidecarJobs = []; // each resolves to { key, text } for a .txt beside a picture

    // PHASE 1: Scan the zip. Decompress image BYTES (cheap — no bitmap decode happens
    // until an <img> actually renders the blob) and read script TEXT. Both are needed:
    // scripts to run, image blobs to store so the lazy loader can hand them out later
    // WITHOUT reopening the zip.
    zip.forEach((path, entry) => {
        if (entry.dir) return;

        const lowerPath = path.toLowerCase();

        if (lowerPath.endsWith(".webp") || lowerPath.endsWith(".png")) {
            let key = path.replace(/\.(webp|png)$/i, "");
            key = key.replace(/^[^/]+\//, "");                 // strip the mod's root folder
            key = key.replace("images-webp/", "")
                     .replace("images/", "")
                     .replace("images-png/", "");

            const mime = lowerPath.endsWith(".png") ? "image/png" : "image/webp";
            imageJobs.push(
                entry.async("blob").then(raw => ({
                    key,
                    // Force the correct mime type; JSZip blobs are often typeless, which
                    // can stop an <img>/background from rendering them.
                    blob: raw.type ? raw : new Blob([raw], { type: mime })
                }))
            );
        } else if (lowerPath.endsWith(".txt")) {
            // Generation info sitting beside a picture. Keyed exactly like the image above so
            // the two can be matched up afterwards; the mod's own root .txt (author, blurb)
            // has no image with the same key and drops out on its own.
            let key = path.replace(/\.txt$/i, "");
            key = key.replace(/^[^/]+\//, "");
            key = key.replace("images-webp/", "")
                     .replace("images/", "")
                     .replace("images-png/", "");
            sidecarJobs.push(
                entry.async("string").then(text => ({ key, text }))
            );
        } else if (lowerPath.endsWith(".js")) {
            scriptJobs.push(
                entry.async("string").then(code => ({ path, code }))
            );
        }
    });

    const [resolvedImages, resolvedScripts, resolvedSidecars] = await Promise.all([
        Promise.all(imageJobs),
        Promise.all(scriptJobs),
        Promise.all(sidecarJobs)
    ]);

    // PHASE 2: Persist scripts (text) and images (blobs) to IndexedDB.
    const db = await openModDB();
    const tx = db.transaction(["mod_images", "mod_scripts"], "readwrite");
    const imageStore = tx.objectStore("mod_images");
    const scriptStore = tx.objectStore("mod_scripts");

    // Store the blob under `content` — this is exactly what processModImageBatch reads.
    for (const { key, blob } of resolvedImages) {
        imageStore.put({ logicalPath: key, modId: modInfo.name, content: blob });
    }

    let coreScriptCode = null;
    const charScripts = {};
    for (const { path, code } of resolvedScripts) {
        scriptStore.put({ logicalPath: path, modId: modInfo.name, content: code });

        const lowerPath = path.toLowerCase();
        if (lowerPath.includes("scripts/characters/")) {
            charScripts[path] = code;
        } else if (!lowerPath.includes("scripts/") && !lowerPath.includes("images")) {
            coreScriptCode = code;
        }
    }

    // Commit. If the device is out of space the transaction aborts with a
    // QuotaExceededError — catch it and tell the player cleanly. The transaction is
    // atomic, so on failure nothing was written and we haven't touched the modlist yet.
    try {
        await new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject(tx.error || new DOMException("Mod storage transaction aborted", "AbortError"));
        });
    } catch (err) {
        if (err && err.name === "QuotaExceededError") {
            console.error(`Mod import failed — out of storage quota: "${modInfo.name}"`, err);
            alert(
                `Couldn't install "${modInfo.name}": your browser is out of storage space for this site.\n\n` +
                `Try removing other mods or freeing up space, then import again.`
            );
            return;
        }
        throw err;
    }

    // Storage committed — register the image keys now so cleanupImage can resolve them.
    // (Done after commit so a failed/quota-exceeded import doesn't leave phantom keys
    //  pointing at blobs that were never actually saved.)
    for (const { key } of resolvedImages) {
        window.knownModFiles.add(key);
    }

    // Mod pictures can carry their generation info too, so the scrapbook can show it the same way
    // it does for the base game's art. Registered in memory only: mod images are blobs that live
    // as long as the mod does, so there is nothing to persist and nothing to clean up.
    if (typeof imageList !== "undefined" && resolvedSidecars && resolvedSidecars.length > 0) {
        const imageKeys = new Set(resolvedImages.map(image => image.key));
        let addedNotes = 0;
        for (const { key, text } of resolvedSidecars) {
            // Only .txt files that actually sit beside one of this mod's pictures
            if (!imageKeys.has(key)) continue;
            const trimmed = String(text).trim();
            if (trimmed === "") continue;
            const existing = imageList.findIndex(entry => entry.img === key);
            if (existing >= 0) { imageList[existing].txt = trimmed; }
            else { imageList.push({ img: key, txt: trimmed }); }
            addedNotes++;
        }
        if (addedNotes > 0) console.info("Registered generation info for " + addedNotes + " mod image(s).");
    }

    // PHASE 3: Execute now. Core first (it defines the global customCharacters list),
    // then the character scripts that core declared.
    // As we execute, append the text to cachedModScripts (same order) so this mod is
    // replayed on every future save-load — covers fresh mid-session imports and the
    // one-time zip-rebuild migration that bootInstalledMods triggers via this function.
    if (coreScriptCode) {
        executeModScript(coreScriptCode);
        cachedModScripts.push(coreScriptCode);
    }

    if (typeof customCharacters !== 'undefined' && customCharacters && customCharacters.length > 0) {
        for (const charName of customCharacters) {
            const match = Object.keys(charScripts)
                .find(p => p.toLowerCase().endsWith(`${charName.toLowerCase()}.js`));

            if (match) {
                executeModScript(charScripts[match]);
                cachedModScripts.push(charScripts[match]);
            }
        }
    }

    // Record the mod + keep the original zip (for re-export and the migration path).
    // Always refresh the stored entry (don't skip when it already exists) so that
    // re-importing a mod updates its thumbnailPath/version. Installs from older builds
    // can carry a stale thumbnailPath computed by a previous extractModInfo, which then
    // 404s in the mod list — re-uploading now repairs it.
    const globalModlist = getGlobalModlist();
    const existingIndex = globalModlist.findIndex(m => m.name === modInfo.name);
    if (existingIndex === -1) {
        globalModlist.push(modInfo);
    } else {
        globalModlist[existingIndex] = modInfo;
    }
    saveGlobalModlist(globalModlist);

    // Fingerprint the mod into the SAVE too. Saves travel between installs (.noodle
    // export, a re-downloaded game = fresh per-folder browser storage) while mods don't,
    // and core content references mod-only art (e.g. pocketmanz) — so without this a save
    // can land somewhere its mods don't exist and the player just sees broken images with
    // no explanation. warnAboutMissingMods() reads this at boot / save import.
    if (typeof data !== "undefined" && data && data.player) {
        if (!Array.isArray(data.player.modsUsed)) data.player.modsUsed = [];
        if (!data.player.modsUsed.includes(modInfo.name)) data.player.modsUsed.push(modInfo.name);
    }

    // Keep the raw zip too (for re-export / legacy rebuild). This roughly doubles the
    // mod's footprint, so if we're out of room for it, keep the mod functional rather
    // than failing — the scripts + image blobs above are what actually run the mod.
    try {
        await saveModToDB(file, modInfo);
    } catch (err) {
        console.warn(`Couldn't store the raw zip for "${modInfo.name}" (mod still works, re-export/rebuild unavailable):`, err);
    }

    console.info("✅ Mod finished loading:", modInfo.name, modInfo);

    //saveSlot(10)
}



function findModScript(zip) {
    let coreJS = null;

    zip.forEach((path, entry) => {
        if (entry.dir) return;

        const lowerPath = path.toLowerCase();
        
        // Ensure it's a JS file, but NOT inside the scripts folder or images folder
        if (lowerPath.endsWith(".js") && !lowerPath.includes("scripts/") && !lowerPath.includes("images")) {
            coreJS = entry;
        }
    });

    return coreJS;
}

function executeModScript(code) {

    const script = document.createElement("script");
    script.textContent = code;

    // An inline (textContent) script runs synchronously the instant it's appended, so by
    // the next line it has already executed and we can drop the node. This matters now
    // that reapplyModScripts() runs this on every save-load: without the cleanup, <head>
    // would accumulate one dead <script> per mod per load over a long session.
    document.head.appendChild(script);
    script.remove();

    console.log("Mod script executed");
}

// Ask the browser to keep our storage (mods + save data) durable so it isn't auto-evicted
// under disk pressure. Chrome often grants this silently based on engagement; Firefox
// prompts; Safari ignores it (its ~7-day inactivity cap still applies unless the site is
// added to the home screen). Safe to call on every startup.
async function requestPersistentStorage() {
    try {
        if (!navigator.storage || !navigator.storage.persist) return;
        if (await navigator.storage.persisted()) {
            console.info("Storage already persistent — mods/saves are durable.");
            return;
        }
        const granted = await navigator.storage.persist();
        console.info(granted
            ? "✅ Persistent storage granted — mods/saves won't be auto-evicted."
            : "Persistent storage not granted (best-effort mode; data may be evicted under disk pressure).");
    } catch (e) {
        console.warn("Persistent storage request failed:", e);
    }
}

function openModDB() {
    return new Promise((resolve, reject) => {
        // Bumped to 4 to add the mod_drafts store. onupgradeneeded only creates stores that
        // don't already exist, so the bump is safe for existing installs.
        const request = indexedDB.open("GameModsDB", 4);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            // mod_drafts holds the in-progress modding workspace (one autosaved draft): a single
            // meta record (keyed "__meta__") plus one record per uploaded image, all keyed by "path".
            const requiredStores = ["mod_images", "mod_scripts", "mods", "mod_drafts"];

            requiredStores.forEach(storeName => {
                if (!db.objectStoreNames.contains(storeName)) {
                    let keyPath = "logicalPath";
                    if (storeName === "mods") keyPath = "filename";
                    else if (storeName === "mod_drafts") keyPath = "path";
                    db.createObjectStore(storeName, { keyPath });
                }
            });
        };
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = (e) => reject(e.target.error);
    });
}

async function saveModToDB(file, modInfo) {
    const db = await openModDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction("mods", "readwrite");
        const store = tx.objectStore("mods");
        
        // This must match exactly what you look for in checkInstalledMods
        store.put({
            filename: modInfo.name, 
            fileData: file,
            timestamp: Date.now()
        });

        tx.oncomplete = () => {
            console.log("Mod saved successfully:", modInfo.name);
            resolve(true);
        };
        tx.onerror = (e) => reject(e.target.error);
    });
}

function getGlobalModlist() {
    const mods = localStorage.getItem("syrupGlobalModlist");
    return mods ? JSON.parse(mods) : [];
}

function saveGlobalModlist(modlist) {
    localStorage.setItem("syrupGlobalModlist", JSON.stringify(modlist));
}

// --- Mod workspace autosave (crash-recovery draft) -------------------------------------
// The in-progress mod (storageArray + uploadedImages) is otherwise memory-only, so a refresh
// or crash loses everything. We mirror it into the mod_drafts IndexedDB store: the whole
// storageArray as one JSON "meta" record, plus each uploaded image as its own blob record.
// storageArray references images by PATH (not blob URL), so the volatile blob URLs are never
// persisted — on restore we recreate them. "Refresh = restart" still holds for the game; this
// is a separate, IDE-style recovery layer just for the modder.
const MOD_DRAFT_META_KEY = "__meta__";
var modDraftAutosaveTimer = null;
var modDraftRestoreOffered = false;
// path -> blobUrl currently persisted in IDB, so autosave only writes new/changed/removed
// images instead of rewriting every blob on every tick.
var persistedDraftImages = null;

async function saveModDraft() {
    // Only persist a real, active workspace — never overwrite the draft with an empty one
    // (e.g. an autosave tick that fires right after exportFinish resets storageArray).
    if (!storageArray || !storageArray.modName) return;
    try {
        const db = await openModDB();
        const tx = db.transaction("mod_drafts", "readwrite");
        const store = tx.objectStore("mod_drafts");

        // Meta (cheap to rewrite every tick): the whole workspace minus image blobs.
        store.put({
            path: MOD_DRAFT_META_KEY,
            savedAt: Date.now(),
            modName: storageArray.modName,
            storageArray: JSON.parse(JSON.stringify(storageArray))
        });

        // Images (incremental): build the current path -> {blobUrl, blob} set.
        const current = new Map();
        for (const blobUrl in uploadedImages) {
            const entry = uploadedImages[blobUrl];
            if (!entry || !entry.file) continue;
            current.set(getCleanKey(entry.path), { blobUrl, blob: entry.file });
        }
        if (!persistedDraftImages) persistedDraftImages = new Map();

        // Write new images, and rewrite any whose blob URL changed (i.e. content was replaced
        // in place under the same path).
        for (const [path, { blobUrl, blob }] of current) {
            if (persistedDraftImages.get(path) !== blobUrl) {
                store.put({ path, blob });
                persistedDraftImages.set(path, blobUrl);
            }
        }
        // Delete images that were removed/renamed away.
        for (const path of Array.from(persistedDraftImages.keys())) {
            if (!current.has(path)) {
                store.delete(path);
                persistedDraftImages.delete(path);
            }
        }

        await new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject(tx.error || new Error("mod draft autosave aborted"));
        });
    } catch (e) {
        // Autosave must never break the editor; just log and try again next tick.
        console.warn("Mod draft autosave failed:", e);
    }
}

// Fetch just the meta record so callers can decide whether to offer a restore.
async function getModDraftMeta() {
    try {
        const db = await openModDB();
        return await new Promise(resolve => {
            const r = db.transaction("mod_drafts", "readonly")
                        .objectStore("mod_drafts").get(MOD_DRAFT_META_KEY);
            r.onsuccess = () => resolve(r.result || null);
            r.onerror = () => resolve(null);
        });
    } catch (e) {
        return null;
    }
}

// Rebuild storageArray + the image maps from the saved draft. Returns true on success.
async function loadModDraftIntoWorkspace() {
    try {
        const db = await openModDB();
        const records = await new Promise(resolve => {
            const r = db.transaction("mod_drafts", "readonly")
                        .objectStore("mod_drafts").getAll();
            r.onsuccess = () => resolve(r.result || []);
            r.onerror = () => resolve([]);
        });

        const meta = records.find(r => r.path === MOD_DRAFT_META_KEY);
        if (!meta || !meta.storageArray) return false;

        storageArray = meta.storageArray;
        uploadedImages = {};
        uploadedImageMap = {};
        persistedDraftImages = new Map();

        // Recreate blob URLs from the stored blobs and rewire both lookup maps by path —
        // the same rehydration importModZip does, just sourced from IndexedDB.
        for (const rec of records) {
            if (rec.path === MOD_DRAFT_META_KEY || !rec.blob) continue;
            const blobUrl = URL.createObjectURL(rec.blob);
            uploadedImages[blobUrl] = { file: rec.blob, path: rec.path };
            registerUploadedPath(rec.path, blobUrl);
            persistedDraftImages.set(getCleanKey(rec.path), blobUrl);
        }

        // Only REAL blobs were stored; any referenced image without one is an unfilled placeholder.
        rebuildPlaceholderPaths();
        return true;
    } catch (e) {
        console.error("Failed to load mod draft:", e);
        return false;
    }
}

async function clearModDraft() {
    try {
        const db = await openModDB();
        const tx = db.transaction("mod_drafts", "readwrite");
        tx.objectStore("mod_drafts").clear();
        await new Promise(resolve => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => resolve();
            tx.onabort = () => resolve();
        });
    } catch (e) {
        console.warn("clearModDraft failed:", e);
    }
    persistedDraftImages = new Map();
}

function startModDraftAutosave() {
    stopModDraftAutosave();
    // 5s interval is a cheap safety net: meta is tiny and image writes are incremental, so an
    // idle tick costs almost nothing, and the worst-case loss window is a few seconds.
    modDraftAutosaveTimer = setInterval(saveModDraft, 5000);
    // Also save immediately so a draft exists the instant a workspace is opened.
    saveModDraft();
}

// Begin autosaving a brand-new or freshly-imported workspace. This REPLACES any previous
// draft, so clear the store first — otherwise leftover image records from an old draft would
// be loaded alongside this one on the next restore. (The restore path must NOT call this; it's
// reading the existing draft.) Clearing is awaited before the first save so they can't race.
async function beginFreshModDraft() {
    await clearModDraft(); // also resets persistedDraftImages
    startModDraftAutosave();
}

function stopModDraftAutosave() {
    if (modDraftAutosaveTimer) {
        clearInterval(modDraftAutosaveTimer);
        modDraftAutosaveTimer = null;
    }
}

// Offer to restore a saved draft when the modder opens the modding section without an active
// workspace. Fire-and-forget; guarded so it only prompts once per session.
async function maybeOfferModDraftRestore() {
    if (modDraftRestoreOffered) return;
    if (storageArray && storageArray.modName) return; // already editing something
    const meta = await getModDraftMeta();
    if (!meta) return;
    modDraftRestoreOffered = true;

    const when = meta.savedAt ? new Date(meta.savedAt).toLocaleString() : "an earlier session";
    const restore = confirm(
        `You have an unsaved mod draft "${meta.modName}" from ${when}.\n\n` +
        `Restore it and keep editing?\n\n` +
        `(Cancel leaves the draft saved — it'll be offered again next time.)`
    );
    if (!restore) return;

    const ok = await loadModDraftIntoWorkspace();
    if (ok) {
        debugMode = true;
        startModDraftAutosave();
        updateMenu();
        generateModdingOverview();
    } else {
        alert("Sorry — that draft couldn't be restored (the saved data may be incomplete).");
    }
}

async function checkInstalledMods() {

    const globalModlist = getGlobalModlist();

    // Check the global list instead of the save data
    if (!globalModlist || !globalModlist.length) return [];

    const db = await openModDB();

    // Names of mods we can't restore because their saved zip is gone too — returned to
    // the caller so the player can be told their data was cleared.
    const missing = [];

    for (const mod of globalModlist) {

        const modFile = await new Promise((resolve, reject) => {
            const tx = db.transaction("mods", "readonly");
            const store = tx.objectStore("mods");
            const req = store.get(mod.name);

            req.onsuccess = () => resolve(req.result ? req.result.fileData : null);
            req.onerror = () => reject(req.error);
        });

        if (modFile) {
            await loadModZip(modFile);
        } else {
            console.warn("Missing mod:", mod.name);
            missing.push(mod.name);
        }
    }

    return missing;
}

// A previously-installed mod's data was wiped by the browser (eviction / privacy
// clearing) while its modlist entry survived. Tell the player and drop the dead entries
// so we don't show broken cards or re-alert every boot. (If the WHOLE origin box is
// evicted, the modlist is gone too and there's nothing left to detect — this catches the
// common partial case, e.g. Safari clearing IndexedDB but keeping localStorage.)
function notifyModsCleared(names) {
    if (!names || !names.length) return;

    console.error("⚠️ Mod data was cleared by the browser; re-import needed:", names.join(", "));

    // Remove the ghost entries so the list stays accurate and we don't nag next boot.
    const remaining = getGlobalModlist().filter(m => !names.includes(m.name));
    saveGlobalModlist(remaining);

    const plural = names.length > 1;
    alert(
        `Your browser cleared the saved data for the following mod${plural ? "s" : ""}:\n\n` +
        `  • ${names.join("\n  • ")}\n\n` +
        `This usually happens when device storage runs low, or when a site hasn't been ` +
        `opened in a while (common on mobile Safari). Please re-import ${plural ? "them" : "it"} ` +
        `to restore the mod content.`
    );
}

// The save remembers which mods it was played with (data.player.modsUsed, stamped by
// loadModZip). Mods live in per-folder browser storage while saves travel — .noodle
// files, or a freshly downloaded game folder — and core content references mod-only art,
// so a save can arrive somewhere its mods don't exist and everything LOOKS like an image
// bug. Called after boot (index.js) and after importing a save file (savedata.js).
// Only warns about saves stamped after this feature shipped; older saves stay silent.
function warnAboutMissingMods() {
    try {
        if (typeof data === "undefined" || !data || !data.player) return;
        const used = Array.isArray(data.player.modsUsed) ? data.player.modsUsed : [];
        if (!used.length) return;
        const installedNames = new Set(getGlobalModlist().map(m => m.name));
        const missing = used.filter(n => !installedNames.has(n));
        if (!missing.length) return;
        const plural = missing.length > 1;
        console.error("⚠️ This save was played with mod(s) that aren't installed here:", missing.join(", "));
        alert(
            `This save file was played with the following mod${plural ? "s" : ""}, which ${plural ? "aren't" : "isn't"} installed in this copy of the game:\n\n` +
            `  • ${missing.join("\n  • ")}\n\n` +
            `Images and content from ${plural ? "these mods" : "this mod"} will show as broken until you re-import the mod .zip.\n\n` +
            `(Browsers store mods per game folder — a re-downloaded or moved game needs its mods imported again.)`
        );
    } catch (e) {
        console.warn("Missing-mod check failed:", e);
    }
}

function extractModInfo(zip, zipFile) {

    let modName = null;
    const imagePaths = [];
    let thumbnail = null;
    var homeFolderName = "";

    zip.forEach((path, entry) => {

        if (entry.dir) return;

        const lower = path.toLowerCase();

        if (!modName && lower.endsWith(".js")) {
            modName = path.split("/").pop().replace(".js","");
            homeFolderName = path.split("/")[0];
        }

        if (lower.endsWith(".webp") || lower.endsWith(".png")) {

            imagePaths.push(path.replace(homeFolderName, ""));

            if (lower.endsWith("thumbnail.webp") || lower.endsWith("thumbnail.png")) {
                thumbnail = path;
            }
        }

    });

    // If no explicit thumbnail, use alphabetically first image
    if (!thumbnail && imagePaths.length) {

        imagePaths.sort((a, b) =>
            a.localeCompare(b, undefined, { sensitivity: "base" })
        );

        thumbnail = imagePaths[0];
    }
    // Mods can legitimately ship with no images (script-only). Guard the string ops
    // below so a null thumbnail doesn't throw and abort the whole load.
    if (!thumbnail) thumbnail = "none.webp";

    thumbnail = thumbnail.replace(homeFolderName+"/", "");
    thumbnail = thumbnail.replace("images/", "");
    thumbnail = thumbnail.replace("images-webp/", "");
    thumbnail = thumbnail.replace("images-png/", "");


    return {
        name: modName || "Unknown Mod",
        version: zipFile.name.replace(/.zip$/i, "").replace(/.webp$/i, "").replace(/_/g, " "),
        thumbnailPath: thumbnail.replace(/\.(webp|png)$/i, ""),
    };
}


//Mod Creation
var storageArray = {modName: "", authorName: "", modDesc: "", customItems: [], customCollectables: [], customCharacters: [], customLocations: [], customTravel: [], customCode: ``};
var targetCharactersList = [];
/*For reference:
newCustomCharacter = {index: "", fName: "", lName: "", color: "", outfit: "", emotion: "", trust: 0, encountered: false, author: "", gender: "", 
logbook: [], scenes: [], events: [], sales: [], pickups: [], mornings: [], trophies: []};
*/

function moddingShortcut(index) {
	document.getElementById('output').innerHTML = '';
    switch(index) {
        case "modding0": {
            writeHTML(`
                foxf sparkle You wanna make a mod?<br>I bet it would be super fun!
                foxm happy This new section allows people to create their own Syrup Town content.<br>This can range from new collectables like jiggies, to creating their own entire characters.
                foxf sleep And it's all handled in-game too.<br>Once you activate debug mode you move around town exactly like normal, adding new items, pickups, items for sale in the shop, even locations by walking around and placing them.
                foxm sleep And for characters, you create new encounters exactly the same way. Move to locations, create the encounters, set their requirements, and write dialogue all using a graphical interface.<br>Things like morning events can be created in your home, since that's where you sleep.<br>Though you'll be more limited on what you can do. since everything's done without writing code yourself.
                im misc/modding/modsIntro
                foxf While there are some placeholder images, it's best to think about generating your own images for your character so you can replace those as soon as possible.
                foxm sparkle And finally, just about everything about your custom characters, like their names, can be found in the logbook!<br>For everything else, little tutorial tooltips will pop up whenever you need them.
                t If you do decide to make a mod, consider posting about it in the Noodle Jacuzzi discord server in the #modding channel, or on the game's F95zone thread.
                trans modReturn; Back
            `);
            break;
        }
        case "moddingGuide": {
            writeHTML(`
                foxm happy Actually making content can be really overwhelming, so we'll break down the bare minimum for you step by step.
                special  1. Create your character
                foxf First, in the technology wing, you'll actually use the "Create a New Character" button. This will generate a character with a bunch of placeholder data.<br>You'll want to open that character's new logbook page to start replacing all of it.
                special 2. Edit your character
                im misc/modding/modsSprites-4
                foxm That red circle is where you click to replace your character's dialogue sprites. There's also a guide on those here in the technology wing.
                foxf sparkle Having lots of emotions is fun!
                foxm crying But don't feel like you need to put in all that extra work!
                special 3. Plan out your story
                foxm happy Once you have an actual character to work with, you should really make some kind of plan for your character. Here's a really easy basic one:
                im misc/modding/modGuide-1
                foxf happy A linear series of scenes, going from the introduction right into actual content.<br>But how will people actually trigger this content?
                special 4. Create encounters
                foxm Head to any location outside of the museum. There you can make encounters using a menu like this:
                im misc/modding/modGuide-2
                foxf Fill in any details you need. This will create an encounter tab for your player when all the requirements are met. They click it, and the scene plays out!
                special 5. Write scenes
                im misc/modding/modGuide-3
                foxm This can also be a bit overwhelming, but Syrup Town uses a series of simple commands to display things like speech and text.
                t Like this:<br>sp foxf; emotion sparkle; Wow! And dropdowns can help you write things too!
                foxf sparkle Wow! And dropdowns can help you write things too!
                special 6. Write events
                foxm Events are written in the exact same way as scenes. Using the 'event' command will allow you to create an event:
                im misc/modding/modGuide-4
                foxf happy They're just separated because events are repeatable.<br>Because you don't want the player repeating a trust-raising event over and over.
                foxm The whole system is still a work in progress, feel free to explore and use the tooltips to understand what's going on. And when you're ready:
                special 7. Create other things
                foxf Morning encounters, picking up items, all the ways that the player can enjoy syrup town's content, you'll be able to use those same tools without learning to code!
                foxm Different things can be created in different locations. You can only put up new items for sale inside the shop, or your character's house.
                t Note: Some features, like housing, may still be a work in progress as you read this.
                foxf And when you're finished...
                special 8. Export
                im misc/modding/modGuide-5
                foxm Export the mod, for the whole world to see!
                t If you feel lost or stuck, or notice any bugs with the modding system, please contact NoodleJacuzzi and help improve this guide, and the game as a whole!
                trans modReturn; Back
            `);
            break;
        }
        case "moddingSprites": {
            writeHTML(`
                foxm sleep Ah, dialogue sprites.
                foxf sparkle They're the best! They make us so expressive!
                foxm crying But they're also hard to make!
                foxf happy So really, don't feel the need to go crazy and add all of them in.<br>Your character can still be fun even if you only use a single sprite for all your character's dialogue.
                foxm happy But you will still want at least one. Nothing in Syrup Town will actually generate the images for you, check out the guide on image generation here in the technology wing.
                t (Or use some online service, or ask politely in the discord server.)
                foxm Once you actually have one:
                im misc/modding/modsSprites-1
                foxf If you want to make emotions, use img2img, or inpaint to make different expression images!
                im misc/modding/modsSprites-2
                foxm And once you've made them, erase the background:
                im misc/modding/modsSprites-3
                t (This was not done manually, but was done with a script called remBG)
                foxf Finally, open up the logbook, then click your character's sprite to go to the emotions list. Click here:
                im misc/modding/modsSprites-4
                foxm And then inside, replace the old expressions.
                trans modReturn; Back
            `);
            break;
        }
        case "modCreate": {
            writeHTML(`
				t Continuing enables debug mode, used for creating mods. You can keep playing normally — your saved game won't be affected by mod creation.
				t To proceed, please name your mod below. Please avoid using spaces in your mod's name and any images you upload due to compatibility issues with Neocities.
				t Mod Name: <input type='text' id='modName' value=''>
				t Author Name: <input type='text' id='authorName' value='`+data.player.name+`'>
				button Continue; nameMod()
				trans modReturn; Back
			`);
            break;
        }
        case "modImport": {
            writeHTML(`
                t Continuing enables debug mode, used for creating mods. You can keep playing normally — your saved game won't be affected by mod creation.
                t To proceed, please upload an in-progress mod below in the form of a .zip file.
                trans modReturn; Back
                eval modImportZone();
            `);
            break;
        }
        case "characterCreate": {
            writeHTML(`
                t IMPORTANT: Character creation is done entirely from scratch. Syrup Town does not give you the tools to generate portraits, create images, or even pick colors. While it will help you write scenes, it can't write them for you.
                foxm Check the technology wing's guides if you want to learn how to generate images.
                t The first step of creating your character is to enter their codename. This is the unique identifier for your character. 
                t It should be one word, uncapitalized, should be short since you'll be writing it a lot, and should not overlap with any other character's codenames. You can use the same name as your mod if you want.
                t New Character's Codename: <input type='text' id='codename' value='`+storageArray.modName+`'>
                button Continue; newCharacter()
                trans modReturn; Back
            `);
            break;
        }
        case "modExport": {
            writeHTML(`
                eval exportStart();
            `);
            break;
        }
    }
}

// Upload (or replace) the mod's thumbnail. Stored under the logical path "thumbnail" — exported to
// images-webp/thumbnail.webp, which extractModInfo recognises as the mod's icon.
function uploadModThumbnail() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.style.display = "none";
    document.body.appendChild(input);
    input.addEventListener("change", async () => {
        const file = input.files && input.files[0];
        input.remove();
        if (!file) return;
        try {
            await replaceImage("thumbnail", file);
        } catch (e) {
            return; // convertToWebP already alerted on failure
        }
        generateModdingOverview(); // refresh so the preview shows the new thumbnail
    });
    input.click();
}

function generateModdingOverview() {
    var moddingSpace = document.getElementById("moddingSpace");
    if (moddingSpace) moddingSpace.remove();
    moddingSpace = document.createElement("div");
    moddingSpace.id = "moddingSpace";
    moddingSpace.className = "moddingSpace";
    document.getElementById("output").appendChild(moddingSpace);

    if (!isModding()) {
        writeHTML(`
            t <span style="color:red;">Debug Status: Disabled</span>
            func moddingShortcut('modCreate'); Create a New Mod
            func moddingShortcut('modImport'); Import an Existing Mod
        `, "moddingSpace");
        // If a previous session left an autosaved draft, offer to restore it (async, once).
        maybeOfferModDraftRestore();
    }
    else {
        writeHTML(`
            t <span style="color:green;">Debug Status: Enabled</span>
            func displayStorageArray(); Total new images in memory: `+Object.keys(uploadedImages).length+`
        `, "moddingSpace");
        
        writeHTML(`
            func moddingShortcut('characterCreate'); Create a New Character
        `, "moddingSpace");

        // Mod thumbnail: stored at the logical path "thumbnail" so extractModInfo picks it up as the
        // mod's icon in the installed-mods list. Show a preview if one's been uploaded.
        writeHTML(`
            func uploadModThumbnail(); ${uploadedImageMap["thumbnail"] ? "Change" : "Upload"} mod thumbnail
        `, "moddingSpace");
        if (uploadedImageMap["thumbnail"]) {
            const thumbImg = document.createElement("img");
            thumbImg.src = cleanupImage("thumbnail");
            thumbImg.style.cssText = "max-width:120px; max-height:120px; display:block; margin:8px auto; border-radius:8px;";
            document.getElementById("moddingSpace").appendChild(thumbImg);
        }

        if (storageArray.customCharacters.length == 0) {
            writeHTML(`
                t No custom characters created.
            `, "moddingSpace");
        }
        
        for (var characterIndex = 0; characterIndex < storageArray.customCharacters.length; characterIndex++) {
            const char = storageArray.customCharacters[characterIndex];
            const stats = `Encounters: ${char.encounters.length}<br>Pickups: ${char.pickups.length}<br>Mornings: ${char.mornings.length}<br>Scenes: ${char.scenes.length}<br>Events: ${char.events.length}`;
            // Call writeSpeech directly (instead of writeHTML's `sp`) so we can pass the "editable"
            // special — that makes the character's portrait here click-to-replace its default
            // expression image, a quick alternative to the full expressions grid.
            writeSpeech(char.index, "", stats, "", "", "editable; target; moddingSpace");
        }
        
        writeHTML(`
            t Total new items: `+storageArray.customItems.length+`<br>Total new locations: `+storageArray.customLocations.length+`
            func moddingShortcut('modExport'); Export and finish your mod
        `, "moddingSpace");
    }
}

var tooltipArray = [
    {index: "start", text: `While in debug mode, this section of your screen will be replaced by a tooltip. Mouse over modding elements and buttons to see what you can do with it while in this mode.<br>To start with, you can create a character, or leave the museum to start creating items.`},
    {index: "museum", text: `The museum is a protected location, you can't add encounters or pickups here.`},
    {index: "newCharacter", text: `Now that you've created your first character, the next thing you should do is open the logbook and replace as many placeholder details as you can!<br>After that, leave the museum to start creating content for them.`},

    {index: "charLogbookFrame", text: `Edit character details here.`},
    {index: "logbookIndex", text: `The character's codename, a unique identifier. It's very dangerous to change it at this stage, it could cause bugs.`},
    {index: "logbookName", text: `The character's actual name. Call it in text whenever you need by writing the codename followed by a capital F.`},
    {index: "logbookColor", text: `The color associated with the character, I use hex codes here like #FFFFFF.`},
    {index: "logbookGender", text: `Reflects the character's gender value. Used to hide the character from vegetarians and carnivores.`},
    
    {index: "logbookSelect", text: `While creating a character, they'll be sorted at the top for convenience.`},
    {index: "logbookDesc", text: `Here you can edit character details by clicking on them, saving changes by clicking away. You can also click on the standing sprite on the right-hand side to view and replace expressions.`},
    {index: "playerSelf", text: `The character's portrait in their default expression.<br>Click on it to start replacing them.`},
    {index: "expressions", text: `The full list of expressions used by the character. Please keep in mind, you don't need to use them all! Click on an image to replace it.<br>Each expression is a separate file, generate whichever ones you need.`},
    {index: "setExpressionDefault", text: `The default expression is used for them standing in their house, and is the expression the character will return to between each scene.`},
    {index: "systemTrust", text: `A numerical score most often used as a requirement for encounters and scenes. Changed via raiseTrust and setTrust.<br>You can manually change it here to test things, when you export your mod this will be reset to 0.`},
    {index: "systemFlags", text: `A set of comma-separated flags most often used when a single trust variable isn't enough. Changed via addFlag and removeFlag.<br>Note that a character cannot have duplicate flags, and that this will be reset to empty when you export your mod.`},
    {index: "logbookNew", text: `Adds a new entry to the character's logbook with some placeholder details.<br>Note: For system reasons, the logbook will refresh every time you add or delete an entry.`},
    {index: "newRequirementSelect", text: `Adds a new true/false requirement to the above element. This will allow you to set a requirement for before they can see/trigger it.`},
    {index: "requirementName", text: `The type of the requirement, such as trust or flag. Click to toggle between whether the check must be true (?) or false (!) for the element to be seen. Some requirements are true only.`},
    {index: "requirementTarget", text: `The target of the requirement, click to turn it into a list selection of possible options.`},
    {index: "requirementValue", text: `The value of the requirement, click to turn it into an input box.`},
    {index: "requirementDelete", text: `Click here to delete this requirement.`},

];

function tooltip(index, forced) {
    if (forced) {
        document.getElementById('tooltip').innerHTML = index;
    }
    else {
        var newTooltip = tooltipArray.find(x => x.index == index);
        if (newTooltip && document.getElementById('tooltip')) {
            document.getElementById('tooltip').innerHTML = newTooltip.text;
        }
    }
}

function modReturn() {
	document.getElementById('output').innerHTML = '';
    fakeLocation('museumTechnology');
    generateMuseum("technology");
    listTopics("modding");
}

function nameMod() {
    if (!document.getElementById('modName') || document.getElementById('modName').value == "" || !document.getElementById('authorName') || document.getElementById('authorName').value == "") {
	    document.getElementById('output').innerHTML = '';
        alert("Failed, please enter both a mod name and an author.");
        writeScene("system", "modCreate");
    }
    else if (!/^[A-Za-z0-9_]+$/.test(document.getElementById('modName').value)) {
        // The mod name becomes a folder name, several file names, and part of generated item indexes,
        // so restrict it to a safe identifier (letters/numbers/underscore). Spaces/punctuation here
        // break zip paths and the import parser.
        document.getElementById('output').innerHTML = '';
        alert("Mod name must be one word — letters, numbers, and underscores only (no spaces or punctuation). It's used as a folder and file name.");
        writeScene("system", "modCreate");
    }
    else {
        storageArray.modName = document.getElementById('modName').value;
        storageArray.authorName = document.getElementById('authorName').value;
	    document.getElementById('output').innerHTML = '';
        debugMode = true;
        // Begin autosaving this new workspace so it survives a refresh/crash.
        beginFreshModDraft();
        writeHTML(`
              t Debug mode activated!
              t From here, you can either create your own character, or leave the museum and search for areas to make things.
              t Most of the things you might want to create, like encounters, or locations, require you to create a character first.<br>But some things, like creating new jiggies, you can just head to the collection room and make them right away.
              t Once you leave this screen, the tooltip window will appear. 
              trans modReturn; Back
        `)
        updateMenu();
        tooltip("start");
    }
}

function newCharacter() {
    if (!document.getElementById('codename') || document.getElementById('codename').value == "") {
        document.getElementById('output').innerHTML = '';
        alert("Failed, please enter a codename.");
        writeScene("system", "modCreate");
    }
    else if (!/^[a-z0-9_]+$/.test(document.getElementById('codename').value.toLowerCase())) {
        // The codename becomes the character's data index, its image folder, character file name, and
        // is baked into requirement sourcePaths — so it must be a safe identifier. Validate before we
        // build the character or register any placeholder paths for it.
        document.getElementById('output').innerHTML = '';
        alert("Codename must be one word — lowercase letters, numbers, and underscores only (no spaces or punctuation). It's used in file names and code.");
        writeScene("system", "modCreate");
    }
    else {
        document.getElementById('codename').value = document.getElementById('codename').value.toLowerCase();
        var newCustomCharacter = {
            index: document.getElementById('codename').value, 
            fName: "Placeholder", 
            lName: "", 
            color: "#FFFFFF", 
            outfit: "expressions", 
            outfitDefault: "expressions", 
            emotion: "happy", 
            emotionDefault: "happy", 
            trust: 0, 
            flags: "", 
            encountered: false, 
            author: storageArray.authorName, 
            gender: "", 
            
            logbook: [], 
            encounters: [], 
            scenes: [], 
            events: [], 
            sales: [], 
            pickups: [], 
            mornings: [], 
            trophies: [], 
            expressions: [], 
            house: {
                location: "",
            },
            walls: [], 
            repeatables: []
        };
        for (var expressionIndex = 0; expressionIndex < expressionArray.length; expressionIndex++) {
            newCustomCharacter.expressions.push(expressionArray[expressionIndex].index);
            placeholderImage(
                document.getElementById('codename').value+"/expressions/"+expressionArray[expressionIndex].index,
                "images-webp/placeholder/expressions/"+expressionArray[expressionIndex].index+".webp"
            );
        }
        var uniqueCodename = true;
        for (var indexChecker = 0; indexChecker < data.story.length; indexChecker++) {
            if (data.story[indexChecker].index == document.getElementById('codename').value) {
                uniqueCodename = false;
            }
        }
        for (var indexChecker = 0; indexChecker < storageArray.customCharacters.length; indexChecker++) {
            if (storageArray.customCharacters[indexChecker].index == document.getElementById('codename').value) {
                uniqueCodename = false;
            }
        }
        if (uniqueCodename == true) {
            var finalCodename = document.getElementById('codename').value;
            storageArray.customCharacters.push(newCustomCharacter);
            document.getElementById('output').innerHTML = '';
            writeHTML(`
                t New character created, codename: ${finalCodename}.
                t You can edit their data using the logbook, add encounters by walking around, and so on. Note that this modding engine is a work in progress, and this GUI cannot actually help you create images to use for your character's expressions and scenes.
                t (Placeholder images have been added to use as their dialogue expressions. The first thing you should probably do is change the placeholder data in the logbook!)
                trans modReturn; Begin content creation
                eval tooltip("newCharacter");
            `)
        }
        else {
            document.getElementById('output').innerHTML = '';
            alert("Failed, this codename is already in use.");
            writeScene("system", "modCreate");
        }
    }
}


function testModBuilderUI() {
    storageArray.modName = "CODENAME";
    document.getElementById("output").innerHTML = "";
    var codenameInput = document.createElement("input")
    codenameInput.type = "text"
    codenameInput.value = "CODENAME"
    codenameInput.id = "codenameInput";
    document.getElementById("output").appendChild(codenameInput);
    var imageInput = document.createElement("input")
    imageInput.type = "file"
    imageInput.id = "imageInput";
    document.getElementById("output").appendChild(imageInput);
}

function generateModbook() {
	document.getElementById('window').innerHTML += `
		<h1 id = "windowTitle" class = "windowTitle" onclick="deleteWindow()">MOD DETAILS</h1>
		<div id = "windowContents" style= "overflow-y:scroll;width:100%;height:75%;display:flex;flex-wrap:wrap;"></div>
	`;
	
	// Build everything with appendChild — doing innerHTML += after appending a textarea would
	// re-serialize the container and wipe the textarea's listeners/values.
	const contents = document.getElementById('windowContents');

	const nameLine = document.createElement("p");
	nameLine.className = "centeredText";
	nameLine.style.width = "100%";
	nameLine.textContent = "Mod Name: " + storageArray.modName;
	contents.appendChild(nameLine);

	const descLabel = document.createElement("p");
	descLabel.className = "centeredText";
	descLabel.style.width = "100%";
	descLabel.textContent = "Description (shown to players in the installed-mods list):";
	contents.appendChild(descLabel);

	const descWorkspace = document.createElement("textarea");
	descWorkspace.id = "modDescWorkspace";
	descWorkspace.value = storageArray.modDesc || "";
	descWorkspace.style = "min-width:100%;min-height:20%;";
	descWorkspace.dataset.tooltip = "A short description of your mod. Shown to players in the installed-mods list.";
	descWorkspace.oninput = () => { storageArray.modDesc = descWorkspace.value; };
	contents.appendChild(descWorkspace);

	const codeLabel = document.createElement("p");
	codeLabel.className = "centeredText";
	codeLabel.style.width = "100%";
	codeLabel.textContent = "Custom Code:";
	contents.appendChild(codeLabel);

	const customCodeWorkspace = document.createElement("textarea");
	customCodeWorkspace.oninput = () => {
        storageArray.customCode = customCodeWorkspace.value;
    };
    customCodeWorkspace.id = "customCodeWorkspace";
    customCodeWorkspace.value = storageArray.customCode;
    customCodeWorkspace.style = "min-width:100%;min-height:50%;";
    customCodeWorkspace.dataset.tooltip = "Write custom code that will execute when the mod loads.<br>You can define custom functions in here and call them with eval commands in scenes.<br>If you already know how to code though, you probably don't need this GUI.";
    contents.appendChild(customCodeWorkspace);
}

function printModLogbook(characterInStory) {
    console.info("printModLogbook()");
    var finalGender = "N/A";
    switch (characterInStory.gender) {
        case "male":
            finalGender = "Yes";
        break;
        case "female":
            finalGender = "No";
        break;
    }
    document.getElementById('logbookRight').innerHTML += `
        <div class=" lb_primary">
            <p class = "textName syrup">Codename: <span id="logbookIndex" data-target="`+characterInStory.index+`"
            >`+characterInStory.index+`</span></p>
            <p class = "textName syrup">Actual Name: <span id="logbookName" data-target="`+characterInStory.index+`"
            >`+characterInStory.fName+`</span></p>
            <p class = "textName syrup"> Color: <span id="logbookColor" 
                style="color: `+characterInStory.color+`;" data-target="`+characterInStory.index+`"
            >`+characterInStory.color+`</span></p>
            <p class = "textName syrup">Has a Penis?: <span id="logbookGender" data-target="`+characterInStory.index+`"
            >`+finalGender+`</p>
            <br>
            <p class = "centeredText" id="systemVariables">System Variables:</p>
            <p class = "textName syrup">Trust: <span id="systemTrust" data-target="`+characterInStory.index+`"
            >`+characterInStory.trust+`</p>
            <p class = "textName syrup">Flags: <span id="systemFlags" style ="background-color: black; display:inline-block;padding:15px;min-width: 100px;min-height: 20px;"
            data-target="`+characterInStory.index+`"
            >`+characterInStory.flags+`</p>
        </div>
    `;
    for (i = 0; i < characterInStory.logbook.length; i++) {
        var transformedEntry = cullRequirements(characterInStory.logbook[i].content);
        console.debug(transformedEntry);
        transformedEntry = decompileLogbook(transformedEntry); 
        console.debug(transformedEntry);

        var dialogueContainer = document.createElement("div");
        dialogueContainer.classList.add("dialogueContainer");
        dialogueContainer.classList.add("syrup");
        dialogueContainer.style.width = "initial";
        var nameContent = document.createElement("p");
        nameContent.classList.add("nameContent");
        nameContent.classList.add("syrup");
        var textContainer = document.createElement("div");
        textContainer.classList.add("textContainer");
        textContainer.classList.add("syrup");
        var textBorder = document.createElement("div");
        textBorder.classList.add("textBorder");
        textBorder.classList.add("syrup");
        var textContent = document.createElement("div");
        textContent.classList.add("textContent");
        textContent.classList.add("syrup");
                
        var dialogueTextDivorcer = document.createElement("div");
        dialogueTextDivorcer.style.width = "max-content";
        if (window.matchMedia('(orientation: portrait)').matches) {
            dialogueTextDivorcer.style.margin = "auto";
        }
        textContent.appendChild(dialogueTextDivorcer);
        
        dialogueContainer.style.borderColor = characterInStory.color;
        var dialogueName = document.createElement("p");
        dialogueName.id = "logbookEntryTitle";
        dialogueName.dataset.target = i;
        dialogueName.classList.add("textName");
        dialogueName.classList.add("syrup");
        dialogueName.style.color = characterInStory.color;
        dialogueTextDivorcer.appendChild(dialogueName);
                    
        var dialogueDivider = document.createElement("hr");
        dialogueDivider.classList.add("textDivider");
        dialogueDivider.classList.add("syrup");
        dialogueDivider.style.borderColor = characterInStory.color;
        dialogueTextDivorcer.appendChild(dialogueDivider);

        var dialogueSVG = document.createElement("div");
        dialogueSVG.innerHTML= `<svg style="height: 150px;	position: absolute;	width: 225px;	right: 15px;	top: 15px;	z-index: -1;" xmlns="http://www.w3.org/2000/svg" version="1.0" width="340.000000pt" height="224.000000pt" viewBox="0 0 340.000000 224.000000" preserveAspectRatio="xMidYMid meet">
            <g transform="translate(0.000000,224.000000) scale(0.100000,-0.100000)" fill="`+characterInStory.color+`" opacity="0.3" stroke="none">
                <path d="M2590 2180 c-91 -12 -142 -52 -171 -132 -26 -74 19 -181 170 -406 132 -196 142 -207 167 -194 18 9 37 17 97 41 211 84 365 169 424 233 28 30 53 89 53 125 -1 76 -101 185 -182 198 -50 9 -131 -3 -186 -26 -61 -27 -76 -24 -108 19 -51 67 -78 94 -119 117 -48 27 -85 34 -145 25z"/>
                <path d="M287 2126 c-15 -7 -43 -26 -61 -44 -81 -76 -106 -209 -86 -455 7 -87 16 -160 20 -162 4 -2 20 0 36 5 16 6 78 26 138 46 99 32 138 47 231 90 67 31 132 107 153 178 15 51 -1 126 -33 156 -24 22 -36 23 -180 8 -29 -3 -30 -1 -37 47 -11 83 -19 104 -48 125 -32 23 -90 25 -133 6z"/>
                <path d="M1871 942 c-67 -11 -115 -81 -145 -214 -7 -29 -23 -35 -54 -19 -68 34 -186 42 -228 15 -45 -30 -76 -98 -77 -168 -1 -107 37 -170 148 -245 69 -47 193 -111 215 -111 5 0 18 -4 28 -9 23 -12 60 -26 102 -41 19 -7 44 -16 55 -21 58 -24 111 -37 120 -28 10 10 30 81 75 274 37 161 48 295 30 370 -30 126 -153 216 -269 197z"/>
            </g>
        </svg>`
        var dialogueBackground = document.createElement("svg");
        dialogueBackground.src = "`+cleanupImage(`system/ui/dialogueHeartsBlack.svg";
        dialogueBackground.classList.add("dialogueBackground");
        dialogueBackground.classList.add("syrup");
        textContent.appendChild(dialogueBackground);

        if (window.matchMedia('(orientation: portrait)').matches) {
            var thumbnailContainer = document.createElement("div");
            thumbnailContainer.classList.add("thumbnailContainer");
            thumbnailContainer.classList.add("syrup");
            dialogueContainer.appendChild(thumbnailContainer);
        }

        var dialogueText = document.createElement("p");
        dialogueText.id = "logbookEntryText";
        dialogueText.dataset.target = i;
        textContent.appendChild(dialogueText);

        if (!window.matchMedia('(orientation: portrait)').matches) {
            var thumbnailContainer = document.createElement("div");
            thumbnailContainer.classList.add("thumbnailContainer");
            thumbnailContainer.classList.add("syrup");
            dialogueContainer.appendChild(thumbnailContainer);
        }
        
        var thumbnailBorder = document.createElement("div");
        thumbnailBorder.classList.add("thumbnailBorder");
        thumbnailBorder.classList.add("syrup");
        thumbnailContainer.appendChild(thumbnailBorder);

        var thumbnailImage = document.createElement("img");
        thumbnailImage.id = "thumbnailImage";
        thumbnailImage.dataset.target = i;
        thumbnailImage.dataset.path = transformedEntry.image;
        thumbnailImage.classList.add("thumbnailImage");
        thumbnailImage.classList.add("modEditableImage");
        thumbnailImage.classList.add("syrup");
        if (window.matchMedia('(orientation: portrait)').matches) {
            thumbnailImage.style.height = "auto";
            thumbnailImage.style.maxHeight = "none";
            thumbnailImage.style.aspectRatio = "1/1";
        }
        thumbnailBorder.appendChild(thumbnailImage);

        dialogueContainer.appendChild(textContainer);
            textContainer.appendChild(textBorder);
                textBorder.appendChild(textContent);
        if (window.matchMedia('(orientation: portrait)').matches) {
            document.getElementById('logbookLeft').style.width = "1%";
            document.getElementById('logbookLeft').style.visibility = "hidden";
            document.getElementById('logbookRight').style.width = "99%";
            thumbnailContainer.style.display = "flex";
            thumbnailContainer.style.position = "relative";
            thumbnailContainer.style.overflow = "hidden";
            thumbnailContainer.style.justifyContent = "center";
            dialogueContainer.style.display = "block";
        }

        dialogueName.innerHTML = replaceCodenames(transformedEntry.title);
        console.info(transformedEntry.content);
        dialogueText.innerHTML = replaceCodenames(transformedEntry.content);
        thumbnailImage.src = cleanupImage(transformedEntry.image);
        
        var targetIndex = storageArray.customCharacters.indexOf(characterInStory);

        transformedEntry.sourcePath = "storageArray.customCharacters[" + targetIndex + "].logbook[" + i + "].content";
        
        document.getElementById('logbookRight').appendChild(dialogueContainer);
        document.getElementById('logbookRight').innerHTML += `
            <div id="logbookRequirements`+i+`"></div>
        `;
        createRequirementBlock("logbookRequirements"+i, characterInStory.logbook[i].content, transformedEntry.sourcePath);

        document.getElementById('logbookRight').innerHTML += `
            <div id="logbookDelete" onclick="deleteLogbookEntry(`+i+`)" class="button">Delete This Entry</div>
        `;

    }
    document.getElementById('logbookRight').innerHTML += `
        <hr>
        <div id="logbookNew" class="button" onclick="generateLogbookEntry()">New Entry</div>
    `;
}

function decompileLogbook(entry) {
    //Function to transform logbook entry into edittable format
    //{index:"test", content:"im images/mayor/bath1Meat; title Cheery; The redheaded mayor of Syrup Town, Angelica is known to be patient and thoughtful, but she's also very much an overthinker.<br>In order to make sure there's at least one person keeping the town together while you're out fixing the birthrate issues, she's opted to abstain from lewdness.<br>She works out of her office on Pineapple Plaza, and most nights she sleeps there too!"},
    var transformedEntry = {title: "", image: "", content: ""};

    var imageSplit = entry.split(";");

    for (loopIndex = 0; loopIndex < imageSplit.length; loopIndex++) {
        //Remove any leading spaces
        imageSplit[loopIndex] = imageSplit[loopIndex].trim();
        switch (imageSplit[loopIndex].split(" ")[0]) {
            case "im":
                var contentToPrint = imageSplit[loopIndex].substring(3);
                
                //Cull any unnecesary parts of the image URL
                if (contentToPrint.includes("images/")) {
                    contentToPrint = contentToPrint.replace("images/", "");
                }
                if (contentToPrint.includes(".png")) {
                    contentToPrint = contentToPrint.replace(".png", "");
                }
                if (contentToPrint.includes(".webp")) {
                    contentToPrint = contentToPrint.replace(".webp", "");
                }

                transformedEntry.image = contentToPrint;
                break;
            case "title":
                var contentToPrint = imageSplit[loopIndex].substring(6);
                transformedEntry.title = replaceCodenames(contentToPrint);
                break;
            default:
                var contentToPrint = imageSplit[loopIndex];
                transformedEntry.content = replaceCodenames(contentToPrint);
                break;
        }
    }

    return transformedEntry;
}

function recompileLogbook(target, element, content) {
	var targetCharacter = storageArray.customCharacters.find(character => character.index == currentDesc);
	var transformedEntry = decompileLogbook(targetCharacter.logbook[target].content)
	switch (element) {
		case "logbookEntryTitle":
			transformedEntry.title = content
		break;
		case "logbookEntryText":
			transformedEntry.content = content
		break;
		case "thumbnailImage":
			transformedEntry.image = content
		break;
	}
	targetCharacter.logbook[target].content = `im `+transformedEntry.image+`; title `+transformedEntry.title+`; `+transformedEntry.content
    console.info(targetCharacter.logbook[target].content);
}

function deleteLogbookEntry(i) {
    var characterInStory = storageArray.customCharacters.find(character => character.index === currentDesc);
    characterInStory.logbook.splice(i, 1);
    switchDesc(currentDesc);
}

async function generateLogbookEntry() {
    var imageName = generateId();
    await placeholderImage(currentDesc+"/"+imageName, "images-webp/placeholder/thumbnail.webp");
    console.info(currentDesc+"/"+imageName);
    imageName = "im "+currentDesc+"/"+imageName;
    var characterInStory = storageArray.customCharacters.find(character => character.index === currentDesc);
    characterInStory.logbook.push({index: currentDesc, content: imageName+"; title New Entry; Lorem Ipsum Dosem"});
    switchDesc(currentDesc);
}

function generateExpressions() {
    var descType = "mod"
    tooltip("expressions");
    var currentChar = storageArray.customCharacters.find(x => x.index == currentDesc);
    console.info(currentChar);  
    if (!currentChar) {
        currentChar = data.story.find(x => x.index == currentDesc);
        var customExpressionList = [];
        for (var expressionIndex = 0; expressionIndex < expressionArray.length; expressionIndex++) {
            customExpressionList.push(expressionArray[expressionIndex].index);
        }
        descType = "core";
    }
    else {
        var customExpressionList = currentChar.expressions;
    }
    // Bulk-upload controls (mod characters only): match dropped files to expressions by filename,
    // so a modder can replace all ~35 at once instead of clicking each cell. Single-click replace
    // still works per cell below.
    var bulkControls = ``;
    if (descType == "mod") {
        bulkControls = `
            <p class="centeredText">Tip: name each image file after its expression (e.g. <b>happy.webp</b>, <b>angry.png</b>) and upload them all at once. Files that don't match an expression name are skipped.</p>
            <div class="button" onclick="bulkUploadExpressions(currentDesc)">Bulk Upload Expression Images</div>
        `;
    }
    document.getElementById('window').innerHTML += `
        <h1 class = "windowTitle" onclick="deleteWindow()">EXPRESSIONS</h1>
        <div id = "logbookGridHolder" class="gridHolder" style="width: 100%;">
            <p class = "centeredText"><b>Expressions</b></p>
            ${bulkControls}
            <div id="phoneSelectionMenu" class="phoneSelectionMenu">
            </div>
        </div>
    `;

    for (var expressionIndex = 0; expressionIndex < expressionArray.length; expressionIndex++) {
        // Use emotionDefault — the field the engine and export actually use. (The old expressionDefault
        // was a phantom that never got written to the exported character, so "Make Default" was lost.)
        if (currentChar.emotionDefault == expressionArray[expressionIndex].index) {
            var finalText = expressionArray[expressionIndex].index + " (Default)";
        }
        else {
            var finalText = expressionArray[expressionIndex].index;
        }
        var buttonsExtra = ``;
        if (descType == "mod") {
            buttonsExtra = `
                <div class = "button" id="setExpressionDefault" onclick="setExpressionDefault(currentDesc, '`+expressionArray[expressionIndex].index+`')">Make Default</div>
            `;
        }
        document.getElementById('phoneSelectionMenu').innerHTML += `
            <div>
                <div class = "textBox" style="border: 3px solid `+currentChar.color+`">
                    <img id = "expressionImage" class = "textThumb" 
                    style="filter: drop-shadow(5px 2px `+currentChar.color+`);" 
                    data-path = "`+currentChar.index+`/`+currentChar.outfit+`/`+expressionArray[expressionIndex].index+`" 
                    src = "`+cleanupImage(currentChar.index+"/"+currentChar.outfit+"/"+expressionArray[expressionIndex].index)+`">
                    <div class="textBoxContent">
                        <span style = "color: `+currentChar.color+`; font-size:var(--fs-xlarge, 2rem)" class = "selectionMenuText">`+finalText+`</span>
                    </div>
                </div>
                `+buttonsExtra+`
            </div>
        `
    }
}

function setExpressionDefault(target, expression) {
    var targetChar = storageArray.customCharacters.find(x => x.index == target);
    if (!targetChar) {
        targetChar = data.story.find(x => x.index == target);
    }
    if (targetChar) {
        // Write the field the engine + export use, so the choice actually persists into the mod.
        targetChar.emotionDefault = expression;
    }
    generateWindow("expressions");
}

// Bulk-assign expression images by filename. Each picked file's name (minus extension) is matched
// against the expression list — by canonical index OR any of its alts — and routed to the right
// slot, so the modder can replace all ~35 expressions in one go. Unmatched files are reported, not
// silently dropped.
function bulkUploadExpressions(characterIndex) {
    const character = storageArray.customCharacters.find(c => c.index === characterIndex)
        || data.story.find(c => c.index === characterIndex);
    if (!character) return;

    // name/alias (lowercased) -> canonical expression index
    const lookup = {};
    expressionArray.forEach(exp => {
        lookup[exp.index.toLowerCase()] = exp.index;
        (exp.alts || "").split(",").map(a => a.trim().toLowerCase()).filter(Boolean)
            .forEach(alt => { if (!lookup[alt]) lookup[alt] = exp.index; });
    });

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.style.display = "none";
    document.body.appendChild(input);

    input.addEventListener("change", async () => {
        const files = Array.from(input.files || []);
        input.remove();
        if (files.length === 0) return;

        const assigned = [];
        const skipped = [];
        for (const file of files) {
            const base = file.name.replace(/\.[^/.]+$/, "").trim().toLowerCase();
            const emotion = lookup[base];
            if (!emotion) { skipped.push(file.name); continue; }
            try {
                // Same path shape the single-click replace uses: <index>/<outfit>/<emotion>.
                await replaceImage(`${character.index}/${character.outfit}/${emotion}`, file);
                assigned.push(emotion);
            } catch (e) {
                skipped.push(file.name);
            }
        }

        let msg = `Assigned ${assigned.length} expression image${assigned.length === 1 ? "" : "s"}.`;
        if (skipped.length) {
            msg += `\n\n${skipped.length} file${skipped.length === 1 ? "" : "s"} didn't match an expression name and ${skipped.length === 1 ? "was" : "were"} skipped:\n` + skipped.join("\n");
        }
        alert(msg);
        generateWindow("expressions");
    });

    input.click();
}

var possibleRequirements = [
	{name: "trust", target: "char", type: "num", trueOnly: false, tooltip: "Checks if the character's trust score exactly matches a specified value."},
	{name: "trustMin", target: "char", type: "num", trueOnly: false, tooltip: "Checks if the character's trust score is greater than a specified value."},
	{name: "trustMax", target: "char", type: "num", trueOnly: false , tooltip: "Checks if the character's trust score is less than a specified value."},
	{name: "flag", target: "char", type: "string", trueOnly: false , tooltip: "Checks if the character has a flag of the specified name."},
	{name: "location", target: "location", type: "none", trueOnly: false, tooltip: "Checks if the player is in the specified location."},
	{name: "item", target: "", type: "string", trueOnly: false, tooltip: "Checks if the player has the specified item."},
	{name: "skill", target: "skill", type: "num", trueOnly: false, tooltip: "Checks if the player has the specified skill at least the specified level."},
	{name: "trophy", target: "", type: "string", trueOnly: true, tooltip: "Checks if the player has the specified trophy."},
	{name: "day", target: "", type: "num", trueOnly: true, tooltip: "Checks if the in-game date is equal to or after the specified day."},
	{name: "time", target: "time", type: "none", trueOnly: false, tooltip: "Checks if the in-game time is equal to the specified time."},
	{name: "money", target: "", type: "num", trueOnly: false, tooltip: "Checks if the player has the specified amount of money or more."},
	{name: "fetish", target: "fetish", type: "none", trueOnly: false , tooltip: "Checks if the player has the specified fetish activated."},
	{name: "gender", target: "gender", type: "none", trueOnly: false, tooltip: "Checks if the player is the specified gender. (If they have boobs or are flat, not genitals)."},
	{name: "gallery", target: "char", type: "string", trueOnly: false, tooltip: "Checks if the specified scene with a character has been unlocked."},
]

var possibleTargets = [
    {index: "char", list: []},
    {index: "location", list: []},
    {index: "time", list: []},
    {index: "fetish", list: []},
    {index: "skill", list: []},
    {index: "gender", list: []},
]

function buildPossibleRequirementsList(index) {
    // 1. Find the exact target group dynamically
    var targetGroup = possibleTargets.find(t => t.index === index);
    if (!targetGroup) return;

    // 2. CLEAR the list before rebuilding it to prevent array bloat!
    targetGroup.list = [];

    switch (index) {
        case "char":
            for (var characterIndex = 0; characterIndex < storageArray.customCharacters.length; characterIndex++) {
                var newRequirement = {index: storageArray.customCharacters[characterIndex].index, name: storageArray.customCharacters[characterIndex].fName};
                targetGroup.list.push(newRequirement);
            }
            targetGroup.list.push({index: "player", name: data.player.name});
            for (var characterIndex = 0; characterIndex < data.story.length; characterIndex++) {
                var newRequirement = {index: data.story[characterIndex].index, name: data.story[characterIndex].fName};
                targetGroup.list.push(newRequirement);
            }
        break;
        case "location":
            for (var locationIndex = 0; locationIndex < locationArray.length; locationIndex++) {
                var newRequirement = {index: locationArray[locationIndex].index, name: locationArray[locationIndex].name};
                targetGroup.list.push(newRequirement);
            }
            for (var locationIndex = 0; locationIndex < storageArray.customLocations.length; locationIndex++) {
                var newRequirement = {index: storageArray.customLocations[locationIndex].index, name: storageArray.customLocations[locationIndex].name};
                targetGroup.list.push(newRequirement);
            }
        break;
        case "time":
            var timeList = ["Morning", "Evening", "Night"];
            for (var timeIndex = 0; timeIndex < timeList.length; timeIndex++) {
                var newRequirement = {index: timeList[timeIndex], name: timeList[timeIndex]};
                targetGroup.list.push(newRequirement);
            }
        break;
        case "fetish":
            for (var toggleIndex = 0; toggleIndex < data.player.filters.length; toggleIndex++) {
                var newRequirement = {index: data.player.filters[toggleIndex].index};
                if (newRequirement.index != "mayor" && newRequirement.index != "carpenter" && newRequirement.index != "shopkeep") {
                    newRequirement.name = fetishFullNamesArray.find(x => x[0] == data.player.filters[toggleIndex].index);
                    newRequirement.name = newRequirement.name[1];
                    targetGroup.list.push(newRequirement);
                }
            }
        break;
        case "skill":
            for (var skillIndex = 0; skillIndex < data.player.skills.length; skillIndex++) {
                var newRequirement = {index: data.player.skills[skillIndex].index, name: data.player.skills[skillIndex].index};
                newRequirement.name = newRequirement.name[0].charAt(0).toUpperCase() + newRequirement.name[0].slice(1);
                targetGroup.list.push(newRequirement);
            }
        break;
        case "gender":
            var genderList = ["masc", "fem"];
            for (var genderIndex = 0; genderIndex < genderList.length; genderIndex++) {
                var newRequirement = {index: genderList[genderIndex], name: genderList[genderIndex]};
                targetGroup.list.push(newRequirement);
            }
        break;
    }
}

function decompileRequirements(reqsArray) {
    //Example input: ["?trustMin mayor 5;", "!trustMin mayor 5;"];
    //console.info(reqsArray);
    var requirements = [];
    for (requirementIndex = 0; requirementIndex < reqsArray.length; requirementIndex++) {
        requirements.push(decompileRequirement(reqsArray[requirementIndex]));
    }
    //console.info(requirements);
    return requirements;
}

function decompileRequirement(reqString) {
    //Example input: ?trustMin mayor 5;
    //console.info(reqString);
    reqString = reqString.substring(0, reqString.length-1);
    var mode = reqString[0]; 
    var command = reqString.slice(1).split(" ")[0];
    var actualCommand = possibleRequirements.find(x => x.name == command);
    if (!actualCommand) {
        console.info("Invalid requirement: " + reqString);
        return;
    }
    if (mode == "!" && actualCommand.trueOnly == true) {
        console.info("Invalid requirement: " + reqString);
        return;
    }
    var parts = reqString.slice(1).split(" ");
    if (actualCommand.target != "") {
        if (actualCommand.type != "none") { 
            var target = parts[1]+" ";
            var input = parts[2];
        }
        else {
            var target = parts[1];
            var input = "";
        }
    }
    else {
        var target = "";
        var input = parts[1];
    }
    //console.info({mode: mode, command: command, target: target, input: input});
    return {mode: mode, command: command, target: target, input: input};
}

function htmlToRequirements(element) {
    originalEntry = element.dataset.originalString;
    console.info("Original entry: " + originalEntry);
    originalEntry = cullRequirements(originalEntry);
    while (originalEntry[originalEntry.length-1] == " ") {
        originalEntry = originalEntry.slice(0, -1);
    }
    // Culling strips every recognized requirement, so for a requirements-only string the leftovers
    // should just be unrecognized-but-intact tokens ("?someCustomThing;"). Alias mangling used to
    // strand bare fragments here ("nancy;", "ming;") that re-saved and multiplied on every edit —
    // keep only tokens that still look like requirements so affected mods clean themselves up.
    originalEntry = originalEntry.split(";")
        .map(part => part.trim())
        .filter(part => part[0] == "?" || part[0] == "!")
        .join("; ");
    if (originalEntry != "") {
        originalEntry += ";";
    }

    function getSafeText(node) {
        if (!node) return "";
        if (node.tagName === "SELECT" || node.tagName === "INPUT") {
            return node.value;
        }
        return node.textContent;
    }

    var requirementsAsWritten = element.children;
    var requirementsConverted = "";
    for (requirementIndex = 0; requirementIndex < requirementsAsWritten.length; requirementIndex++) {
        if (requirementsAsWritten[requirementIndex].id != "newRequirement") {
            var newRequirement = "";
            var reqChildren = requirementsAsWritten[requirementIndex].children;
            
            // Extract the 4 parts safely
            var part0 = getSafeText(reqChildren[0]);
            var part1 = getSafeText(reqChildren[1]);
            var part2 = getSafeText(reqChildren[2]);
            var part3 = getSafeText(reqChildren[3]);

            if (part0 != "") {
                newRequirement += part0;
            }
            if (part1 != "") {
                if (part1[0] != " ") {
                    newRequirement += " ";
                }
                newRequirement += part1;
            }
            if (newRequirement[newRequirement.length-1] == " ") {
                newRequirement = newRequirement.slice(0, -1);
            }
            if (part2 != "") {
                if (part2[0] != " ") {
                    newRequirement += " ";
                }
                newRequirement += part2;
            }
            if (newRequirement[newRequirement.length-1] == " ") {
                newRequirement = newRequirement.slice(0, -1);
            }
            if (part3 != "") {
                newRequirement += part3;
            }
            if (newRequirement[newRequirement.length-1] == " ") {
                newRequirement = newRequirement.slice(0, -1);
            }
            if (newRequirement[newRequirement.length-1] != ";") {
                newRequirement += ";";
            }
            
            requirementsConverted += " " + newRequirement;
        }
    }
    while (requirementsConverted[0] == " " && requirementsConverted[1] == " ") {
        requirementsConverted = requirementsConverted.slice(1);
    }
    
    console.info("Requirements converted: " + requirementsConverted);
    return originalEntry + requirementsConverted;
}

// Assign a string to a computed "source path" that contains a .find(...) call (so a plain property
// walker like writeToPath can't resolve it). We still have to eval the path itself, but the VALUE is
// JSON.stringified so quotes/backslashes/newlines in a requirement string can't break the statement
// or inject code — the old `... = "${recompiled}"` form broke on any value containing a quote.
function assignRequirementsViaPath(sourcePath, value) {
    if (!sourcePath) return;
    eval(`${sourcePath} = ${JSON.stringify(value)};`);
}

function createRequirementBlock(containerId, str, sourcePath) {
    if (str[0] == " ") {
        str = str.slice(1);
    }
    console.debug(containerId);
    console.debug(document.getElementById(containerId));
    
    requirementsArray = checkRequirements(str, "extract")
    console.info(requirementsArray);
    requirementsArray = decompileRequirements(requirementsArray);
    console.info(requirementsArray);

    const container = document.getElementById(containerId);

    container.dataset.sourcePath = sourcePath;
    container.dataset.originalString = str;

    container.style.display = "grid";
    container.style.gridTemplateColumns = "repeat(auto-fill, minmax(200px, 1fr))";
    container.style.gap = "6px";

    var reqWrapper = document.createElement("div");
    reqWrapper.dataset.originalEntry = str;
    reqWrapper.dataset.sourcePath = sourcePath;
    reqWrapper.className = "requirement";
    reqWrapper.style.display = "flex";
    reqWrapper.style.gap = "4px";
    reqWrapper.style.padding = "4px";
    reqWrapper.style.borderRadius = "6px";
    reqWrapper.style.color = "white";
    reqWrapper.style.fontFamily = "playtime";
    reqWrapper.style.fontSize = "var(--fs-medium, 1.25rem)";
    reqWrapper.id = "newRequirement";

    var reqSelect = document.createElement("select");
    reqSelect.dataset.originalEntry = str;
    reqSelect.dataset.sourcePath = sourcePath;
    reqSelect.id = "newRequirementSelect";
    var blankOption = document.createElement("option");
    blankOption.value = "";
    blankOption.textContent = "Add a requirement";
    reqSelect.appendChild(blankOption);
    for (requirementIndex = 0; requirementIndex < possibleRequirements.length; requirementIndex++) {
        var newOption = document.createElement("option");
        newOption.value = possibleRequirements[requirementIndex].name;
        newOption.textContent = possibleRequirements[requirementIndex].name;
        newOption.dataset.tooltip = possibleRequirements[requirementIndex].tooltip;
        reqSelect.appendChild(newOption);
    }
    reqWrapper.appendChild(reqSelect);
    container.appendChild(reqWrapper);

    requirementsArray.forEach((req, index) => {
        const el = createRequirementElement(req, sourcePath, index, container);
        el.dataset.sourcePath = sourcePath;
        container.appendChild(el);
    });
}

function createRequirementElement(req, sourcePath, index, container) {
    console.info(req);

    var reqWrapper = document.createElement("div");
    reqWrapper.dataset.index = index;
    reqWrapper.className = "requirement";
    reqWrapper.style.display = "flex";
    reqWrapper.style.gap = "4px";
    reqWrapper.style.padding = "4px";
    reqWrapper.style.borderRadius = "6px";
    reqWrapper.style.color = "white";
    reqWrapper.style.fontFamily = "playtime";
    reqWrapper.style.fontSize = "var(--fs-medium, 1.25rem)";
    reqWrapper.style.background = req.mode === "?" ? "#2a4" : "#a44";

    // MODE / NAME
    const name = document.createElement("span");
    name.textContent = req.mode + req.command;
    name.id = "requirementName";
    name.style.cursor = "pointer";
    name.dataset.sourcePath = sourcePath;

    // TARGET
    const target = document.createElement("span");
    target.textContent = req.target;
    target.id = "requirementTarget";
    target.style.cursor = "pointer";
    target.dataset.sourcePath = sourcePath;

    // VALUE
    const value = document.createElement("span");
    value.textContent = req.input;
    value.id = "requirementValue";
    value.style.cursor = "pointer";
    value.dataset.sourcePath = sourcePath;

    // DELINEATOR
    const delineator = document.createElement("span");
    delineator.textContent = ";";

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.id = "requirementDelete";
    deleteButton.style.cursor = "pointer";
    deleteButton.style.marginLeft = "auto";
    deleteButton.dataset.sourcePath = sourcePath;

    reqWrapper.append(name, target, value, delineator, deleteButton);

    return reqWrapper;
}

function writeToPath(path, value) {
    const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
    let obj = window;

    for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
    }

    obj[keys[keys.length - 1]] = value;
}

var promptForImageName = false;
function initializeDocumentEvents() {
    document.addEventListener("change", async (e) => {
        if (e.target) {
            if (e.target.id === "codenameInput") {
                storageArray.modName = e.target.value;
            }
            if (e.target === hiddenImageInput) {
                const file = e.target.files[0];

                if (!file || !activeImagePath) {
                    hiddenImageInput.value = "";
                    activeImagePath = null;
                    promptForImageName = false;
                    return;
                }

                try {

                    if (promptForImageName) {
                        await replaceImageWithPromptFlow(activeImagePath, file);
                    } else {
                        await replaceImage(activeImagePath, file);
                    }

                    console.log("Updated image at:", activeImagePath);

                } finally {
                    // ALWAYS reset state
                    hiddenImageInput.value = "";
                    activeImagePath = null;
                    promptForImageName = false;
                }
            }

            if (e.target.id === "imageInput") {

                const file = e.target.files[0];
                if (!file) return;

                const webpBlob = await convertToWebP(file);

                const url = URL.createObjectURL(webpBlob);

                const baseName = file.name.replace(/\.(png|PNG|jpg|jpeg|webp)$/i, "");
                const finalName = baseName + ".webp";

                const defaultPath = "images/" + modName + "/" + finalName;

                uploadedImages[url] = {
                    file: webpBlob,
                    path: defaultPath
                };

                registerUploadedPath(defaultPath, url);

                writeBig(url, defaultPath);

                console.log("Converted + stored:", finalName);
            }
        }

    });
    document.addEventListener("click", (e) => {
        if (e.target) {
            if (e.target.dataset.tooltip) {
                tooltip(e.target.dataset.tooltip, true);
            }
            else if (e.target.id) {
                tooltip(e.target.id);
            }
            //console.info(e.target);
            switch (e.target.id) {
                case "modImagePath": {
                    const blobUrl = e.target.dataset.img;
                    const currentPath = uploadedImages[blobUrl].path;

                    const input = document.createElement("input");
                    input.value = currentPath;
                    input.dataset.img = blobUrl;

                    e.target.replaceWith(input);
                    input.focus();
                    break;
                }
                case "windowBackdrop": {
                    deleteWindow();
                    break;
                }
                case "logbookIndex": {
                    console.info(e.target.dataset.target); 
                    if (isModding(e.target.dataset.target)) {
                        const input = document.createElement("input");
                        input.value = e.target.innerHTML;
                        input.dataset.target = e.target.dataset.target;
                        input.id = e.target.id+"Modding";
                        e.target.replaceWith(input);
                        input.focus();
                    }
                    break;
                }
                case "logbookName": {
                    console.info(e.target.dataset.target);
                    if (isModding(e.target.dataset.target)) {
                        const input = document.createElement("input");
                        input.value = e.target.innerHTML;
                        input.dataset.target = e.target.dataset.target;
                        input.id = e.target.id+"Modding";
                        e.target.replaceWith(input);
                        input.focus();
                    }
                    break;
                }
                case "logbookColor": {
                    console.info(e.target.dataset.target);
                    if (isModding(e.target.dataset.target)) {
                        const input = document.createElement("input");
                        input.value = e.target.innerHTML;
                        input.dataset.target = e.target.dataset.target;
                        input.id = e.target.id+"Modding";
                        e.target.replaceWith(input);
                        input.focus();
                    }
                    break;
                }
                case "logbookGender": {
                    console.info(e.target.dataset.target);
                    if (isModding(e.target.dataset.target) && e.target.tagName === "SPAN") {
                        //Use dropdown list instead of text input
                        const input = document.createElement("select");
                        input.innerHTML = `<option value="">N/A</option><option value="male">Yes</option><option value="female">No</option>`;
                        input.value = e.target.innerHTML;
                        input.dataset.target = e.target.dataset.target;
                        input.id = e.target.id+"Modding";
                        e.target.replaceWith(input);
                        input.focus();
                    }
                    break;
                }
                case "systemTrust": {
                    console.info(e.target.dataset.target); 
                    if (isModding(e.target.dataset.target)) {
                        const input = document.createElement("input");
                        input.value = e.target.innerHTML;
                        input.dataset.target = e.target.dataset.target;
                        input.id = e.target.id+"Modding";
                        e.target.replaceWith(input);
                        input.focus();
                    }
                    break;
                }
                case "systemFlags": {
                    console.info(e.target.dataset.target); 
                    if (isModding(e.target.dataset.target)) {
                        const input = document.createElement("input");
                        input.value = e.target.innerHTML;
                        input.dataset.target = e.target.dataset.target;
                        input.id = e.target.id+"Modding";
                        e.target.replaceWith(input);
                        input.focus();
                    }
                    break;
                }
                case "playerSelf": {
                    console.info(e.target.dataset.target);
                    if (isModding(currentDesc) && activeWindow === "logbook") {
                        generateWindow("expressions");
                    }
                    break;
                }
                case "expressionImage": {
                    console.info(e.target.dataset.path);
                    if (isModding(currentDesc)) {
                        const path = e.target.dataset.path;

                        activeImagePath = path;
                        console.info(activeImagePath);

                        promptForImageName = false;
                        openHiddenImagePicker();
                    }
                    break;
                }
                case "logbookEntryTitle": {
                    console.info(e.target.dataset.target);
                    if (isModding(currentDesc)) {
                        const input = document.createElement("input");
                        input.value = e.target.innerHTML;
                        input.dataset.target = e.target.dataset.target;
                        input.dataset.classStorage = e.target.classList;
                        input.id = e.target.id+"Modding";
                        e.target.replaceWith(input);
                        input.focus();
                    }
                    break;
                }
                case "logbookEntryText": {
                    console.info(e.target.dataset.target);
                    if (isModding(currentDesc)) {
                        const input = document.createElement("textarea");
                        const rawHTML = e.target.innerHTML;
                        input.value = rawHTML.replace(/<br\s*\/?>/gi, "\n");

                        input.dataset.target = e.target.dataset.target;
                        input.dataset.classStorage = e.target.classList;
                        input.id = e.target.id+"Modding";

                        e.target.replaceWith(input);
                        input.focus();
                    }
                    break;
                }
                case "requirementName": {
                    cleanupRequirementTargetting();
                    const parent = e.target.parentElement;
                    const grandparent = parent?.parentElement;
                    if (e.target.innerHTML[0] == "?") {
                        var trueCommand = possibleRequirements.find(requirement => requirement.name == e.target.innerHTML.substring(1, e.target.innerHTML.length));
                        //console.info(trueOnly);
                        if (trueCommand.trueOnly == false) {
                            e.target.innerHTML = "!" + e.target.innerHTML.substring(1, e.target.innerHTML.length);
                            e.target.parentElement.style.backgroundColor = "#a44"
                            //console.info(e.target.innerHTML);
                        }
                    }
                    else {
                        e.target.innerHTML = "?" + e.target.innerHTML.substring(1, e.target.innerHTML.length);
                        e.target.parentElement.style.backgroundColor = "#2a4"
                    }
                    // reqWrapper.style.background = req.mode === "?" ? "#2a4" : "#a44";
                    var recompiled = htmlToRequirements(grandparent);
                    console.info(e.target.dataset.sourcePath)
                    assignRequirementsViaPath(e.target.dataset.sourcePath, recompiled);
                    break;
                }
                case "requirementTarget": {
                    
                    for (requirementListIndex = 0; requirementListIndex < possibleTargets.length; requirementListIndex++) {
                        buildPossibleRequirementsList(possibleTargets[requirementListIndex].index);
                    }
                    var legalTargetsList = [];
                    var trueCommand = possibleRequirements.find(requirement => requirement.name == e.target.parentElement.children[0].innerHTML.substring(1, e.target.parentElement.children[0].innerHTML.length));
                    if (trueCommand) {
                        var legalTargetsList = "";
                        var legalTargetsArray = possibleTargets.find(target => target.index == trueCommand.target);
                        var defaultTarget = legalTargetsArray.list[0].index;
                        for (var i = 0; i < legalTargetsArray.list.length; i++) {
                            legalTargetsList += `<option value="`+legalTargetsArray.list[i].index+`">`+legalTargetsArray.list[i].name+`</option>`;
                            if (e.target.innerHTML == legalTargetsArray.list[i].index) {
                                defaultTarget = legalTargetsArray.list[i].index;
                            }
                        }

                        const input = document.createElement("select");
                        input.innerHTML = legalTargetsList;
                        console.info(e.target.innerHTML+"!");

                        input.dataset.sourcePath = e.target.dataset.sourcePath;
                        input.id = e.target.id+"Modding";
                        input.className = "requirementTargetModding";
                        e.target.replaceWith(input);
                        input.focus();
                        input.value = defaultTarget;
                        console.info(input.value);
                    }
                    break;
                }
                case "requirementValue": {
                    console.info(e.target.dataset.sourcePath);
                    const input = document.createElement("input");
                    input.value = e.target.innerHTML;
                    input.dataset.sourcePath = e.target.dataset.sourcePath;
                    input.id = e.target.id+"Modding";
                    e.target.replaceWith(input);
                    input.focus();
                    break;
                }
                case "requirementDelete": {
                    const parent = e.target.parentElement;
                    const grandparent = parent?.parentElement;
                    e.target.parentElement.remove();
                    var recompiled = htmlToRequirements(grandparent);
                    console.info(e.target.dataset.sourcePath)
                    assignRequirementsViaPath(e.target.dataset.sourcePath, recompiled);
                    break;
                }
            }
            if (e.target.classList.contains("modEditableImage")) {
                console.info(e.target.dataset.target);
                const path = e.target.dataset.path;
                activeImagePath = path;
                promptForImageName = true;
                openHiddenImagePicker();
            }
        }
    });
    document.addEventListener("blur", (e) => {
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
            switch(e.target.id) {
                case "logbookIndexModding": {
                    const oldIndex = e.target.dataset.target;
                    const newIndex = e.target.value.trim();

                    // Helper: put a static span back (used for revert and for the committed result).
                    const placeIndexSpan = (value) => {
                        const p = document.createElement("span");
                        p.id = e.target.id.replace("Modding", "");
                        p.dataset.target = value;
                        p.textContent = value;
                        e.target.replaceWith(p);
                    };

                    // No change — just close the input.
                    if (newIndex === oldIndex || newIndex === "") {
                        placeIndexSpan(oldIndex);
                        break;
                    }

                    // Validate charset (matches the export/zip-path constraints).
                    if (!/^[A-Za-z0-9_]+$/.test(newIndex)) {
                        alert("Codename must be one word — letters, numbers, and underscores only. Rename cancelled.");
                        placeIndexSpan(oldIndex);
                        break;
                    }

                    // Reject collisions with other custom characters or core cast.
                    const taken = storageArray.customCharacters.some(c => c.index === newIndex)
                        || (typeof coreCharactersArray !== "undefined" && coreCharactersArray.some(c => c.index === newIndex));
                    if (taken) {
                        alert(`The codename "${newIndex}" is already in use. Rename cancelled.`);
                        placeIndexSpan(oldIndex);
                        break;
                    }

                    // Renaming cascades sprites/assets, but NOT dialogue text — make that explicit.
                    const proceed = confirm(
                        `Rename codename "${oldIndex}" → "${newIndex}"?\n\n` +
                        `Sprites and per-character image paths will be moved automatically.\n\n` +
                        `WARNING: any dialogue you've already written that names "${oldIndex}" ` +
                        `(e.g. "sp ${oldIndex};") will NOT be updated automatically — you'll need to fix those by hand.`
                    );
                    if (!proceed) {
                        placeIndexSpan(oldIndex);
                        break;
                    }

                    renameCustomCharacter(oldIndex, newIndex);
                    placeIndexSpan(newIndex);

                    // Re-render so every regenerated control (sourcePaths, etc.) targets the new index.
                    if (typeof switchDesc === "function") switchDesc(newIndex);
                    if (typeof renderModWorkspaces === "function") renderModWorkspaces();
                    break;
                }
                case "logbookNameModding": {
                    var targetCharacter = storageArray.customCharacters.find(character => character.index == e.target.dataset.target);
                    targetCharacter.fName = e.target.value;
                    const p = document.createElement("span");
                    p.id = e.target.id.replace("Modding", "");
                    p.dataset.target = e.target.dataset.target;
                    p.textContent = e.target.value;
                    e.target.replaceWith(p);
                    break;
                }
                case "logbookColorModding": {
                    var targetCharacter = storageArray.customCharacters.find(character => character.index == e.target.dataset.target);
                    targetCharacter.color = e.target.value;
                    const p = document.createElement("span");
                    p.id = e.target.id.replace("Modding", "");
                    p.dataset.target = e.target.dataset.target;
                    p.textContent = e.target.value;
                    p.style.color = e.target.value;
                    e.target.replaceWith(p);
                    break;
                }
                case "logbookGenderModding": {
                    var targetCharacter = storageArray.customCharacters.find(character => character.index == e.target.dataset.target);
                    targetCharacter.gender = e.target.value;
                    const p = document.createElement("span");
                    p.id = e.target.id.replace("Modding", "");
                    if (e.target.value === "male") {
                        p.textContent = "Yes";
                    }
                    else if (e.target.value === "female") {
                        p.textContent = "No";
                    }
                    else {
                        p.textContent = "N/A";
                    }
                    p.dataset.target = e.target.dataset.target;
                    e.target.replaceWith(p);
                    break;
                }
                case "systemTrustModding": {
                    var targetCharacter = storageArray.customCharacters.find(character => character.index == e.target.dataset.target);
                    //Only allow numbers
                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    if (e.target.value === "") e.target.value = 0;
                    targetCharacter.trust = e.target.value;
                    const p = document.createElement("span");
                    p.id = e.target.id.replace("Modding", "");
                    p.textContent = e.target.value;
                    p.dataset.target = e.target.dataset.target;
                    e.target.replaceWith(p);
                    break;
                }
                case "systemFlagsModding": {
                    var targetCharacter = storageArray.customCharacters.find(character => character.index == e.target.dataset.target);
                    targetCharacter.flags = e.target.value;
                    const p = document.createElement("span");
                    p.style.backgroundColor = "black";
                    p.style.display = "inline-block";
                    p.style.padding = "15px";
                    p.style.minWidth = "100px";
                    p.style.minHeight = "20px";
                    p.id = e.target.id.replace("Modding", "");
                    p.textContent = e.target.value;
                    p.dataset.target = e.target.dataset.target;
                    e.target.replaceWith(p);
                    break;
                }
                case "logbookEntryTitleModding": {
                    recompileLogbook(e.target.dataset.target, e.target.id, e.target.value);
                    const p = document.createElement("p");
                    p.id = e.target.id.replace("Modding", "");
                    p.dataset.target = e.target.dataset.target;
                    p.classList = e.target.dataset.classStorage;
                    p.textContent = e.target.value;
                    e.target.replaceWith(p);
                    break;
                }
                case "logbookEntryTextModding": {
                    console.info(e.target.value);
                    const value = e.target.value;

                    // Convert newline → <br> for display/storage
                    const htmlValue = value.replace(/\n/g, "<br>");

                    recompileLogbook(
                        e.target.dataset.target,
                        e.target.id.replace("Modding", ""),
                        htmlValue
                    );

                    const p = document.createElement("p");
                    p.id = e.target.id.replace("Modding", "");
                    p.dataset.target = e.target.dataset.target;
                    p.classList = e.target.dataset.classStorage;

                    // IMPORTANT: use innerHTML here, not textContent
                    p.innerHTML = htmlValue;

                    e.target.replaceWith(p);
                    break;
                }
                case "requirementValueModding": {
                    cleanupRequirementTargetting();
                    const parent = e.target.parentElement;
                    const grandparent = parent?.parentElement;
                    const p = document.createElement("span");
                    p.id = e.target.id.replace("Modding", "");
                    p.dataset.sourcePath = e.target.dataset.sourcePath;
                    p.textContent = e.target.value;
                    e.target.replaceWith(p);
                    var recompiled = htmlToRequirements(grandparent);
                    console.info(e.target.dataset.sourcePath)
                    assignRequirementsViaPath(e.target.dataset.sourcePath, recompiled);
                    break;
                }
            }
        }
        
        if (e.target.id === "modImagePath" && e.target.tagName === "INPUT" && e.target.dataset.img) {

            const blobUrl = e.target.dataset.img;
            const newPath = e.target.value;

            // Remove old mapping
            const oldPath = uploadedImages[blobUrl].path;
            delete uploadedImageMap[oldPath.replace(/\.webp$/i, "")];

            // Update data
            uploadedImages[blobUrl].path = newPath;

            // Add new mapping
            uploadedImageMap[newPath.replace(/\.webp$/i, "")] = blobUrl;

            // Replace back with <p>
            const p = document.createElement("p");
            p.id = "modImagePath";
            p.className = "centeredText";
            p.dataset.img = blobUrl;
            p.dataset.path = newPath;
            p.textContent = newPath;

            e.target.replaceWith(p);
        }
        if (e.target.id === "codenameInput") {
            storageArray.modName = e.target.value;
        }

    }, true); // IMPORTANT: use capture phase

    document.addEventListener("change", (e) => {
        switch(e.target.id) {
            case "logbookGenderModding": {
                var targetCharacter = storageArray.customCharacters.find(
                    character => character.index == e.target.dataset.target
                );

                targetCharacter.gender = e.target.value;

                const p = document.createElement("span");
                p.id = e.target.id.replace("Modding", "");
                p.dataset.target = e.target.dataset.target;
                switch (e.target.value) {
                    case "male":
                        p.textContent = "Yes";
                        break;
                    case "female":
                        p.textContent = "No";
                        break;
                    default:
                        p.textContent = "N/A";
                        break;
                }

                e.target.replaceWith(p);
                break;
            }
            case "requirementTargetModding": {
                const parent = e.target.parentElement;
                const grandparent = parent?.parentElement;
                const p = document.createElement("span");
                p.id = e.target.id.replace("Modding", "");
                p.dataset.sourcePath = e.target.dataset.sourcePath;
                p.textContent = e.target.value+" ";
                e.target.replaceWith(p);
                var recompiled = htmlToRequirements(grandparent);
                console.info(e.target.dataset.sourcePath)
                assignRequirementsViaPath(e.target.dataset.sourcePath, recompiled);
                break;
            }
            case "newRequirementSelect": {
                if (e.target.value == "") {
                    return;
                }
                const parent = e.target.parentElement;
                const grandparent = parent?.parentElement;
                console.info("Before: "+grandparent.dataset.originalString);

                var reqType = e.target.value;
                console.info(reqType);
                var trueCommand = possibleRequirements.find(req => req.name == reqType);
                console.info(trueCommand);
                var fullRequirement = {
                    mode: "?", 
                    command: reqType, 
                    target: "", 
                    input: "0;"
                }
                if (trueCommand.target != "") {
                    console.info(possibleTargets.find(target => target.index == trueCommand.target))
                    fullRequirement.target = possibleTargets.find(target => target.index == trueCommand.target).list[0].index;
                }
                if (trueCommand.target == "location") {
                    console.info(data.player.location)
                    fullRequirement.target = data.player.location;
                }

                if (trueCommand.type == "none") {
                    fullRequirement.input = "";
                }
                else {
                    fullRequirement.target += " "
                    fullRequirement.input = "0";
                }

                grandparent.appendChild(createRequirementElement(fullRequirement, e.target.dataset.sourcePath));
                grandparent.dataset.originalString += " "+fullRequirement.mode+fullRequirement.command+" "+fullRequirement.target+fullRequirement.input+";";
                e.target.value = "";
                
                var recompiled = htmlToRequirements(grandparent);
                console.info("Updated string: "+grandparent.dataset.originalString);
                console.info(e.target.dataset.sourcePath)
                assignRequirementsViaPath(e.target.dataset.sourcePath, recompiled);
                break;
            }
        }
    });

    document.addEventListener("mouseover", (e) => {
        if (e.target) {
            if (e.target.dataset.tooltip) {
                tooltip(e.target.dataset.tooltip, true);
            }
            else if (e.target.id) {
                tooltip(e.target.id);
            }
        }
    });
    document.addEventListener("mousedown", (e) => {
        const suggestionBox = document.getElementById("syrup-suggestions-dropdown");
        if (!suggestionBox || suggestionBox.style.display === "none") return;

        // If the user didn't click inside the dropdown AND didn't click an active text input...
        if (!e.target.closest("#syrup-suggestions-dropdown") && !e.target.closest(".syrup-line-input")) {
            // Hide it
            suggestionBox.style.display = "none";
        }
    });
}
let activeImagePath = null;
const hiddenImageInput = document.createElement("input");
hiddenImageInput.type = "file";
hiddenImageInput.accept = "image/*";
hiddenImageInput.style.display = "none";
initializeDocumentEvents();

// The input lives inside #wrapper (appended at boot). If anything replaces wrapper's children
// (innerHTML rewrites), the original input is detached — the picker still opens, but its change
// event no longer bubbles to the document listener, so chosen files silently do nothing.
// Re-attach before every open so uploads survive that.
function openHiddenImagePicker() {
    if (!hiddenImageInput.isConnected) {
        const wrapperEl = document.getElementById("wrapper");
        if (wrapperEl) wrapperEl.appendChild(hiddenImageInput);
    }
    hiddenImageInput.click();
}

function cleanupRequirementTargetting() {
    document.querySelectorAll(".requirementTargetModding").forEach(e => {
        const p = document.createElement("span");
        p.id = e.id.replace("Modding", "");
        p.dataset.sourcePath = e.dataset.sourcePath;
        p.textContent = e.value+" ";
        e.replaceWith(p);
    });
}

function generateId() {
    return crypto.randomUUID();
}

// Rename a custom character's codename, cascading the data-loss-critical references so its sprites
// don't detach (and don't get re-flagged by the orphan purge, which builds expression paths from
// the CURRENT index). NOTE: dialogue text inside scenes/events that names the old codename
// (e.g. "sp oldIndex;") is NOT rewritten here — that's surfaced to the user as a warning.
function renameCustomCharacter(oldIndex, newIndex) {
    const character = storageArray.customCharacters.find(c => c.index === oldIndex);
    if (!character) return;

    const prefixOld = oldIndex + "/";
    const prefixNew = newIndex + "/";

    // Re-home every uploaded image stored under "<oldIndex>/..." (expression sprites + any
    // per-character assets) and update structured references that point at them.
    for (const blobUrl in uploadedImages) {
        const entry = uploadedImages[blobUrl];
        if (!entry || typeof entry.path !== "string" || !entry.path.startsWith(prefixOld)) continue;

        const oldPath = entry.path;
        const newPath = prefixNew + oldPath.slice(prefixOld.length);
        const oldClean = oldPath.replace(/\.webp$/i, "");
        const newClean = newPath.replace(/\.webp$/i, "");

        // Structured image props may be stored with or without the .webp suffix; cover both.
        syncImageMetadata(oldClean, newClean);
        syncImageMetadata(oldClean + ".webp", newClean + ".webp");

        // Move the blob map entry.
        entry.path = newPath;
        delete uploadedImageMap[oldClean];
        uploadedImageMap[newClean] = blobUrl;
    }

    // Update the character record. The debug build also keeps a logbook copy in data.story; update
    // it by old index so this works whether or not it's the same object reference.
    character.index = newIndex;
    const storyEntry = data.story.find(c => c.index === oldIndex);
    if (storyEntry && storyEntry !== character) storyEntry.index = newIndex;

    if (typeof currentDesc !== "undefined" && currentDesc === oldIndex) currentDesc = newIndex;
}

function isModding(character) {
    if (!storageArray.modName) return false;

    if (!character) {
        return true;
    }
    var charInStorage = storageArray.customCharacters.find(c => c.index == character);
    if (!charInStorage) {
        return false
    }
    else {
        return true;
    }
}

function setUploadedImage(path, fileOrBlob, existingBlobUrl = null) {

    const cleanPath = path.replace(/\.webp$/i, "");

    let blobUrl;

    // If replacing, reuse the same blob URL (important for UI stability)
    if (existingBlobUrl) {
        blobUrl = existingBlobUrl;

        // Clean old mapping
        const oldPath = uploadedImages[blobUrl].path;
        delete uploadedImageMap[oldPath.replace(/\.webp$/i, "")];
    } else {
        blobUrl = URL.createObjectURL(fileOrBlob);
    }

    uploadedImages[blobUrl] = {
        file: fileOrBlob,
        path: cleanPath
    };

    registerUploadedPath(cleanPath, blobUrl);

    return blobUrl;
}

async function placeholderImage(path, imageUrl) {
    // Reworked: no fetch, no blob. We just register this path as an unfilled placeholder; cleanupImage
    // resolves it to the inline SVG cross until a real image is uploaded. This is what makes empty
    // slots local-safe (no fetch) and orphan-free (no blob). `imageUrl` is now ignored but kept in the
    // signature so existing callers don't need changing. Returns the SVG so callers that assign the
    // result straight to an <img>.src still render the cross.
    markPlaceholderPath(path);
    return window.PLACEHOLDER_IMAGE_SVG;
}

async function replaceImage(path, file) {
    console.info("Replacing image at path:", path);

    const cleanKey = path.replace(/\.webp$/i, "");

    const oldBlobUrl = uploadedImageMap[cleanKey];

    if (!oldBlobUrl) {
        console.warn("No existing image at path:", path);
    }

    const webpBlob = await convertToWebP(file);

    // Create NEW blob URL
    const newBlobUrl = URL.createObjectURL(webpBlob);

    // Cleanup old mapping
    if (oldBlobUrl) {
        delete uploadedImageMap[cleanKey];
        delete uploadedImages[oldBlobUrl];
    }

    // Register new
    uploadedImages[newBlobUrl] = {
        file: webpBlob,
        path: path
    };

    registerUploadedPath(path, newBlobUrl, path);

    // Update DOM
    updateImagesUsingPath(path, newBlobUrl, path);

    URL.revokeObjectURL(oldBlobUrl);

    return newBlobUrl;
}

async function replaceImageWithPromptFlow(oldPath, file) {

    const folder = oldPath.substring(0, oldPath.lastIndexOf("/") + 1);
    const rawName = file.name.replace(/\.[^/.]+$/, "");

    const defaultPath = folder + rawName;

    const userPath = await promptWithFilenameSelected(defaultPath);

    if (!userPath) return; // cancel

    const newPath = userPath.replace(/\.webp$/i, "") + ".webp";

    await performImageRenameReplace(oldPath, newPath, file);
}

function promptWithFilenameSelected(defaultPath) {
    return new Promise((resolve) => {
        const overlay = document.createElement("div");
        overlay.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;

        const box = document.createElement("div");
        box.style.cssText = `
            background: #222;
            padding: 15px;
            border: 1px solid #5fe6ec;
            border-radius: 8px;
            color: white;
            min-width: 300px;
        `;

        const input = document.createElement("input");
        input.type = "text";
        input.value = defaultPath;
        input.style.width = "100%";

        // --- Select filename only ---
        const lastSlash = defaultPath.lastIndexOf("/") + 1;
        const lastDot = defaultPath.lastIndexOf(".");
        const end = lastDot > lastSlash ? lastDot : defaultPath.length;

        setTimeout(() => {
            input.focus();
            input.setSelectionRange(lastSlash, end);
        }, 0);

        const okBtn = document.createElement("button");
        okBtn.textContent = "OK";
        okBtn.onclick = () => {
            cleanup();
            resolve(input.value);
        };

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancel";
        cancelBtn.onclick = () => {
            cleanup();
            resolve(null);
        };

        function cleanup() {
            document.body.removeChild(overlay);
        }

        box.append("Enter new image path:", input, okBtn, cancelBtn);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    });
}

async function performImageRenameReplace(oldPath, newPath, file) {

    const oldKey = oldPath.replace(/\.webp$/i, "");
    const oldBlobUrl = uploadedImageMap[oldKey];

    const webpBlob = await convertToWebP(file);
    const newBlobUrl = URL.createObjectURL(webpBlob);

    // --- CASE 1: Existing modded image ---
    if (oldBlobUrl) {

        delete uploadedImageMap[oldKey];
        delete uploadedImages[oldBlobUrl];
        URL.revokeObjectURL(oldBlobUrl);

    } else {
        // --- CASE 2: Core asset override ---
        console.info("Creating new override for core asset:", oldPath);
    }

    // --- Register new ---
    uploadedImages[newBlobUrl] = {
        file: webpBlob,
        path: newPath
    };

    registerUploadedPath(newPath, newBlobUrl);

    // --- Update DOM ---
    updateImagesUsingPath(oldPath, newBlobUrl, newPath);
    syncImageMetadata(oldPath, newPath);
}

function updateImagesUsingPath(oldPath, newBlobUrl, newPath) {
    console.info("Updating images using path:", oldPath, "to:", newBlobUrl, "with new path:", newPath);

    const imgs = document.querySelectorAll(
        `.modEditableImage[data-path="${oldPath}"]`
    );

    imgs.forEach(img => {
        img.src = newBlobUrl;
        img.dataset.path = newPath;
        //Update relevant info based on replaced's ID
        if (img.id) {
            switch (img.id) {
                case "thumbnailImage":
                    if (img.dataset.target) {
                        recompileLogbook(img.dataset.target, img.id, newPath)
                    }
                break
            }
        }
    });

}

async function convertToWebP(file) {
    // Re-encodes any uploaded image to WebP at quality 0.9 (lossy — fine for our art, but a
    // round-trip on an already-webp file does lose a little). Fails LOUDLY rather than hanging or
    // silently producing an empty image, so callers abort instead of storing a broken asset.
    const url = URL.createObjectURL(file);
    try {
        const img = document.createElement("img");

        // Wait for decode — but reject (don't hang forever) if the file isn't a readable image.
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => reject(new Error("not a readable image file"));
            img.src = url;
        });

        if (!img.width || !img.height) {
            throw new Error("image has zero dimensions");
        }

        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d").drawImage(img, 0, 0);

        // toBlob hands back null when the browser can't encode WebP, or when the canvas exceeds
        // its size cap (very large uploads). Treat that as a hard failure.
        const blob = await new Promise(resolve =>
            canvas.toBlob(resolve, "image/webp", 0.9)
        );
        if (!blob) {
            throw new Error("couldn't encode to WebP (the image may be too large, or WebP export isn't supported in this browser)");
        }

        return blob;
    } catch (e) {
        console.error("convertToWebP failed:", e, file && file.name);
        alert(
            `Couldn't process image "${(file && file.name) || "(unknown)"}":\n${e.message}.\n\n` +
            `The image was NOT added. Try a different or smaller file.`
        );
        throw e;
    } finally {
        // Always release the object URL, even on the failure paths above.
        URL.revokeObjectURL(url);
    }
}

function registerUploadedPath(path, url) {

    const clean = path.replace(/\.webp$/i, "");

    uploadedImageMap[clean.replace("images/", "")] = url;

    // A real image now exists for this path, so it's no longer a placeholder. (This is the single
    // choke point for setUploadedImage / replaceImage / performImageRenameReplace.)
    clearPlaceholderPath(path);
}

// (Removed dead exportModZip — superseded by exportStart/exportFinish. It emitted a broken mod:
//  it called an undefined loadCharacter() and wrote empty placeholder scenes/items.)

//Mod Workspace & UI
function establishModWorkspace() {
    const root = document.getElementById("modWorkspace") || (() => {
        const el = document.createElement("div");
        el.id = "modWorkspace";
        document.getElementById("output").appendChild(el);
        return el;
    })();
}

var workspaceState = {}; 

function renderModWorkspaces() {
    lastActiveTab = null;
    for (var characterIndex = 0; characterIndex < storageArray.customCharacters.length; characterIndex++) {
        renderModWorkspace(storageArray.customCharacters[characterIndex].index);
    }

    // Janky code for maintaining link between created items (collectables) and actual collectable array entries.
    itemCollectablesMaintenance()
}

// Categories of item that are ALSO collectables (shown in the collection room).
const collectableCategoryList = ["jiggy", "tarot", "pocketmanz", "card", "magazine", "pogs"];

// Build a clean collectable record from a collectable-category item, per category — mirrors the
// engine's own collectablesCleanup() so what shows while editing matches what ships. Tagged
// _derivedFromItem so we know it's auto-generated (and must NOT be exported; the engine re-derives
// it from the item at load).
function deriveCollectableFromItem(item) {
    const c = {
        _derivedFromItem: item.index,
        index: item.index,
        category: item.category,
        image: item.image,
        name: item.name || item.index,
        requirements: item.requirements || `?item ${item.index};`,
        tags: item.tags || "",
    };
    if (item.desc) c.desc = item.desc;
    if (item.set) c.set = item.set;

    switch (item.category) {
        case "jiggy":
            c.pieces = item.pieces || 100;
            if (!c.set) c.set = "Misc";
            if (!c.desc) c.desc = "No description";
            break;
        case "pocketmanz":
            c.color = item.color || "#CCCCCC";
            if (!c.set) c.set = "Misc";
            c.rarity = item.rarity || "common";
            break;
        case "tarot":
            c.color = item.color || "#CCCCCC";
            break;
        // pogs / card / magazine: the base fields above are enough
    }
    return c;
}

// Keep the collection room's derived collectables in sync with collectable-category items. A jiggy
// can arrive as a plain item OR via a pickup/sale, so the source of truth is customItems; this
// surfaces them as collectables for display/testing without the modder re-entering them. Standalone
// collectables (created directly in the collection room) are left untouched and are the only ones
// exported as newCollectable — derived ones are skipped at export (the engine rebuilds them).
function itemCollectablesMaintenance() {
    // 1. Drop derived entries whose source item is gone or no longer a collectable category.
    storageArray.customCollectables = storageArray.customCollectables.filter(c => {
        if (!c._derivedFromItem) return true; // standalone — always keep
        const src = storageArray.customItems.find(i => i.index === c._derivedFromItem);
        return src && collectableCategoryList.includes(src.category);
    });

    // 2. Derive/refresh a collectable for each collectable-category item.
    for (const item of storageArray.customItems) {
        if (!collectableCategoryList.includes(item.category)) continue;

        const existing = storageArray.customCollectables.find(c => c.index === item.index);
        if (!existing) {
            storageArray.customCollectables.push(deriveCollectableFromItem(item));
        } else if (existing._derivedFromItem) {
            // Refresh from the item (its the source of truth). Don't touch a same-index STANDALONE
            // collectable — that's the modder's, leave it alone.
            Object.assign(existing, deriveCollectableFromItem(item));
        }
    }
}

// Deleting an item-type sale/pickup card leaves the custom item it created behind in customItems —
// and with no Items tab in the workspace, that item becomes unreachable. Worse, if it's a
// collectable category (jiggy etc), itemCollectablesMaintenance re-derives its museum entry forever,
// so "deleted" jiggies kept haunting the collection room. If nothing else in the mod references the
// item, offer to delete it along with the card.
function deleteOrphanedCustomItem(itemIndex) {
    if (!itemIndex) return;
    const customItem = storageArray.customItems.find(i => i.index === itemIndex);
    if (!customItem) return; // global/core item — nothing to clean up

    // Blunt but thorough reference check: any other card, scene, event, requirement string, or
    // custom code that mentions the index keeps the item. (The item's own auto-derived collectable
    // is excluded — it references the index by definition.)
    const otherContent = JSON.stringify([
        storageArray.customCharacters,
        storageArray.customCollectables.filter(c => c._derivedFromItem !== itemIndex),
        storageArray.customCode || ""
    ]);
    if (otherContent.includes(itemIndex)) return;

    if (!confirm(`This card created the custom item "${itemIndex}", and nothing else in your mod uses it.\n\nDelete the item too?\n\n(Keeping it leaves it in your mod — collectable items like jiggies will still appear in the collection room.)`)) return;

    const removedImage = customItem.image;
    storageArray.customItems.splice(storageArray.customItems.indexOf(customItem), 1);
    if (removedImage) releaseImageIfUnused(removedImage);
    // Drop the item's auto-derived museum entry now that its source is gone.
    itemCollectablesMaintenance();
}

function renderModWorkspace(characterIndex) {
    const root = document.getElementById("modWorkspace") || (() => {
        const el = document.createElement("div");
        el.id = "modWorkspace";
        document.getElementById("output").appendChild(el);
        return el;
    })();

    root.innerHTML = "";
	
    const character = storageArray.customCharacters.find(c => c.index === characterIndex);
    if (!character) return;

    const tabBar = document.createElement("div");
    tabBar.className = "syrup"; // Applying your global class
    tabBar.style.display = "flex";
    tabBar.style.marginBottom = "10px";
    tabBar.style.gap = "5px";

    const tabs = getAvailableTabs(characterIndex).filter(t => t.isAvailable);

    // Persist the last tab or default to first
    let activeTab = tabs.find(t => t.key === workspaceState._lastTab) 
                    ? workspaceState._lastTab 
                    : (tabs.length > 0 ? tabs[0].key : null);

    const content = document.createElement("div");

    function draw() {
        workspaceState._lastTab = activeTab;
        content.innerHTML = "";
        
        // Safety check: only render if we have a valid tab
        if (activeTab) {
            // renderTabGeneric already renders the sort/filter controls with the correct args.
            // The previous call here passed (tabKey, characterIndex) into a (tabKey, state,
            // characterIndex) signature, so `state` became the character-index string and
            // `characterIndex` was undefined — producing a SECOND, broken control bar whose
            // buttons called renderModWorkspace(undefined) and wiped the whole workspace.
            renderTabGeneric(characterIndex, content, activeTab);
        }

        // Update Button Styles
        Array.from(tabBar.children).forEach(btn => {
            const isActive = btn.dataset.key === activeTab;
            btn.style.background = isActive ? "rgba(50,30,0,0.6)" : "#222";
            btn.style.color = isActive ? "#FFFFFF" : "#FBEAB5";
            btn.style.border = isActive ? "1px solid #FBEAB5" : "1px solid #444";
        });
    }

    tabs.forEach(tab => {
        const btn = document.createElement("button");
        btn.textContent = tab.label; // RESTORED: This was missing!
        btn.dataset.key = tab.key;   // Needed for the styling loop
        btn.style.flex = "1";
        btn.style.padding = "10px";
        btn.style.borderRadius = "8px";
        btn.style.cursor = "pointer";
        btn.style.fontWeight = "bold";
        btn.onclick = () => { activeTab = tab.key; draw(); };
        tabBar.appendChild(btn);
    });

    root.append(tabBar, content);
    draw();
    updateNavMenuTest(characterIndex)
}

/*
Config rules/assumptions
assume format == "" if null
assume display requirements == "" if null
assume default == "" if null
assume onclick == "" if null
assume default == "" if null
assume origin == key if null
*/

const tabConfig = {
    encounters: {
        listPath: (character) => character.encounters,
        card: {
            overview: [
                { key: "index", format: "head", label: "Index", display: (item) => item.index, tooltip: "The unique index of this encounter, used to identify it in the game and to determine which scene it links to.<br>Must be unique among all encounters."},
                { label: "Type", key: "type", display: (item) => (item.type || "standard").charAt(0).toUpperCase() + (item.type || "standard").slice(1), tooltip: "The type of encounter this is.<br>Standard, which are displayed in tabs below the nav menu<br>Button, which display like location buttons in the nav menu<br>Walking, which trigger automatically when all requirements are met."},
                { key: "name", label: "Displayed Text", display: (item) => item.name, tooltip: "The text that will be displayed in the game when this encounter is triggered.<br>For standard encounters, this is the text following the blue arrow.<br>For buttons, this is the text of the button.<br>Unused for walking encounters."},
                { key: "requirements", label: "Requirements", display: (item) => summarizeRequirements(item.requirements), tooltip: "The requirements for the encounter to appear. By default, your location is added automatically.<br>You can delete it, though that would mean your encounter can happen anywhere!"},
                { key: "test", format: "switch", label: "", display: "Edit the attached scene", onClick: (item, char) => testScene(char.index, item.index), tooltip: "Click to enter scene-editing mode, where you can test the attached scene." },
            ],
            editor: [
                { key: "index", origin: "index", inputType: "string", label: "Index", default: (char) => generateGenericIndex(char.index, char.encounters, "Encounter"), tooltip: "The unique index of this encounter, used to identify it in the game and to determine which scene it links to.<br>Must be unique among all encounters."},
                { key: "type", origin: "type", inputType: "dropdown", label: "Encounter Type", options: ["standard", "button", "walking"], values: ["standard", "button", "walking"], default: "standard", tooltip: "The type of encounter this is.<br>Standard, which are displayed in tabs below the nav menu<br>Button, which display like location buttons in the nav menu<br>Walking, which trigger automatically when all requirements are met."},
                { key: "name", origin: "name", inputType: "string", label: "Displayed Text", displayCondition: (item) => item.type === 'standard' || item.type === 'button', tooltip: "The text displayed to the player in-game for this encounter." },
                { key: "altName", origin: "altName", inputType: "string", label: "Alt Speaker Name", displayCondition: (item) => item.type === 'standard', tooltip: "An alternate name to display for the speaker.<br>Overrides the default character name." },
                { key: "altImage", origin: "altImage", inputType: "imageOptional", label: "Alternate Image", displayCondition: (item) => item.type === 'standard', tooltip: "An alternate portrait or image to display during this encounter." },
                { key: "position", inputType: "position", x_origin: "top", x_label: "Top%", x_default: 0, y_origin: "left", y_label: "Left%", y_default: 0, displayCondition: (item) => item.type === 'button', tooltip: "The screen position for this encounter button.<br>Top and Left are percentages." },
                { key: "walkingNote", inputType: "note", display: "Triggers automatically when conditions are met.", displayCondition: (item) => item.type === 'walking'}
            ]
        }
    },

    pickups: {
        listPath: (character) => character.pickups,
        card: {
            overview: [
                { key: "index", format: "head", label: "Index", display: (item) => item.index, tooltip: "The unique identifier for this pickup. You really don't want to change it directly, unless you know what you're doing." },
                { key: "type1", label: "Type", display: () => "Item", displayCondition: (item) => item.event === false, tooltip: "This pickup will grant an item directly. The item given determined by the pickup's index." },
                { key: "type2", label: "Type", display: () => "Scene", displayCondition: (item) => item.event === true, tooltip: "This pickup will trigger a scene when clicked. The scene triggered is the one with the same index as the pickup." },
                { key: "requirements", label: "Requirements", display: (item) => summarizeRequirements(item.requirements), tooltip: "The conditions that must be met for this pickup to spawn.<br>Use location requirements to determine where it will be available." },
                { key: "test", format: "switch", label: "", display: "Edit the attached scene", displayCondition: (item) => item.event === true, onClick: (item, char) => testScene(char.index, item.index), tooltip: "Click to enter scene-editing mode for the scene connected to this pickup." },
                //{ key: "tes2", format: "switch", label: "", display: "Test the attached item", displayCondition: (item) => item.event === false, onClick: (item) => testInjectCustomItem(item.index), tooltip: "Click to test giving this item to you, right now."}
            ],
            editor: [
                { key: "index", origin: "index", inputType: "string", label: "Index", default: (char) => generateGenericIndex(char.index, char.pickups, "Pickup"), tooltip: "The unique identifier for this pickup. You really don't want to change it directly, unless you know what you're doing." },
                { key: "position", inputType: "position", x_origin: "top", x_label: "Top%", x_default: 0, y_origin: "left", y_label: "Left%", y_default: 0, tooltip: "The screen position for this pickup icon.<br>Top and Left are percentages, detmermining how far down and to the right the icon appears on the nav menu above." },
                { key: "type", origin: "event", inputType: "dropdown", label: "Pickup Type", options: ["scene", "item"], values: [true, false], default: true, tooltip: "Choose whether this pickup triggers a scene or gives an item." },
                
                // --- NEW SEARCH FIELD ---
                { 
                    key: "itemLookup", 
                    origin: "index", 
                    inputType: "search", 
                    label: "Lookup Item", 
                    displayCondition: (item) => item.event === false && !itemSearch(item.index),
                    tooltip: "Search the database for an existing item to link to this pickup, or create an entirely new one."
                },
                
                // --- UPDATED INSERT FIELD ---
                { 
                    key: "item", 
                    origin: "index", 
                    inputType: "itemInsert", 
                    label: "Linked Item", 
                    displayCondition: (item) => item.event === false && !!itemSearch(item.index),
                    tooltip: "The item linked to this pickup.<br>Players will receive this item."
                },
                
                { key: "image", inputType: "imageMandatory", label: "Pickup Icon:", tooltip: "The icon displayed on the screen for the player to click on. This is -not- the item's own image." },
                { key: "unique", inputType: "checkbox", label: "Unique?", tooltip: "If checked, this pickup can only be collected once. Otherwise it can reappear/be collected again whenever its requirements are met." }
            ]
        }
    },

    travelButton: {
        listPath: () => storageArray.customTravel,
        card: {
            overview: [
                { key: "index", format: "head", label: "Target Location", display: (item) => item.index, tooltip: "The destination this button sends the player to." },
                { key: "name", label: "Button Text", display: (item) => item.name, tooltip: "The text displayed on the nav menu button." },
                { key: "requirements", label: "Requirements", display: (item) => summarizeRequirements(item.requirements), tooltip: "The conditions for this button to appear.<br>This is used to determine the source location, so if you don't have ?location xxx; the button will probably break.<br>If your button isn't appearing, make sure you, the player, actually meet its requirements." },
                {key: "test",
                    label: "Test Transition",
                    format: "switch",
                    display: "Test location target",
                    onClick: (item, character) => {
                        testInjectCustomLocation(item, character);
                    },
                    tooltip: "Click to test this travel transition in the game engine. This does the same thing as the button which should appear in the nav menu above."
                }
            ],
            editor: [
                { key: "name", inputType: "string", label: "Button Text:", tooltip: "The text that will be displayed on the travel button in-game." },
                
                // --- FIXED LOCATION SEARCH FIELD ---
                { 
                    key: "locationLookup", 
                    origin: "index", 
                    inputType: "locationSearch", 
                    label: "Lookup Target Location", 
                    displayCondition: (item) => !locationFind(item.index),
                    tooltip: "Search for an existing location destination to link to this button, or create a new one."
                },

                // --- UPDATED LOCATION INSERT FIELD ---
                { 
                    key: "location", 
                    origin: "index", 
                    inputType: "locationInsert", 
                    label: "Linked Location", 
                    displayCondition: (item) => !!locationFind(item.index),
                    tooltip: "The destination location this button leads to."
                },

                { key: "position", inputType: "position", x_key: "top", x_label: "Top%", x_default: 0, y_key: "left", y_label: "Left%", y_default: 0, tooltip: "The screen position for this travel button.<br>Top and Left are percentages." }
            ]
        }
    },

    repeatables: {
        listPath: (character) => character.repeatables,
        card: {
            overview: [
                { key: "index", format: "head", label: "Index", display: (item) => item.index, tooltip: "The unique identifier for this repeatable scene. Determines both the scene and event's index.<br>Repeatables appear by default in the 'statusQuo' scene, which by default comes when the player talks to your character in their house.<br>Must include 'Repeat' to function properly." },
                { key: "requirements", label: "Requirements", display: (item) => summarizeRequirements(item.requirements), tooltip: "The conditions that must be met for this repeatable scene to be available. Otherwise, it'll display a locked image." },
                { key: "test", format: "switch", label: "", display: "Edit the attached scene", onClick: (item, char) => testScene(char.index, item.index), tooltip: "Click to enter scene-editing mode for this repeatable's first and repeat scenes, as well as the attached event." }
            ],
            editor: [
                { key: "index", inputType: "string", label: "Index", default: (char) => generateGenericIndex(char.index, char.encounters, "Repeat"), tooltip: "The unique index of this repeatable.<br>Must be unique among all repeatables.<br>Actually editting the event's details, like its image and name, is handled inside the scene editor." }
            ]
        }
    },

    mornings: {
        listPath: (character) => character.mornings,
        card: {
            overview: [
                { key: "index", format: "head", label: "Index", display: (item) => item.index, tooltip: "The unique identifier for this morning event." },
                { key: "requirements", label: "Requirements", display: (item) => summarizeRequirements(item.requirements), tooltip: "The conditions that must be met for this morning event to trigger upon waking up." },
                { key: "test", format: "switch", label: "", display: "Edit the attached scene", onClick: (item, char) => testScene(char.index, item.index), tooltip: "Click to enter scene-editing mode for the attached scene." }
            ],
            editor: [
                { key: "index", inputType: "string", label: "Index", default: (char) => generateGenericIndex(char.index, char.mornings, "Morning"), tooltip: "The unique index of this morning event.<br>Causes issues if this isn't unique." },
                { key: "priority", inputType: "string", label: "Priority", default: 99, tooltip: "Determines which morning event triggers if multiple have their requirements met.<br>Higher priority = higher chance. If you want to be absolutely sure it will trigger, leave it at 99 and it -should- always trigger on wakeup." },
                { key: "unique", inputType: "checkbox", label: "Unique?", tooltip: "If checked, this morning event will only ever happen once per save. Otherwise, it can trigger again after a delay." }
            ]
        }
    },

    sales: {
        listPath: (character) => character.sales,
        card: {
            overview: [
                { key: "index", format: "head", label: "Index", display: (item) => item.index, tooltip: "The unique identifier for this sale listing. Determines what scene is triggered or what item is given." },
                { key: "name", label: "Sale Name", display: (item) => item.name, tooltip: "The name of the sale item or scene.<br>This is not the item's name." },
                { key: "requirements", label: "Requirements", display: (item) => summarizeRequirements(item.requirements), tooltip: "The conditions for this item to appear in the shop." },
                { key: "value", label: "Price", display: (item) => item.value, tooltip: "How much this costs to purchase." },
                { key: "test1", format: "switch", label: "", display: "Edit the attached scene", displayCondition: (item) => item.event === true, onClick: (item, char) => testScene(char.index, item.index), tooltip: "Click to enter scene-editing mode for this sale." },
                //{ key: "test2", format: "switch", label: "", display: "Test adding the attached item", displayCondition: (item) => item.event === false, onClick: (item) => testInjectCustomItem(item.index), tooltip: "Click to test adding the atatched item to your inventory." }
            ],
            editor: [
                { key: "type", origin: "event", inputType: "dropdown", label: "Sale Type", options: ["scene", "item"], values: [true, false], default: true, tooltip: "Choose whether buying this triggers a scene or gives an item." },
                { key: "index1", origin: "index", inputType: "string", label: "Index", default: (char) => generateGenericIndex(char.index, char.sales, "Sale"), displayCondition: (item) => item.event === true, tooltip: "The unique index of this sale scene.<br>Must be unique." },
                { key: "image", inputType: "imageMandatory", label: "Sale Icon", displayCondition: (item) => item.event === true, tooltip: "The icon displayed in the shop's sale listing." },
                { key: "name", inputType: "string", label: "Name", default: "", tooltip: "The name displayed in the shop's sale listing.<br>For item sales, leave blank to use the item's own name." },
                { key: "desc", inputType: "string", label: "Description", default: "", tooltip: "The description displayed in the shop's sale listing.<br>For item sales, leave blank to use the item's own description." },
                { key: "value", inputType: "string", label: "Price", default: 0, tooltip: "The price the player must pay to buy this.<br>For item sales, leave at 0 to charge the standard shop markup (double the item's value)." },
                { 
                    key: "index2", 
                    origin: "index", 
                    inputType: "search", 
                    label: "Item", 
                    displayCondition: (item) => item.event === false && !itemSearch(item.index),
                    tooltip: "Search for an existing item to sell, or create a new one."
                },
                { 
                    key: "itemCreation", 
                    origin: "index", 
                    inputType: "itemInsert", 
                    displayCondition: (item) => item.event === false && !!itemSearch(item.index),
                    tooltip: "The item linked to this sale.<br>Players will receive this item upon purchase."
                }
            ]
        }
    },

    wall: {
        listPath: (character) => character.walls,
        card: {
            overview: [
                { key: "index", format: "head", label: "Index", display: (item) => item.index, tooltip: "The unique identifier for this wall interaction. Must include 'Wall' for it to appear in the shop.<br>Wall scenes are chosen randomly from among all scenes the player hasn't obtained yet. After that, it's a random chance among all repeats." },
                { key: "requirements", label: "Requirements", display: (item) => summarizeRequirements(item.requirements), tooltip: "The conditions for this wall scene to have a chance to appear." },
                { key: "test", format: "switch", label: "", display: "Edit the attached scene", onClick: (item, char) => testScene(char.index, item.index), tooltip: "Click to enter scene-editing mode for this wall scene, event, and repeat." }
            ],
            editor: [
                { key: "index", inputType: "string", label: "Index", default: (char) => generateGenericIndex(char.index, char.encounters, "Wall"), tooltip: "The unique identifier for this wall interaction. Must include 'Wall' for it to appear in the shop.<br>Wall scenes are chosen randomly from among all scenes the player hasn't obtained yet. After that, it's a random chance among all repeats." }
            ]
        }
    },

    collectables: {
        listPath: () => storageArray.customCollectables,
        card: {
            overview: [
                { key: "index", format: "head", label: "Index", display: (item) => item.index, tooltip: "The unique identifier for this collectable." },
                { key: "derivedNote", label: "Source", display: (item) => `Auto-generated from item "${item._derivedFromItem}" — edit that item (or its pickup/sale) to change this. Edits here won't stick.`, displayCondition: (item) => !!item._derivedFromItem },
                { key: "name", label: "Displayed Text", display: (item) => item.name, tooltip: "The name of the collectable." },
                { key: "requirements", label: "Requirements", display: (item) => summarizeRequirements(item.requirements), tooltip: "The conditions to obtain this collectable.<br>You can make it dependant on an item, though you're better off creating the item first in that case." },
                { key: "testJiggy", format: "switch", label: "", display: "Test this jiggy", displayCondition: (item) => item.category === "jiggy", onClick: (item) => getJiggyWithIt(item.image, item.pieces || 100, item.index), tooltip: "Assemble this jiggy right now to test how it plays. Uses the collectable's image and piece count." }
            ],
            editor: [
                { key: "index", inputType: "string", label: "Index", default: () => generateGenericIndex(storageArray.modName, storageArray.customCollectables, "Collectable"), tooltip: "The unique index of this collectable.<br>Must be unique." },
                { key: "name", inputType: "string", label: "Item Name:", tooltip: "The name of the collectable. Mostly for jiggies." },
                { key: "category", inputType: "dropdown", label: "Item Category", options: () => getItemCategoryList(), values: () => getItemCategoryList(), default: () => getItemCategoryList()[0], tooltip: "The inventory category this collectable belongs to." },
                { key: "image", inputType: "imageMandatory", label: "Item Image:", tooltip: "The icon for this collectable." },
                { key: "description", inputType: "string", label: "Item Description:", tooltip: "The flavor text or description for this collectable. Mainly for jiggies, though treasures, critters, etc will have them in the museum." },
                { key: "set", inputType: "string", label: "Item Set:", tooltip: "The collection set this item belongs to, if any. Only used for cards and jiggies." },
                { key: "pieces", inputType: "string", label: "Item Set Pieces", default: 0, tooltip: "How many pieces are required to complete the set. Only used for jiggies." }
            ]
        }
    },

    houseNull: {
        listPath: (character) => { 
            const home = character.encounters.find(e => e.index === "Home");
            return home ? [] : [{}]; // Only shows if no home exists
        },
        rules: { noDelete: true },
        card: {
            overview: [
                { key: "label", format: "head", label: "House" },
                { key: "status", label: "This character doesn't have a house yet!" },
                { key: "placeHere", format: "switch", label: "", display: "Place the character's house here", onClick: (item, char) => placeHouse(char.index) }
            ],
            editor: []
        }
    },

    houseOutside: {
        listPath: (character) => {
            const home = character.encounters.find(e => e.index === "Home");
            return home ? [home] : [];
        },
        rules: { onDelete: (item, char) => clearHouseData(char) },
        card: {
            overview: [
                { key: "label", format: "head", label: "House (Exterior)" },
                { key: "requirements", label: "Requirements", display: (item) => summarizeRequirements(item.requirements) },
                { key: "test", format: "switch", label: "", display: "Edit the attached scene", onClick: (item, char) => testHouse(char.index) }
            ],
            editor: [
                { key: "name", origin: "name", inputType: "string", label: "Displayed Text:" },
                { key: "external", origin: "altImage", inputType: "imageMandatory", label: "House Exterior Image:" },
                { key: "internal", origin: "image", inputType: "imageMandatory", label: "House Interior Image:" }
            ]
        }
    },

    houseInside: {
        listPath: (character) => {
            const home = character.encounters.find(e => e.index === "Home");
            return home ? [home] : [];
        },
        rules: { noDelete: true },
        card: {
            overview: [
                { key: "label", format: "head", label: "House (Interior)" },
                { key: "testQuo", format: "switch", display: "Test the character's Status Quo scene", onClick: (item, char) => testScene(char.index, 'statusQuo') },
                { key: "testEnter", format: "switch", display: "Write stuff for when you enter the house", displayCondition: (item) => item.onEntry === true, onClick: (item, char) => testScene(char.index, 'houseEnter') },
                { key: "testLeave", format: "switch", display: "Write stuff for when you leave the house", displayCondition: (item) => item.onExit === true, onClick: (item, char) => testScene(char.index, 'houseLeave') }
            ],
            editor: [
                { key: "positionExit", inputType: "position", x_origin: "top", x_label: "Exit Button Top%", x_default: 65, y_origin: "left", y_label: "Exit Button Left%", y_default: 15 },
                { key: "onEnter", origin: "onEntry", inputType: "checkbox", label: "Event on Entry?", checked: true, unchecked: false, default: false },
                { key: "onLeave", origin: "onExit", inputType: "checkbox", label: "Event on Exit?", checked: true, unchecked: false, default: false }
            ]
        }
    },

    items: {
        listPath: () => storageArray.customItems,
        card: {
            overview: [
                { key: "index", format: "head", label: "Index", display: (item) => item.index },
                { key: "name", label: "Item Name", display: (item) => item.name }
            ],
            editor: [
                { key: "index", origin: "index", inputType: "string", label: "Index", default: () => generateGenericIndex(storageArray.modName, storageArray.customItems, "Item") },
                { key: "name", origin: "name", inputType: "string", label: "Item Name:" },
                { key: "value", origin: "value", inputType: "string", label: "Item Price", default: 0 },
                { key: "category", origin: "category", inputType: "dropdown", label: "Item Category", options: () => getItemCategoryList(), values: () => getItemCategoryList(), default: "key" },
                { key: "image", origin: "image", inputType: "imageMandatory", label: "Item Image:" },
                { key: "description", origin: "desc", inputType: "string", label: "Item Description:" },
                { key: "set", origin: "set", inputType: "string", label: "Item Set:" },
                { key: "pieces", origin: "pieces", inputType: "string", label: "Item Set Pieces", default: 0 }
            ]
        }
    },

    locations: {
        listPath: () => storageArray.customLocations,
        card: {
            overview: [
                { key: "index", format: "head", label: "Index", display: (item) => item.index },
                { key: "name", label: "Location Name", display: (item) => item.name }
            ],
            editor: [
                { key: "index", inputType: "string", label: "Index", default: () => generateGenericIndex(storageArray.modName, storageArray.customLocations, "Location") },
                { key: "name", inputType: "string", label: "Location Name:" },
                { key: "image", inputType: "imageMandatory", label: "Location Image:" }
            ]
        }
    }
};

// Adjust the above tabConfig (saves time compared to making manual edits)
const tabFeatureBlacklist = {
    requirements: ["houseNull", "houseOutside", "houseInside", "items", "locations"],
    controls: ["houseNull", "houseOutside", "houseInside", "items", "locations"]
};

Object.keys(tabConfig).forEach(key => {
    const config = tabConfig[key];

    // Ensure key exists
    config.key = key;

    // Default: requirements enabled unless blacklisted
    config.hasRequirements = !tabFeatureBlacklist.requirements.includes(key);

    // Default: controls (sort/filter UI)
    config.hasControls = !tabFeatureBlacklist.controls.includes(key);

    // Default: no sorting/filtering logic yet (safe stub)
    if (!config.sorters) {
        config.sorters = {};
    }

    if (!config.filter) {
        config.filter = null;
    }
});

//Tab List Functions
function renderTabGeneric(characterIndex, container, tabKey) {
    const config = tabConfig[tabKey];
    const character = storageArray.customCharacters.find(c => c.index === characterIndex);
    const state = workspaceState[tabKey] ||= { sortMode: 'index' };

    if (!config) return;
    container.innerHTML = "";
    container.dataset.tabKey = tabKey; // Store for the helper functions

    // 1. Render Sorting/Filter Controls
    const controls = renderControls(tabKey, state, characterIndex);
	controls.style.display = "flex";
    controls.style.flexWrap = "wrap";
    controls.style.gap = "8px";
    controls.style.marginBottom = "10px";
	
	const makeBtn = (text, fn) => {
        const btn = document.createElement("button");
        btn.textContent = text;
        btn.onclick = fn;
        return btn;
    };
    
    // 2. Get and Process List (Filter/Sort)
    const rawList = config.listPath(character); // The actual storage array (e.g. character.scenes)
    let list = config.filter ? rawList.filter(config.filter) : [...rawList]; 
    list = applyFiltersAndSorts(list, tabKey, state, character);

    // 3. Render Cards
    const listContainer = document.createElement("div");
    listContainer.style.display = "flex";
    listContainer.style.flexDirection = "column";
    listContainer.style.gap = "12px";
    listContainer.style.padding = "10px";
    listContainer.style.background = "rgba(50,30,0,0.6)";
    listContainer.style.borderRadius = "10px";

    list.forEach((item, i) => {
        const card = createGenericCard(item, character, i, () => renderModWorkspace(characterIndex), config);
        listContainer.appendChild(card);
    });

    // 4. Add Button
    const addBtn = makeBtn("+ New Entry", () => {
        const newItem = createItemFromSchema(tabKey, character);
        console.info(newItem);
        config.listPath(character).push(newItem);
        renderModWorkspace(characterIndex);
    });
    addBtn.dataset.tooltip = "Adds a new entry to the list above. This is where you actually start making new content!"

    container.append(controls, listContainer, addBtn);
}

function getAvailableTabs(characterIndex) {
    const character = storageArray.customCharacters.find(c => c.index === characterIndex);
    const loc = data.player.location;
    const isProtected = ["townHall", "store", "collectionRoom", "squidsMakeInc"].includes(loc);
    const hasHouseFlag = checkFlag(character.index, "House");

    return [
        {
            label: "Encounters",
            key: "encounters",
            isAvailable: !isProtected && !hasHouseFlag
        },
        {
            label: "Pickups",
            key: "pickups",
            isAvailable: !isProtected && !hasHouseFlag
        },
        {
            label: "Locations",
            key: "travelButton",
            isAvailable: !isProtected && !hasHouseFlag
        },
        {
            label: "Repeatables",
            key: "repeatables",
            isAvailable: hasHouseFlag
        },
        {
            label: "Mornings",
            key: "mornings",
            isAvailable: loc === "playerHouse"
        },
        {
            label: "Sales",
            key: "sales",
            isAvailable: loc === "store" || hasHouseFlag
        },
        {
            label: "Wall Scene",
            key: "wall",
            isAvailable: loc === "squidsMakeInc"
        },
        {
            label: "Collectables",
            key: "collectables",
            isAvailable: loc === "collectionRoom"
        },
        /*
        {
            label: "House",
            key: "house",
            isAvailable: (
                // 1. No house placed yet
                (!character.houseLocation && !isProtected)

                // 2. At house location
                || (character.houseLocation && character.houseLocation === loc)

                // 3. Inside house
                || hasHouseFlag
            )
        }
        */
    ];
}
function applyFiltersAndSorts(list, tabKey, state, character) {
    let processedList = [...list];

    // --- 1. FILTERING ---
    if (state.filterLocation) {
        processedList = processedList.filter(item => {
            // Use your parseRequirements function
            // If no character is present (global tabs), we pass null
            const charIndex = character ? character.index : null;
            const parsed = parseRequirements(item.requirements, charIndex);
            
            // If the item has no location requirement, it stays visible
            // If it does, it must match the player's current location
            if (!parsed.location) return true;
            return parsed.location === data.player.location;
        });
    }

    // --- 2. SORTING ---
    if (state.sortMode === "index") {
        processedList.sort((a, b) => (a.index || "").localeCompare(b.index || ""));
    } 
    else if (state.sortMode === "trust" && character) {
        processedList.sort((a, b) => 
            getTrustSortValue(a, character.index) - getTrustSortValue(b, character.index)
        );
    }

    return processedList;
}

function renderControls(tabKey, state, characterIndex) {
    const container = document.createElement("div");
    container.className = "workspace-controls syrup";
    container.style.display = "flex";
    container.style.gap = "8px";
    container.style.marginBottom = "10px";

    const makeBtn = (text, active, onClick) => {
        const btn = document.createElement("button");
        btn.textContent = text;
        btn.className = active ? "btn-active" : "";
        btn.onclick = onClick;
        return btn;
    };

    // Index Sort is universal
    container.appendChild(makeBtn(
        "Sort: Index", 
        state.sortMode === "index", 
        () => { state.sortMode = "index"; renderModWorkspace(characterIndex); }
    ));

    // Trust Sort only makes sense if we are inside a character tab
    if (characterIndex) {
        container.appendChild(makeBtn(
            "Sort: Trust", 
            state.sortMode === "trust", 
            () => { state.sortMode = "trust"; renderModWorkspace(characterIndex); }
        ));
    }

    // Location Filter
    container.appendChild(makeBtn(
        state.filterLocation ? "Showing: Local Only" : "Filter: All Locations", 
        state.filterLocation, 
        () => { state.filterLocation = !state.filterLocation; renderModWorkspace(characterIndex); }
    ));

    return container;
}

function parseRequirements(reqString = "", characterIndex) {
    const result = {
        location: null,
        trust: null,
        trustMin: null,
        trustMax: null
    };

    if (!reqString) return result;

    // --- LOCATION ---
    const locationMatch = reqString.match(/[!?]location\s+([^\s;]+)/);
    if (locationMatch) result.location = locationMatch[1];

    // --- TRUST constraints ---
    const trustRegex = /([!?]trust(?:Min|Max)?)\s+(\w+)\s+(\d+)/g;
    let match;
    while ((match = trustRegex.exec(reqString)) !== null) {
        const type = match[1];          // ?trust, !trustMin, etc
        const codename = match[2];      // character index
        const value = parseInt(match[3], 10);

        if (codename !== characterIndex) continue; // skip other characters

        switch (type) {
            case "?trust":
                result.trust = value;
                break;
            case "!trust":
                result.trustNeg = value;
                break;
            case "?trustMin":
                result.trustMin = value;
                break;
            case "!trustMin":
                result.trustMinNeg = value;
                break;
            case "?trustMax":
                result.trustMax = value;
                break;
            case "!trustMax":
                result.trustMaxNeg = value;
                break;
        }
    }

    return result;
}

function getTrustSortValue(encounter, characterIndex) {
    const r = parseRequirements(encounter.requirements, characterIndex);

    console.info(encounter.requirements, r);

    // exact trust has highest priority
    if (r.trust !== null) return r.trust;
    if (r.trustMin !== null) return r.trustMin + 0.1;
    if (r.trustMax !== null) return r.trustMax + 0.2;

    // Negations → sort after corresponding positive conditions
    if (r.trustNeg !== undefined) return r.trustNeg + 0.3;
    if (r.trustMinNeg !== undefined) return r.trustMinNeg + 0.4;
    if (r.trustMaxNeg !== undefined) return r.trustMaxNeg + 0.5;

    return Infinity; // no relevant trust → last
}

//Tab Card Functions

function createGenericCard(item, character, itemIndex, refresh, config) {
    // Setup the Container
    const card = document.createElement("div");
    card.className = "dialogueContainer syrup";
    card.style.position = "relative"; // For the delete button
	
	// LIVE-EDIT MODEL: itemBuffer now aliases the real storageArray entry instead of being a clone,
	// so every field edit lands immediately (like the scene editor / requirement editor already do).
	// Nothing is silently lost when the workspace re-renders or the autosave fires mid-edit. The
	// leftover Object.assign(item, itemBuffer) in the save handler becomes a harmless no-op.
	// revertSnapshot is a pre-edit copy so the new Cancel button can still discard changes.
	let itemBuffer = item;
    let isEditing = !!item._isNew;
    item._isEditing = isEditing;
    delete item._isNew;
    // Snapshot AFTER clearing _isNew. If we snapshot before, a brand-new card's snapshot still
    // carries _isNew:true, and Cancel's Object.assign re-introduces it — so the next render re-opens
    // the editor (the "Cancel won't close until I switch tabs" jitter).
    let revertSnapshot = JSON.parse(JSON.stringify(item));

    const content = document.createElement("div");
    content.className = "textContent syrup";

    // --- SECTION: OVERVIEW (The Preview) ---
    const overviewSection = document.createElement("div");
    overviewSection.className = "card-overview";

    const updateOverview = () => {
        overviewSection.innerHTML = "";
        renderSchemaFields(item, character, overviewSection, config.key, 'overview');
        
        // HIDE SWITCHES IF EDITING (so the user doesn't click "Test" mid-edit)
        if (isEditing) {
            overviewSection.querySelectorAll('.switch').forEach(el => el.style.display = "none");
        }
    };
	
    updateOverview();

    // --- SECTION: EDITOR ---
    const editorSection = document.createElement("div");
    editorSection.className = "card-editor";
    editorSection.style.display = isEditing ? "block" : "none";
    editorSection.style.marginTop = "10px";

    const updateEditor = () => {
		editorSection.innerHTML = "";
		editorSection.__itemBuffer = itemBuffer;
		
		// Pass 'updateEditor' itself as the onUpdate callback
		renderSchemaFields(itemBuffer, character, editorSection, config.key, 'editor', updateEditor);

		// --- RE-INJECT REQUIREMENTS ---
		// (This remains visible/functional even after a dropdown change)
		if (config.hasRequirements) {
			const reqContainer = document.createElement("div");
			reqContainer.id = `req-${character.index}-${itemIndex}-${Math.floor(Math.random() * 1000)}`;
			reqContainer.className = "requirement-editor-wrapper";
			
			setTimeout(() => {
				if (typeof createRequirementBlock === "function") {
					const list = config.listPath(character);
					const realIndex = list.indexOf(item);
					// The requirement engine writes back by eval'ing this path, so it has to name the
					// ACTUAL storage list — config.key doesn't always match it (wall → walls;
					// collectables/travelButton live on storageArray, not the character).
					const listExprMap = {
						wall: `storageArray.customCharacters.find(c=>c.index==='${character.index}').walls`,
						collectables: `storageArray.customCollectables`,
						travelButton: `storageArray.customTravel`
					};
					const listExpr = listExprMap[config.key]
						|| `storageArray.customCharacters.find(c=>c.index==='${character.index}').${config.key}`;
					createRequirementBlock(
						reqContainer.id,
						itemBuffer.requirements || "",
						`${listExpr}[${realIndex}].requirements`
					);
				}
			}, 0);
			editorSection.appendChild(labeledField("Requirements", reqContainer));
		}

		// --- RE-INJECT SAVE BUTTON ---
		const saveBtn = document.createElement("button");
		saveBtn.textContent = "Save Changes";
		saveBtn.className = "save-button syrup";
		saveBtn.style.marginTop = "15px";
		saveBtn.onclick = () => {
            // A. Field Cleanup (e.g. Delete altImage if type is 'walking')
            // 1. Identify all keys that are CURRENTLY ACTIVE - We create a Set of keys that have at least one visible field using them
            const activeKeys = new Set(['index', 'id', 'origin']); // Permanent core protection

            config.card.editor.forEach(field => {
                // If the field has no condition, or the condition is met, it's "active"
                if (!field.displayCondition || field.displayCondition(itemBuffer)) {
                    const key = field.origin || field.key;
                    if (key) activeKeys.add(key);
                }
            });

            // 2. Perform the Cleanup based on the Active Set
            config.card.editor.forEach(field => {
                const key = field.origin || field.key;

                // Only proceed if this key is NOT in our "Keep-List"
                if (!activeKeys.has(key)) {
                    // Remember any image path so we can actually free its blob after deletion.
                    // (The old code called syncImageMetadata(...,null) which nulled references in
                    // OTHER shared entries and never freed the blob.)
                    const removedImagePath = (field.inputType?.includes("image") && item[key]) ? item[key] : null;

                    console.info(`Cleaning up unused field: ${key}`);
                    delete item[key];

                    if (removedImagePath) releaseImageIfUnused(removedImagePath);
                }
            });

            delete itemBuffer._isNew;
            //console.info(itemBuffer);

            // B. Handle requirements via the specialized engine
            const reqEl = editorSection.querySelector('.requirement-editor-wrapper');
            if (reqEl && typeof htmlToRequirements === "function") {
                itemBuffer.requirements = htmlToRequirements(reqEl);
            }

            // INDEX PRIORITIZATION
            // If we are in a tab that uses items (like Sales or Pickups)
            if (itemBuffer.event === false && itemBuffer.index) {
                // Ensure the card's index matches the selected item's index
                // This handles the "addItem(this.index)" engine requirement
                const attachedItem = itemSearch(itemBuffer.index);
                if (attachedItem) {
                    itemBuffer.index = attachedItem.data.index;
                }
            }

            // C. Commit buffer to real storage
            // 1. Find keys that exist in the real item but are now gone from the buffer
            Object.keys(item).forEach(key => {
                if (!(key in itemBuffer)) delete item[key];
            });

			// 2. Now perform the assign to update/add the remaining values
			Object.assign(item, itemBuffer);
            
            isEditing = false;
            item._isEditing = false;
            editorSection.style.display = "none";
            updateOverview();
            refresh(); // Re-render tab
        };
        editorSection.appendChild(saveBtn);

        // --- CANCEL / REVERT BUTTON ---
        // Edits are live now, so "discard" needs an explicit action: restore the pre-edit snapshot.
        // Uses onmousedown so it fires before any focused input's blur can write a fresh value back
        // into the item we're about to revert.
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancel";
        cancelBtn.className = "save-button syrup";
        cancelBtn.style.marginTop = "15px";
        cancelBtn.style.marginLeft = "10px";
        cancelBtn.style.opacity = "0.8";
        cancelBtn.dataset.tooltip = "Discard the changes you made since opening this editor.";
        cancelBtn.onmousedown = (e) => {
            e.preventDefault();
            // Drop keys added during the edit, then copy the snapshot back over the live item.
            Object.keys(item).forEach(k => { if (!(k in revertSnapshot)) delete item[k]; });
            Object.assign(item, revertSnapshot);
            isEditing = false;
            item._isEditing = false;
            editorSection.style.display = "none";
            refresh();
        };
        editorSection.appendChild(cancelBtn);
    };
	
	// --- TOGGLE BUTTON ---
    // Clearer label for encounters (distinguishes editing the encounter from editing its scene).
    const editLabel = config.key === "encounters" ? "Edit this encounter" : "Edit";
    const editToggleBtn = document.createElement("span");
    editToggleBtn.className = "switch";
    editToggleBtn.style.fontSize = "var(--fs-medium, 1.2em)";
    editToggleBtn.textContent = isEditing ? "Close Editor" : editLabel;
    editToggleBtn.style.cursor = "pointer";
    editToggleBtn.onclick = () => {
        isEditing = !isEditing;
        editorSection.style.display = isEditing ? "block" : "none";
        editToggleBtn.textContent = isEditing ? "Close Editor" : editLabel;
        editToggleBtn.style.display = "none";
        
        //Hide switches if editing
        overviewSection.querySelectorAll('.switch').forEach(el => el.style.display = "none");

        if (isEditing) updateEditor();
    };
    
    if (isEditing) {
        editToggleBtn.style.display = "none";
    }

    // --- DELETE BUTTON ---
    if (!config.rules?.noDelete) {
        const deleteBtn = document.createElement("div");
        deleteBtn.textContent = "✕";
        deleteBtn.className = "card-delete-btn";
        deleteBtn.style.cssText = "position:absolute; top:8px; right:12px; cursor:pointer; font-size:var(--fs-large, 1.5em); color:#5fe6ec; z-index:2;";

        deleteBtn.onclick = () => {
            const targetIndex = item.index;
            
            // 1. Check if the scene even exists
            const hasScene = character.scenes.some(s => s.index === targetIndex);
            let isOrphan = false;

            if (hasScene) {
                // 2. Count how many items across ALL tabs point to this index
                const triggerArrays = ['encounters', 'pickups', 'sales', 'mornings', 'walls', 'repeatables'];
                let totalPointers = 0;
                
                triggerArrays.forEach(arrName => {
                    if (character[arrName]) {
                        totalPointers += character[arrName].filter(x => x.index === targetIndex).length;
                    }
                });

                // If this is the ONLY item pointing to the scene, deleting it orphans the scene.
                if (totalPointers <= 1) {
                    isOrphan = true;
                }
            }

            // 3. Dynamic Warning Message
            let confirmMsg = `Are you sure you want to delete this ${config.key} entry?`;
            if (isOrphan) {
                confirmMsg = `WARNING: Deleting this will leave the attached scene "${targetIndex}" orphaned.\n\nDo you want to delete this entry AND the orphaned scene?`;
            }

            if (!confirm(confirmMsg)) return;
            
            // 4. Collect this card's image paths before we remove it from storage.
            const removedImagePaths = [];
            config.card.editor.forEach(f => {
                const k = f.origin || f.key;
                if (f.inputType?.includes("image") && item[k]) {
                    removedImagePaths.push(item[k]);
                }
            });

            // 5. Delete the card item from its respective list
            const list = config.listPath(character);
            const idx = list.indexOf(item);
            if (idx > -1) list.splice(idx, 1);

            // 5b. Free each image blob now that the entry is gone (skips any still referenced).
            removedImagePaths.forEach(p => releaseImageIfUnused(p));

            // 5c. Item-type sales/pickups may have created a custom item — offer to delete it too
            // if it's now orphaned (otherwise its derived collectable haunts the collection room).
            if ((config.key === "sales" || config.key === "pickups") && item.event === false) {
                deleteOrphanedCustomItem(targetIndex);
            }

            // 6. Execute the new deleteScene function if it was orphaned
            if (isOrphan) {
                deleteScene(character, targetIndex);
            }

            if (typeof updateNavMenuTest === "function") updateNavMenuTest(character);
            
            refresh();
        };
        card.appendChild(deleteBtn);
    }

    // --- DUPLICATE BUTTON ---
    if (!config.rules?.noDelete) { // Optional: allows you to disable duplication per-tab in config
        const duplicateBtn = document.createElement("div");
        duplicateBtn.textContent = "Copy"; 
        duplicateBtn.className = "card-duplicate-btn";
        duplicateBtn.style.cssText = "position:absolute; top:8px; right:45px; cursor:pointer; font-size:var(--fs-medium, 1.3em); z-index:2;";
        
        // Position it to the left of the Delete Button (Delete is at right: 12px)
        duplicateBtn.style.cssText = "position:absolute; top:8px; right:45px; cursor:pointer; font-size:var(--fs-medium, 1.3em); z-index:2; filter: grayscale(1); opacity: 0.7;";

        duplicateBtn.onclick = async () => {
            // UI feedback so the user knows it's thinking
            duplicateBtn.style.opacity = "0.3";
            duplicateBtn.style.pointerEvents = "none";
            
            // We pass config.key (tabKey), character, and the local refresh function
            await duplicateItem(item, config.key, character, refresh);
        };
        
        card.appendChild(duplicateBtn);
    }

    // Assemble components
    updateOverview();
    if (isEditing) updateEditor();

    // Edit toggle sits ABOVE the overview (and thus above the "Edit the attached scene" switch), so
    // the encounter-editing action reads before the scene-editing action.
    content.append(editToggleBtn, overviewSection, editorSection);
    card.appendChild(content);

    return card;
}

// Per-category default values for items/collectables. When a category is chosen, any of these fields
// that the modder hasn't filled in yet get sensible defaults. Extend this table to add more rules.
const categoryFieldDefaults = {
    jiggy: { set: "Misc", pieces: 100 },
};

// Fill in blank fields for the item's current category (does not overwrite values the user has set).
function applyCategoryDefaults(item) {
    if (!item) return;
    const defs = categoryFieldDefaults[item.category];
    if (!defs) return;
    for (const key in defs) {
        const cur = item[key];
        // "Blank" = missing, empty string, or 0 (the schema's empty default for numeric fields).
        if (cur === undefined || cur === null || cur === "" || cur === 0) {
            item[key] = defs[key];
        }
    }
}

function createItemFromSchema(tabKey, character) {
    const config = tabConfig[tabKey];
    const newItem = {};

    // Map through editor fields to set initial values
    config.card.editor.forEach(field => {
        const targetKey = field.origin || field.key;
        
        if (typeof field.default === 'function') {
            newItem[targetKey] = field.default(character);
        } else if (field.default !== undefined) {
            newItem[targetKey] = field.default;
        } else {
            // Sensible fallbacks based on input type
            if (field.inputType === 'checkbox') newItem[targetKey] = false;
            if (field.inputType === 'position') {
                newItem[field.x_origin || 'top'] = field.x_default || 0;
                newItem[field.y_origin || 'left'] = field.y_default || 0;
            }
        }
    });

    // Handle special requirements flags based on game context
    newItem.requirements = getDefaultRequirements(); 

    newItem._isNew = true;
    return newItem;
}

function renderSchemaFields(item, character, container, tabKey, mode = 'editor', onUpdate = null) {
    const config = tabConfig[tabKey]; 
    if (!config) return;

    const fields = config.card[mode];

    fields.forEach(field => {
        // Respect displayConditions (e.g., only show 'scene' input if type is 'scene')
        if (field.displayCondition && !field.displayCondition(item)) return;

        if (mode === 'overview') {
			const displayVal = typeof field.display === 'function' 
                ? field.display(item) 
                : (typeof field.display === 'string' ? field.display : item[field.key]);

			// If there's no value and no custom display function, skip rendering this row
			// or show a placeholder if it's a critical field
			if (displayVal === undefined || displayVal === null || displayVal === "") {
				return; // This omits the row entirely from the overview
			}

			let element;

			// --- CASE 1: head format ---
			if (field.format === 'head') {
				element = document.createElement("p");
				element.className = "textName syrup";
				element.textContent = `Index: ${displayVal}`;
			} 
			// --- CASE 2: switch format ---
			else if (field.format === 'switch') {
				element = document.createElement("span");
				element.className = "switch";
				element.textContent = displayVal; 
				element.style.display = "inline-block";
				element.style.marginTop = "5px";
                element.style.fontSize = "var(--fs-medium, 1.2em)";
			} 
			// --- CASE 3: I once had a piece of my spine replaced with a piece of brick ---
			else {
				element = document.createElement("div");
				element.className = "overview-row";
				
                if (window.matchMedia('(orientation: portrait)').matches) {
                    element.style.fontSize = "var(--fs-small, 1em)";
                }
                else {
				    element.style.fontSize = "var(--fs-large, 1.5em)";
                }
				element.style.opacity = "1";
				element.style.fontFamily = "playtime";
				element.style.lineHeight = "1.5";
				element.innerHTML = `<b>${field.label}:</b> <span>${displayVal}</span>`;
			}

			if (field.onClick) {
				element.style.cursor = "pointer";
				element.onclick = () => field.onClick(item, character);
			}

			container.appendChild(element);
		}
        else {
            const input = createInputFromType(field, item, character, onUpdate);
            console.info(field.label);
            container.appendChild(labeledField(field.label, input));
            
            /* moved into createInputFromType
            input.onchange = (e) => {
                let val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

                // --- NEW: Boolean Casting ---
                // If the value is the string "true" or "false", turn it back into a real boolean
                if (val === "true") val = true;
                if (val === "false") val = false;
                
                // Also handle numbers if necessary (optional but helpful)
                if (!isNaN(val) && val !== "" && typeof val !== "boolean") {
                    val = parseFloat(val);
                }

                item[field.origin || field.key] = val; // Updates the itemBuffer with the REAL boolean
                
                // Re-render the editor to show/hide fields based on displayCondition
                if (onUpdate) {
                    onUpdate(); 
                }
            };
            */
        }
    });
}

function createInputFromType(field, item, character, onUpdate) {
    let input;
    const targetOrigin = field.origin || field.key;
    let currentValue = item[targetOrigin] !== undefined ? item[targetOrigin] : "";

    // Helper to handle the "Standard" update logic
    const bindStandardChange = (el) => {
        el.onchange = (e) => {
            let val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
            
            // Boolean/Number casting
            if (val === "true") val = true;
            if (val === "false") val = false;
            if (!isNaN(val) && val !== "" && typeof val !== "boolean") val = parseFloat(val);

            item[targetOrigin] = val;
            // Choosing a category fills in sensible blank fields (e.g. jiggy → set/pieces).
            if (targetOrigin === "category") applyCategoryDefaults(item);
            // Only re-render the editor for inputs that can flip OTHER fields' displayConditions
            // (the type/event dropdowns). Plain text/checkbox edits skip the rebuild — that rebuild,
            // fired on blur, is what destroyed the Save button mid-click and forced a second click.
            if (onUpdate && (field.inputType === "dropdown" || field.inputType === "dropdownCustom")) {
                onUpdate();
            }
        };
    };

    // cleanup: "(no display text)" placeholder for names
    if (targetOrigin === "name" && currentValue === "(no display text)") {
        currentValue = "";
    }

    switch (field.inputType) {
        case "string":
            input = document.createElement("input");
            input.type = "text";
            input.value = currentValue;
            bindStandardChange(input);
            break;

        case "checkbox":
            input = document.createElement("input");
            input.type = "checkbox";
            input.checked = !!currentValue;
            bindStandardChange(input);
            break;

        case "dropdownNoRefresh":
        input = document.createElement("select");
        const optionsArr = typeof field.options === 'function' ? field.options() : field.options;
        const valuesArr = typeof field.values === 'function' ? field.values() : field.values;

        optionsArr.forEach((optName, index) => {
            const opt = document.createElement("option");
            opt.textContent = optName;
            opt.value = valuesArr[index];
            if (item[field.key] == valuesArr[index]) opt.selected = true; 
            input.appendChild(opt);
        });

        // The logic: Update data silently and kill the event bubbling
        input.onchange = (e) => {
            e.stopPropagation(); // Stops the parent card from seeing this change
            item[field.key] = e.target.value;
            // Choosing a category fills blank fields (jiggy → set/pieces); re-render so the filled
            // values show. onUpdate here is the component's own local re-render (e.g. renderState),
            // not the parent card's.
            if (field.key === "category") {
                applyCategoryDefaults(item);
                if (onUpdate) onUpdate();
            }
        };
        break;

        case "dropdown":
        case "dropdownCustom":
            input = document.createElement("select");
            const options = typeof field.options === 'function' ? field.options() : field.options;
            const values = typeof field.values === 'function' ? field.values() : field.values;

            options.forEach((optName, index) => {
                const opt = document.createElement("option");
                opt.textContent = optName;
                opt.value = values[index];
                // Use loose equality (==) since values[index] might be a string "true" in the DOM
                if (currentValue == values[index]) opt.selected = true; 
                input.appendChild(opt);
            });
            bindStandardChange(input);

            // Do not use !currentValue, as that triggers on 'false' or 0
            if ((item[targetOrigin] === undefined || item[targetOrigin] === "") && values.length > 0) {
                const d = typeof field.default === 'function' ? field.default(character) : field.default;
                item[targetOrigin] = d !== undefined ? d : values[0];
            }
            break;

        case "position":
            input = document.createElement("div");
            input.className = "schema-input-position-container";
            input.style.display = "flex";
            input.style.gap = "10px";

            const xOrigin = field.y_origin || 'left';
            const yOrigin = field.x_origin || 'top';

            const xInput = createInputFromType({ inputType: "string" }, item, character);
            xInput.type = "number";
            xInput.dataset.tooltip = field.tooltip;
            xInput.value = item[xOrigin] ?? field.y_default ?? 0;
            xInput.onchange = (e) => {
                item[xOrigin] = parseFloat(e.target.value) || 0;
                e.stopPropagation(); // FIX: Stops renderSchemaFields from creating a 'position' variable
            };

            const yInput = createInputFromType({ inputType: "string" }, item, character);
            yInput.type = "number";
            yInput.dataset.tooltip = field.tooltip;
            yInput.value = item[yOrigin] ?? field.x_default ?? 0;
            yInput.onchange = (e) => {
                item[yOrigin] = parseFloat(e.target.value) || 0;
                e.stopPropagation(); 
            };

            input.appendChild(labeledField(field.y_label || "Left%", xInput));
            input.appendChild(labeledField(field.x_label || "Top%", yInput));
            return input; // Early return because sub-inputs handle their own tooltips
			
		case "imageMandatory":
		case "imageOptional":
			const isMandatory = field.inputType === "imageMandatory";
            const currentTab = field.tabContext || "encounters"; 
            
            input = createImageField({
                value: currentValue,
                isMandatory: isMandatory, // FIX: Pass the flag to the helper
                onChange: (newPath, blobUrl) => {
                    const oldPath = item[targetOrigin];
					
					// 1. Update the Buffer
					if (newPath) {
                        item[targetOrigin] = newPath;
                    } else if (!isMandatory) {
                        delete item[targetOrigin];
                    }

					// 2. Sync Metadata (Overwrites old path reference with the new one)
					if (typeof syncImageMetadata === "function") {
                        syncImageMetadata(oldPath, newPath, blobUrl);
                    }
				},
				pathRoot: `images/${character.index}/${currentTab}/`,
                placeholderSrc: "images-webp/placeholder/expressions/happy.webp",
                
                tooltipCreate: isMandatory ? "Cannot create a mandatory image." : "Create a new image, click on it to replace it.",
                tooltipClear: isMandatory ? "Cannot clear a mandatory image." : "Remove this image.",
                tooltipImage: "Click to replace this image.",
                tooltipPath: `Path to the ${field.label} asset.`
            });
            break;

        case "note":
            // For the "walking" encounter type info note
            input = document.createElement("div");
            input.textContent = field.display || "";
            input.style.opacity = "0.7";
            input.style.fontSize = "var(--fs-small, 0.9em)";
            break;

        case "search":
            return componentItemSearch(item, character, onUpdate);
        case "itemInsert":
            return componentItemInsert(item, character, onUpdate);
        case "locationSearch":
            return componentLocationSearch(item, character, onUpdate);
        case "locationInsert":
            return componentLocationInsert(item, character, onUpdate);
    }

    // 3. TOOLTIP LOGIC: Apply tooltip from schema to the main input element
    if (field.tooltip && input) {
        input.dataset.tooltip = field.tooltip;
    }

    return input;
}

function labeledField(labelText, inputEl) {
    const wrapper = document.createElement("div");

    const label = document.createElement("div");
    label.textContent = labelText;
    if (window.matchMedia('(orientation: portrait)').matches) {
        label.style.fontSize = "var(--fs-small, 1em)";
    }
    else {
        label.style.fontSize = "var(--fs-large, 1.5em)";
    }
    label.style.opacity = "1";
	label.style.fontFamily = "playtime";

    wrapper.append(label, inputEl);
    return wrapper;
}

function createImageField({
    value,                 // string (e.g. encounter.altImage)
    onChange,              // function(newValue)
    pathRoot,              // e.g. `images/${characterIndex}/encounters/`
    placeholderSrc,        // e.g. "images-webp/placeholder/expressions/happy.webp"
    isMandatory,
    tooltipCreate,
    tooltipClear,
    tooltipImage,
    tooltipPath
}) {
    const container = document.createElement("div");

    const pathDisplay = document.createElement("div");
    pathDisplay.style.opacity = "0.8";
    pathDisplay.dataset.tooltip = tooltipPath;

    const img = document.createElement("img");
    img.classList.add("modEditableImage");
    img.style.width = "120px";
    img.style.height = "auto";
    img.dataset.tooltip = tooltipImage;

    const createBtn = document.createElement("button");
    createBtn.textContent = "Create Image";
    createBtn.dataset.tooltip = tooltipCreate;

    const clearBtn = document.createElement("button");
    clearBtn.textContent = "Clear Image";
    clearBtn.dataset.tooltip = tooltipClear;

    // Hide the clear button if mandatory
    if (isMandatory) {
        createBtn.style.display = "none";
        clearBtn.style.display = "none"
    };

    // Auto-generate placeholder if mandatory and empty
    if (isMandatory && !value) {
        setTimeout(() => createBtn.click(), 50); // Small delay to let DOM settle
    }

    // --- STATE ---
    let currentValue = value || "";

    function resolveAndRender() {
        const hasImage = !!currentValue;

        createBtn.disabled = hasImage;
        clearBtn.disabled = !hasImage;

        if (hasImage) {
            const clean = currentValue.replace(/\.webp$/i, "");
            const resolved = cleanupImage(clean);

            img.src = resolved;
            img.dataset.path = currentValue;
            img.style.display = "block";

            pathDisplay.textContent = currentValue;
        } else {
            img.src = "";
            img.dataset.path = "";
            img.style.display = "none";

            pathDisplay.textContent = "(no image)";
        }
    }

    // --- CREATE ---
    createBtn.onclick = async () => {
        if (currentValue) return;

        const id = generateId();
        const path = pathRoot + id;

        const blobUrl = await placeholderImage(path, placeholderSrc);

        currentValue = path + ".webp";

        img.src = blobUrl;
        img.dataset.path = currentValue;

        onChange(currentValue, blobUrl);
        resolveAndRender();
    };

    // --- CLEAR ---
    clearBtn.onclick = () => {
		if (!currentValue) return;

		const oldPath = currentValue;
		currentValue = "";

		// 1. Tell the buffer the path is now empty (clears this entry's reference)
		onChange("");

		// 2. Drop any placeholder registration, and free the blob only if nothing else still points
		// at this path (placeholders have no blob, so releaseImageIfUnused is a no-op for them).
		clearPlaceholderPath(oldPath);
		releaseImageIfUnused(oldPath);

		resolveAndRender();
	};

    // --- INITIAL RENDER ---
    resolveAndRender();

    container.append(
        pathDisplay,
        img,
        createBtn,
        clearBtn
    );

    return container;
}

function syncImageMetadata(oldPath, newPath) {
    if (!oldPath) return;

    // 1. Universal Storage Sweep
    const storageKeys = ["customTravel", "customLocations", "customItems", "customCollectables"];

    for (let key of storageKeys) {
        if (!storageArray[key]) continue;

        storageArray[key].forEach(entry => {
            for (let prop in entry) {
                if (entry[prop] === oldPath) {
                    entry[prop] = newPath;
                }
            }
        });
    }


    storageArray.customCharacters.forEach(char => {
        // Property-image entries (encounter altImage, pickup/sale/morning icons, event thumbnails,
        // trophy images). 'events' and 'trophies' were previously missed — renaming those images left
        // a dead reference.
        ['encounters', 'pickups', 'sales', 'mornings', 'events', 'trophies'].forEach(tab => {
            if (!char[tab]) return;
            char[tab].forEach(entry => {
                // Check every single key in the entry for the old path
                for (let key in entry) {
                    if (entry[key] === oldPath) {
                        entry[key] = newPath;
                    }
                }
            });
        });
    });

    // 1b. Images embedded INSIDE content strings (scene/event `im` lines, logbook thumbnails). Only on
    // a real rename (newPath set) — never on a clear, which would blank the `im` target. We replace
    // the path only where it appears as a whole token (bounded by whitespace, ';', or string ends),
    // in both its raw and no-".webp" forms, so we can't partially clobber a longer path or unrelated
    // prose. Logbook renames are also handled by recompileLogbook; doing it here too is harmless.
    if (newPath) {
        const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const variants = [];
        const addVariant = (o, n) => { if (o && !variants.some(v => v.o === o)) variants.push({ o, n }); };
        addVariant(oldPath, newPath);
        addVariant(oldPath.replace(/\.webp$/i, ""), newPath.replace(/\.webp$/i, ""));

        const replacers = variants.map(v => ({
            re: new RegExp(`(^|[\\s;])${escapeRe(v.o)}(?=[\\s;]|$)`, 'g'),
            n: v.n
        }));

        const sweepContent = (entry) => {
            if (!entry || typeof entry.content !== "string") return;
            let c = entry.content;
            for (const r of replacers) c = c.replace(r.re, `$1${r.n}`);
            entry.content = c;
        };

        storageArray.customCharacters.forEach(char => {
            (char.scenes || []).forEach(sweepContent);
            (char.events || []).forEach(sweepContent);
            (char.logbook || []).forEach(sweepContent);
        });
    }

    // 2. Universal Buffer Sweep (Fixes the visual break before saving)
    const activeEditors = document.querySelectorAll('.card-editor');
    activeEditors.forEach(editor => {
        if (editor.__itemBuffer) {
            for (let key in editor.__itemBuffer) {
                if (editor.__itemBuffer[key] === oldPath) {
                    editor.__itemBuffer[key] = newPath;
                }
            }
        }
    });
}

// Count how many structured entries still reference an image path. Mirrors the arrays
// syncImageMetadata sweeps. (Expression sprites aren't counted — they're referenced by
// construction, not stored as path props — so this is only used for card/asset images.)
function countImagePathReferences(path) {
    if (!path) return 0;
    let count = 0;
    const scan = (entry) => {
        if (!entry || typeof entry !== "object") return;
        for (const k in entry) if (entry[k] === path) count++;
    };
    ["customTravel", "customLocations", "customItems", "customCollectables"].forEach(key => {
        (storageArray[key] || []).forEach(scan);
    });
    (storageArray.customCharacters || []).forEach(char => {
        ["encounters", "pickups", "sales", "mornings"].forEach(tab => (char[tab] || []).forEach(scan));
    });
    return count;
}

// Free an uploaded image's blob + object URL, but ONLY if nothing references its path anymore.
// This is the missing piece behind several leaks: clearing, cleaning up an inactive field, or
// deleting a card previously just nulled references and left the blob in memory (and in the
// autosaved draft / export). Call this AFTER the reference has been removed.
function releaseImageIfUnused(path) {
    if (!path) return;
    if (countImagePathReferences(path) > 0) return; // still used somewhere — keep it
    const clean = path.replace(/\.webp$/i, "");
    const blobUrl = uploadedImageMap[clean];
    if (!blobUrl) return;
    delete uploadedImages[blobUrl];
    delete uploadedImageMap[clean];
    URL.revokeObjectURL(blobUrl);
}

async function duplicateItem(originalItem, tabKey, character, refresh) {
   // 1. Get the actual list from the config
    const config = tabConfig[tabKey];
    if (!config) {
        console.error(`Tab config not found for key: ${tabKey}`);
        return;
    }
    const list = config.listPath(character);

    // 2. Deep Clone the data
    const newItem = JSON.parse(JSON.stringify(originalItem));

    // 3. Handle Index (Unique ID) with Collision Detection
    // Actually check for collisions (the previous version just appended "(copy)" once, so
    // duplicating twice — or copying a copy — produced colliding indexes, which the game's
    // index-keyed systems then collapse or mishandle). Append an incrementing suffix until unique.
    const baseIndex = newItem.index || "NewEntry";
    let newIndex = `${baseIndex} (copy)`;
    let copyNum = 2;
    while (list.some(it => it.index === newIndex)) {
        newIndex = `${baseIndex} (copy ${copyNum})`;
        copyNum++;
    }
    newItem.index = newIndex;

    // 4. Decouple Images
    const imageFields = config.card.editor.filter(f => f.inputType?.includes("image"));
    
    for (let field of imageFields) {
        const key = field.origin || field.key;
        const oldPath = newItem[key];

        if (oldPath && typeof oldPath === 'string') {
            const extension = oldPath.includes('.') ? oldPath.split('.').pop() : 'webp';
            const pathWithoutExt = oldPath.replace(/\.[^/.]+$/, "");
            const newPath = `${pathWithoutExt}_copy.${extension}`;

            // Duplicate the actual asset in memory/map
            await duplicateAssetFile(oldPath, newPath);
            
            newItem[key] = newPath;
        }
    }

    // 5. Add to the start of the storage array
    list.unshift(newItem);
    
    // 6. Refresh the UI
    // We call the main render function for the tab to show the new card
    if (typeof refresh === "function") {
        refresh();
    } else {
        console.warn("refresh not found. Manual refresh required.");
    }
    
    console.info(`Duplicated ${baseIndex} to ${newItem.index}`);
}

async function duplicateAssetFile(oldPath, newPath) {
    const oldKey = oldPath.replace(/\.webp$/i, "");
    const oldBlobUrl = uploadedImageMap[oldKey];

    let blobToClone;

    if (oldBlobUrl && uploadedImages[oldBlobUrl]) {
        // CASE 1: The image is already in memory (user-uploaded/modified)
        blobToClone = uploadedImages[oldBlobUrl].file;
    } else {
        // CASE 2: The image is a core asset (not yet in memory)
        // We fetch it and convert it to a blob to "localize" it for the new copy
        try {
            const res = await fetch(oldPath);
            if (!res.ok) throw new Error("Core asset not found");
            const rawBlob = await res.blob();
            blobToClone = await convertToWebP(rawBlob);
        } catch (e) {
            console.error("Could not duplicate core asset:", oldPath, e);
            return null;
        }
    }

    // Register the cloned blob under the new path
    // We use setUploadedImage so it creates a unique BlobURL for the new card
    const newBlobUrl = setUploadedImage(newPath, blobToClone);
    return newBlobUrl;
}

//Lookup/insert components & functions
// COMPONENT: Item Search & Selection
function componentItemSearch(item, character, onUpdate) {
    const wrapper = document.createElement("div");
    wrapper.className = "item-search-wrapper";
    //wrapper.style.position = "relative";

    const searchInput = document.createElement("input");
    searchInput.className = "syrup-input";
    searchInput.placeholder = "Select or search for an item...";
    searchInput.value = item.index || "";

    const resultsDiv = document.createElement("div");
    resultsDiv.className = "search-results-dropdown syrup";
    resultsDiv.style.display = "none";

    const performSearch = () => {
        const query = searchInput.value.toLowerCase();
        resultsDiv.innerHTML = "";

        console.info("Syrup Editor: Performing location search...");
        console.info(item)
        

        const typedText = searchInput.value.trim();
        const cardIndex = typedText || item.index || "newItem";
        const alreadyExists = !!itemSearch(cardIndex);

        // 1. CREATE NEW PRIORITY
        if (!alreadyExists) {
            const createRow = document.createElement("div");
            createRow.className = "search-row create-new";
            createRow.innerHTML = `<b>+ Create New Custom Item: "${cardIndex}"</b>`;
            createRow.onmousedown = (e) => {
                console.info("Creating a new custom item...");
                e.preventDefault();
                const newItem = { index: cardIndex, name: cardIndex, value: 0, desc: "", image: "", category: "key", _isBrandNew: true };
                storageArray.customItems.push(newItem);
                item.index = newItem.index;
                resultsDiv.style.display = "none";
                if (onUpdate) onUpdate();
            };
            resultsDiv.appendChild(createRow);
        }

        // 2. FILTERED LIST
        const all = [
            ...storageArray.customItems.map(i => ({ ...i, _source: 'custom' })),
            ...globalItemsArray.map(i => ({ ...i, _source: 'global' }))
        ];

        all.filter(i => (i.index||"").toLowerCase().includes(query) || (i.name||"").toLowerCase().includes(query))
           .slice(0, 15)
           .forEach(match => {
                const row = document.createElement("div");
                row.className = `search-row ${match._source}`;
                row.innerHTML = `<span>${match.index}</span> <small>(${match.name})</small>`;
                row.onmousedown = (e) => {
                    e.preventDefault();
                    item.index = match.index;
                    if (onUpdate) onUpdate();
                };
                resultsDiv.appendChild(row);
           });

        resultsDiv.style.display = "block";
    };

    searchInput.onfocus = performSearch;
    searchInput.oninput = performSearch;
    searchInput.onblur = () => { setTimeout(() => resultsDiv.style.display = "none", 150); };

    wrapper.append(searchInput, resultsDiv);
    return wrapper;
}

// COMPONENT: Item Insert / Mini-Editor
function componentItemInsert(item, character, onUpdate) {
    
    /* =============================================================================
    * SCENE EDITOR IMPLEMENTATION GUIDE
    * * How to use componentItemInsert & componentItemSearch in the Scene Editor:
    * * 1. THE PARSER: When reading a scene string that gives an item (e.g., "+item testSale1"), 
    * the parser will create a temporary "block" object:
    * let sceneBlock = { type: "giveItem", index: "testSale1" };
    * * 2. THE RENDER: Pass this temporary block into the component exactly like in the tabs.
    * const itemUI = componentItemInsert(sceneBlock, character, onSceneUpdate);
    * * 3. THE TRANSLATOR (onSceneUpdate): The onUpdate callback 
    * for the scene editor won't just refresh the UI—it should translate the block BACK into a string.
    * * const onSceneUpdate = () => {
    * // If the user changed the item in the UI to "newSword", sceneBlock.index is now "newSword"
    * // We rewrite the specific line in the scene's raw string:
    * updateRawSceneLine(lineNumber, `+item ${sceneBlock.index}`);
    * * // Re-render the scene editor UI
    * refreshSceneUI(); 
    * };
    * ============================================================================= */

    const itemRef = itemSearch(item.index);
    if (!itemRef) return document.createElement("div");

    const container = document.createElement("div");
    container.className = "dialogueContainer syrup";
    //container.style.position = "relative";

    // This stops sub-inputs (like name or category) from telling the parent Pickup Card that the "index" has changed.
    container.addEventListener('change', (e) => e.stopPropagation());
    container.addEventListener('input', (e) => e.stopPropagation());

    const content = document.createElement("div");
    content.className = "textContent syrup";
    content.style.width = "100%"; // Ensure it takes the full space

    // If we don't know the state yet, guess based on if the item is "empty".
    // This ensures freshly created items default to Edit mode, while existing ones default to Static.
    if (itemRef.source === 'custom' && item._isEditingItem === undefined) {
        item._isEditingItem = itemRef.data._isBrandNew === true;
    }

    // --- We wrap the rendering in a function so we can easily swap states ---
    const renderState = () => {
        content.innerHTML = ""; // Clear existing content

        // --- 1. The Global "X" Button (Always Present) ---
        const changeBtn = document.createElement("button");
        changeBtn.textContent = "×";
        changeBtn.className = "card-delete-btn"; 
        changeBtn.style.cssText = "position:absolute; top:8px; right:12px; cursor:pointer; font-size:var(--fs-large, 1.5em); color:#5fe6ec; z-index:2; background:transparent; border:none; padding:0;";
        changeBtn.onclick = (e) => {
            e.stopPropagation(); // Safety first
            item.index = ""; 
            item._isEditingItem = undefined; // Clean up our temporary flag
            if (onUpdate) onUpdate(); 
        };
        content.appendChild(changeBtn);

        const innerWrapper = document.createElement("div");

        // --- STATE A: GLOBAL (Static Only) ---
        if (itemRef.source === 'global') {
            innerWrapper.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:flex-start; padding-right: 25px;">
                    <div>
                        <h3 style="margin:0 0 5px 0; color:#5fe6ec;">${itemRef.data.name}</h3>
                        <p style="margin:0; font-size:var(--fs-small, 0.85em); opacity:0.8;">${itemRef.data.desc || 'No description.'}</p>
                        <p style="margin:5px 0 0 0; font-size:var(--fs-small, 0.8em); color:#f1c40f;">Price: ${itemRef.data.value}</p>
                    </div>
                    <div style="text-align:right;">
                        ${itemRef.data.image ? `<img src="${cleanupImage(itemRef.data.image)}" style="width:64px; height:64px; border-radius:8px; border:1px solid #5fe6ec; object-fit:cover; margin-bottom:5px;"/>` : ''}
                        <br>
                        <span style="font-size:var(--fs-tiny, 0.7em); background:#444; padding:2px 6px; border-radius:4px; white-space:nowrap;">GLOBAL ITEM</span>
                    </div>
                </div>
            `;
            content.appendChild(innerWrapper);
        } 
        
        // --- STATE B: CUSTOM (Static / Read-Only View) ---
        else if (!item._isEditingItem) {
            const cats = itemRef.data.category ? ` [${itemRef.data.category.toUpperCase()}]` : '';
            innerWrapper.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:flex-start; padding-right: 25px;">
                    <div style="flex:1;">
                        <h3 style="margin:0 0 5px 0; color:#fcebb5;">${itemRef.data.name}${cats}</h3>
                        <p style="margin:0; font-size:var(--fs-small, 0.85em); opacity:0.8;">${itemRef.data.desc || 'No description.'}</p>
                        <div style="margin-top:8px; font-size:var(--fs-small, 0.8em); display:grid; grid-template-columns: 1fr 1fr; gap: 5px;">
                            <span style="color:#fcebb5;">Value: ${itemRef.data.value || 0}</span>
                            ${itemRef.data.set ? `<span style="opacity:0.7;">Set: ${itemRef.data.set}</span>` : ''}
                            ${itemRef.data.tags ? `<span style="opacity:0.7;">Tags: ${itemRef.data.tags}</span>` : ''}
                            ${itemRef.data.pieces ? `<span style="opacity:0.7;">Pieces: ${itemRef.data.pieces}</span>` : ''}
                        </div>
                    </div>
                    <div style="text-align:right; margin-left:15px;">
                        ${itemRef.data.image ? `<img src="${cleanupImage(itemRef.data.image)}" style="width:64px; height:64px; border-radius:8px; border:1px solid #fcebb5; object-fit:cover; margin-bottom:5px;"/>` : ''}
                        <br>
                        <span style="font-size:var(--fs-tiny, 0.7em); background:#664400; padding:2px 6px; border-radius:4px; color:#fcebb5; white-space:nowrap;">CUSTOM ITEM</span>
                    </div>
                </div>
            `;
            
            const editBtn = document.createElement("button");
            editBtn.textContent = "✎ Edit Item";
            editBtn.className = "switch"; 
            editBtn.style.cssText = "margin-top: 15px; font-size:var(--fs-small, 0.8em); cursor:pointer;";
            editBtn.onclick = () => {
                item._isEditingItem = true;
                if (onUpdate) onUpdate(); else renderState();
            };
            
            innerWrapper.appendChild(editBtn);
            content.appendChild(innerWrapper);
        } 

        // --- STATE C: CUSTOM (Editing View) ---
        else {
            const header = document.createElement("h3");
            header.style.cssText = "margin: 0 0 10px 0; color: #fcebb5;";
            header.textContent = `Editing Custom Item: ${item.index}`;
            innerWrapper.appendChild(header);

            // Get categories for the dropdown
            const categoryOptions = getItemCategoryList();

            const fields = [
                { key: "name", label: "Display Name", inputType: "string" },
                { 
                    key: "category", 
                    label: "Category", 
                    inputType: "dropdownNoRefresh", 
                    options: categoryOptions, 
                    values: categoryOptions 
                },
                { key: "value", label: "Value / Price", inputType: "string" },
                { key: "image", label: "Icon", inputType: "imageMandatory", tabContext: "items" },
                { key: "desc", label: "Description", inputType: "string" },
                
                // --- EXTRA CONTEXT FIELDS ---
                { key: "set", label: "Set", inputType: "string", tooltip: "Used for grouped collections/magazines" },
                { key: "tags", label: "Tags", inputType: "string", tooltip: "Optional tags used for content filters. As a modder, you don't need to worry about this.<br>Just make sure your mod is tagged correctly." },
                { key: "pieces", label: "Pieces", inputType: "string", tooltip: "Number of pieces required (for jiggies)" }
            ];

            fields.forEach(f => {
                // The category field gets a re-render callback so picking a category (and the
                // resulting auto-filled set/pieces) refreshes the mini-editor; other fields stay
                // silent (no re-render on every keystroke).
                const cb = (f.key === "category") ? renderState : null;
                const input = createInputFromType(f, itemRef.data, character, cb);
                innerWrapper.appendChild(labeledField(f.label, input));
            });

            const saveBtn = document.createElement("button");
            saveBtn.textContent = "✓ Save Item";
            saveBtn.className = "switch"; 
            saveBtn.style.cssText = "margin-top: 15px; font-size:var(--fs-small, 0.8em); background-color: rgba(39, 174, 96, 0.4); border-color: #2ecc71; color: #2ecc71; cursor:pointer;";
            saveBtn.onclick = () => {
                item._isEditingItem = false;
                delete itemRef.data._isBrandNew; 
                
                if (onUpdate) onUpdate(); else renderState();
            };
            
            innerWrapper.appendChild(saveBtn);
            content.appendChild(innerWrapper);
        }
    };

    // Run the render logic
    renderState();

    container.appendChild(content);
    return container;
}

function testInjectCustomItem(buttonItem) {
    
}

// Utility to find items across both global and custom arrays
function itemSearch(index) {
    if (!index) return null;
    const custom = storageArray.customItems.find(i => i.index === index);
    if (custom) return { data: custom, source: 'custom' };
    const global = globalItemsArray.find(i => i.index === index);
    if (global) return { data: global, source: 'global' };
    return null;
}

// COMPONENT: Location Search & Selection
function componentLocationSearch(item, character, onUpdate) {
    const wrapper = document.createElement("div");
    wrapper.className = "location-search-wrapper";
    //wrapper.style.position = "relative";

    const searchInput = document.createElement("input");
    searchInput.className = "syrup-input";
    searchInput.placeholder = "Select or search for a location...";
    searchInput.value = item.index || ""; // Using 'target' instead of 'index'

    const resultsDiv = document.createElement("div");
    resultsDiv.className = "search-results-dropdown syrup";
    resultsDiv.style.display = "none";

    const performSearch = () => {
        const query = searchInput.value.toLowerCase();
        resultsDiv.innerHTML = "";

        console.info("Syrup Editor: Performing location search...");
        console.info(item)
        
        // --- THE FIX: Prioritize what the user is actively typing! ---
        const typedText = searchInput.value.trim();
        const cardTarget = typedText || item.index || "newLocation";
        
        const alreadyExists = !!locationFind(cardTarget);

        // 1. CREATE NEW PRIORITY
        if (!alreadyExists) {
            const createRow = document.createElement("div");
            createRow.className = "search-row create-new";
            createRow.innerHTML = `<b>+ Create New Custom Location: "${cardTarget}"</b>`;
            createRow.onmousedown = (e) => {
                console.info("Syrup Editor: Creating a new custom location...");
                e.preventDefault();
                // Basic location structure.
                const newLoc = { index: cardTarget, name: cardTarget, image: "", buttons: [] };
                storageArray.customLocations.push(newLoc);
                item.index = newLoc.index;
                resultsDiv.style.display = "none";
                if (onUpdate) onUpdate();
            };
            resultsDiv.appendChild(createRow);
        }

        // 2. FILTERED LIST
        const all = [
            ...storageArray.customLocations.map(l => ({ ...l, _source: 'custom' })),
            ...locationArray.map(l => ({ ...l, _source: 'global' }))
        ];

        all.filter(l => (l.index||"").toLowerCase().includes(query) || (l.name||"").toLowerCase().includes(query))
           .slice(0, 15)
           .forEach(match => {
               const row = document.createElement("div");
               row.className = `search-row ${match._source}`;
               row.innerHTML = `<span>${match.index}</span> <small>(${match.name})</small>`;
               row.onmousedown = (e) => {
                   e.preventDefault();
                   item.index = match.index; // Assigning to target!
                   if (onUpdate) onUpdate();
               };
               resultsDiv.appendChild(row);
           });

        resultsDiv.style.display = "block";
    };

    searchInput.onfocus = performSearch;
    searchInput.oninput = performSearch;
    searchInput.onblur = () => { setTimeout(() => resultsDiv.style.display = "none", 150); };

    wrapper.append(searchInput, resultsDiv);
    return wrapper;
}

// COMPONENT: Location Insert / Mini-Editor
function componentLocationInsert(item, character, onUpdate) {
    const locRef = locationFind(item.index);
    // Guard FIRST: the old debug line below dereferenced locRef.data before this null check,
    // so an unresolved location index threw instead of returning an empty node.
    if (!locRef) return document.createElement("div");

    const container = document.createElement("div");
    container.className = "dialogueContainer syrup";
    //container.style.position = "relative";

    // Stop sub-inputs from triggering parent card "target" updates (The Bug Fix!)
    container.addEventListener('change', (e) => e.stopPropagation());
    container.addEventListener('input', (e) => e.stopPropagation());

    const content = document.createElement("div");
    content.className = "textContent syrup";
    content.style.width = "100%";

    if (locRef.source === 'custom' && item._isEditingItem === undefined) {
        // Guess state based on if it has an image or altered name
        const isBrandNew = !locRef.data.image && locRef.data.name === locRef.data.index;
        item._isEditingItem = isBrandNew; 
    }

    const renderState = () => {
        content.innerHTML = "";

        // --- 1. The Global "X" Button ---
        const changeBtn = document.createElement("button");
        changeBtn.textContent = "×";
        changeBtn.className = "card-delete-btn"; 
        changeBtn.style.cssText = "position:absolute; top:8px; right:12px; cursor:pointer; font-size:var(--fs-large, 1.5em); color:#5fe6ec; z-index:2; background:transparent; border:none; padding:0;";
        changeBtn.onclick = (e) => {
            e.stopPropagation(); 
            item.index = ""; 
            item._isEditingItem = undefined;
            if (onUpdate) onUpdate(); 
        };
        content.appendChild(changeBtn);

        const innerWrapper = document.createElement("div");

        // --- STATE A: GLOBAL (Static Only) ---
        if (locRef.source === 'global') {
            console.info(locRef);
            var finalImage = locRef.data.image;
            if (!finalImage.includes("/")) {
                finalImage = `locations/${finalImage}`;
            }
            finalImage = cleanupImage(finalImage);
            innerWrapper.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:flex-start; padding-right: 25px;">
                    <div>
                        <h3 style="margin:0 0 5px 0; color:#5fe6ec;">${locRef.data.name}</h3>
                        <p style="margin:0; font-size:var(--fs-small, 0.85em); opacity:0.8;">Index: ${locRef.data.index}</p>
                    </div>
                    <div style="text-align:right;">
                        ${locRef.data.image ? `<img src="${finalImage}" style="width:120px; height:64px; border-radius:8px; border:1px solid #5fe6ec; object-fit:cover; margin-bottom:5px;"/>` : ''}
                        <br>
                        <span style="font-size:var(--fs-tiny, 0.7em); background:#444; padding:2px 6px; border-radius:4px; white-space:nowrap;">GLOBAL LOCATION</span>
                    </div>
                </div>
            `;
            content.appendChild(innerWrapper);
        } 
        
        // --- STATE B: CUSTOM (Static / Read-Only View) ---
        else if (!item._isEditingItem) {
            innerWrapper.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:flex-start; padding-right: 25px;">
                    <div style="flex:1;">
                        <h3 style="margin:0 0 5px 0; color:#fcebb5;">${locRef.data.name}</h3>
                        <p style="margin:0; font-size:var(--fs-small, 0.85em); opacity:0.8;">Index: ${locRef.data.index}</p>
                    </div>
                    <div style="text-align:right; margin-left:15px;">
                        ${locRef.data.image ? `<img src="${cleanupImage(locRef.data.image)}" style="width:120px; height:64px; border-radius:8px; border:1px solid #fcebb5; object-fit:cover; margin-bottom:5px;"/>` : ''}
                        <br>
                        <span style="font-size:var(--fs-tiny, 0.7em); background:#664400; padding:2px 6px; border-radius:4px; color:#fcebb5; white-space:nowrap;">CUSTOM LOCATION</span>
                    </div>
                </div>
            `;
            
            const editBtn = document.createElement("button");
            editBtn.textContent = "✎ Edit Location";
            editBtn.className = "switch"; 
            editBtn.style.cssText = "margin-top: 15px; font-size:var(--fs-small, 0.8em); cursor:pointer;";
            editBtn.onclick = () => {
                item._isEditingItem = true;
                if (onUpdate) onUpdate(); else renderState();
            };
            
            innerWrapper.appendChild(editBtn);
            content.appendChild(innerWrapper);
        } 

        // --- STATE C: CUSTOM (Editing View) ---
        else {
            const header = document.createElement("h3");
            header.style.cssText = "margin: 0 0 10px 0; color: #fcebb5;";
            header.textContent = `Editing Custom Location: ${item.index}`;
            innerWrapper.appendChild(header);

            // Locations are simple! Just name and background image.
            const fields = [
                { key: "name", label: "Location Name", inputType: "string", tooltip: "The actual name of the location, you'll want to add spaces and capitalization here."},
                { key: "image", label: "Background Image", inputType: "imageMandatory", tabContext: "locations", tooltip: "The background image for the location."}
            ];

            fields.forEach(f => {
                // Pass null for onUpdate to prevent refresh-on-type
                const input = createInputFromType(f, locRef.data, character, null);
                input.dataset.tooltip = f.tooltip;
                innerWrapper.appendChild(labeledField(f.label, input));
            });

            const saveBtn = document.createElement("button");
            saveBtn.textContent = "✓ Save Location";
            saveBtn.className = "switch"; 
            saveBtn.style.cssText = "margin-top: 15px; font-size:var(--fs-small, 0.8em); background-color: rgba(39, 174, 96, 0.4); border-color: #2ecc71; color: #2ecc71; cursor:pointer;";
            saveBtn.onclick = () => {
                item._isEditingItem = false;
                if (onUpdate) onUpdate(); else renderState();
            };
            
            innerWrapper.appendChild(saveBtn);
            content.appendChild(innerWrapper);
        }
    };

    renderState();
    container.appendChild(content);
    return container;
}

function testInjectCustomLocation(buttonItem, character) {
    // 1. Identify SOURCE and TARGET
    // Source comes from requirements. Target comes from the button's index.
    const locMatch = buttonItem.requirements?.match(/\?location\s+([^;]+);/);
    const sourceLocIndex = locMatch ? locMatch[1].trim() : null;
    const targetLocIndex = buttonItem.index;

    if (!sourceLocIndex) {
        console.warn("Syrup Editor: Cannot test. No '?location' requirement found to identify the source location.");
        alert("Please add a '?location sourceName;' requirement so the editor knows where to place this button!");
        return;
    }

    // 2. Fetch the Source and Target from custom storage / global array
    // (Assuming locationSearch functions exactly like our fixed search from before)
    const sourceResult = locationFind(sourceLocIndex);
    const targetResult = locationFind(targetLocIndex);

    if (!sourceResult) {
        console.warn(`Syrup Editor: Source location '${sourceLocIndex}' not found in game data.`);
        return;
    }

    // 3. Clone both locations to avoid permanent pollution of editor arrays
    const sourceLocationToInject = JSON.parse(JSON.stringify(sourceResult.data));
    
    // Handle the Target Location. If it's brand new and somehow not found, 
    // we create a temporary blank room so the engine doesn't crash on travel.
    let targetLocationToInject;
    if (targetResult) {
        targetLocationToInject = JSON.parse(JSON.stringify(targetResult.data));
    } else {
        console.warn(`Syrup Editor: Target location '${targetLocIndex}' not found. Creating a temporary blank void!`);
        targetLocationToInject = { index: targetLocIndex, name: targetLocIndex, image: "", buttons: [] };
    }

    // 4. Prepare the Button for the Engine
    const testButton = JSON.parse(JSON.stringify(buttonItem));
    testButton.target = testButton.index; // Swap index (target destination) to 'target'
    delete testButton.index;

    /*
    // 5. Inject the button into the SOURCE location's button list
    // Replace button if any with identical target and name exists
    if (!sourceLocationToInject.buttons) sourceLocationToInject.buttons = [];
    let addButton = true;
    for (let i = 0; i < sourceLocationToInject.buttons.length; i++) {
        if (sourceLocationToInject.buttons[i].target === testButton.target && 
            sourceLocationToInject.buttons[i].name === testButton.name) {
            sourceLocationToInject.buttons[i] = testButton;
            addButton = false;
            break; // We found our match, stop looping
        }
    }
    if (addButton) sourceLocationToInject.buttons.push(testButton);
    */

    // 6. Feed BOTH into the engine via newLocation
    newLocation(sourceLocationToInject);
    newLocation(targetLocationToInject);

    // 7. Execute the transition to the TARGET
    if (typeof changeLocation === "function") {
        changeLocation(testButton.target);
        console.info(`🧪 TEST SUCCESS: Traveled from '${sourceLocationToInject.index}' to '${targetLocationToInject.index}'. Test button '${testButton.name}' injected into source!`);
    } else {
        console.error("Engine Error: changeLocation function not found.");
    }
}

// Utility to find locations across both global and custom arrays
function locationFind(index) {
    if (!index) return null;

    // Search custom locations first
    const custom = storageArray.customLocations.find(l => l.index === index);
    if (custom) return { data: custom, source: 'custom' }; // Returns the ACTUAL object

    // Search global locations
    const global = locationArray.find(l => l.index === index);
    if (global) return { data: global, source: 'global' };

    return null;
}

function updateNavMenuTest(character) {
    const playerRoom = document.getElementsByClassName('playerRoom')[0];
    if (!playerRoom) return;

    // 1. WIPE PREVIOUS TEST BUTTONS
    // We target a specific class so we don't accidentally delete base-game travel buttons
    const oldButtons = playerRoom.querySelectorAll('.syrup-travel-test');
    oldButtons.forEach(btn => btn.remove());

    if (!storageArray.customTravel) return;

    // 2. DETERMINE SIZE (using your engine's logic)
    const targetSize = window.matchMedia('(orientation: portrait)').matches ? 40 : 30;

    // 3. LOOP AND RENDER
    storageArray.customTravel.forEach(button => {
        // CONDITION A: Is the card currently open in the editor?
        if (button._isEditing) return;

        // CONDITION B: Are requirements met?
        // (Assuming empty requirements pass automatically)
        if (button.requirements && checkRequirements(button.requirements) === false) {
            return;
        }

        // Create the button mimicking your engine's exact style
        const btnEl = document.createElement("div");
        btnEl.className = "pictureButton syrup-travel-test"; 
        
        // Apply styling and positions
        btnEl.style.top = `${button.top}%`;
        btnEl.style.left = `${button.left}%`;
        btnEl.style.maxWidth = `${targetSize}%`;
        btnEl.textContent = button.name;

        // Bind the test function to act identically to the real game
        btnEl.onclick = () => {
            testInjectCustomLocation(button, character);
        };

        playerRoom.appendChild(btnEl);
    });
}

//Smaller misc helper functions
var itemCategoriesList = [];
function getItemCategoryList() {
    if (itemCategoriesList.length > 0) {
        return itemCategoriesList
    }
    else {
        for (var itemIndex = 0; itemIndex < globalItemsArray.length; itemIndex++) {
            if (!itemCategoriesList.includes(globalItemsArray[itemIndex].category)) {
                itemCategoriesList.push(globalItemsArray[itemIndex].category);
            }
        }
        //Sort "key" to the top
        itemCategoriesList.sort((a, b) => {
            if (a === "key") return -1;
            if (b === "key") return 1;
            return 0;
        })
        return itemCategoriesList
    }
}

function getLocationNameList() {
    var locationNamesList = [];
    for (var locationIndex = 0; locationIndex < locationArray.length; locationIndex++) {
        if (!locationNamesList.includes(locationArray[locationIndex].name)) {
            locationNamesList.push(locationArray[locationIndex].name);
        }
    }
    return locationNamesList
}

function getLocationIndexList() {
    var locationIndexList = [];
    for (var locationIndex = 0; locationIndex < locationArray.length; locationIndex++) {
        if (!locationIndexList.includes(locationArray[locationIndex].index)) {
            locationIndexList.push(locationArray[locationIndex].index);
        }
    }
    return locationIndexList
}

function generateGenericIndex(characterIndex, array, type) {
    const character = storageArray.customCharacters.find(c => c.index === characterIndex);
    if (!array) array = [];

    let max = 0;

    // NOTE: this MUST be a RegExp built from `type` — a /${type}(\d+)$/ literal does NOT interpolate,
    // so it only ever matched the literal text "${type}1" (never a real index), leaving max at 0 and
    // handing every new card the same "<char><Type>1" index.
    const indexPattern = new RegExp(`${type}(\\d+)$`);
    array.forEach(enc => {
        const match = enc.index?.match(indexPattern);
        if (match) {
            const num = parseInt(match[1]);
            if (num > max) max = num;
        }
    });

    return `${characterIndex}${type}${max + 1}`;
}

function getDefaultRequirements() {
    return `?location ${data.player.location};`;
}

function summarizeRequirements(reqString) {
    if (!reqString) return "(no requirements)";
    return reqString.length > 60 
        ? reqString.slice(0, 60) + "..."
        : reqString;
}

// SCENEWRITING
//Scene edit window
window.syrupEditorBuffers = {};
function testScene(characterIndex, sceneIndex) {
    data.player.currentCharacter = characterIndex;
    console.info(`Now editing scene ${sceneIndex} for character ${characterIndex}`);

    generateSceneEditor(characterIndex); 

    //Find the character and scene in question
    var character = storageArray.customCharacters.find(character => character.index === characterIndex);
    if (!character.scenes) {
        character.scenes = [];
    };
    var trueScene = character.scenes.find(scene => scene.index === sceneIndex);
    //If the scene doesn't exist, create it and prepare to populate with default data
    if (!trueScene) {
        trueScene = {index: sceneIndex, content: ""};
    };

    //Determine scene type
    var sceneType = "";
    if (trueScene.index.includes("Wall")) {
        sceneType = "wall";
    }
    if (trueScene.index.includes("Repeat")) {
        sceneType = "repeatable";
    }

    //Specific and unique scene type handling
    switch (sceneType) {
        case "wall":
            if (trueScene.content == "") {
                trueScene.content = `eval writeEvent(`+sceneIndex+`);\nfinish`;
                character.scenes.push(trueScene);
            }
            appendContentToEditor(characterIndex, trueScene.index, "scene");
            appendContentToEditor(characterIndex, trueScene.index, "event");
        break;
        case "repeatable":
            if (trueScene.content == "") {
                //Cleanup logic to separate first and repeat
                if (!trueScene.index.includes("First")) {
                    trueScene.index += "First";
                }
                trueScene.content = `eval writeEvent(`+sceneIndex+`);\\nfinish`;
            }
            appendContentToEditor(characterIndex, trueScene.index, "scene");
            appendContentToEditor(characterIndex, sceneIndex, "event");
            appendContentToEditor(characterIndex, trueScene.index.replace("First", "Repeat"), "scene");
        break;
        default:
            appendContentToEditor(characterIndex, sceneIndex, "scene");
    }
}

function deleteScene(character, sceneIndex) {
    const idx = character.scenes.findIndex(s => s.index === sceneIndex);
    if (idx > -1) {
        // TODO: Add functionality here later for deleting images/events inside the scene
        console.info(`Cleaning up orphaned scene: ${sceneIndex}`);
        character.scenes.splice(idx, 1);
    }
}

function generateSceneEditor(characterIndex) {
    const gameContainer = document.getElementById("output"); 
    gameContainer.innerHTML = ""; // Clear screen

    const editorSpace = document.createElement("div");
    editorSpace.className = "syrup-editor-space";

    // --- Windows Container (Scrolls) ---
    const windowsContainer = document.createElement("div");
    windowsContainer.id = "syrup-windows-container";

    // --- Bottom Controls (Fixed at bottom) ---
    const bottomControls = document.createElement("div");
    bottomControls.style.display = "flex";
    bottomControls.style.justifyContent = "space-between";
    bottomControls.style.alignItems = "center";
    bottomControls.style.marginTop = "10px";

    const searchDropdown = componentSceneEventSearch(characterIndex, null, null, (type, charIdx, itemIndex) => {
        // pass characterIndex from the parent scope to keep it locked to this character
        appendContentToEditor(characterIndex, itemIndex, type);
    });

    const exitBtn = document.createElement("button");
    exitBtn.className = "syrup-btn syrup-btn-danger";
    exitBtn.innerText = "Exit Editor";
    exitBtn.onclick = () => {
        // To-do: add a loop here checking if any windows have unsaved changes before exiting
        purgeTempImages();
        changeLocation(data.player.location);
    };

    bottomControls.append(searchDropdown, exitBtn);

    // Append to DOM
    editorSpace.append(windowsContainer, bottomControls);
    gameContainer.appendChild(editorSpace);
}

function appendContentToEditor(characterIndex, sceneIndex, type) {
    const container = document.getElementById("syrup-windows-container");
    const bufferKey = `${characterIndex}_${sceneIndex}`;

    // 1. Data Routing & Instantiation
    let workingCharacter = storageArray.customCharacters.find(c => c.index === characterIndex);
    console.info(`Working on ${characterIndex}'s ${type} ${sceneIndex}...`);
    console.info(workingCharacter);
    let workingArray = (type === "event" || type === "new_event") ? workingCharacter.events : workingCharacter.scenes;
    let sceneData = workingArray.find(s => s.index === sceneIndex);
    const actualType = (type === "event" || type === "new_event") ? "event" : "scene";
    

    // If it doesn't exist (ie created via search dropdown), build it and push it to the mod array
    if (!sceneData) {
        sceneData = { 
            index: sceneIndex, 
            content: "t Placeholder\nfinish" 
        };
        if (actualType === "event") {
            sceneData.name = "New Event";
            sceneData.image = "";
            sceneData.requirements = "";
            sceneData.tags = "";
            sceneData.content = "t Placeholder";
        }
        workingArray.push(sceneData);
    }

    //Inject new entry into relevant array in storageArray for writing
    if (actualType === "event") {
        if (!workingCharacter.events) {
            workingCharacter.events = [];
        }
        if (!workingCharacter.events.find(s => s.index === sceneIndex)) {
            workingCharacter.events.push(sceneData);
        }
    } else {
        if (!workingCharacter.scenes) {
            workingCharacter.scenes = [];
        }
        if (!workingCharacter.scenes.find(s => s.index === sceneIndex)) {
            workingCharacter.scenes.push(sceneData);
        }
    }

    // Buffers for unsaved changes
    let contentBuffer = sceneData.content;
    let metaBuffer = actualType === "event" ? {
        name: sceneData.name, image: sceneData.image, requirements: sceneData.requirements, tags: sceneData.tags
    } : null;
    
    // State variable for future block/raw conversion
    let isBlockFormat = true;

    // 2. Main Window Creation
    const windowDiv = document.createElement("div");
    windowDiv.className = "syrup-window";
    if (actualType === "event") windowDiv.style.border = "5px solid #fcb5b5";
    windowDiv.setAttribute('data-editor-id', `${characterIndex}-${sceneIndex}-${actualType}`);

    // 3. Header Upper
    const headerUpper = document.createElement("div");
    headerUpper.className = "syrup-header-upper";
    let headerUpperTitle = actualType === "event" ? "⭐ Event" : "🎬 Scene";
    let headerColor = actualType === "event" ? "#fcb5b5" : "#FCEBB5";
    
    headerUpper.innerHTML = `<h3 style="margin:0; font-size:var(--fs-medium, 1.2em); color:${headerColor};">${headerUpperTitle}: ${sceneIndex}</h3>`;

    const collapseBtn = document.createElement("button");
    collapseBtn.className = "syrup-btn";
    collapseBtn.innerText = "▼ Collapse";
    var collapseBtnColor = type == "event" ? "#fcb5b5" : "#FCEBB5";
    collapseBtn.style.backgroundColor = collapseBtnColor;
    collapseBtn.onclick = () => {
        windowDiv.classList.toggle("collapsed");
        collapseBtn.innerText = windowDiv.classList.contains("collapsed") ? "▶ Expand" : "▼ Collapse";
    };
    headerUpper.appendChild(collapseBtn);
    windowDiv.append(headerUpper);

    // Status Helper Function
    const updateSavedStatus = () => {
        //console.info("!!! UPDATING BUFFER?")
        const statusIcon = windowDiv.querySelector(".saved-status");
        if (!statusIcon) return;

        let isSaved = contentBuffer === sceneData.content;

        if (actualType === "event") {
            // Compare current global buffer vs the original data
            const currentReqs = window.syrupEditorBuffers[bufferKey] || sceneData.requirements;
            
            isSaved = isSaved && 
                    currentReqs === sceneData.requirements &&
                    metaBuffer.name === sceneData.name &&
                    metaBuffer.image === sceneData.image &&
                    metaBuffer.tags === sceneData.tags;
        }
        statusIcon.innerText = isSaved ? "✔️ Saved" : "⚠️ Unsaved Changes";
        statusIcon.style.color = isSaved ? "#8f8" : "#f88";
    };

    // 3b. Header Lower (EVENTS ONLY)
    if (actualType === "event") {
        const headerLower = document.createElement("div");
        headerLower.className = "syrup-header-lower";
        
        const createMetaInput = (label, key, width = "100px") => {
            let wrap = document.createElement("div");
            wrap.innerHTML = `<small style="display:block; color:#fcb5b5">${label}</small>`;
            let input = document.createElement("input");
            if (label=="Special") {
                input.dataset.tooltip = "(Optional!) Used for specific event logic. <br>For example, writing 'mini' will cause your event to not appear in the gallery.";
            }
            if (label=="Tags") {
                input.dataset.tooltip = "(Optional!) Any specific fetishes that should be associated with this event.<br>For example, writing 'feral' here will cause the scene to not appear in the gallery if the player has feral content turned off.";
            }
            input.className = "syrup-input meta-text-input";
            input.style.width = width;
            input.value = metaBuffer[key] || "";
            input.oninput = (e) => { 
                metaBuffer[key] = e.target.value; 
                updateSavedStatus(); 
            };
            wrap.appendChild(input);
            return wrap;
        };

        // Initialize image component
        const imageThumbComponent = eventImageComponent(
            metaBuffer, 
            characterIndex, 
            sceneIndex, 
            updateSavedStatus
        );

        const reqShell = eventRequirementComponent(characterIndex, sceneIndex, sceneData.requirements, updateSavedStatus);
        headerLower.appendChild(reqShell);
        windowDiv.append(headerLower);

        headerLower.append(
            imageThumbComponent,
            createMetaInput("Special", "name", "150px"),
            createMetaInput("Tags", "tags", "100px"),
            reqShell,
        );
        windowDiv.append(headerLower);
    }

    // 4. Contents (The Editor Space)
    const contentsDiv = document.createElement("div");
    contentsDiv.className = "syrup-contents";

    const textAreaWrapper = document.createElement("div");
    //textAreaWrapper.style.position = "relative";
    textAreaWrapper.style.height = "100%"; 

    const textArea = document.createElement("textarea");
    textArea.className = "syrup-textarea";
    textArea.value = contentBuffer;
    textArea.oninput = (e) => {
        contentBuffer = e.target.value;
        updateSavedStatus();
    };

    textAreaWrapper.appendChild(textArea);
    contentsDiv.appendChild(textAreaWrapper);

    // 5. Footer Upper (Sticky actions)
    const footerUpper = document.createElement("div");
    footerUpper.className = "syrup-footer-upper";

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "syrup-btn";
    toggleBtn.innerText = "Toggle Format";
    toggleBtn.dataset.tooltip = "Toggle between assisted and raw text mode.<br>In assisted, you'll have the suggestion box and ability to upload images.<br>In raw text mode, you can more easily copy/paste data.";
    toggleBtn.onclick = () => {
        isBlockFormat = !isBlockFormat;
        
        toggleSceneWindow(
            textAreaWrapper, 
            contentBuffer, 
            isBlockFormat, 
            
            // Callback 1: onUpdate (Keeps the buffer and save icon in perfect sync)
            (newVal) => { 
                contentBuffer = newVal; 
                updateSavedStatus(); 
            },
            
            // Callback 2: rebuildAssisted (Reboots the block editor with full permissions)
            () => {
                initializeSceneWriter(
                    textAreaWrapper, 
                    characterIndex, 
                    sceneIndex,
                    () => contentBuffer,
                    (newVal) => { contentBuffer = newVal; updateSavedStatus(); }
                );
            }
        );
    };

    const saveBtn = document.createElement("button");
    saveBtn.className = "syrup-btn";
    saveBtn.innerText = "Save";
    saveBtn.onclick = () => {
        commitTempImagesToGlobal();
        sceneData.content = contentBuffer; 
        if (actualType === "event") {
            sceneData.name = metaBuffer.name;
            sceneData.image = metaBuffer.image;
            sceneData.tags = metaBuffer.tags;
            
            // GRAB FROM BUFFER: This is the crucial bridge
            if (window.syrupEditorBuffers[bufferKey] !== undefined) {
                sceneData.requirements = window.syrupEditorBuffers[bufferKey];
            }
        }
        updateSavedStatus();
    };
    saveBtn.dataset.tooltip = "Save changes to this scene.";

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "syrup-btn syrup-btn-danger";
    cancelBtn.innerText = "Cancel";
    cancelBtn.onclick = () => {
        // Reset Text
        contentBuffer = sceneData.content;

        if (isBlockFormat) {
            initializeSceneWriter(
                textAreaWrapper, characterIndex, sceneIndex,
                () => contentBuffer,
                (newVal) => { contentBuffer = newVal; updateSavedStatus(); }
            );
        }
        else {
            // Find whatever textarea is currently alive in the DOM
            const activeTextarea = textAreaWrapper.querySelector('textarea');
            if (activeTextarea) activeTextarea.value = contentBuffer;
        }

        // Reset Requirements Shell visually
        if (actualType === "event") {
            const oldShell = windowDiv.querySelector(".syrup-req-shell");
            const newShell = eventRequirementComponent(characterIndex, sceneIndex, sceneData.requirements);
            oldShell.replaceWith(newShell);

            // Quick hack to reset visual inputs without re-rendering everything
            metaBuffer = { name: sceneData.name, image: sceneData.image, tags: sceneData.tags };

            // Reset text inputs visually
            let inputs = windowDiv.querySelectorAll('.syrup-header-lower .meta-text-input');
            if(inputs.length === 3) {
                inputs[0].value = metaBuffer.name; 
                inputs[1].value = metaBuffer.image;
                inputs[2].value = metaBuffer.tags;
            }
        }
        updateSavedStatus();
    };
    cancelBtn.dataset.tooltip = "Discard changes made since the scene was last saved.";

    let btnGroup = document.createElement("div");
    btnGroup.style.display = "flex"; btnGroup.style.gap = "10px";
    btnGroup.append(saveBtn, cancelBtn);
    footerUpper.append(toggleBtn, btnGroup);

    // 6. Footer Lower
    const footerLower = document.createElement("div");
    footerLower.className = "syrup-footer-lower";
    footerLower.innerHTML = `<span class="saved-status" style="color:#8f8;">✔️ Saved</span>`;

    const closeBtn = document.createElement("button");
    closeBtn.className = "syrup-btn syrup-btn-danger";
    closeBtn.innerText = "Close Window";
    closeBtn.onclick = () => {
        // Basic unsaved check
        const currentReqs = window.syrupEditorBuffers[bufferKey];
        const isDirty = contentBuffer !== sceneData.content || (actualType === "event" && currentReqs !== sceneData.requirements);

        if (isDirty && !confirm("Unsaved changes will be lost. Close anyway?")) return;
        
        // CLEANUP: Important so we don't bloat memory
        delete window.syrupEditorBuffers[bufferKey];
        windowDiv.remove();
    };
    closeBtn.dataset.tooltip = "Remove this window from the screen. You can always reopen it later.<br>Did you remember to save?";
    footerLower.appendChild(closeBtn);

    windowDiv.append(contentsDiv, footerUpper, footerLower);
    container.appendChild(windowDiv);
    
    initializeSceneWriter(
        textAreaWrapper,
        characterIndex,
        sceneIndex,
        () => contentBuffer,
        (newVal) => { contentBuffer = newVal; updateSavedStatus(); }
    );
}

function componentSceneEventSearch(characterIndex, itemIndex, type, onSelect) {
    const wrapper = document.createElement("div");
    wrapper.className = "scene-search-wrapper";
    wrapper.style.position = "relative";
    wrapper.style.width = "400px";

    const searchInput = document.createElement("input");
    searchInput.className = "syrup-input";
    searchInput.placeholder = "Search or browse scenes/events...";
    searchInput.style.width = "100%";
    searchInput.style.boxSizing = "border-box";
    searchInput.dataset.tooltip = "You can open a new scene or event here by typing in its name."

    const resultsDiv = document.createElement("div");
    resultsDiv.className = "search-results-dropdown syrup";
    resultsDiv.style.display = "none";
    resultsDiv.style.position = "absolute";
    resultsDiv.style.top = "100%";
    resultsDiv.style.left = "0";
    resultsDiv.style.width = "100%";
    resultsDiv.style.maxHeight = "350px";
    resultsDiv.style.overflowY = "auto";
    resultsDiv.style.zIndex = "100";
    resultsDiv.style.background = "rgba(40, 20, 0, 0.95)";

    const performSearch = () => {
        const query = searchInput.value.toLowerCase().trim();
        resultsDiv.innerHTML = "";

        console.info("Syrup Editor: Performing scene/event search for character", characterIndex, "and query", query);

        // 1. GATHER DATA
        let allItems = [];
        const charData = storageArray.customCharacters.find(c => c.index === characterIndex);
        
        if (!charData) return;

        // Add scenes
        charData.scenes.forEach(s => {
            allItems.push({ charIndex: characterIndex, itemIndex: s.index, type: 'scene', name: null });
        });
        // Add events
        charData.events.forEach(e => {
            allItems.push({ charIndex: characterIndex, itemIndex: e.index, type: 'event', name: e.name });
        });

        // 2. SORTING (Scenes before Events, then Alphabetical)
        allItems.sort((a, b) => {
            if (a.type !== b.type) {
                return a.type === 'scene' ? -1 : 1; // Scene always comes first
            }
            return a.itemIndex.localeCompare(b.itemIndex); // Then alphabetical by index
        });

        // 3. CREATE NEW OPTIONS (Only if query is not empty)
        if (query !== "") {
            const exactMatch = allItems.some(item => item.itemIndex.toLowerCase() === query);
            if (!exactMatch) {
                ["scene", "event"].forEach(newType => {
                    const row = document.createElement("div");
                    row.className = "search-row create-new";
                    row.style.padding = "8px 10px";
                    row.style.borderBottom = "2px solid #FCEBB5";
                    row.innerHTML = `<b style="color:#8f8">+ Create New ${newType}: "${query}"</b>`;
                    row.onmousedown = (e) => {
                        e.preventDefault();
                        onSelect(`new_${newType}`, characterIndex, query);
                        searchInput.value = "";
                        resultsDiv.style.display = "none";
                    };
                    resultsDiv.appendChild(row);
                });
            }
        }

        // 4. RENDER LIST (Filtered if query exists, otherwise full list)
        const filtered = query === "" ? allItems : allItems.filter(item => 
            item.itemIndex.toLowerCase().includes(query) || 
            (item.name && item.name.toLowerCase().includes(query))
        );

        filtered.forEach(match => {
            // Check if this is already open in the editor
            const existingWindow = document.querySelector(`[data-editor-id="${characterIndex}-${match.itemIndex}-${match.type}"]`);
            
            const row = document.createElement("div");
            row.className = `search-row ${match.type}`;
            row.style.padding = "5px 10px";
            row.style.cursor = "pointer";
            row.style.opacity = existingWindow ? "0.5" : "1"; // Dim if already open
            row.style.borderBottom = "1px solid rgba(255,255,255,0.1)";

            const typeLabel = match.type === 'scene' ? '🎬' : '⭐';
            const openStatus = existingWindow ? " <small>(Open)</small>" : "";
            
            row.innerHTML = `
                <span style="color:#FCEBB5">${typeLabel}</span> 
                <b>${match.itemIndex}</b> 
                ${match.name ? `<i>(${match.name})</i>` : ""}
                <span style="color:#aaa">${openStatus}</span>
            `;

            row.onmousedown = (e) => {
                e.preventDefault();
                if (existingWindow) {
                    // Instead of appending, scroll to it and "flash" it
                    existingWindow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    existingWindow.style.outline = "5px solid #FCEBB5";
                    setTimeout(() => existingWindow.style.outline = "none", 1000);
                } else {
                    onSelect(match.type, match.charIndex, match.itemIndex);
                }
                searchInput.value = "";
                resultsDiv.style.display = "none";
            };

            // Hover effects
            row.onmouseenter = () => row.style.backgroundColor = "rgba(255,255,255,0.1)";
            row.onmouseleave = () => row.style.backgroundColor = "transparent";

            resultsDiv.appendChild(row);
        });

        resultsDiv.style.display = filtered.length > 0 || query !== "" ? "block" : "none";
    };

    searchInput.onfocus = performSearch;
    searchInput.oninput = performSearch;
    searchInput.onblur = () => { setTimeout(() => resultsDiv.style.display = "none", 200); };

    wrapper.append(searchInput, resultsDiv);
    return wrapper;
}

function eventImageComponent(metaBuffer, characterIndex, eventIndex, onUpdate) {
    const wrapper = document.createElement("div");
    wrapper.className = "syrup-event-image-container";
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.alignItems = "center";
    wrapper.style.gap = "5px";

    const label = document.createElement("small");
    label.style.color = "#fcb5b5";
    label.innerText = "Thumbnail";
    
    const contentDiv = document.createElement("div");
    
    // An internal render function so we can hot-swap the button for the image
    const render = () => {
        contentDiv.innerHTML = "";
        
        // Check if no image exists (or if it's the default literal string from creation)
        if (!metaBuffer.image || metaBuffer.image === "" || metaBuffer.image === "placeholder/image") {
            const createBtn = document.createElement("button");
            createBtn.className = "syrup-btn";
            createBtn.innerText = "➕ Create Image";
            createBtn.dataset.tooltip = "(Optional!) Create an image to use as the event's thumbnail for the gallery.<br>If you don't create one, the first image in the event will be used instead.";
            
            createBtn.onclick = async () => {
                // Generate a logical path for the new event image
                const newPath = `${characterIndex}/events/${eventIndex}`;
                
                // Call your existing placeholder logic (you may need to point this to a real generic default image path)
                const fallbackImgSrc = "images-webp/placeholder/expressions/happy.webp"; 
                await placeholderImage(newPath, fallbackImgSrc);
                
                metaBuffer.image = newPath;
                onUpdate(); // Trigger updateSavedStatus
                render();   // Re-render this component to show the new thumbnail
            };
            
            contentDiv.appendChild(createBtn);
        } else {
            // It has an image! Render the thumbnail
            
            // --- NEW: Wrap the image so we can absolutely position the 'X' ---
            const imageWrapper = document.createElement("div");
            imageWrapper.style.position = "relative";
            imageWrapper.style.display = "inline-block"; 

            const img = document.createElement("img");
            img.className = "modEditableImage"; // Triggers your global click listener!
            img.style.width = "60px";
            img.style.height = "60px";
            img.style.objectFit = "cover";
            img.style.border = "2px dashed #FCEBB5";
            img.style.borderRadius = "8px";
            img.style.cursor = "pointer";
            
            // Assign datasets required by your global image functions
            img.dataset.path = metaBuffer.image;
            img.dataset.target = eventIndex;
            img.id = `eventThumb-${characterIndex}-${eventIndex}`; 

            // Resolve via cleanupImage so an unfilled slot shows the placeholder cross (not a broken
            // file), and a real upload shows its blob. (The old manual fallback to a raw
            // images-webp/<path>.webp is what produced the broken-image icon.)
            img.src = cleanupImage(metaBuffer.image);

            // --- NEW: The Clear Button ---
            const clearBtn = document.createElement("button");
            clearBtn.innerHTML = "✖";
            clearBtn.className = "syrup-btn syrup-btn-danger";
            clearBtn.style.cssText = `
                position: absolute;
                top: -8px;
                right: -8px;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                padding: 0;
                font-size:var(--fs-tiny, 10px);
                line-height: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10;
            `;

            clearBtn.onclick = (e) => {
                e.stopPropagation(); // Prevent the image click listener from firing
                metaBuffer.image = "";
                onUpdate(); // Flag as unsaved
                render();   // Instantly switch the UI back to the "Create Image" button!
            };

            // Observe the DOM element for data-path changes
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === "attributes" && mutation.attributeName === "data-path") {
                        metaBuffer.image = img.dataset.path;
                        onUpdate(); // Warn the user there are unsaved changes
                    }
                });
            });
            
            observer.observe(img, { attributes: true });

            // Pack it all together
            imageWrapper.appendChild(img);
            imageWrapper.appendChild(clearBtn);
            contentDiv.appendChild(imageWrapper);
        }
    };

    render();
    wrapper.append(label, contentDiv);
    return wrapper;
}

function eventRequirementComponent(characterIndex, itemIndex, reqString, onChange) {
    const bufferKey = `${characterIndex}_${itemIndex}`;
    const containerId = `req-container-${bufferKey.replace(/[^a-zA-Z0-9]/g, '_')}`; // Sanitize ID
    
    // 1. Initialize/Refresh the buffer for this specific scene
    window.syrupEditorBuffers[bufferKey] = reqString;

    // 2. Create the shell
    const shell = document.createElement("div");
    shell.id = containerId;
    shell.className = "syrup-req-shell";
    shell.style.width = "100%";
    shell.style.padding = "10px";
    shell.style.background = "rgba(0,0,0,0.2)";
    shell.style.borderRadius = "8px";

    // 3. Trigger existing logic
    const triggerUpdate = () => setTimeout(onChange, 50);
    
    shell.addEventListener('change', triggerUpdate);
    shell.addEventListener('click', (e) => {
        // Only trigger if they clicked something relevant (button or span)
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'SPAN') {
            triggerUpdate();
        }
    });

    const path = `window.syrupEditorBuffers["${bufferKey}"]`;
    requestAnimationFrame(() => {
        if (document.getElementById(containerId)) {
            createRequirementBlock(containerId, reqString, path);
        }
    });

    return shell;
}

//Scene edit text area
function initializeSceneWriter(container, characterIndex, sceneIndex, getBuffer, setBuffer) {
    aliasDictionaryAssembly();
    container.innerHTML = ''; // Clear any leftover textareas/placeholders
    
    // Function to update the line numbers (1, 2, 3...) manually via JS
    const refreshLineNumbers = () => {
        const rows = container.querySelectorAll('.syrup-editor-row');
        rows.forEach((row, i) => {
            const numSpan = row.querySelector('.syrup-line-number');
            if (numSpan) numSpan.innerText = i + 1;
        });
    };

    const recompose = () => {
        const rows = container.querySelectorAll('.syrup-editor-row');
        const newContent = Array.from(rows).map(row => {
            // If it's a widget row, safely extract the stamped string!
            if (row.hasAttribute('data-raw-value')) {
                return row.getAttribute('data-raw-value');
            }
            // Otherwise, extract the text from the visible input
            const input = row.querySelector('.syrup-line-input');
            return input ? input.innerText : "";
        }).join('\n');
        
        setBuffer(newContent);
    };

    const build = () => {
        container.innerHTML = '';
        const buffer = getBuffer();
        // Ensure we have at least one empty line if the buffer is empty
        const lines = buffer.length > 0 ? buffer.split('\n') : [""];

        lines.forEach((lineText) => {
            // We pass recompose and refreshLineNumbers as callbacks
            const row = createEditorLine(container, lineText, recompose, refreshLineNumbers);
            container.appendChild(row);
        });
        refreshLineNumbers();
    };

    build();
}

function createEditorLine(container, text, onChange, onRowStructureChange) {
	//Line Creation
    const row = document.createElement("div");
    row.className = "syrup-editor-row";

    const lineNum = document.createElement("span");
    lineNum.className = "syrup-line-number";
    // Handled by refreshLineNumbers()

	//Req Button
    const reqBtn = document.createElement("button");
    reqBtn.className = "syrup-line-req-btn";
    reqBtn.innerText = "REQ";

    // Visual toggle for the REQ button
    const updateReqVisibility = () => {
        const val = lineInput.innerText;
        if (val.trim().length != 0 && val != "<br>") {
            reqBtn.style.opacity = 1;
            reqBtn.style.display = "block";
        }
        else {
            reqBtn.style.display = "none";
        }
    };

    reqBtn.onclick = () => {
        const rows = Array.from(container.querySelectorAll('.syrup-editor-row'));
        const currentIndex = rows.indexOf(row);
        
        // Pass the container so we can attach the overlay to it
        openRequirementWindow(lineInput.innerText, container, (updatedLine) => {
            lineInput.innerText = updatedLine;
            updateReqVisibility();
            onChange();
        });
    };
	
	//Line Input
    const lineInput = document.createElement("div");
    lineInput.className = "syrup-line-input";
    lineInput.contentEditable = "true";
    lineInput.innerText = text;

	//Offload suggestion box and ghost text code, run them on click, keyup, input, focus, whatever
    lineInput.oninput = () => {
        updateEditorUI(lineInput);
        updateReqVisibility();
        onChange();
    };
    lineInput.onclick = () => updateEditorUI(lineInput);
    lineInput.onkeyup = () => updateEditorUI(lineInput);
    lineInput.onfocus = () => updateEditorUI(lineInput);
    lineInput.onblur = () => {
        // Nuke the ghost text immediately when the user clicks away
        lineInput.removeAttribute("data-ghost");
    };

    lineInput.onkeydown = (e) => {
        console.info(lineInput.innerText);
		switch (e.key) {
			case "Enter": {
				e.preventDefault();
				
				// 1. Find exactly where the cursor is
				const cursorOffset = getCursorCharacterOffsetWithin(lineInput);
				const fullText = lineInput.innerText;

				// 2. Split the text
				const textBefore = fullText.slice(0, cursorOffset);
				const textAfter = fullText.slice(cursorOffset);

				// 3. Update the current line to only have the text before the cursor
				lineInput.innerText = textBefore;

				// 4. Create the new row using the text after the cursor
				const newRow = createEditorLine(container, textAfter, onChange, onRowStructureChange);
				row.after(newRow);
				
				onRowStructureChange(); 

				// 5. Focus the new line and put the cursor at the very beginning
				const newInput = newRow.querySelector('.syrup-line-input');
				newInput.focus();
				
				const range = document.createRange();
				const sel = window.getSelection();
				// Safety check: if textAfter is empty, firstChild might be null
				const textNode = newInput.firstChild || newInput; 
				range.setStart(textNode, 0);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);

				onChange();
				break;
			}
			case "ArrowUp": {
				const prevRow = row.previousSibling;
				if (prevRow && prevRow.classList.contains('syrup-editor-row')) {
					e.preventDefault();
					const prevInput = prevRow.querySelector('.syrup-line-input');
					prevInput.focus();
					// Move cursor to the end of the line above
					window.getSelection().selectAllChildren(prevInput);
					window.getSelection().collapseToEnd();
					onChange();
				}
				break;
			}
			case "ArrowDown": {
				const nextRow = row.nextSibling;
				if (nextRow && nextRow.classList.contains('syrup-editor-row')) {
					e.preventDefault();
					const nextInput = nextRow.querySelector('.syrup-line-input');
					nextInput.focus();
					// Move cursor to the end of the line below
					window.getSelection().selectAllChildren(nextInput);
					window.getSelection().collapseToEnd();
					onChange();
				}
				break;
			}
			case "Backspace": {
				// Only delete if there are other lines left
				if (container.querySelectorAll('.syrup-editor-row').length > 1) {
					//if (cursor at start of line)
                    if (getCursorCharacterOffsetWithin(lineInput) == 0) {
						e.preventDefault();
						const prevRow = row.previousSibling;
						//Move cursor to end of previous line
						if (prevRow) {
							const prevInput = prevRow.querySelector('.syrup-line-input');
							prevInput.focus();
							// Move cursor to end of previous line
							window.getSelection().selectAllChildren(prevInput);
							window.getSelection().collapseToEnd();
						}
						//append content of line (if any) to start of previous line
                        if (lineInput.innerText.length > 0) {
                            prevRow.querySelector('.syrup-line-input').innerText += lineInput.innerText;
                        }
						//delete line
						row.remove();
						onRowStructureChange();
						onChange();
                    }
				}
				break;
			}
		}
    };

    row.append(lineNum, lineInput, reqBtn);
    updateReqVisibility();
    return row;
}

function updateEditorUI(inputEl) {
    const rowElement = inputEl.closest('.syrup-editor-row');
    const windowElement = inputEl.closest('.syrup-window');

    //Check if writing in an event, for specific tooltips
    const isEventWindow = windowElement ? windowElement.getAttribute('data-editor-id').endsWith('-event') : false;
    
    // If the input is hidden by a widget, innerText returns "". Read from the stamp instead
    let text = inputEl.innerText;
    if (inputEl.style.display === "none" && rowElement && rowElement.hasAttribute('data-raw-value')) {
        text = rowElement.getAttribute('data-raw-value');
    }

    const cursorIndex = getCursorCharacterOffsetWithin(inputEl);

    const context = analyzeLine(text, cursorIndex);
    const suggestionData = processLine(context, isEventWindow);

    // 1. Tooltips
    if (typeof tooltip === "function") {
        if (suggestionData.tooltip) tooltip(suggestionData.tooltip, true);
        else tooltip("", true);
    }

    // 2. Line-Level Inserts (Images, Widgets, etc.)
    if (rowElement) {
        updateImageInsert(rowElement, context.linkedImage);
        
        // Trigger the item/location widget logic
        updateWidgetInsert(rowElement, context.insertState, "mayor");
    }

    // 3. Autocomplete Dropdown
    showSuggestions(suggestionData, inputEl, context);
}

function getCursorCharacterOffsetWithin(element) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    if (!element.contains(range.commonAncestorContainer)) {
        return 0;
    }
    
    const preRange = range.cloneRange();
    preRange.selectNodeContents(element);
    preRange.setEnd(range.endContainer, range.endOffset);
    
    return preRange.toString().length;
}

//Simple structural parser, splitting text into tokens
function tokenize(text) {
    return text.match(/[^;\s]+|;|\s+/g) || [];
}

function cleanupSceneWindow(container) {
    const rows = container.querySelectorAll('.syrup-editor-row');
    const validSpeakers = getValidOptions(getCharacterList);
    const validFunctions = getValidOptions(getFunctionList);

    rows.forEach(row => {
        const inputEl = row.querySelector('.syrup-line-input');
        if (!inputEl) return;

        let text = inputEl.innerText.trim();
        if (!text) return; // Skip empty lines

        let changed = false;

        // --- FIX A & B: Missing 'sp' or 'eval' commands ---
        const startMatch = text.match(/^([a-zA-Z0-9_-]+)(;|\s|$)/);
        
        if (startMatch) {
            const firstWord = startMatch[1];
            const validCommands = simplerEditSchema.commands;
            
            // Only auto-correct if it's NOT already a valid command!
            if (!validCommands.includes(firstWord)) {
                
                // Check if they just typed a speaker's name/alias
                if (checkValidity(firstWord, validSpeakers) !== "INVALID") {
                    const remainder = text.slice(startMatch[0].length).trim();
                    text = `sp ${firstWord}; ${remainder}`;
                    changed = true;
                } 
                // Check if they just typed a raw function name
                else if (checkValidity(firstWord, validFunctions) !== "INVALID") {
                    text = `eval ${text}`;
                    changed = true;
                }
            }
        }

        // --- FIX C: Unclosed 'eval' formatting ---
        if (text.startsWith("eval ")) {
            // Temporarily strip trailing semicolons/spaces to evaluate the true ending
            let cleanText = text.replace(/;+\s*$/, '').trim();
            
            // Count the quotes to see if one was left unclosed
            const singleQuotes = (cleanText.match(/'/g) || []).length;
            const doubleQuotes = (cleanText.match(/"/g) || []).length;

            if (singleQuotes % 2 !== 0) {
                cleanText += "'";
                changed = true;
            }
            if (doubleQuotes % 2 !== 0) {
                cleanText += '"';
                changed = true;
            }

            // Ensure the function call is closed
            if (!cleanText.endsWith(")")) {
                cleanText += ")";
                changed = true;
            }

            // Always ensure the line ends with a final semicolon
            const finalizedText = cleanText + ";";
            if (text !== finalizedText) {
                text = finalizedText;
                changed = true;
            }
        }

        // --- APPLY & RENDER ---
        if (changed) {
            inputEl.innerText = text;
        }

        // ensures that even if a line didn't need syntax cleanup, its widgets, images, and states are instantly rendered when toggling formats.
        updateEditorUI(inputEl);
    });
}

function toggleSceneWindow(container, contentBuffer, isBlockFormat, onUpdate, rebuildAssisted) {
    console.info(contentBuffer)
    if (isBlockFormat) {
        // --- RAW TO ASSISTED ---
        container.innerHTML = "";
        
        // Use the parent's initialization function so it gets the REAL callbacks!
        rebuildAssisted();
        
        if (typeof cleanupSceneWindow === "function") cleanupSceneWindow(container);

    } else {
        // --- ASSISTED TO RAW ---
        // READ THE ROWS FIRST!
        const rows = container.querySelectorAll('.syrup-editor-row');
        let extractedLines = [];

        rows.forEach(row => {
            if (row.hasAttribute('data-raw-value')) {
                extractedLines.push(row.getAttribute('data-raw-value'));
            } else {
                const inputEl = row.querySelector('.syrup-line-input');
                if (inputEl) {
                    extractedLines.push(inputEl.innerText.replace(/\u00a0/g, " ").trimEnd());
                }
            }
        });

        const newContent = extractedLines.join('\n');
        
        // IMMEDIATELY sync the parent's buffer so the toggle registers as a change
        onUpdate(newContent); 

        // NOW we can safely clear the container
        container.innerHTML = "";

        const rawArea = document.createElement("textarea");
        rawArea.className = "syrup-raw-textarea";
        rawArea.style.width = "100%";
        rawArea.style.height = "500px"; 
        rawArea.style.backgroundColor = "rgba(20, 10, 0, 0.8)";
        rawArea.style.color = "#fff";
        rawArea.style.border = "1px solid #FCEBB5";
        rawArea.style.padding = "10px";
        rawArea.style.fontFamily = "monospace";
        
        rawArea.value = newContent;

        // Sync the parent's buffer on EVERY keystroke!
        rawArea.oninput = (e) => {
            onUpdate(e.target.value);
        };

        container.appendChild(rawArea);
    }
}

const simplerEditSchema = {
    commands: ["t", "sp", "trans", "event", "im", "finish", "cancel", "eval"],
    definitions: {
        sp: [
            { type: "speaker", source: getCharacterList, suffix: ";" },
            { 
                type: "special_arg", 
                repeatable: true, 
                source: ["altName", "altColor", "altImage", "special", "emotion"], 
                suffix: " " // e.g., "emotion " (waiting for the value)
            }
        ],
        trans: [
            { type: "scene", source: getSceneList, suffix: ";" }
        ],
        event: [
            { type: "event", source: getEventList, suffix: "" }
        ],
        eval: [
            { type: "function", source: getFunctionList, suffix: "" }
        ]
    }
};

function getValidOptions(source) {
    if (!source) return [];
    const rawList = typeof source === "function" ? source() : source;
    return rawList.map(item => typeof item === "string" ? item : item.value);
}

function analyzeLine(text, cursorIndex) {
    //split the line based on exactly where the cursor sits
    const textBefore = text.slice(0, cursorIndex);
    const textAfter = text.slice(cursorIndex);

    //get trailing content (if any) and the partial word before the cursor
    const matchBefore = textBefore.match(/[^;\s]+$/);
    const matchAfter = textAfter.match(/^[^;\s]+/);

    const partialBefore = matchBefore ? matchBefore[0] : "";
    const partialAfter = matchAfter ? matchAfter[0] : "";
    
    //combine them to see the full word the user is currently editing
    const activeWord = partialBefore + partialAfter;

    //evaulate syntax up to the end of the current word
    const evaluationText = textBefore + partialAfter;

    let debugData = {
        command: "",
        blockType: "command",
        activeKey: "", // Tracks the sub-argument (e.g., 'emotion')
        inputState: "EMPTY",
        activeWord: activeWord,
        replaceBefore: partialBefore,    // What to delete before the cursor
        replaceAfter: partialAfter,      // What to delete after the cursor
        typedSoFar: activeWord,          // filter by the ENTIRE word, not just the left half
        trailingText: textAfter.slice(partialAfter.length)
    };

    //Scan for images
    debugData.linkedImage = null; 

    const fullFirstSpace = text.indexOf(" ");
    const fullCommandRaw = fullFirstSpace === -1 ? text.trim() : text.slice(0, fullFirstSpace).trim();
    const fullArgsStr = fullFirstSpace === -1 ? "" : text.slice(fullFirstSpace + 1);
    
    if (fullCommandRaw === "im") {
        let rawArgs = fullArgsStr.split(";")[0].trim();
        // Chop off any requirements starting with ? or ! before checking for illegal spaces
        let imgPath = rawArgs.split(/(?=[?!])/)[0].trim();
        
        if (imgPath.includes(" ")) debugData.linkedImage = "ILLEGAL";
        else if (imgPath === "") debugData.linkedImage = "NONE";
        else debugData.linkedImage = imgPath;
    } 
    else if (fullCommandRaw === "sp") {
        const fullBlocks = fullArgsStr.split(";");
        // The first block after "sp" is the speaker — capture it so emotion suggestions can be
        // limited to that character's provided expressions (TF-5).
        debugData.speaker = fullBlocks[0] ? fullBlocks[0].trim() : "";
        for (let i = 1; i < fullBlocks.length; i++) {
            const blockText = fullBlocks[i].trim();
            if (!blockText) continue;
            
            const firstSpace = blockText.indexOf(" ");
            const firstWord = firstSpace === -1 ? blockText : blockText.slice(0, firstSpace);
            
            if (resolveAlias(firstWord) === "altImage") {
                let imgPath = firstSpace === -1 ? "" : blockText.slice(firstSpace + 1).trim();
                if (imgPath.includes(" ")) debugData.linkedImage = "ILLEGAL";
                else if (imgPath === "") debugData.linkedImage = "NONE";
                else debugData.linkedImage = imgPath;
                break; // Found it, stop scanning
            }
        }
    }
    debugData.insertState = null;
    if (fullCommandRaw === "eval") {
        // Find the first word after "eval ", e.g., "changeLocation"
        const funcMatch = fullArgsStr.match(/^\s*([a-zA-Z0-9_-]+)/);
        
        if (funcMatch) {
            const funcName = resolveAlias(funcMatch[1]);
            
            if (funcName === "changeLocation" || funcName === "addItem") {
                // Slice off the function name so we only pass the arguments to the evaluator
                const argsRaw = fullArgsStr.slice(funcMatch[0].length);
                debugData.insertState = checkInsertState(funcName, argsRaw);
            }
        }
    }

    if (evaluationText.length === 0) {
        logDebug(text, cursorIndex, debugData);
        return debugData;
    }

    if (partialAfter.length > 0) {
        debugData.inputState = "TRAILING_CONTENT";
    }

    // 1. Check Command State
    const firstSpaceIndex = evaluationText.indexOf(" ");
    
    if (firstSpaceIndex === -1) {
        debugData.command = evaluationText;
        const validCmds = simplerEditSchema.commands;
        
        if (validCmds.includes(evaluationText)) {
            debugData.inputState = "FINISHED"; 
        } else if (validCmds.some(c => c.startsWith(evaluationText))) {
            debugData.inputState = "PARTIAL";  
        } else {
            debugData.inputState = "INVALID";  
        }
        logDebug(text, cursorIndex, debugData);
        return debugData;
    }

    // 2. We have a command. Find our block.
    debugData.command = evaluationText.slice(0, firstSpaceIndex).trim();
    const afterCommand = evaluationText.slice(firstSpaceIndex + 1);

    if (debugData.command === "eval") {
        // Pass the raw string after "eval " to a dedicated parser
        return analyzeEvalLine(afterCommand, debugData, text); 
    }
    
    const def = simplerEditSchema.definitions[debugData.command];
    if (!def) {
        // It's a valid command but takes no arguments (e.g., 't', 'finish')
        if (simplerEditSchema.commands.includes(debugData.command)) {
            debugData.blockType = "free_text";
            debugData.inputState = "FREE_TEXT";
        } else {
            debugData.blockType = "unknown_command";
            debugData.inputState = "INVALID";
        }
        logDebug(text, cursorIndex, debugData);
        return debugData;
    }

    const blocks = afterCommand.split(";");
    const currentBlockIndex = blocks.length - 1;
    const currentBlockText = blocks[currentBlockIndex];

    

    let activeBlockDef = def[currentBlockIndex];
    let hasBrokenToDialogue = false;
    debugData.usedKeys = [];

    // If we exceed defined blocks, fallback to the repeatable block (if one exists)
    if (!activeBlockDef) {
        const repeatableDef = def.find(b => b.repeatable);
        const repeatableStartIndex = def.findIndex(b => b.repeatable);
        
        if (repeatableDef) {
            activeBlockDef = repeatableDef;
            const validKeys = getValidOptions(repeatableDef.source);
            
            // Scan previous blocks to see what keys have been used or if dialogue started
            for (let i = repeatableStartIndex; i <= currentBlockIndex; i++) {
                const blockWords = blocks[i].trimStart().split(/\s+/).filter(Boolean);
                if (blockWords.length > 0) {
                    const keyCandidate = blockWords[0];
                    const isKnownKey = checkValidity(keyCandidate, validKeys) !== "INVALID";
                    
                    if (i < currentBlockIndex) {
                        if (!isKnownKey) {
                            hasBrokenToDialogue = true;
                            break;
                        } else {
                            // Record the validated primary key
                            debugData.usedKeys.push(resolveAlias(keyCandidate));
                        }
                    }
                    if (i === currentBlockIndex && !isKnownKey) {
                        hasBrokenToDialogue = true;
                        break;
                    }
                }
            }
        }
    }

    if (hasBrokenToDialogue) {
        debugData.blockType = "free_text";
        debugData.inputState = "FREE_TEXT";
    } else {
        debugData.blockType = activeBlockDef ? activeBlockDef.type : "max_arguments_reached";
    }

    // 3. Determine state inside the block
    if (activeBlockDef && !hasBrokenToDialogue) {
        
        const words = currentBlockText.trimStart().split(/\s+/).filter(Boolean);
        const endsWithSpace = currentBlockText.endsWith(" ");
        let optionsToMatch = getValidOptions(activeBlockDef.source);

        // NEW: Filter out any keys we already used in previous blocks!
        if (activeBlockDef.type === "special_arg" && debugData.usedKeys.length > 0) {
            optionsToMatch = optionsToMatch.filter(opt => !debugData.usedKeys.includes(opt));
        }

        if (words.length === 0) {
            debugData.inputState = "EMPTY"; 
        } 
        else if (activeBlockDef.type === "special_arg") {
            const keyCandidate = words[0];
            const keyState = checkValidity(keyCandidate, optionsToMatch);

            if (keyState === "FINISHED") {
                // KEY DETECTED! Resolve alias instantly
                debugData.activeKey = resolveAlias(keyCandidate);
                
                if (debugData.activeKey === "emotion") {
                    optionsToMatch = getEmotionList(debugData.speaker);
                    debugData.blockType = "emotion_value";
                } else {
                    optionsToMatch = []; // Free-text arguments like altImage
                }

                if (words.length === 1 && !endsWithSpace) {
                    debugData.inputState = "NEEDS_SPACE_THEN_VALUE";
                } 
                else if (words.length === 1 && endsWithSpace) {
                    debugData.inputState = "READY_FOR_VALUE";
                } 
                else {
                    const currentVal = words[words.length - 1];
                    if (optionsToMatch.length === 0) {
                        debugData.inputState = "FREE_TEXT";
                    } else {
                        debugData.inputState = checkValidity(currentVal, optionsToMatch);
                    }
                }
            } 
            else if (keyState === "PARTIAL") {
                debugData.inputState = "PARTIAL";
            } 
            else {
                debugData.blockType = "free_text";
                debugData.inputState = "FREE_TEXT";
            }
        } 
        else {
            // STANDARD TERRITORY (Speaker, Scene, Event, etc.)
            if (endsWithSpace && words.length >= 1) {
                debugData.inputState = "FINISHED"; 
            } else {
                const currentVal = words[0];
                debugData.inputState = checkValidity(currentVal, optionsToMatch);
            }
        }
    }

    logDebug(text, cursorIndex, debugData);
    return debugData;
}

function processLine(context, isEventWindow) {
    let suggestionData = {
        action: "NONE", // "LIST", "HINT", or "NONE"
        items: [],      // Array of strings or objects to suggest
        message: ""     // Debug or hint message
    };

    // 1. Handling the Command Block
    if (context.blockType === "command") {
        if (context.inputState === "EMPTY") {
            suggestionData.action = "LIST";
            suggestionData.items = simplerEditSchema.commands.reverse();
            suggestionData.message = "Showing all commands";
        } 
        else if (context.inputState === "PARTIAL") {
            suggestionData.action = "LIST";
            suggestionData.items = simplerEditSchema.commands.filter(c => c.startsWith(context.typedSoFar));
            suggestionData.message = "Showing filtered commands";
        } 
        else if (context.inputState === "FINISHED") {
            // LOOKAHEAD: Command is done, grab the first required argument from the schema
            const def = simplerEditSchema.definitions[context.command];
            if (def && def[0] && def[0].source) {
                suggestionData.action = "LIST";
                suggestionData.items = getValidOptions(def[0].source);
                suggestionData.message = `Command complete: showing options for ${def[0].type}`;
            } else {
                suggestionData.action = "HINT";
                suggestionData.message = "Command complete: hit space to continue";
            }
        }
        else if (context.inputState === "INVALID") {
            suggestionData.action = "HINT";
            suggestionData.message = "Invalid command";
        }
    }
    // 1.5 Handling Eval Function Names specifically
    else if (context.blockType === "eval_function") {
        let sourceList = getValidOptions(getFunctionList);
        
        if (context.inputState === "EMPTY") {
            suggestionData.action = "LIST";
            suggestionData.items = sourceList;
            suggestionData.message = "Showing all functions";
        } else if (context.inputState === "PARTIAL") {
            suggestionData.action = "LIST";
            const intendedTarget = resolveAlias(context.typedSoFar);
            suggestionData.items = sourceList.filter(item => checkValidity(context.typedSoFar, [item]) !== "INVALID");
            suggestionData.message = `Showing filtered functions (Resolved: ${intendedTarget})`;
        } else if (context.inputState === "FINISHED") {
            suggestionData.action = "HINT";
            suggestionData.message = "Function complete: hit ( to begin arguments";
        } else if (context.inputState === "INVALID") {
            suggestionData.action = "HINT";
            suggestionData.message = "Invalid function name";
        }
    }
    // 2. Handling the Argument Blocks
    else if (context.blockType !== "unknown_command" && context.blockType !== "max_arguments_reached" && context.blockType !== "free_text") {
        // determine which list to pull from based on the active block
        let sourceList = [];
        if (context.blockType === "speaker") sourceList = getValidOptions(getCharacterList);
        else if (context.blockType === "scene") sourceList = getValidOptions(getSceneList);
        else if (context.blockType === "event") sourceList = getValidOptions(getEventList);
        else if (context.blockType === "function") sourceList = getValidOptions(getFunctionList.reverse());
        else if (context.blockType === "special_arg") sourceList = ["altName", "altColor", "altImage", "special", "emotion"];
        else if (context.blockType === "emotion_value") sourceList = getEmotionList(context.speaker).reverse();

        if (context.usedKeys && context.usedKeys.length > 0) {
            sourceList = sourceList.filter(k => !context.usedKeys.includes(k));
        }

        // Map the state to the appropriate action
        if (context.inputState === "EMPTY" || context.inputState === "READY_FOR_VALUE" || context.inputState === "NEEDS_SPACE_THEN_VALUE") {
            suggestionData.action = "LIST";
            suggestionData.items = sourceList;
            suggestionData.message = `Showing all options for ${context.blockType}`;
        }
        else if (context.inputState === "PARTIAL") {
            suggestionData.action = "LIST";

            // Resolve aliases before filtering
            const intendedTarget = resolveAlias(context.typedSoFar);
            
            // We use checkValidity here so if they type 'ang', it matches 'mayor' in the list
            suggestionData.items = sourceList.filter(item => checkValidity(context.typedSoFar, [item]) !== "INVALID");
            suggestionData.message = `Showing filtered options for ${context.blockType} (Resolved: ${intendedTarget})`;
        }
        else if (context.inputState === "FINISHED") {
            // Look into trailing text. Check appropriately for eval commas vs standard semicolons.
            if (context.isEvalArg) {
                if (context.trailingText.trimStart().startsWith(",") || context.trailingText.trimStart().startsWith(")")) {
                    suggestionData.action = "NONE";
                    suggestionData.message = "Eval argument complete and properly suffixed";
                } else {
                    suggestionData.action = "HINT";
                    suggestionData.message = "Argument complete: add a comma or closing parenthesis";
                }
            } else {
                if (context.trailingText.trimStart().startsWith(";")) {
                    suggestionData.action = "NONE";
                    suggestionData.message = "Argument complete and properly suffixed";
                } else {
                    suggestionData.action = "HINT";
                    suggestionData.message = "Argument complete: add a semicolon to start next argument";
                }
            }
        }
        else if (context.inputState === "INVALID") {
            suggestionData.action = "HINT";
            suggestionData.message = "Invalid argument value";
        }
        else if (context.inputState === "INSERT_WIDGET") {
            suggestionData.action = "HINT";
            suggestionData.message = "Awaiting custom insert widget";
        }
    }
    // 3. Fallbacks
    else {
        suggestionData.action = "HINT";
        suggestionData.message = "No further inputs expected or typing free text";
    }

    // --- TOOLTIP CALCULATION ---
    let tooltipText = "";

    // 1. "On Suggest" Tooltips
    if (context.blockType === "command" && context.inputState === "EMPTY") {
        tooltipText = "Select what kind of line you want to add, such as dialogue (sp) or basic text (t)";
    } else if (context.blockType === "speaker" && !context.isEvalArg) { 
        tooltipText = "SP command - displays a line of spoken dialogue.<br>Select which character will do the speaking using their codename. Typing in their name will filter the list.";
    } else if (context.blockType === "scene") {
        tooltipText = "TRANS command - creates a transition button to another scene. <br>Enter the index for the scene you want the button to go to.<br>After that, add a semicolon, and anything left will be used to make the text on the button itself.";
    } else if (context.blockType === "event") {
        tooltipText = "EVENT command - prints the contents of an event right here. You don't want to put any code such as changing trust or adding flags in the events themselves, since events are repeatable!";
    } else if (context.blockType === "eval_function") {
        tooltipText = "EVAL command - select a function, these are used to make the scene change variables like trust, or add flags.<br>These are case sensitive, so make sure you either select from the list or capitalize them properly!";
    } else if (context.blockType === "special_arg") {
        tooltipText = "Add any special arguments to change how the dialogue works. Such as setting the character's emotion, or setting an alternative image for the dialogue sprite.<br>Once you're done, add a semicolon and just type whatever dialogue you want.";
    } else if (context.inputState === "FINISHED" && suggestionData.message.includes("semicolon")) {
        tooltipText = "Don't forget to add a semicolon!";
    }

    // 2. "On Apply" Tooltips (Triggers when the cursor is inside the completed command/function)
    if (context.blockType === "free_text") {
        if (context.command === "t") tooltipText = "T command - displays a line of plain white text.<br>Go ahead and type anything you want!";
        else if (context.command === "im") tooltipText = "IM command - displays a picture. Type an image's URL, or click the button that replaced the line number to upload one now.";
        else if (context.command === "finish") tooltipText = "FINISH command - a shortcut that adds a button labeled \"Finish\" that will drop the player at their current location, ending the scene and making the character unencounterable until tomorrow.";
        else if (context.command === "cancel") tooltipText = "CANCEL command - a shortcut that adds a button labeled \"Go back\" that will drop the player at their current location, ending the scene, and making the character encounterable again.";
    }

    // 3. Eval Function Tooltips
    if (context.isEvalArg || (context.blockType === "eval_function" && context.inputState === "FINISHED")) {
        const fn = context.activeKey;
        if (fn === "passTime") tooltipText = "passTime() - a function which advances the time forward by one, so going from Morning to Evening, or Evening to Night.";
        else if (fn === "raiseTrust") tooltipText = "raiseTrust - a function which raises the character's hidden trust score, or lowers it if you use a negative number.<br>Select a character, then enter what their trust should be changed by.";
        else if (fn === "setTrust") tooltipText = "setTrust - a function which sets the character's hidden trust score to a specific number.<br>Select a character, then enter what their trust should set to.";
        else if (fn === "addFlag") tooltipText = "addFlag - a function which adds a flag to the chosen character's data, used for requirements too complex to use only trust. Select a character, then type the flag's name.";
        else if (fn === "removeFlag") tooltipText = "removeFlag - a function which removes a flag from the chosen character's data, if present. <br>Select a character, then type the flag's name.";
        else if (fn === "raiseMoney") tooltipText = "raiseMoney - a function which changes the player's money, useful if you want it to seem like they bought something.<br>Enter a number, even negative ones.";
        else if (fn === "addItem") tooltipText = "addItem - Select an item to add to the character's inventory, or create a brand new one right here.";
        else if (fn === "changeLocation") tooltipText = "changeLocation - Change the player's location here, including creating a new one.<br>You can use the finish or cancel button afterwards to make it feel like the player moved around during the scene.";
    }

    // 4. Event window-specific warning tooltips
    if (isEventWindow) {
        if (context.command === "finish") {
            tooltipText = "Warning! Events are repeatable, you probably don't want to add a finish command in an event.<br>Add it to the scene where you trigger the event instead!";
        }
        if (context.command === "cancel") {
            tooltipText = "Warning! Events are repeatable, you probably don't want to add a cancel command in an event.<br>Add it to the scene where you trigger the event instead!";
        }
        if (context.command === "eval") {
            tooltipText = "Warning! Events are repeatable, you probably want to be writing code or changing variables inside the event itself.<br>Add it to the scene where you trigger the event instead!";
        }
        if (context.command === "event") {
            tooltipText = "Warning! You're inserting an event inside of another event!<br>Are you sure you meant to do that?";
        }
    }

    suggestionData.tooltip = tooltipText;

    // --- REPLACEMENT & INSERTION CALCULATION ---
    let replaceOutput = "none";
    let addOnSuggest = "";

    if (suggestionData.action === "LIST") {
        if (context.blockType === "command" && context.inputState === "FINISHED") {
            replaceOutput = "none"; 
        } else if (context.replaceBefore && context.replaceAfter) {
            replaceOutput = `"${context.replaceBefore}" + "${context.replaceAfter}" (trailing)`;
        } else if (context.replaceBefore) {
            replaceOutput = `"${context.replaceBefore}"`;
        } else if (context.replaceAfter) {
            replaceOutput = `"${context.replaceAfter}" (trailing)`;
        }

        let suffix = "";
        let prefix = ""; // NEW: For eval quotes
        let valName = context.blockType;

        if (context.blockType === "command") {
            if (context.inputState === "FINISHED") {
                const def = simplerEditSchema.definitions[context.command];
                if (def && def[0]) {
                    suffix = def[0].suffix !== undefined ? def[0].suffix : "";
                    valName = def[0].type;
                    addOnSuggest = `" " + ${valName} + "${suffix}"`;
                }
            } else {
                addOnSuggest = `command + " "`;
            }
        } else if (context.blockType === "eval_function") {
            // Function name autocompletion
            addOnSuggest = `functionName + "("`;
        } else if (context.isEvalArg) {
            // Eval Argument formatting!
            prefix = context.hasOpenQuote ? "" : "'";
            suffix = context.hasOpenQuote ? "" : "'";
            suffix += context.isLastArg ? ")" : ", ";
            addOnSuggest = `"${prefix}" + ${valName} + "${suffix}"`;
        } else {
            // Standard Dialogue parsing
            // If we are suggesting a special_arg KEY, the suffix is a space.
            if (context.blockType === "special_arg") suffix = " ";
            else if (context.blockType === "event" || context.blockType === "function") suffix = "";
            else suffix = "; "; 

            addOnSuggest = `${valName} + "${suffix}"`;
        }
    } 
    else if (suggestionData.action === "HINT" && context.inputState === "FINISHED") {
        replaceOutput = `""`;
        
        let suffix = "; ";
        if (context.blockType === "event" || context.blockType === "function") suffix = "";
        else if (context.isEvalArg) suffix = context.isLastArg ? ")" : ", "; // Hint handles eval punctuation too
        
        addOnSuggest = `"${suffix}"`;
    }

    console.info(`---> processLine Decision <---`);
    console.info(`Action: [${suggestionData.action}] | ${suggestionData.message}`);
    if (suggestionData.action !== "NONE") {
        console.info(`replaces: ${replaceOutput}`);
        if (addOnSuggest) console.info(`Add on suggest: ${addOnSuggest}`);
    }
    if (suggestionData.action === "LIST") {
        console.info(`Items:`, suggestionData.items);
    }
    // image logging
    if (context.linkedImage !== null) {
        if (context.linkedImage === "ILLEGAL") {
            console.info(`Linked image: (edge case, illegal space detected in altImage, don't display image)`);
        } else if (context.linkedImage === "NONE") {
            console.info(`Linked image: none (edge case, empty image entry, display image anyways!)`);
        } else {
            console.info(`Linked image: ${context.linkedImage}`);
        }
    }

    // --- NEW: WIDGET STATE LOGGING ---
    if (context.inputState === "INSERT_WIDGET" && context.insertState) {
        console.info(`--- Widget Evaluation ---`);
        console.info(`Type: ${context.insertState.type}`);
        console.info(`Status: ${context.insertState.status}`);
        console.info(`Extracted Value: "${context.insertState.value}"`);
        console.info(`-------------------------`);
    }

    return suggestionData;
}

function analyzeEvalLine(evalText, debugData) {
    debugData.blockType = "eval_function";
    const firstParenIndex = evalText.indexOf("(");
    
    // 1. TYPING THE FUNCTION NAME (No parenthesis yet)
    if (firstParenIndex === -1) {
        const partialName = evalText.trimStart();
        const funcOptions = getValidOptions(getFunctionList);
        
        debugData.inputState = checkValidity(partialName, funcOptions);
        debugData.typedSoFar = partialName;
        debugData.replaceBefore = partialName;
        
        const matchAfter = debugData.trailingText.match(/^[^(\s]+/);
        debugData.replaceAfter = matchAfter ? matchAfter[0] : "";

        if (debugData.inputState === "FINISHED") {
            debugData.activeKey = resolveAlias(partialName);

            // --- NEW: SHORTCUT FOR INSERTS ---
            const funcDef = getFunctionList().find(f => f.value === debugData.activeKey || f.label === debugData.activeKey);
            if (funcDef && funcDef.args[0] === "insert") {
                debugData.inputState = "INSERT_WIDGET";
                // Pass an empty string to instantly spawn the search bar
                debugData.insertState = checkInsertState(debugData.activeKey, ""); 
                return debugData;
            }
        }
        return debugData;
    }
    
    // 2. WE HAVE A PARENTHESIS. Resolve the function.
    const funcNameRaw = evalText.slice(0, firstParenIndex).trim();
    const funcName = resolveAlias(funcNameRaw);

    debugData.activeKey = funcName; // <-- ADD THIS LINE HERE
    
    const functionDefs = getFunctionList();
    const funcDef = functionDefs.find(f => f.value === funcName || f.label === funcName);
    
    if (!funcDef) {
        debugData.inputState = "INVALID";
        debugData.blockType = "unknown_function";
        return debugData;
    }

    // 3. PARSE ARGUMENTS
    const argsString = evalText.slice(firstParenIndex + 1);
    let commaCount = 0;
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let currentArgText = "";
    
    // Simple scanner to count commas outside of quotes
    for (let i = 0; i < argsString.length; i++) {
        const char = argsString[i];
        if (char === "'" && !inDoubleQuote) inSingleQuote = !inSingleQuote;
        else if (char === '"' && !inSingleQuote) inDoubleQuote = !inDoubleQuote;
        else if (char === ',' && !inSingleQuote && !inDoubleQuote) {
            commaCount++;
            currentArgText = ""; 
            continue;
        }
        currentArgText += char;
    }
    
    const expectedArgType = funcDef.args[commaCount];
    //Pass the full argument list and current index down to the execution layer
    debugData.funcArgs = funcDef.args;
    debugData.argIndex = commaCount; 
    
    debugData.blockType = expectedArgType || "max_arguments_reached";
    debugData.isEvalArg = true; // Special flag for processLine
    debugData.isLastArg = commaCount === (funcDef.args.length - 1);
    
    if (!expectedArgType) {
        debugData.inputState = "FINISHED";
        return debugData;
    }
    
    // Clean up current argument to see what they are typing
    const trimmedArg = currentArgText.trimStart();
    let activeQuery = trimmedArg;
    
    if (trimmedArg.startsWith("'") || trimmedArg.startsWith('"')) {
        debugData.hasOpenQuote = true;
        activeQuery = trimmedArg.slice(1); // Strip quote for checking
    } else {
        debugData.hasOpenQuote = false;
    }
    
    debugData.typedSoFar = activeQuery;
    debugData.replaceBefore = activeQuery;
    
    const trailingMatch = debugData.trailingText.match(/^[^'",)]+/);
    debugData.replaceAfter = trailingMatch ? trailingMatch[0] : "";

    // 4. SET STATE BASED ON EXPECTED TYPE
    if (expectedArgType === "speaker") {
        const options = getValidOptions(getCharacterList);
        debugData.inputState = checkValidity(activeQuery, options);
    } else if (expectedArgType === "insert") {
        debugData.inputState = "INSERT_WIDGET";
        // NEW: Pass the extracted value to our new widget evaluator!
        debugData.insertState = checkInsertState(funcName, activeQuery);
    } else {
        debugData.inputState = "FREE_TEXT";
    }
    
    return debugData;
}

function logDebug(text, cursorIndex, data) {
    console.info(`--- analyzeLine Debug ---`);
    console.info(`Line: "${text}"`);
    console.info(`Cursor: ${cursorIndex}`);
    console.info(`Location: [${data.command || "none"}] -> [${data.blockType}]`);
    if (data.activeKey) console.info(`Active Key: [${data.activeKey}]`);
    console.info(`State: ${data.inputState}`);
    console.info(`Active Word: "${data.typedSoFar}"`);
    console.info(data);
}

// Manual alias entry goes here
let aliasDictionary = [
    ["altImage", "altimage", "img", "image"],
    ["changeLocation", "changelocation", "location"],
];

//Automated alias entries
function aliasDictionaryAssembly() {
    
    // Helper function to handle the safe merging and deduplication
    function addOrMergeAlias(newGroup) {
        if (!newGroup || newGroup.length === 0 || !newGroup[0]) return;
        
        const primaryKey = newGroup[0];
        const existingRow = aliasDictionary.find(row => row[0] === primaryKey);

        if (existingRow) {
            // Merge both arrays and let Set automatically delete duplicates
            const combined = new Set([...existingRow, ...newGroup]);
            
            // Empty the existing array and refill it to avoid breaking memory references
            existingRow.length = 0; 
            existingRow.push(...combined);
        } else {
            // Push as a brand new array, still ensuring no internal duplicates
            aliasDictionary.push([...new Set(newGroup)]);
        }
    }

    // 1. Core Characters
    if (data && data.story) {
        data.story.forEach(char => {
            if (char.index && char.fName) {
                addOrMergeAlias([char.index, char.fName, char.fName.toLowerCase()]);
            }
        });
    }

    // 2. Modded Characters
    if (storageArray && storageArray.customCharacters) {
        storageArray.customCharacters.forEach(char => {
            if (char.index && char.fName) {
                addOrMergeAlias([char.index, char.fName, char.fName.toLowerCase()]);
            }
        });
    }

    // 3. Emotions
    if (expressionArray) {
        expressionArray.forEach(expr => {
            if (expr.index) {
                let group = [expr.index];
                
                // Parse the comma-delineated alts string if it exists
                if (expr.alts) {
                    const parsedAlts = expr.alts
                        .split(',')
                        .map(str => str.trim())
                        .filter(Boolean); // Removes any empty strings from accidental trailing commas
                    
                    group.push(...parsedAlts);
                }
                
                addOrMergeAlias(group);
            }
        });
    }
}

function resolveAlias(typedWord) {
    const lowerTyped = typedWord.toLowerCase();
    for (const group of aliasDictionary) {
        const primaryKey = group[0];
        const isMatch = group.some(alias => alias.toLowerCase().startsWith(lowerTyped));
        if (isMatch) return primaryKey;
    }
    return typedWord;
}

function checkValidity(typed, options) {
    if (!typed) return "EMPTY";
    const lowerTyped = typed.toLowerCase();
    let isPartial = false;
    let isFinished = false;

    for (const opt of options) {
        // 1. Primary Key Checks
        if (opt.toLowerCase() === lowerTyped) isFinished = true;
        else if (opt.toLowerCase().startsWith(lowerTyped)) isPartial = true;

        // 2. Alias Checks
        const aliasGroup = aliasDictionary.find(group => group[0] === opt);
        if (aliasGroup) {
            for (const alias of aliasGroup) {
                if (alias === opt) continue; // Skip primary key, handled above
                
                // If they perfectly type an alias, we STILL treat it as partial 
                // so the suggestion box appears and allows them to format it to the primary key.
                if (alias.toLowerCase() === lowerTyped) {
                    isPartial = true; 
                } else if (alias.toLowerCase().startsWith(lowerTyped)) {
                    isPartial = true;
                }
            }
        }
    }

    if (isFinished) return "FINISHED";
    if (isPartial) return "PARTIAL";
    return "INVALID";
}

//Suggestion dropdown functions
function showSuggestions(suggestionData, inputEl, context) {
    // 1. HIGHLANDER RULE: Destroy all duplicates
    const allBoxes = document.querySelectorAll("#syrup-suggestions-dropdown");
    if (allBoxes.length > 1) {
        for (let i = 1; i < allBoxes.length; i++) {
            allBoxes[i].remove();
        }
    }

    // 2. Grab the one true box, or build it if it doesn't exist
    let suggestionBox = allBoxes[0];
    if (!suggestionBox) {
        suggestionBox = document.createElement("div");
        suggestionBox.id = "syrup-suggestions-dropdown";
        document.body.appendChild(suggestionBox);
    } 
    // Ensure it's on the body (The native breakout fix)
    else if (suggestionBox.parentElement !== document.body) {
        document.body.appendChild(suggestionBox);
    }
    
    // Apply the exact aesthetic base styles
    suggestionBox.className = "search-results-dropdown syrup";
    suggestionBox.style.position = "absolute";
    suggestionBox.style.maxHeight = "350px";
    suggestionBox.style.overflowY = "auto";
    suggestionBox.style.zIndex = "100";
    suggestionBox.style.background = "rgba(40, 20, 0, 0.95)";
    suggestionBox.style.border = "1px solid #FCEBB5"; 

    suggestionBox.innerHTML = "";

    console.info(suggestionData)

    // Safely ensure items is always an array
    const items = suggestionData.items || [];

    // --- NEW: INJECT "CREATE NEW" PRIORITY ROW ---
    // Applies to both events and scenes — `trans` (blockType "scene") gets the same create-new flow.
    if ((context.blockType === "event" || context.blockType === "scene") && context.typedSoFar.trim() !== "" && context.inputState !== "FINISHED") {
        const query = context.typedSoFar.trim();
        const newTypeLabel = context.blockType === "scene" ? "Scene" : "Event";

        // Check if what they typed is already an exact match to an existing entry
        const exactMatch = items.some(item => {
            const val = typeof item === "string" ? item : item.value;
            return val.toLowerCase() === query.toLowerCase();
        });

        if (!exactMatch) {
            const createRow = document.createElement("div");
            createRow.className = "search-row create-new suggestion";
            createRow.style.padding = "8px 10px";
            createRow.style.borderBottom = "2px solid #FCEBB5";
            createRow.style.cursor = "pointer";
            createRow.innerHTML = `<b style="color:#8f8">+ Create New ${newTypeLabel}: "${query}"</b>`;

            createRow.onmousedown = (e) => {
                e.preventDefault(); 
                e.stopPropagation(); 
                
                suggestionBox.style.display = "none";
                
                // For now, we are just applying the raw text string. 
                // We will handle the actual creation logic in the next step!
                console.info(`Prepared to create new event: ${query}`);
                applySuggestion(query, inputEl, context);
            };

            createRow.onmouseenter = () => createRow.style.backgroundColor = "rgba(255,255,255,0.1)";
            createRow.onmouseleave = () => createRow.style.backgroundColor = "transparent";

            suggestionBox.appendChild(createRow);
        }
    }

    // ---  MOVED EARLY RETURN ---
    // If the box is still empty (meaning we didn't build a Create New button) AND there are no items to list, abort
    if (suggestionBox.children.length === 0 && (suggestionData.action !== "LIST" || items.length === 0)) {
        console.info("No suggestions to display");
        suggestionBox.style.display = "none";
        return;
    }

    items.forEach(item => {
        const row = document.createElement("div");
        row.className = "search-row suggestion";
        row.style.padding = "5px 10px";
        row.style.cursor = "pointer";
        row.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
        row.style.color = "#fff"; 

        const display = typeof item === "string" ? item : item.label;
        row.innerHTML = `<span style="color:#FCEBB5">⚡</span> <b>${display}</b>`;

        row.onmousedown = (e) => {
            e.preventDefault(); 
            e.stopPropagation(); // Stops the document mousedown listener from firing
            
            suggestionBox.style.display = "none";
            applySuggestion(item, inputEl, context);
        };

        row.onmouseenter = () => row.style.backgroundColor = "rgba(255,255,255,0.1)";
        row.onmouseleave = () => row.style.backgroundColor = "transparent";

        suggestionBox.appendChild(row);
    });
    
    positionDropdown(inputEl);
}

function positionDropdown(inputEl) {
    //console.info(inputEl)
    const suggestionBox = document.getElementById("syrup-suggestions-dropdown");
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    let range = selection.getRangeAt(0);
    let rect = range.getBoundingClientRect();

    // EDGE CASE: If the line is completely empty, the text range might have 0 width/height.
    if (rect.width === 0 && rect.height === 0) {
        rect = inputEl.getBoundingClientRect();
    }

    // BREAKOUT FIX
    if (suggestionBox.parentElement !== document.body) {
        document.body.appendChild(suggestionBox);
    }

    // VERTICAL HEADROOM
    // rect.top = distance from the cursor to the top of the browser window.
    const padding = 20; 
    const availableHeight = rect.top - padding;


    suggestionBox.style.position = "absolute";
    suggestionBox.style.zIndex = "99999";
    suggestionBox.style.display = "block";
    
    // Set a max-height so it never goes off-screen
    suggestionBox.style.maxHeight = `${Math.max(availableHeight, 100)}px`;
    suggestionBox.style.overflowY = "auto";

    // Set max width to the width of the input field
    suggestionBox.style.maxWidth = `${inputEl.offsetWidth}px`;
    
    // 3. POSITIONING
    const absoluteTop = rect.top + window.scrollY;
    const absoluteLeft = inputEl.getBoundingClientRect().left + window.scrollX;

    suggestionBox.style.left = `${absoluteLeft}px`;
    suggestionBox.style.top = `${absoluteTop - 5}px`;
    suggestionBox.style.transform = "translateY(-100%)";
    suggestionBox.scrollTop = suggestionBox.scrollHeight;
    
    suggestionBox.style.display = "block";
}

function applySuggestion(item, inputEl, context) {
    const valueToInsert = typeof item === "string" ? item : item.value;

    // 1. Calculate Prefix and Suffix based on the Schema/Context
    let prefix = "";
    let suffix = "";

    if (context.blockType === "command") {
        if (context.inputState === "FINISHED") {
            const def = simplerEditSchema.definitions[context.command];
            if (def && def[0]) {
                suffix = def[0].suffix !== undefined ? def[0].suffix : "";
                prefix = " "; // Need a space between command and first arg
            }
        } else {
            suffix = " ";
        }
    } 
    else if (context.blockType === "eval_function") {
        // We clicked a function name. Let's see what it needs.
        const funcDef = getFunctionList().find(f => f.value === valueToInsert || f.label === valueToInsert);
        if (funcDef && funcDef.args.length === 0) {
            suffix = "();"; // Zero arguments! Close it instantly.
        } else if (funcDef && funcDef.args.length > 0) {
            const firstArg = funcDef.args[0];
            const needsQuote = ["speaker", "free_text", "insert"].includes(firstArg);
            suffix = needsQuote ? "('" : "("; // Open the quote if the first argument requires it
        } else {
            suffix = "(";
        }
    } 
    else if (context.isEvalArg) {
        // We clicked an argument inside an eval function.
        const currentArgType = context.blockType;
        const requiresQuotes = ["speaker", "free_text", "insert"].includes(currentArgType);

        prefix = (requiresQuotes && !context.hasOpenQuote) ? "'" : "";

        let closingQuote = requiresQuotes ? "'" : "";
        let punctuation = context.isLastArg ? ")" : ", ";

        let nextOpenQuote = "";
        // Look ahead to the NEXT argument to see if we should open a quote for the user
        if (!context.isLastArg && context.funcArgs) {
            const nextArgType = context.funcArgs[context.argIndex + 1];
            if (["speaker", "free_text", "insert"].includes(nextArgType)) {
                nextOpenQuote = "'";
            }
        }

        suffix = closingQuote + punctuation + nextOpenQuote;
    } 
    else {
        // Standard Dialogue parsing
        if (context.blockType === "special_arg") suffix = " ";
        else if (context.blockType === "event" || context.blockType === "function") suffix = "";
        else suffix = "; "; 
    }

    // 2. Slice the text precisely using the analyzer's findings
    const fullText = inputEl.innerText;
    const cursorOffset = getCursorCharacterOffsetWithin(inputEl);

    let replaceLenBefore = context.replaceBefore ? context.replaceBefore.length : 0;
    let replaceLenAfter = context.replaceAfter ? context.replaceAfter.length : 0;

    // --- THE ROOT CAUSE FIX ---
    // Mirroring processLine: If a command is finished, we are appending the next 
    // argument, so we force the replacement lengths to 0 so we don't delete the command!
    if (context.blockType === "command" && context.inputState === "FINISHED") {
        replaceLenBefore = 0;
        replaceLenAfter = 0;
    }

    const startIdx = cursorOffset - replaceLenBefore;
    const endIdx = cursorOffset + replaceLenAfter;

    const textBefore = fullText.slice(0, startIdx);
    const textAfter = fullText.slice(endIdx);

    // --- SMART SEMICOLON SPACING FIX ---
    // If inserting directly after a semicolon (e.g. `sp mayor;|`), force a space prefix
    if (prefix === "" && startIdx > 0 && textBefore[startIdx - 1] === ";") {
        prefix = " ";
    }

    // 3. Assemble and Inject
    const insertion = prefix + valueToInsert + suffix;
    inputEl.innerText = textBefore + insertion + textAfter;

    // 4. Reposition Cursor
    const newPos = textBefore.length + insertion.length;
    const range = document.createRange();
    const sel = window.getSelection();
    
    const textNode = inputEl.firstChild || inputEl;
    range.setStart(textNode, Math.min(newPos, textNode.length || 0));
    range.collapse(true);

    sel.removeAllRanges();
    sel.addRange(range);

    let shouldKeepFocus = true;

    // --- AUTO-OPEN EVENT/SCENE WINDOW ---
    // `event` (event command) and `scene` (trans command) both auto-open their editor window so the
    // modder lands straight in the new/selected entry.
    if (context.blockType === "event" || context.blockType === "scene") {
        const activeChar = data.player.currentCharacter;
        const targetIndex = valueToInsert;
        const editorType = context.blockType === "scene" ? "scene" : "event";

        // 1. Check if it's already open so we don't spawn duplicates
        const existingWindow = document.querySelector(`[data-editor-id="${activeChar}-${targetIndex}-${editorType}"]`);

        if (existingWindow) {
            // Scroll to it and flash it
            existingWindow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            existingWindow.style.outline = "5px solid #FCEBB5";
            setTimeout(() => existingWindow.style.outline = "none", 1000);
        } else {
            // 2. Open it (a new entry is created automatically by appendContentToEditor)
            appendContentToEditor(activeChar, targetIndex, editorType);
        }

        shouldKeepFocus = false;
    }

    if (shouldKeepFocus) {
        inputEl.focus();
    } else {
        inputEl.blur();
    }

    if (typeof inputEl.oninput === 'function') {
        inputEl.oninput();
    } else {
        updateEditorUI(inputEl);
    }
}

//Scenewriting image insert functions
function updateImageInsert(rowElement, linkedImageState) {
    const numSpan = rowElement.querySelector('.syrup-line-number');
    let imgThumb = rowElement.querySelector('.syrup-line-thumbnail');

    // 1. Cleanup / Reset
    if (linkedImageState === null || linkedImageState === "ILLEGAL") {
        if (imgThumb) imgThumb.style.display = "none";
        if (numSpan) numSpan.style.display = "";
        return;
    }
    
    // 2. We have a valid image trigger! Hide the line number.
    if (numSpan) numSpan.style.display = "none";

    // 3. Mount the thumbnail holder if it doesn't exist yet
    if (!imgThumb) {
        imgThumb = document.createElement('img');
        imgThumb.className = 'syrup-line-thumbnail';
        
        imgThumb.style.cssText = `
            width: 80px; 
            height: 80px; 
            object-fit: contain; 
            border-radius: 6px; 
            border: 1px solid rgba(255, 255, 255, 0.2);
            margin-right: 8px; 
            flex-shrink: 0; 
            background-color: rgba(0,0,0,0.3); 
            cursor: pointer;
            transition: all 0.1s ease-in-out;
        `;
        
        // --- THE MAGIC: Fallback SVG on Error ---
        imgThumb.onerror = function() {
            const svgPlus = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="%23222" rx="6"/><path d="M40 25 V55 M25 40 H55" stroke="%235fe6ec" stroke-width="4" stroke-linecap="round"/></svg>`;
            this.src = svgPlus;
            this.dataset.uploadState = "ready"; 
        };
        
        imgThumb.onload = function() {
            if (!this.src.startsWith('data:image/svg+xml')) {
                this.dataset.uploadState = "valid";
            }
        };

        // --- THE CLICK HANDLER ---
        imgThumb.onclick = function() {
            if (this.dataset.uploadState !== "ready") return;

            // 1. Create an isolated hidden file input
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'file';
            hiddenInput.accept = "image/*";
            
            hiddenInput.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                // 2. Guess the default path to feed the prompt
                let defaultPath = rawPath ? rawPath : data.player.currentCharacter+"/"+file.name.replace(/\.[^/.]+$/, "");

                // 3. Fire prompt function
                const userPath = await promptWithFilenameSelected(defaultPath);
                if (!userPath) return; // User hit cancel

                // 4. Format paths
                let finalPath = userPath.replace(/\.webp$/i, "");
                if (finalPath.startsWith("images/")) {
                    finalPath = finalPath.substring(7);
                }
                const cleanKey = finalPath;

                // 5. Convert & Buffer (Assuming convertToWebP is globally available)
                const webpBlob = await convertToWebP(file);
                const blobUrl = URL.createObjectURL(webpBlob);

                if (!window.syrupTempImageMap) window.syrupTempImageMap = {};
                
                // Store all the data we need to commit later
                window.syrupTempImageMap[cleanKey] = {
                    blobUrl: blobUrl,
                    file: webpBlob,
                    finalPath: finalPath
                };

                // 6. Rewrite the raw text line!
                const inputEl = rowElement.querySelector('.syrup-line-input');
                let currentText = inputEl.innerText;
                console.warn(currentText);
                
                const firstSpace = currentText.indexOf(" ");
                const command = firstSpace === -1 ? currentText.trim() : currentText.slice(0, firstSpace).trim();

                if (command === "im") {
                    // CASE 1: Line starts with 'im'
                    // Replace everything after 'im' up to the first semicolon or end of line
                    currentText = currentText.replace(/^(\s*im\s*)[^;]*/, (match, p1) => {
                        // Ensure there is exactly one space after the command
                        const prefix = p1.endsWith(' ') ? p1 : p1 + ' ';
                        return prefix + finalPath;
                    });
                    
                } else if (command === "sp") {
                    // CASES 2-6: altImage within a dialogue block
                    const blocks = currentText.split(";");
                    
                    for (let i = 1; i < blocks.length; i++) {
                        const block = blocks[i];
                        const blockTrimmed = block.trimStart();
                        const firstWordMatch = blockTrimmed.match(/^(\S+)/);
                        
                        if (firstWordMatch) {
                            const firstWord = firstWordMatch[1];
                            
                            // Check if the block is altImage (respecting any aliases they used)
                            if (resolveAlias(firstWord) === "altImage") {
                                // Preserve their original spacing for aesthetics
                                const leadingSpace = block.match(/^\s*/)[0] || " ";
                                
                                // Reconstruct just this specific block
                                blocks[i] = leadingSpace + firstWord + " " + finalPath;
                                break; 
                            }
                        }
                    }
                    // Stitch the line back together
                    currentText = blocks.join(";");
                }

                inputEl.innerText = currentText;
                
                // Force the engine to re-scan and update the UI
                if (typeof inputEl.oninput === 'function') inputEl.oninput();
                else updateEditorUI(inputEl);
            };
            
            hiddenInput.click();
        };
        
        numSpan.after(imgThumb);
    }

    // 4. Update the source and handle empty paths cleanly
    const rawPath = linkedImageState === "NONE" ? "" : linkedImageState;
    
    if (rawPath === "") {
        // Short-circuit: Don't trigger a network request at all, just show the button
        const svgPlus = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="%23222" rx="6"/><path d="M40 25 V55 M25 40 H55" stroke="%235fe6ec" stroke-width="4" stroke-linecap="round"/></svg>`;
        if (imgThumb.src !== svgPlus) {
            imgThumb.src = svgPlus;
            imgThumb.dataset.currentPath = "EMPTY";
            imgThumb.dataset.uploadState = "ready"; 
        }
    } else {
        // We have a real path, let's try to load it
        const finalUrl = cleanupImage(rawPath);
        
        // SANITY CHECK: Only trigger a network request if the URL actually changed
        if (imgThumb.dataset.currentPath !== finalUrl) {
            imgThumb.dataset.currentPath = finalUrl;
            imgThumb.dataset.uploadState = "loading"; 
            imgThumb.src = finalUrl;
        }
    }
    
    imgThumb.style.display = "block"; 
}

function commitTempImagesToGlobal() {
    if (!window.syrupTempImageMap) return;
    
    for (const key in window.syrupTempImageMap) {
        const imgData = window.syrupTempImageMap[key];
        
        // 1. Add to the core file array
        uploadedImages[imgData.blobUrl] = {
            file: imgData.file,
            path: imgData.finalPath
        };
        
        // 2. Register it using your exact mapping logic
        registerUploadedPath(imgData.finalPath, imgData.blobUrl);
    }
    
    // Wipe the temp buffer
    window.syrupTempImageMap = {};
}

function purgeTempImages() {
    if (!window.syrupTempImageMap) return;
    
    for (const key in window.syrupTempImageMap) {
        const imgData = window.syrupTempImageMap[key];
        URL.revokeObjectURL(imgData.blobUrl); // Free memory!
    }
    
    window.syrupTempImageMap = {};
}

//Scenewriting other insert handling
function checkInsertState(funcName, rawValue) {
    // Strip trailing quotes and parentheses that the user might have typed
    const cleanValue = rawValue.replace(/['"();]/g, "").trim();
    
    let state = {
        type: funcName === "changeLocation" ? "location" : "item",
        status: "no value present",
        value: cleanValue
    };

    if (!cleanValue) return state;

    if (funcName === "changeLocation") {
        if (storageArray && storageArray.customLocations && storageArray.customLocations.some(l => l.index === cleanValue)) {
            state.status = "complete value (custom)";
        } else if (typeof locationArray !== 'undefined' && locationArray.some(l => l.index === cleanValue)) {
            state.status = "complete value (core)";
        } else {
            state.status = "partial value present";
        }
    } else if (funcName === "addItem") {
        if (storageArray && storageArray.customItems && storageArray.customItems.some(i => i.index === cleanValue)) {
            state.status = "complete value (custom)";
        } else if (typeof globalItemsArray !== 'undefined' && globalItemsArray.some(i => i.index === cleanValue)) {
            state.status = "complete value (core)";
        } else {
            state.status = "partial value present";
        }
    }

    return state;
}

function updateWidgetInsert(rowElement, insertState, character) {
    const inputEl = rowElement.querySelector('.syrup-line-input');
    let widgetContainer = rowElement.querySelector('.syrup-widget-container');

    // 1. Cleanup & Reset (Not an insert line)
    if (!insertState) {
        if (widgetContainer) widgetContainer.remove();
        inputEl.style.display = "block";
        rowElement.removeAttribute('data-raw-value');
        return;
    }

    if (!widgetContainer) {
        widgetContainer = document.createElement("div");
        widgetContainer.className = "syrup-widget-container";
        widgetContainer.style.flex = "1"; 
        inputEl.parentNode.insertBefore(widgetContainer, inputEl.nextSibling);
    }
    
    widgetContainer.innerHTML = "";

    // 2. Hide the raw text input completely
    inputEl.style.display = "none";

    // 3. Determine base command and dummy item
    const baseCommand = insertState.type === "location" ? "changeLocation" : "addItem";
    const dummyItem = { index: insertState.value };

    rowElement.setAttribute('data-raw-value', `eval ${baseCommand}('${insertState.value}');`);

    const handleWidgetUpdate = () => {
        const newValue = `eval ${baseCommand}('${dummyItem.index}');`;
        
        // 1. Write to the hidden text input safely using textContent
        inputEl.textContent = newValue; 
        
        // 2. Update the stamp IMMEDIATELY so updateEditorUI has fresh data!
        rowElement.setAttribute('data-raw-value', newValue);
        
        // 3. Force the input to trigger its own event cycle so onChange() fires!
        if (typeof inputEl.oninput === 'function') {
            inputEl.oninput();
        } else {
            // Fallback just in case
            updateEditorUI(inputEl);
        }
        
        // Only try to focus if the input isn't hidden (e.g. reverting to search bar)
        if (inputEl.style.display !== "none") inputEl.focus(); 
    };

    // --- STATE A: LOOKUP FORM (Search Bar) ---
    if (insertState.status === "no value present" || insertState.status === "partial value present") {
        
        let searchNode;
        if (insertState.type === "location") {
            if (typeof componentLocationSearch === "function") {
                // Pass character instead of null
                searchNode = componentLocationSearch(dummyItem, character, handleWidgetUpdate); 
            } else {
                searchNode = document.createElement("div");
                searchNode.innerText = `[Location Search Placeholder]`;
            }
        } else {
            if (typeof componentItemSearch === "function") {
                // Pass character instead of null
                searchNode = componentItemSearch(dummyItem, character, handleWidgetUpdate);
            } else {
                searchNode = document.createElement("div");
                searchNode.innerText = `[Item Search Placeholder]`;
            }
        }

        widgetContainer.appendChild(searchNode);

        const buttonWrapper = document.createElement("div");
        buttonWrapper.style.marginTop = "8px";

        const revertBtn = document.createElement("button");
        revertBtn.className = "card-delete-btn"; 
        revertBtn.innerHTML = "× Cancel Insert";
        revertBtn.style.cssText = "font-size:var(--fs-small, 0.8em); cursor: pointer; color: #ff6b6b; background: transparent; border: 1px solid #ff6b6b; border-radius: 4px; padding: 2px 5px;";
        
        revertBtn.onclick = () => {
            // 1. Wipe the eval command completely
            inputEl.textContent = ""; 
            
            // 2. erase the stamp
            rowElement.removeAttribute('data-raw-value');
            
            // 3. Bring the text input back
            inputEl.style.display = "block";
            
            // 4. Force the UI and buffer to sync the deletion
            if (typeof inputEl.oninput === 'function') {
                inputEl.oninput();
            } else {
                updateEditorUI(inputEl);
            }
            
            inputEl.focus();
        };
        
        buttonWrapper.appendChild(revertBtn);
        widgetContainer.appendChild(buttonWrapper);
    } 
    // --- STATE B: INSERT FORM (Complete Value) ---
    else if (insertState.status.includes("complete")) {
        
        try {
            let insertNode;
            if (insertState.type === "location") {
                insertNode = componentLocationInsert(dummyItem, character, handleWidgetUpdate);
            } else {
                insertNode = componentItemInsert(dummyItem, character, handleWidgetUpdate);
            }
            
            // Mount the widget
            widgetContainer.appendChild(insertNode);
            
            // CRITICAL FIX: Only hide the text input AFTER the widget successfully mounts!
            inputEl.style.display = "none"; 
            
        } catch (error) {
            console.error(`[Syrup IDE] Widget Crash for ${insertState.value}:`, error);
            
            // Fallback: Show the error, but keep the text input visible so the user isn't stuck
            const errorMsg = document.createElement("div");
            errorMsg.style.cssText = "color: #ff6b6b; font-size:var(--fs-small, 0.8em); margin-top: 5px;";
            errorMsg.innerText = `[Error loading ${insertState.type} widget. See console.]`;
            widgetContainer.appendChild(errorMsg);
            
            inputEl.style.display = "block";
            rowElement.removeAttribute('data-raw-value');
        }
    }
}

// Scene Edit Requirements
window.activeLineReqBuffer = "";

function openRequirementWindow(fullLineText, editorContainer, applyCallback) {
    // 1. Setup the Overlay and Modal
    const overlay = document.createElement("div");
    overlay.className = "syrup-editor-overlay";
    
    const modal = document.createElement("div");
    modal.className = "syrup-req-modal";

    // 2. Separate Dialogue from Requirements SAFELY
    let baseText = fullLineText;
    let existingReqString = "";
    
    // Look for a space (or start of line), then ? or !, then a word character, then the rest.
    const reqMatch = fullLineText.match(/(?:\s|^)([?!]\w+.*)$/);
    
    if (reqMatch) {
        existingReqString = reqMatch[1].trim();
        
        // Safe extraction: slice the string exactly where the requirements start, leaving the dialogue portion entirely untouched.
        const reqIndex = fullLineText.lastIndexOf(reqMatch[1]);
        baseText = fullLineText.substring(0, reqIndex).trimEnd();
    }
    
    // Reset our dummy buffer just in case
    window.activeLineReqBuffer = existingReqString;

    // 3. Create the Container for UI
    // createRequirementBlock function relies on document.getElementById, so this div MUST have an ID, and MUST be appended to DOM before call
    const userUIWrapper = document.createElement("div");
    userUIWrapper.id = "syrup-temp-req-container";
    
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "syrup-modal-buttons";

    const applyBtn = document.createElement("button");
    applyBtn.innerText = "Apply Requirements";
    applyBtn.onclick = () => {
        // Scrape
        const containerEl = document.getElementById("syrup-temp-req-container");
        let compiledReqs = htmlToRequirements(containerEl).trim();
        
        // Stitch the dialogue and the new requirements back together
        const finalLine = compiledReqs !== "" ? `${baseText} ${compiledReqs}` : baseText;
        
        applyCallback(finalLine); // updates the line and triggers the save
        overlay.remove(); 
    };

    const cancelBtn = document.createElement("button");
    cancelBtn.innerText = "Cancel";
    cancelBtn.onclick = () => {
        overlay.remove(); // Close without applying
    };

    // 4. Assemble the DOM
    buttonContainer.append(cancelBtn, applyBtn);
    modal.append(userUIWrapper, buttonContainer);
    overlay.appendChild(modal);
    
    // May need to use alternative to body
    document.body.appendChild(overlay);

    // 5. Fire 
    // pass "window.activeLineReqBuffer" as the sourcePath, when global events fire, they will evaluate: window.activeLineReqBuffer = "..."
    createRequirementBlock("syrup-temp-req-container", existingReqString, "window.activeLineReqBuffer");
}

//Placeholder schema data obtainment functions
function getCharacterList() {
    var characterList = [{ label: "player", value: "player" }];
    if (storageArray && storageArray.customCharacters) {
        storageArray.customCharacters.forEach(char => {
            if (char.index && char.fName) {
                characterList.push({ label: char.fName, value: char.index });
            }
        });
    }
    if (data && data.story) {
        data.story.forEach(char => {
            if (char.index && char.fName) {
                characterList.push({ label: char.fName, value: char.index });
            }
        });
    }


    return characterList.reverse();
}

function getSceneList() {
    // Mirror getEventList: the active character's actual scenes, so `trans` can search/select them.
    const activeChar = data.player.currentCharacter;
    const charData = storageArray.customCharacters.find(c => c.index === activeChar);
    if (!charData || !charData.scenes) return [];
    return charData.scenes.map(s => ({ label: s.index, value: s.index }));
}

function getEventList() {
    // Grab the currently active character being edited
    const activeChar = data.player.currentCharacter; 
    const charData = storageArray.customCharacters.find(c => c.index === activeChar);
    
    if (!charData || !charData.events) return [];

    // Map them into the { label, value } format the schema expects
    return charData.events.map(e => ({
        label: e.name ? `${e.index} (${e.name})` : e.index,
        value: e.index
    }));
}

function getFunctionList() {
    return [
        { value: "passTime", args: [] },
        { value: "raiseTrust", args: ["speaker", "number"] },
        { value: "setTrust", args: ["speaker", "number"] },
        { value: "addFlag", args: ["speaker", "free_text"] },
        { value: "removeFlag", args: ["speaker", "free_text"] },
        { value: "raiseMoney", args: ["number"] },
        { value: "addItem", args: ["insert"] },
        { value: "changeLocation", args: ["insert"] }
    ];
}

function getEmotionList(characterIndex) {
    const all = expressionArray.map(expr => expr.index).filter(Boolean);

    // No speaker context → list everything (back-compat).
    if (!characterIndex) return all;

    // Core/built-in characters ship every expression, so don't restrict them.
    const custom = storageArray.customCharacters &&
        storageArray.customCharacters.find(c => c.index === characterIndex);
    if (!custom) return all;

    // Custom (modded) character: only suggest expressions that actually have a real uploaded image
    // (TF-5). Fall back to the full list if they haven't provided any yet, so the box isn't empty.
    const outfit = custom.outfit || "expressions";
    const provided = all.filter(em => uploadedImageMap[getCleanKey(`${characterIndex}/${outfit}/${em}`)]);
    return provided.length > 0 ? provided : all;
}

//Final, actual export section
// Shared zip instance between Start and Finish
let activeZip;

// Collect schema image fields that still point at an unfilled placeholder (no real uploaded blob).
// Used to warn — not block — the modder at export. Expressions are intentionally excluded: leaving
// expression sprites unfilled is normal (and they're handled by the separate expression system).
function collectUnprovidedImages() {
    const missing = [];
    const seen = new Set();
    const typeLabels = {
        items: "Item", collectables: "Collectable", locations: "Location",
        travelButton: "Travel button", encounters: "Encounter", pickups: "Pickup",
        sales: "Sale", mornings: "Morning event"
    };

    const checkEntry = (entry, tabKey) => {
        const cfg = tabConfig[tabKey];
        if (!cfg || !entry) return;
        cfg.card.editor.forEach(f => {
            if (!f.inputType || !f.inputType.includes("image")) return;
            const val = entry[f.origin || f.key];
            if (typeof val !== "string" || !val) return;
            const clean = getCleanKey(val);
            if (uploadedImageMap[clean] || seen.has(clean)) return; // has a real image, or already listed
            seen.add(clean);
            missing.push({
                path: val,                                   // the stored value, fed straight to replaceImage
                typeLabel: typeLabels[tabKey] || tabKey,
                index: entry.index || "(unnamed)",
                fieldLabel: (f.label || "image").replace(/:$/, "")
            });
        });
    };

    [["items", "customItems"], ["collectables", "customCollectables"],
     ["locations", "customLocations"], ["travelButton", "customTravel"]]
        .forEach(([tabKey, arrKey]) => (storageArray[arrKey] || []).forEach(e => checkEntry(e, tabKey)));

    (storageArray.customCharacters || []).forEach(char => {
        ["encounters", "pickups", "sales", "mornings"].forEach(tab => (char[tab] || []).forEach(e => checkEntry(e, tab)));
    });

    return missing;
}

// Editor-only bookkeeping flags that must never be written into an exported mod (they'd clutter the
// output and, on re-import, make cards/items open mid-edit). Previously only travel buttons were
// stripped; this clears them from every entry type.
function stripAllEditorFlags() {
    const FLAGS = ["_isEditing", "_isEditingItem", "_isNew", "_isBrandNew", "_source"];
    const clean = (entry) => { if (entry && typeof entry === "object") FLAGS.forEach(f => delete entry[f]); };
    const cleanArr = (arr) => (arr || []).forEach(clean);

    cleanArr(storageArray.customItems);
    cleanArr(storageArray.customCollectables);
    cleanArr(storageArray.customLocations);
    cleanArr(storageArray.customTravel);
    (storageArray.customCharacters || []).forEach(char => {
        ["encounters", "pickups", "sales", "mornings", "scenes", "events", "walls", "repeatables", "logbook", "trophies"]
            .forEach(tab => cleanArr(char[tab]));
    });
}

function exportStart() {
    // Janky code for maintaining link between created items (collectables) and actual collectable array entries.
    itemCollectablesMaintenance();
    // Drop editor-only flags so they don't end up in the exported mod.
    stripAllEditorFlags();

    //Prepare zip
    activeZip = new JSZip();
    const rootFolder = activeZip.folder(storageArray.modName);
    
    //Create mod info doc
    const modInfoText = `modName: ${storageArray.modName}\nauthorName: ${storageArray.authorName}\nmodVersion: 1\nmodDesc:\n${storageArray.modDesc}`;
    rootFolder.file(`${storageArray.modName}.txt`, modInfoText);
    
    //Create core js file
    let coreJS = "//START OF NEW GAME CONTENTS\n\n";
    
    //Export uploaded images
    const imagesFolder = rootFolder.folder("images-webp");
    for (const blobUrl in uploadedImages) {
        const { file, path } = uploadedImages[blobUrl];
        const cleanName = getCleanKey(path);
        imagesFolder.file(`${cleanName}.webp`, file);
    }
    
    //Export items
    coreJS += `var newItems = [//ITEMS START\n`;
    if (storageArray.customItems) {
        storageArray.customItems.forEach(item => {
            coreJS += `    ${JSON.stringify(item)},\n`;
        });
    }
    coreJS += `]//ITEMS END\n\nfor (var i = 0; i < newItems.length; i++) {\n    newItem(newItems[i]);\n}\n\n`;
    
    //Export collectables — only STANDALONE ones. Entries tagged _derivedFromItem are auto-generated
    //from collectable-category items; the engine's collectablesCleanup() rebuilds them from those
    //items at load, so shipping them here too would be redundant (and drag editor-only fields along).
    coreJS += `var newCollectables = [//COLLECTABLES START\n`;
    if (storageArray.customCollectables) {
        storageArray.customCollectables.forEach(item => {
            if (item._derivedFromItem) return; // skip — engine derives this from its item
            coreJS += `    ${JSON.stringify(item)},\n`;
        });
    }
    coreJS += `]//COLLECTABLES END\n\nfor (var i = 0; i < newCollectables.length; i++) {\n    newCollectable(newCollectables[i]);\n}\n\n`;
    
    //Export locations (Standalone)
    coreJS += `var newLocations = [//LOCATIONS START\n`;
    if (storageArray.customLocations) {
        storageArray.customLocations.forEach(loc => {
            let locCopy = { ...loc };
            delete locCopy.buttons; // Strip out any lingering buttons just to be safe
            coreJS += `    ${JSON.stringify(locCopy)},\n`; 
        });
    }
    coreJS += `]//LOCATIONS END\n\nfor (var i = 0; i < newLocations.length; i++) {\n    newLocation(newLocations[i]);\n}\n\n`;

    //Export travel buttons (Standalone)
    coreJS += `var newTravel = [//TRAVEL START\n`;
    if (storageArray.customTravel) {
        storageArray.customTravel.forEach(btn => {
            let btnCopy = { ...btn };
            // Strip out editor-specific UI states so they don't clutter the export
            delete btnCopy._isEditing; 
            delete btnCopy._isEditingItem;
            coreJS += `    ${JSON.stringify(btnCopy)},\n`;
        });
    }
    // Just call the engine function, exactly like locations
    coreJS += `]//TRAVEL END\n\nfor (var i = 0; i < newTravel.length; i++) {\n    newTravelButton(newTravel[i]);\n}\n\n`;
    
    //Check for any custom characters
    let characterNames = [];
    var characterCodeStrings = "";
    if (storageArray.customCharacters && storageArray.customCharacters.length > 0) {
        const charFolder = rootFolder.folder("scripts").folder("characters");
        
        storageArray.customCharacters.forEach(char => {
            characterNames.push(char.index);
            let charContent = "";
            
            //Reset trust and flags
            char.trust = 0;
            char.flags = "";
            char.encountered = false;
            
            //Export character data object
            let baseChar = {
                index: char.index, fName: char.fName, lName: char.lName, color: char.color, 
                outfit: char.outfit, outfitDefault: char.outfitDefault, emotion: char.emotion, 
                emotionDefault: char.emotionDefault, trust: char.trust, flags: char.flags, 
                encountered: char.encountered, author: char.author, gender: char.gender
            };
            charContent += `var character = ${JSON.stringify(baseChar)};\n\n`;
            
            //Export character expressions
            charContent += `//COMMENTED SPACE FOR MODDING UI TO SAVE ACTUAL CHARACTER EXPRESSIONS:\n`;
            charContent += `//EXPRESSIONSSTART${char.expressions ? char.expressions.join(",") : ""}EXPRESSIONSEND\n\n`;

            //Export character logbook
            charContent += `var logbookArray = [//LOGBOOK START\n`;
            if (char.logbook) {
                char.logbook.forEach(entry => {
                    // JSON.stringify produces a properly-escaped JS string literal — a raw
                    // "${entry.content}" broke the file (and silently lost the entry on re-import)
                    // whenever a logbook entry contained a quote, backslash, or newline.
                    charContent += `    ${JSON.stringify(entry.content)},\n`;
                });
            }
            charContent += `]//LOGBOOK END\n\n`;

            //Export character trophies
            charContent += `var achievementArray = [//TROPHIES START\n`;
            if (char.trophies) char.trophies.forEach(t => charContent += `    ${JSON.stringify(t)},\n`);
            charContent += `];//TROPHIES END\n\n`;
            
            //Items Array (As requested in your format)
            charContent += `var itemsArray = [\n    //LEAVE BLANK, STORE ITEMS IN CORE MOD DOCUMENT\n];\n\n`;

            //Export sales/shops
            charContent += `var shopArray = [ //SALES START\n`;
            if (char.sales) char.sales.forEach(sale => charContent += `    ${JSON.stringify(sale)},\n`);
            charContent += `];//SALES END\n\n`;

            //Export character pickups
            charContent += `var pickupArray = [//PICKUPS START\n`;
            if (char.pickups) char.pickups.forEach(p => charContent += `    ${JSON.stringify(p)},\n`);
            charContent += `];//PICKUPS END\n\n`;
            
            //Export character mornings
            charContent += `var morningArray = [//MORNINGS START\n`;
            if (char.mornings) char.mornings.forEach(m => charContent += `    ${JSON.stringify(m)},\n`);
            charContent += `];//MORNINGS END\n\n`;
            
            //Export character encounters
            charContent += `var encounterArray = [//ENCOUNTERS START\n`;
            if (char.encounters) char.encounters.forEach(e => charContent += `    ${JSON.stringify(e)},\n`);
            charContent += `];//ENCOUNTERS END\n\n`;
            
            //Export character scenes
            charContent += `var sceneArray = [//SCENES START\n`;
            if (char.scenes) char.scenes.forEach(s => charContent += `    ${JSON.stringify(s)},\n`);
            charContent += `];//SCENES END\n\n`;
            
            //Export character events (Merging Walls and Repeatables)
            let eventsToExport = [];
            if (char.events) {
                eventsToExport = char.events.map(ev => {
                    let evCopy = { ...ev };
                    evCopy.requirements = evCopy.requirements || "";

                    // Match and append Wall requirements
                    if (char.walls) {
                        const matchedWall = char.walls.find(w => w.index === evCopy.index);
                        if (matchedWall && matchedWall.requirements) {
                            evCopy.requirements = (evCopy.requirements + " " + matchedWall.requirements).trim();
                        }
                    }

                    // Match and append Repeatable requirements
                    if (char.repeatables) {
                        const matchedRep = char.repeatables.find(r => r.index === evCopy.index);
                        if (matchedRep && matchedRep.requirements) {
                            evCopy.requirements = (evCopy.requirements + " " + matchedRep.requirements).trim();
                        }
                    }

                    return evCopy;
                });
            }

            charContent += `var eventArray = [//EVENTS START\n`;
            eventsToExport.forEach(e => charContent += `    ${formatHumanReadable(e)},\n`);
            charContent += `];//EVENTS END\n\n`;
            
            //Core suffix injection
            charContent += `//CORE CHARACTER LOADING CODE\nconsole.log(character.index+'.js loaded correctly.');\n`;

            // Appends the massive global suffix
            if (typeof charFileSuffix !== 'undefined') {
                charContent += `\n${charFileSuffix}\n`;
            } else {
                charContent += `\n// charFileSuffix goes here\n`;
            }
            
            //Write character JS document
            charFolder.file(`${char.index}.js`, charContent);
            
            characterCodeStrings += charContent;
            
        });
    }
    
    //Create character load list
    coreJS += `var customCharacters = [//CUSTOM CHARACTERS START\n`;
    if (characterNames.length > 0) {
        characterNames.forEach(name => {
            coreJS += `    "${name}",\n`;
        });
    }

    // (Custom characters are loaded by the engine itself when the mod boots — it reads the
    //  customCharacters global and injects each character script — so no loader code is emitted here.)

    coreJS += `]//CUSTOM CHARACTERS END\n\n`;

    coreJS += `//END OF NEW GAME CONTENTS\n\n`;

    // Load confirmation. Placed BEFORE the custom-code marker so it isn't swallowed by the import's
    // "everything after CUSTOM CODE" capture. Guarded on currentScene != "start": the core script
    // re-runs on every save-load (the engine replays mods after rebuilding its arrays), and those
    // replays are immediately followed by writeScene('system','start') which clears the output — so
    // this is only actually visible at the moment the modder uploads the zip from the mod menu.
    coreJS += `// Confirm the mod loaded (only visible when uploaded from the menu)\n`;
    coreJS += `if (typeof data !== "undefined" && data.player && data.player.currentScene != "start") {\n`;
    coreJS += `    writeHTML(\`special ${storageArray.modName} loaded!\`);\n`;
    coreJS += `}\n\n`;

    //Export custom code
    coreJS += `//CUSTOM CODE BEYOND HERE\n${storageArray.customCode || ""}\n`;

    // Write final core JS file to root
    rootFolder.file(`${storageArray.modName}.js`, coreJS);
    
    // --- ORPHAN IMAGE HUNTING ---
    // 1. Create a master string containing every piece of code we generated
    let masterCodeString = coreJS;
    masterCodeString += characterCodeStrings;

    // 1b. Protect expression sprites. They're referenced by construction at render time
    // (character.index + "/expressions/" + emotion) and so never appear as literal paths in
    // the generated code. Without adding them here the substring check below flags every
    // expression — and the default standing image — as an orphan, so PURGE would wipe a
    // character's entire sprite set. Append their real stored paths to the haystack.
    if (storageArray.customCharacters) {
        storageArray.customCharacters.forEach(char => {
            if (!char.expressions) return;
            char.expressions.forEach(expression => {
                masterCodeString += `\n${char.index}/expressions/${expression}`;
            });
        });
    }
    // Also protect the mod thumbnail — it's the mod's icon (read by extractModInfo), not referenced
    // anywhere in the generated code, so it would otherwise be flagged as an orphan.
    masterCodeString += `\nthumbnail`;

    // 2. Find the orphans
    let orphanedImages = [];
    for (const blobUrl in uploadedImages) {
        const path = uploadedImages[blobUrl].path;
        const cleanName = getCleanKey(path); // Using your existing clean function

        // If the clean path isn't anywhere in the generated code, it's an orphan
        if (!masterCodeString.includes(cleanName)) {
            orphanedImages.push({ blobUrl, cleanName });
        }
    }

    // 3. Build the UI
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = ""; // Clear existing output

    if (orphanedImages.length > 0) {
        outputDiv.innerHTML = `<p class="centeredText">Orphans Detected! (${orphanedImages.length})</h3>
                               <p class="centeredText">These images are uploaded but don't seem to be referenced in your mod's code.<br>If you don't need them, they might be placeholders, you should delete them to preserve space on user computers for other mods!</p>`;
        
        // Create the image grid
        const grid = document.createElement("div");
        grid.style.display = "flex";
        grid.style.flexWrap = "wrap";
        grid.style.gap = "10px";
        grid.style.marginBottom = "20px";

        orphanedImages.forEach(orphan => {
            const img = document.createElement("img");
            img.src = orphan.blobUrl;
            img.style.width = "100px";
            img.style.height = "100px";
            img.style.objectFit = "contain"; // Swapped from "cover" to "contain"
            img.style.border = "1px solid #ccc";
            img.style.backgroundColor = "#222"; // Optional: adds a dark backdrop so transparent images pop
            img.title = orphan.cleanName; 
            grid.appendChild(img);
        });
        
        outputDiv.appendChild(grid);

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "choiceText";
        deleteBtn.innerText = "PURGE ORPHANS";
        deleteBtn.style.color = "red";
        deleteBtn.onclick = () => {
            orphanedImages.forEach(orphan => {
                // 1. Remove from editor memory
                delete uploadedImages[orphan.blobUrl]; 
                
                // 2. Remove from the pending Zip file so it doesn't download
                imagesFolder.remove(`${orphan.cleanName}.webp`); 
            });
            
            outputDiv.innerHTML = "<p class='centeredText'>Orphans purged! Proceeding to download...</p>";
            exportFinish();
        };
        outputDiv.appendChild(deleteBtn);

        // Ignore button (in case they are saving an image for later but haven't coded it yet)
        const ignoreBtn = document.createElement("button");
        ignoreBtn.className = "choiceText";
        ignoreBtn.innerText = "Ignore & Finish Export";

        ignoreBtn.onclick = () => {
            outputDiv.innerHTML = "<p class='centeredText'>Proceeding to download...</p>";
            exportFinish();
        };
        outputDiv.appendChild(ignoreBtn);

    } else {
        outputDiv.innerHTML = `<p class='centeredText'>Export Ready!</p>
                               <p class='centeredText'>No orphaned images found. Your mod is incredibly clean.</p>`;
        
        const finishBtn = document.createElement("button");
        finishBtn.className = "choiceText";
        finishBtn.innerText = "Finish Export";
        finishBtn.onclick = () => {
            outputDiv.innerHTML = "<p class='centeredText'>Proceeding to download...</p>";
            exportFinish();
        };
        outputDiv.appendChild(finishBtn);
    }
    // Harmless heads-up: image slots that were never given a real picture (they'll show the
    // placeholder cross in-game). Informational only — the modder can still finish exporting, since
    // a rough/unfinished mod is a legitimate work-in-progress state. Each row also offers an inline
    // "Add image" so they don't have to hunt the slot down; adding one re-runs exportStart() to
    // rebuild the zip (the zip was already assembled above, so a late upload must be re-folded in).
    const unprovided = collectUnprovidedImages();
    if (unprovided.length > 0) {
        const note = document.createElement("p");
        note.className = "centeredText";
        note.style.color = "#fcdf5f";
        note.innerHTML = `Heads up: ${unprovided.length} image slot${unprovided.length === 1 ? "" : "s"} ` +
            `${unprovided.length === 1 ? "hasn't" : "haven't"} been given a real picture yet. ` +
            `${unprovided.length === 1 ? "It" : "They"}'ll show as a placeholder in-game — fine for a ` +
            `work-in-progress, or add ${unprovided.length === 1 ? "it" : "them"} now:`;
        outputDiv.appendChild(note);

        unprovided.forEach(miss => {
            const row = document.createElement("div");
            row.style.cssText = "display:flex; align-items:center; gap:10px; justify-content:center; margin:6px 0; flex-wrap:wrap;";

            const label = document.createElement("span");
            label.innerHTML = `The ${miss.typeLabel} <b>${miss.index}</b> has no ${miss.fieldLabel.toLowerCase()}.`;

            const uploadBtn = document.createElement("button");
            uploadBtn.className = "choiceText";
            uploadBtn.innerText = "Add image";
            uploadBtn.onclick = () => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.style.display = "none";
                document.body.appendChild(input);
                input.addEventListener("change", async () => {
                    const file = input.files && input.files[0];
                    input.remove();
                    if (!file) return;
                    try {
                        await replaceImage(miss.path, file);
                    } catch (e) {
                        return; // convertToWebP already alerted the modder
                    }
                    exportStart(); // rebuild the zip + refresh this screen with the slot now filled
                });
                input.click();
            };

            row.append(label, uploadBtn);
            outputDiv.appendChild(row);
        });
    }

    const cancelBtn = document.createElement("button");
    cancelBtn.innerText = "Cancel and Go Back";
    cancelBtn.className = "choiceText";
    cancelBtn.onclick = () => {
        writeScene("system", "modReturn");
    };
    outputDiv.appendChild(cancelBtn);

    console.info("Zip successfully prepared! Awaiting user confirmation to trigger exportFinish().");
}

async function exportFinish() {
    //Download zip
    if (!activeZip) {
        console.error("No active zip found. Did exportStart complete?");
        return;
    }

    const blob = await activeZip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${storageArray.modName}.zip`;
    
    document.body.appendChild(a); 
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
    
    //Kill storage array
    activeZip = null;
    console.log("Mod exported:", storageArray.modName);
    // Stop autosaving, then clear the draft: exporting IS the save, so a leftover draft would
    // nag the modder with a "you have unsaved work" restore prompt next time even though they
    // just finished. (The zip blob is already generated above, so the download is reliable.)
    stopModDraftAutosave();
    clearModDraft();
    modDraftRestoreOffered = false;
    storageArray = {modName: "", authorName: "", modDesc: "", customItems: [], customCollectables: [], customCharacters: [], customLocations: [], customTravel: [], customCode: ``};
    uploadedImages = {};
    uploadedImageMap = {};
    targetCharactersList = [];
    window.placeholderImagePaths = new Set();
    // Export is the clean exit from debug mode — leave it on and the workspace is wiped but the UI
    // stays in its mod-editing state. Turn it off and refresh the menu.
    debugMode = false;
    updateMenu();
    writeHTML(`finish`);
}

function getCleanKey(path) {
    let clean = path.replace("images/", "");
    clean = clean.replace("images-webp/", "");
    return clean.replace(/\.webp$/i, "");
}

// Helper function to keep scenes/events human-readable instead of using "\n" and "\t"
function formatHumanReadable(obj) {
    const props = Object.entries(obj).map(([key, val]) => {
        // If the key is 'content', wrap it in backticks so it stays a literal multiline string.
        // Escape the characters that would otherwise break (or inject into) a template literal:
        // backslashes first, then backticks, then the ${ template-expression opener. Without this
        // a single ` or ${ in scene/event dialogue produced an unparseable mod file.
        if (key === 'content' && typeof val === 'string') {
            const escaped = val
                .replace(/\\/g, '\\\\')
                .replace(/`/g, '\\`')
                .replace(/\$\{/g, '\\${');
            return `${key}: \`${escaped}\``;
        }
        return `${key}: ${JSON.stringify(val)}`;
    });
    return `{${props.join(', ')}}`;
}

function modImportZone() {
    const wrapper = document.createElement("div");
    wrapper.className = "modUploadWrapper";

    const dropZone = document.createElement("div");
    dropZone.className = "modUploadZone";
    dropZone.innerText = "Upload ZIP\n(loads a mod for editing)";

    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".zip";
    input.style.display = "none";

    input.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        importModZip(file);
    });

    // click support
    dropZone.addEventListener("click", () => {
        input.click();
    });

    // drag & drop support
    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("dragHover");
    });

    dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("dragHover");
    });

    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragHover");

        const file = e.dataTransfer.files[0];
        if (!file) return;

        if (!file.name.endsWith(".zip")) {
            alert("Please upload a ZIP file.");
            return;
        }

        importModZip(file);
    });

    wrapper.appendChild(dropZone);
    wrapper.appendChild(input);

    document.getElementById("output").appendChild(wrapper);
}

function placeholderModImportArea() {
    document.getElementById("output").innerHTML +=`
    <button id="importModBtn" style="padding: 10px 20px; font-size:var(--fs-small, 16px); cursor: pointer;">
        Import Mod (.zip)
    </button>
    <input id="zombieFile" type="file" accept=".zip" style="display: none;">
    `;

    const importBtn = document.getElementById('importModBtn');
    const fileInput = document.getElementById('zombieFile');

    // 1. When the visible button is clicked, simulate a click on the hidden file input
    importBtn.addEventListener('click', () => {
        fileInput.click();
    });

    // 2. Listen for when the user actually selects a file
    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        
        if (!file) {
            console.log("Import canceled by user.");
            return; 
        }

        console.info(`Starting import process for: ${file.name}`);
        
        try {
            // Call the massive import function we just built!
            await importModZip(file);
            console.info("Import test finished! Check the storageArray in your console.");
        } catch (error) {
            console.error("An error occurred during the import process:", error);
        }

        // 3. Reset the input's value so the user can import the exact same file again if they need to test tweaks
        event.target.value = '';
    });
}

async function importModZip(file) {
    // Guard: importing REPLACES the entire in-progress workspace (storageArray + images). If one
    // is already open, confirm before discarding it — otherwise a modder who imports "just to look"
    // loses unsaved work instantly. (The autosaved draft is also cleared by beginFreshModDraft, so
    // there's no hidden copy to fall back on.)
    if (storageArray && storageArray.modName) {
        const proceed = confirm(
            `You currently have the mod "${storageArray.modName}" open.\n\n` +
            `Importing will REPLACE it with the imported mod. Anything you haven't exported will be lost.\n\n` +
            `Continue?`
        );
        if (!proceed) return;
    }

    // 1. Obtain zip
    const zip = new JSZip();
    let unzipped;
    try {
        unzipped = await zip.loadAsync(file);
    } catch (e) {
        console.error("Failed to read zip file", e);
        return;
    }

    // Locate the core files (ignoring known subfolders)
    let modInfoFile = null;
    let coreJsFile = null;

    unzipped.forEach((relativePath, zipEntry) => {
        if (zipEntry.dir) return;

        const lowerPath = relativePath.toLowerCase();

        // Skip anything inside the scripts or images folders
        if (lowerPath.includes("scripts/") || lowerPath.includes("images")) {
            return;
        }

        if (lowerPath.endsWith(".txt")) {
            modInfoFile = zipEntry;
        }
        if (lowerPath.endsWith(".js")) {
            coreJsFile = zipEntry;
        }
    });

    if (!modInfoFile || !coreJsFile) {
        console.error("Invalid mod zip: Missing core .txt or .js file in root.");
        return;
    }

    // Initialize a fresh storage array
    storageArray = {
        customItems: [],
        customCollectables: [],
        customLocations: [],
        customTravel: [],
        customCharacters: []
    };

    // 2. Read mod info doc
    const modInfoText = await modInfoFile.async("text");
    console.info("Mod info text:", modInfoText);
    
    // 3. Import mod name & description using regex matches
    const nameMatch = modInfoText.match(/modName:\s*(.*)/);
    const authorMatch = modInfoText.match(/authorName:\s*(.*)/);
    const descMatch = modInfoText.match(/modDesc:\n([\s\S]*)/); // [\s\S]* captures everything after the newline

    storageArray.modName = nameMatch ? nameMatch[1].trim() : "Unknown";
    storageArray.authorName = authorMatch ? authorMatch[1].trim() : "";
    storageArray.modDesc = descMatch ? descMatch[1].trim() : "";

    // Define acceptable image extensions
    const imageExtensions = ['.webp', '.png', '.jpg', '.jpeg', '.gif'];
    const imagePromises = [];

    // Loop through the zip and find all images
    unzipped.forEach((relativePath, zipEntry) => {
        if (zipEntry.dir) return; // Skip folders

        const lowerPath = relativePath.toLowerCase();
        const isImage = imageExtensions.some(ext => lowerPath.endsWith(ext));
        
        if (isImage) {
            // Push an async function to our promises array for faster parallel extraction
            imagePromises.push(async () => {
                const blob = await zipEntry.async("blob");
                
                // Clean the path to act as our alias
                let cleanPath = relativePath;

                //Don't include root folder name in cleanPath
                cleanPath = cleanPath.replace(storageArray.modName + "/", "");
                
                // Strip leading folders if they exist
                cleanPath = cleanPath.replace("images-webp/", "");
                cleanPath = cleanPath.replace("images/", "");
                // In case there's a leading slash from the root
                cleanPath = cleanPath.replace(/^\//, ""); 
                
                // Strip the file extension
                cleanPath = cleanPath.substring(0, cleanPath.lastIndexOf('.'));

                // Create the Blob URL
                const blobUrl = URL.createObjectURL(blob);
                
                // Store it exactly how the editor's export function expects it
                uploadedImages[blobUrl] = {
                    file: blob,
                    path: cleanPath
                };

                uploadedImageMap[cleanPath] = blobUrl;
            });
        }
    });

    // Wait for all images to finish extracting and processing
    await Promise.all(imagePromises.map(fn => fn()));
    console.info(`Successfully imported ${Object.keys(uploadedImages).length} images!`);

    // 4. Read core js file
    const coreJsText = await coreJsFile.async("text");

    // 5. Cleaning & Interpreting Function
    // This looks between your markers, grabs the text, and evaluates it as a JS array
    function extractAndParse(text, startMarker, endMarker) {
        const start = text.indexOf(startMarker);
        const end = text.indexOf(endMarker);
        
        if (start === -1 || end === -1) return [];

        // Grab everything *between* the start marker and the closing bracket of the end marker
        const block = text.substring(start + startMarker.length, end).trim();

        try {
            // new Function treats the string as literal JS, completely bypassing strict JSON rules
            return new Function(`return [\n${block}\n];`)();
        } catch (e) {
            console.error(`Failed to parse block between ${startMarker} and ${endMarker}`, e);
            return [];
        }
    }

    // 6. Import items
    storageArray.customItems = extractAndParse(coreJsText, "//ITEMS START", "]//ITEMS END");
    
    // 7. Import collectables
    storageArray.customCollectables = extractAndParse(coreJsText, "//COLLECTABLES START", "]//COLLECTABLES END");

    console.log("Successfully imported items and collectables!", storageArray);
    
    // 8. Separate locations and travel buttons / Import locations
    const importedLocations = extractAndParse(coreJsText, "//LOCATIONS START", "]//LOCATIONS END");
    
    // Check if there's already a new travel buttons array (Future-proofing)
    const importedTravel = extractAndParse(coreJsText, "//TRAVEL START", "]//TRAVEL END");

    if (importedTravel && importedTravel.length > 0) {
        // If an explicit travel array exists, safely map them
        storageArray.customTravel = importedTravel.map(btn => ({
            ...btn,
            _isEditing: false,
            _isEditingItem: false
        }));
        
        // Push locations without buttons
        storageArray.customLocations = importedLocations.map(loc => {
            let locCopy = { ...loc };
            delete locCopy.buttons; // Clean up editor properties
            return locCopy;
        });
    } else {
        // Reverse the exporter's combining logic
        importedLocations.forEach(loc => {
            if (loc.buttons && Array.isArray(loc.buttons)) {
                loc.buttons.forEach(btn => {
                    storageArray.customTravel.push({
                        ...btn,
                        _isEditing: false,
                        _isEditingItem: false
                    });
                });
            }
            
            // Clean up the location object before pushing to storage
            let locCopy = { ...loc };
            delete locCopy.buttons;
            storageArray.customLocations.push(locCopy);
        });
    }

    console.log("Successfully imported locations and travel buttons!");

    // 9. Check for any custom characters
    const characterList = extractAndParse(coreJsText, "//CUSTOM CHARACTERS START", "]//CUSTOM CHARACTERS END");

    if (characterList && characterList.length > 0) {
        // Loop through our character list
        for (const charName of characterList) {
            
            // Search for the character file dynamically to bypass the root folder name
            let charFile = null;
            unzipped.forEach((relativePath, zipEntry) => {
                if (!zipEntry.dir && relativePath.toLowerCase().endsWith(`scripts/characters/${charName.toLowerCase()}.js`)) {
                    charFile = zipEntry;
                }
            });

            if (!charFile) {
                console.warn(`Character file ${charName}.js not found in zip.`);
                continue;
            }

            // 10. Read character js
            const charJsText = await charFile.async("text");
            
            // Extract the base character object
            let baseCharacter = {};
            const charObjMatch = charJsText.match(/var character = ({[\s\S]*?});/);
            if (charObjMatch) {
                try {
                    baseCharacter = new Function(`return ${charObjMatch[1]};`)();
                } catch (e) {
                    console.error(`Failed to parse base character object for ${charName}`, e);
                }
            }

            // Extract expressions via specific Regex
            const expressionsMatch = charJsText.match(/\/\/EXPRESSIONSSTART(.*?)EXPRESSIONSEND/);
            let parsedExpressions = [];
            if (expressionsMatch && expressionsMatch[1].trim()) {
                parsedExpressions = expressionsMatch[1].split(',').map(e => e.trim());
            }

            // Rebuild the logbook objects from the extracted strings
            const rawLogbook = extractAndParse(charJsText, "//LOGBOOK START", "]//LOGBOOK END");
            const parsedLogbook = rawLogbook.map(entryStr => ({
                index: charName,
                content: entryStr
            }));

            const parsedEvents = extractAndParse(charJsText, "//EVENTS START", "];//EVENTS END");
            let parsedWalls = [];
            let parsedRepeatables = [];

            // Check for Walls and Repeatables baked into events
            parsedEvents.forEach(ev => {
                if (ev.index.includes("Wall")) {
                    parsedWalls.push({
                        index: ev.index,
                        requirements: ev.requirements || "",
                        _isEditing: false
                    });
                } else if (ev.index.includes("Repeat")) {
                    parsedRepeatables.push({
                        index: ev.index,
                        requirements: ev.requirements || "",
                        _isEditing: false
                    });
                }
            });

            // Initialize the character data structure with the base details and all extracted arrays
            let charData = {
                ...baseCharacter,
                expressions: parsedExpressions,
                logbook: parsedLogbook,
                trophies: extractAndParse(charJsText, "//TROPHIES START", "];//TROPHIES END"),
                sales: extractAndParse(charJsText, "//SALES START", "];//SALES END"),
                pickups: extractAndParse(charJsText, "//PICKUPS START", "];//PICKUPS END"),
                mornings: extractAndParse(charJsText, "//MORNINGS START", "];//MORNINGS END"),
                encounters: extractAndParse(charJsText, "//ENCOUNTERS START", "];//ENCOUNTERS END"),
                scenes: extractAndParse(charJsText, "//SCENES START", "];//SCENES END"),
                events: parsedEvents,
                walls: parsedWalls,          
                repeatables: parsedRepeatables 
            };
            
            // Push the fully assembled character to the storage array
            storageArray.customCharacters.push(charData);
        }
    }

    // Import custom code (from coreJsText)
    const customCodeMatch = coreJsText.match(/\/\/CUSTOM CODE BEYOND HERE\n([\s\S]*)/);
    storageArray.customCode = customCodeMatch ? customCodeMatch[1].trim() : "";

    console.log("Mod import complete!", storageArray);

    // Imported zips only carry REAL images; any referenced slot without one is an unfilled
    // placeholder, so rebuild that set or those slots would render as broken file paths.
    rebuildPlaceholderPaths();

    // The UI below tells the user debug mode is active, so make it true in fact, and begin
    // autosaving the imported workspace. beginFreshModDraft clears any prior draft first, so the
    // imported mod becomes the one and only draft (every rehydrated image is written out fresh).
    debugMode = true;
    beginFreshModDraft();
    updateMenu();

    displayStorageArray(storageArray);
}

function displayStorageArray() {
    document.getElementById('output').innerHTML = '';
    writeHTML(`
        t Mod loaded successfully!
        t Mod name: ${storageArray.modName}
        t Author: ${storageArray.authorName}
    `);

    const outputDiv = document.getElementById("output");
    
    // Check if there are uploaded images
    if (Object.keys(uploadedImages).length > 0) {
        writeHTML(`t Detected images:`);
        
        // Create the image grid
        const grid = document.createElement("div");
        grid.style.display = "flex";
        grid.style.flexWrap = "wrap";
        grid.style.gap = "10px";
        grid.style.marginBottom = "20px";

        //Do a for loop of the keys of the uploadedImages object
        for (const key in uploadedImages) {
            const img = document.createElement("img");
            const orphan = uploadedImages[key];
            img.src = key;
            img.style.width = "100px";
            img.style.height = "100px";
            img.style.objectFit = "contain"; // Swapped from "cover" to "contain"
            img.style.border = "1px solid #ccc";
            img.style.backgroundColor = "#222"; // Optional: adds a dark backdrop so transparent images pop
            img.title = orphan.cleanName; 
            grid.appendChild(img);
            
        }
        
        outputDiv.appendChild(grid);
    }
    writeHTML(`
        t Debug mode is active. Refresh or close the game, or export the mod to leave debug mode.
        trans modReturn; Back    
    `);
}

var charFileSuffix = `
switch (requestType) {
	case "load": {
        var alreadyPresent = false;
        for (characterCounter = 0; characterCounter < data.story.length; characterCounter++) {
            if (data.story[characterCounter].index == character.index) {
                alreadyPresent = true;
            }
        }
        if (alreadyPresent) {
            console.log("Character already loaded");
        }
        else {
            data.story.push(character);
        }
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
			//Exported character files keep their own itemsArray blank (items live in the core mod
			//document, which loads first), so without this fallback item sales never found their
			//item and shipped with undefined name/price.
			if (!itemTarget && typeof globalItemsArray !== "undefined") {
				itemTarget = globalItemsArray.find(item => item.index === shopArray[shopCounter].index);
			}
			//The mod editor stores the sale price under "value" while the shop reads "price".
			//A 0 value on an item sale means "use the item default" (double its value, set below).
			if (shopArray[shopCounter].price == null && shopArray[shopCounter].value != null && shopArray[shopCounter].value !== "") {
				if (shopArray[shopCounter].event == true || shopArray[shopCounter].value != 0) {
					shopArray[shopCounter].price = shopArray[shopCounter].value;
				}
			}
			if (itemTarget) {
				if (shopArray[shopCounter].name == null || shopArray[shopCounter].name === "") {
					shopArray[shopCounter].name = itemTarget.name;
				}
				if ((shopArray[shopCounter].desc == null || shopArray[shopCounter].desc === "") && itemTarget.desc != null) {
					shopArray[shopCounter].desc = itemTarget.desc;
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
`