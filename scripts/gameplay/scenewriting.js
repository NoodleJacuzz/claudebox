//Cleanup depending on various image notations
function cleanupImage(image) {
	//Shortcut for a blank image
	if (image == "none") return "images-webp/none.webp";
	
	//Shortcut for where current character is not present
	if (image.includes("/") == false && image != "none" && image.includes("thumbnail") == false) {
		image = data.player.currentCharacter+"/"+image
	}
	//Shortcut for commonly used nicknames
	var nicknames = [["sado", "sadogato"], ["fash", "fashionista"], ["shop", "shopkeep"]];
	for (nickIndex = 0; nickIndex < nicknames.length; nickIndex++) {
		if (image.includes(nicknames[nickIndex][0]+"/") == true) {
			image = image.replace(nicknames[nickIndex][0]+"/", nicknames[nickIndex][1]+"/");
		}
	}
	if (data.playerCurrentCharacter == "mayor") {
		if (image.includes("SEX") == true) {
			if (checkFlag("mayor", "meat") == true) {
				image = image.replace("-SEX/", "-meat/")
				image = image.replace("SEX", "Meat")
			}
			else {
				image = image.replace("-SEX/", "/")
				image = image.replace("SEX", "Veggie")
			}
		}
	}
	if (data.playerCurrentCharacter == "carpenter") {
		if (image.includes("SEX") == true) {
			if (checkFlag("carpenter", "meat") == true) {
				image = image.replace("-SEX/", "-meat/")
				image = image.replace("SEX", "Meat")
			}
			else {
				image = image.replace("-SEX/", "/")
				image = image.replace("SEX", "Veggie")
			}
		}
	}
	if (data.playerCurrentCharacter == "shopkeep") {
		if (image.includes("SEX") == true) {
			if (checkFlag("shopkeep", "meat") == true) {
				image = image.replace("-SEX/", "-meat/")
				image = image.replace("SEX", "Meat")
			}
			else {
				image = image.replace("-SEX/", "/")
				image = image.replace("SEX", "Veggie")
			}
		}
	}
	if (image.includes("mayor/") == true && image.includes("SEX") == true) {
		if (checkFlag("mayor", "meat") == true) {
			image = image.replace("-SEX/", "-meat/")
			image = image.replace("SEX", "Meat")
		}
		else {
			image = image.replace("-SEX/", "/")
			image = image.replace("SEX", "Veggie")
		}
	}
	if (image.includes("carpenter/") == true && image.includes("SEX") == true) {
		if (checkFlag("carpenter", "meat") == true) {
			image = image.replace("-SEX/", "-meat/")
			image = image.replace("SEX", "Meat")
		}
		else {
			image = image.replace("-SEX/", "/")
			image = image.replace("SEX", "Veggie")
		}
	}
	if (image.includes("shopkeep/") == true && image.includes("SEX") == true) {
		if (image.includes("SEX") == true) {
			if (checkFlag("shopkeep", "meat") == true) {
				image = image.replace("-SEX/", "-meat/")
				image = image.replace("SEX", "Meat")
			}
			else {
				image = image.replace("-SEX/", "/")
				image = image.replace("SEX", "Veggie")
			}
		}
	}

	//Error case
	if (!image) {
		console.error("Image not found: "+image)
		return "images-webp/none.webp";
	}

	//Bypass for blobs, in case cleanupImage is called a second time by accident
	if (image.includes("blob:")) return image;

	//Re-entry for our own lazy-load placeholder ("none.webp#<path>"). A marker can get
	//stored somewhere (an array, save data) and re-cleaned long after its original fetch
	//resolved — returning it unchanged left those images blank forever, since nothing
	//would ever request that path again. Instead: hand back the real URL if the blob is
	//ready, otherwise (re)queue the fetch so repaintModImage can swap the marker in the
	//DOM once it lands. Second passes during a normal in-flight load behave exactly as
	//before (the path is "fetching", so this just returns the marker).
	if (image.includes("none.webp#")) {
		try {
			var markerPath = decodeURIComponent(image.split("none.webp#").pop());
			if (window.modImages && window.modImages[markerPath] && window.modImages[markerPath] !== "not_found") {
				return window.modImages[markerPath];
			}
			if (window.knownModFiles && window.knownModFiles.has(markerPath) && window.loadingStatus[markerPath] !== "fetching") {
				lazyLoadModImage(markerPath);
			}
		} catch (e) {
			//Malformed marker (e.g. a mangled save) — fall through and return it untouched.
		}
		return image;
	}

	//Remove any potential top-level folder or direct format calls, the game is only built for .webp (and mp4 in specific cases)
	var cleanedImageName = image.replace("images/", "");
	cleanedImageName = cleanedImageName.replace("images-webp/", "");
	cleanedImageName = cleanedImageName.replace("images-webp/", "");
	cleanedImageName = cleanedImageName.replace("images-png/", "");
	cleanedImageName = cleanedImageName.replace("images-png/", "");
	cleanedImageName = cleanedImageName.replace(".webp", "");
	cleanedImageName = cleanedImageName.replace(".webp", "");
	cleanedImageName = cleanedImageName.replace(".png", "");
	cleanedImageName = cleanedImageName.replace(".png", "");
	console.log("Displaying image: "+image)

	//Mod creation tools scene creation early exit
	if (window.syrupTempImageMap && window.syrupTempImageMap[cleanedImageName]) {
        return window.syrupTempImageMap[cleanedImageName].blobUrl;
    }
	//Mod creation tools general early exit, this is not for mods loaded via importing .zip files, it's a space for holding mods ready to be packed into .zip files
	if (uploadedImageMap[cleanedImageName]) {
		//console.info(image)
		return uploadedImageMap[cleanedImageName];
	}
	//Mod creation tools: an image slot the modder hasn't filled yet → inline SVG placeholder (no
	//blob, no fetch, so it's safe on local file:// builds). Real uploads above always take priority.
	//Guarded so this has zero effect during normal gameplay (the set is empty then).
	if (window.placeholderImagePaths && window.placeholderImagePaths.has(cleanedImageName)) {
		return window.PLACEHOLDER_IMAGE_SVG;
	}
	//Direct URL early exit
	if (cleanedImageName.includes("http") == true) {
		return cleanedImageName
	}

	image = cleanedImageName;

	//Modded images early exit, there is no feasible way to incorporate shortcuts such as skintone or gender variants for these without also overhauling how images are uploaded
	if (window.knownModFiles && window.knownModFiles.has(image)) {
		//Filter suffixes still apply, but only when the mod ships the plain image as well
		if (typeof filterImageSuffixes == "function" && window.knownModFiles.has(filterImageSuffixes(image))) {
			image = filterImageSuffixes(image);
		}

        // 1. If we have the URL, return it
        if (window.modImages[image] && window.modImages[image] !== "not_found") {
            return window.modImages[image]; 
        } 
        
        // 2. If it's not "fetching" yet, start the request
        if (window.loadingStatus[image] !== "fetching") {
            lazyLoadModImage(image);
        }
        
        // 3. Return the placeholder
        return "images-webp/none.webp#" + encodeURIComponent(image);
    }

	//Leftover from when the game supported png
	var imageFolder = "images";
    if (image) {
		//Replacement shortcuts
		image = image.replace("SCENE", data.player.currentScene);
		//Disabled filters swap suffixed images for the plain version (exampleRosebud -> example).
		//The extension is already stripped by this point, so the suffix is matched at the end of the name.
		//Guarded because toggles.js loads after this file.
		if (typeof filterImageSuffixes == "function") {
			image = filterImageSuffixes(image);
		}
		//Shortcut for commonly used nicknames
		var nicknames = [["sado", "sadogato"], ["fash", "fashionista"], ["shop", "shopkeep"]];
		for (nickIndex = 0; nickIndex < nicknames.length; nickIndex++) {
			if (image.includes(nicknames[nickIndex][0]+"/") == true) {
				image = image.replace(nicknames[nickIndex][0]+"/", nicknames[nickIndex][1]+"/");
			}
		}
		//Shortcut for player skintone and gender variants
		if (data.player.skin != "light") {
			if (image.includes("-light") == true) {
				image = image.replace("-light", "-"+data.player.skin);
			}
		}
		if (data.player.gender != "masc") {
			if (image.includes("-masc") == true) {
				image = image.replace("-masc", "-"+data.player.gender);
			}
		}
		
		
		//Emergency exits for mod images
		//Mod creation tools scene creation early exit
		if (window.syrupTempImageMap && window.syrupTempImageMap[image]) {
			return window.syrupTempImageMap[image].blobUrl;
		}
		//Mod creation tools general early exit, this is not for mods loaded via importing .zip files, it's a space for holding mods ready to be packed into .zip files
		if (uploadedImageMap[image]) {
			//console.info(image)
			return uploadedImageMap[image];
		}
		//Modded images early exit, there is no feasible way to incorporate shortcuts such as skintone or gender variants for these without also overhauling how images are uploaded
		if (window.knownModFiles && window.knownModFiles.has(image)) {
			
			// 1. If we have the URL, return it
			if (window.modImages[image] && window.modImages[image] !== "not_found") {
				return window.modImages[image]; 
			} 
			
			// 2. If it's not "fetching" yet, start the request
			if (window.loadingStatus[image] !== "fetching") {
				lazyLoadModImage(image);
			}
			
			// 3. Return the placeholder
			return "images-webp/none.webp#" + encodeURIComponent(image);
		}

		//Direct URL early exit
		if (image.includes("http") == true) {
			return image
		}

		//Shortcut for where current character is not present
		if (image.includes("/") == false && image.includes("scripts") == false) {
			image = data.player.currentCharacter+"/"+image
		}
		//Shortcut for characters with multiple genders
		if (image.includes("mayor/") == true && image.includes("SEX") == true) {
			if (checkFlag("mayor", "meat") == true) {
				image = image.replace("-SEX/", "-meat/")
				image = image.replace("SEX", "Meat")
			}
			else {
				image = image.replace("-SEX/", "/")
				image = image.replace("SEX", "Veggie")
			}
		}
		if (image.includes("carpenter/") == true && image.includes("SEX") == true) {
			if (checkFlag("carpenter", "meat") == true) {
				image = image.replace("-SEX/", "-meat/")
				image = image.replace("SEX", "Meat")
			}
			else {
				image = image.replace("-SEX/", "/")
				image = image.replace("SEX", "Veggie")
			}
		}
		if (image.includes("shopkeep/") == true || image.includes("artifacts/") == true) {
			if (image.includes("SEX") == true) {
				if (checkFlag("shopkeep", "meat") == true) {
					image = image.replace("-SEX/", "-meat/")
					image = image.replace("SEX", "Meat")
				}
				else {
					image = image.replace("-SEX/", "/")
					image = image.replace("SEX", "Veggie")
				}
			}
		}
		if (image.includes("tarot/") == true && image.includes("SEX") == true) {
			if (data.player.vegetarian == true) {
				image = image.replace("SEX", "Veggie")
			}
			else {
				image = image.replace("SEX", "Meat")
			}
		}
		
        if (image.includes(imageFolder+"-"+imageFormat+"/"+imageFolder+"-"+imageFormat+"/") == true) {
            //console.error("Double image format in image path")
            image = image.replace(
                imageFolder+"-"+imageFormat+"/"+imageFolder+"-"+imageFormat+"/", 
                imageFolder+"-"+imageFormat+"/"
            )
        }
		if (image.includes("."+imageFormat+"."+imageFormat) == true) {
			//console.error("Double image format in image path")
			image = image.replace(
				"."+imageFormat+"."+imageFormat, 
				"."+imageFormat
			)
		}
		//If the final character is an empty space, remove it
		if (image.slice(-1) == " ") {
			image = image.slice(0, -1);
		}

		image = imageFolder+"-"+imageFormat+"/"+image+"."+imageFormat;
		//Finaally, if no exits have been met, return the image
        return image;
    }
}

// || guards so these survive whichever script file loads first, and so we never wipe
// URLs / the registry that modding.js may already have populated.
window.modImages = window.modImages || {};                 // logicalPath -> Blob URL or 'not_found'
window.loadingStatus = window.loadingStatus || {};          // logicalPath -> "fetching" while queued
window.modImageFetchQueue = window.modImageFetchQueue || [];
window.isFetchingModImages = window.isFetchingModImages || false;
window.knownModFiles = window.knownModFiles || new Set();

function lazyLoadModImage(logicalPath, imgElement = null) {
    if (window.loadingStatus[logicalPath] === "fetching" || window.modImages[logicalPath] === "not_found") return;

    // Already materialized this session — reuse the existing URL instead of re-fetching.
    // A re-fetch used to revoke+remint the blob URL, breaking every DOM node (jiggy pieces,
    // baked-in backgrounds) that still pointed at the old one.
    if (window.modImages[logicalPath]?.startsWith?.("blob:")) {
        if (imgElement) imgElement.src = window.modImages[logicalPath];
        return;
    }

    window.loadingStatus[logicalPath] = "fetching";
    window.modImageFetchQueue.push({ path: logicalPath, element: imgElement });

    if (!window.isFetchingModImages) {
        window.isFetchingModImages = true;
        setTimeout(processModImageBatch, 0); // faster response
    }
}

async function processModImageBatch() {
    if (window.modImageFetchQueue.length === 0) {
        window.isFetchingModImages = false;
        return;
    }

    const batch = [...window.modImageFetchQueue];
    window.modImageFetchQueue = [];

    // If the DB can't even open (privacy modes, transient file:// hiccups), un-stick the
    // queued paths and reset the pump. Before this guard, a single rejection here left
    // isFetchingModImages stuck true — every mod image for the rest of the session stayed
    // a placeholder because no batch could ever be scheduled again.
    let store;
    try {
        const db = await openModDB();
        const tx = db.transaction("mod_images", "readonly");
        store = tx.objectStore("mod_images");
    } catch (e) {
        console.error("Mod image batch: mod DB unavailable (queued images will retry on their next render):", e);
        for (const item of batch) delete window.loadingStatus[item.path];
        if (window.modImageFetchQueue.length > 0) {
            setTimeout(processModImageBatch, 0);
        } else {
            window.isFetchingModImages = false;
        }
        return;
    }

    const requests = batch.map(item => {
        return new Promise(resolve => {
            // A synchronous throw here (bad key, transaction already dead) would REJECT
            // this promise and hang the Promise.all below — recover as a retryable miss.
            let req;
            try {
                req = store.get(item.path);
            } catch (e) {
                console.warn("Mod image get failed (will retry on next render):", item.path, e);
                delete window.loadingStatus[item.path];
                return resolve();
            }

            req.onsuccess = () => {
				// Wrapped in try/catch: an exception inside an IDB success handler aborts
				// the whole transaction, stranding every other request in this batch AND
				// leaving isFetchingModImages stuck true — one bad record used to kill
				// lazy loading for the rest of the session.
				try {
					const result = req.result;

					if (!result || !result.content) {
						// The record genuinely isn't there — permanent for this session.
						window.modImages[item.path] = "not_found";
						delete window.loadingStatus[item.path];
						return resolve();
					}

					// Records written by older loaders may hold raw bytes instead of a
					// Blob; createObjectURL would throw on those.
					let blob = result.content;
					if (!(blob instanceof Blob)) {
						blob = new Blob([blob], { type: "image/webp" });
					}

					// A URL for this path already exists (duplicate request slipped through):
					// KEEP it. Revoking here broke every element still using the old URL —
					// blob URLs must stay stable for the whole session.
					let url = window.modImages[item.path];
					if (!url?.startsWith?.("blob:")) {
						url = URL.createObjectURL(blob);
					}
					window.modImages[item.path] = url;

					if (item.element) {
						item.element.src = url;
					}

					delete window.loadingStatus[item.path];
				} catch (e) {
					// NOT marked not_found — clearing "fetching" lets a later render retry.
					console.warn("Mod image failed to materialize (will retry on next render):", item.path, e);
					delete window.loadingStatus[item.path];
				}
				resolve();
			};

            req.onerror = () => {
                // Transient read error (file:// installs see these — AV scans, profile
                // locks). Don't poison the path with "not_found", which is permanent for
                // the session; just clear the flag so a later render retries the fetch.
                console.warn("Mod image read failed (will retry on next render):", item.path, req.error);
                delete window.loadingStatus[item.path];
                resolve();
            };
        });
    });

    await Promise.all(requests);

    // Swap any placeholders already baked into the DOM for the images we just resolved
    // (cleanupImage returns a "none.webp#<path>" marker while a blob is in flight).
    for (const item of batch) {
        const resolvedUrl = window.modImages[item.path];
        if (resolvedUrl && resolvedUrl !== "not_found") repaintModImage(item.path, resolvedUrl);
    }

    // 🔁 IMPORTANT: continue processing if new items arrived mid-batch
    if (window.modImageFetchQueue.length > 0) {
        setTimeout(processModImageBatch, 0);
    } else {
        window.isFetchingModImages = false;
    }
}

// When a mod image finishes loading, cleanupImage may already have returned a
// placeholder ("…/none.webp#<encoded logical path>") that got baked into the DOM via
// innerHTML or a background-image. Find those and swap in the real blob URL so the
// image appears without waiting for the next full re-render.
function repaintModImage(logicalPath, url) {
	if (!url || url === "not_found") return;

	// EXACT match on the encoded path. A loose .includes() is wrong here: the marker for
	// "sub5Veggie-1" is a prefix of "sub5Veggie-10", so substring matching paints puzzle
	// 1's image onto 10–19 (and then those elements lose their marker and can never claim
	// their own blob).
	const imgMarker = "none.webp#" + encodeURIComponent(logicalPath);

	// <img src="…none.webp#<path>"> — the marker is the tail of the src, so endsWith is exact.
	document.querySelectorAll('img[src*="none.webp#"]').forEach(img => {
		if ((img.getAttribute("src") || "").endsWith(imgMarker)) img.src = url;
	});

	// CSS background sinks (e.g. the location background #wrapperBG): url(…none.webp#<path>)
	// — the marker is followed by a closing quote or paren, so require that boundary to
	// avoid the same prefix false-match.
	document.querySelectorAll('[style*="none.webp#"]').forEach(el => {
		const bg = el.style.backgroundImage || "";
		if (bg.includes(imgMarker + '"') || bg.includes(imgMarker + "'") || bg.includes(imgMarker + ")")) {
			el.style.backgroundImage = "url(" + url + ")";
		}
	});
}



//Expressions are drawn once, in one folder, and tinted at runtime by a mask. There is no longer
//a whole set of face art per skintone: player/light, player/tan and player/dark are replaced by
//player/expressions plus a matching mask of the same name in player/masks.
const playerExpressionFolder = "player/expressions";
const playerMaskFolder = "player/masks";

//How each skintone is made from that one set. The mask multiplies over the doll and the face.
//Light is the art exactly as drawn, so it gets no mask at all.
//
//Tan is the mask at its own natural strength, 171 of 255. Dark still needs finding by eye: the
//three knobs are here so it can be dialled in without touching any art. Opacity thins the mask,
//contrast deepens the difference between its light and dark areas, and saturate pushes how much
//colour it carries rather than just darkening.
const skinToneMasks = {
	light: null,
	tan: {opacity: 171 / 255, contrast: 1, brightness: 1, saturate: 1},
	dark: {opacity: 200 / 255, contrast: 1, brightness: 0.5, saturate: 0.5}
};

//The mask layer for the current skintone, or nothing at all for light skin. The mask is named
//after the expression it belongs to, so the path is the expression's with the folder swapped.
function skinMaskLayer(expressionPath, classType) {
	var tone = skinToneMasks[data.player.skin];
	if (!tone) {
		return "";
	}
	var maskPath = String(expressionPath).split(playerExpressionFolder).join(playerMaskFolder);
	//Only the tunable parts are inline; the blend mode and the border removal live in the
	//stylesheet, where the class is defined once for both orientations
	var style = "opacity:" + tone.opacity + ";";
	var maskFilter = "";
	if (tone.contrast != 1) {
		maskFilter += " contrast(" + tone.contrast + ")";
	}
	if (tone.saturate != 1) {
		maskFilter += " saturate(" + tone.saturate + ")";
	}
	if (tone.brightness != 1) {
		maskFilter += " saturate(" + tone.saturate + ")";
	}
	if (maskFilter != "") {
		style += "filter:" + maskFilter + ";";
	}
	//A mask that has not been drawn yet simply removes itself, so an unfinished expression falls
	//back to light skin instead of showing a broken image while the set is still being made
	return `<img class="`+classType+` playerSkinMask" style="`+style+`" src="`+maskPath+`" onerror="this.style.display='none'">`;
}

function drawPlayer(special, clothesOverride, skinOverride) {
	//The clothes to draw, normally the player's worn clothes. Pass an array (like a saved outfit) to preview it on the player's current body instead.
	var playerClothes = data.player.clothes;
	var playerSkin = data.player.skin;
	if (skinOverride != undefined) {
		playerSkin = skinOverride;
	}
	if (clothesOverride != undefined) {
		playerClothes = clothesOverride;
	}
	var expression = cleanupImage(playerExpressionFolder+"/happy")
	var classType = "playerImage";
	var specialCounter = 0;
	var newClothingArray = [];
	var bottomless = false;
	var topless = false;
	var nopan = false;

	var backwearToAdd = [];
	var playerGenitalString = "";

	//Special code for altering the player image
	//EX: clothes:001;expression:happy;clothes:211;
	if (special == undefined) {
		special = "";
	}
	if (special.includes("playerSelf;")) {
		special = special.replace("playerSelf;", "");
		classType = "playerSelf";
	}
	if (special.includes("textThumb;")) {
		special = special.replace("textThumb;", "");
		classType = "textThumb";
	}
	if (special.includes("bottomless;")) {
		special = special.replace("bottomless;", "");
		bottomless = true;
	}
	if (special.includes("nopan;")) {
		special = special.replace("nopan;", "");
		nopan = true;
	}
	if (special.includes("topless;")) {
		special = special.replace("topless;", "");
		topless = true;
	}
	if (special.includes("nude;")) {
		special = special.replace("nude;", "");
		bottomless = true;
		topless = true;
	}
	while (special != "" && specialCounter < 100) {
		specialCommand = special.split(`:`)[0];
		console.log("Special command detected, "+specialCommand+"");
		switch (specialCommand) {
			case "clothes": {
				console.log(special.split(`;`)[0]);
				newClothingArray.splice(1, 0, special.split(`;`)[0]);
				break;
			}
			case "expression": {
				expression = special.split(`;`)[0];
				expression = expression.replace("expression:", "");
				data.player.emotion = expression;
				expression = cleanupImage(playerExpressionFolder+"/"+expression);
				break;
			}
			case "class": {
				classType = special.split(`;`)[0];
				classType = classType.replace("class:", "");
				break;
			}
		}
		special = special.replace(special.split(`;`)[0]+";", "");
		if (special != "") {
			console.log("Next special: "+special);
		}
		specialCounter += 1;
	}
	//Player image base
	var playerImage = `<img id="playerImage" class="`+classType+`" src="` + cleanupImage(`player/doll-`+data.player.gender+`-`+playerSkin) + `">`;
	console.debug(data.player.emotion);
	if (data.player.emotion == "robot") {
		playerImage = `<img id="playerImage" class="`+classType+`" src="` + cleanupImage(`player/doll-`+data.player.gender+`-robot`) + `">`;
	}
	if (data.player.gender == "masc") {
		expression = expression.replace("happy", "happy-masc");
	}
	if (data.player.gender == "fem") {
		expression = expression.replace("happy", "happy-fem");
	}
	//Special robot bypass
	if (data.player.emotion != "robot") {
		playerImage+= `<img id="playerExpression" class="`+classType+`" src="`+expression+`">`;
		//The skintone mask sits directly on the face, over the expression and under everything
		//else, so hair and clothing are never tinted by it
		playerImage+= skinMaskLayer(expression, classType);
	}

	//Resolve the whole layer list before emitting anything. The old renderer decided genital
	//visibility part way through building the output string, so a covering piece late in the
	//array switched it off only after the genitals had already been written out, which drew
	//the player's junk on top of their trousers as soon as two lowerwear pieces were worn.
	var drawList = normalizeDrawList(playerClothes);

	//clothes: specials put a garment on the preview using the same rules as actually wearing
	//one, so a wardrobe tile always shows exactly what equipping that garment would do
	for (var newClothingCounter = 0; newClothingCounter < newClothingArray.length; newClothingCounter++) {
		var clothingNumber = newClothingArray[newClothingCounter].replace("clothes:", "");
		if (isNaN(parseInt(clothingNumber))) {
			for (var clothesNameCounter = 0; clothesNameCounter < globalClothesArray.length; clothesNameCounter++) {
				if (globalClothesArray[clothesNameCounter].index == clothingNumber) {
					clothingNumber = clothesNameCounter;
				}
			}
		}
		clothingNumber = parseInt(clothingNumber);
		if (globalClothesArray[clothingNumber]) {
			drawList = applyGarment(drawList, globalClothesArray[clothingNumber]);
		}
	}

	//Whether the genitals are drawn at all, resolved once. A covering garment above the anchor
	//already accounts for them in its own art. bottomless is hiding those garments anyway, so
	//it stops them counting; nopan overrides everything.
	var showGenitals = true;
	if (bottomless != true) {
		showGenitals = genitalsVisible(drawList);
	}
	if (data.player.genitals == "pussy") {
		showGenitals = false;
	}
	if (nopan == true) {
		showGenitals = true;
	}

	//A piece tagged genitals supplies the anchor's art in place of the default stack
	for (var genitalCounter = 0; genitalCounter < drawList.length; genitalCounter++) {
		if (hasTag(drawList[genitalCounter], "genitals")) {
			playerGenitalString += `<img class="`+classType+`" style="`+clothingStyle(drawList[genitalCounter])+`" src="`+cleanupImage(drawList[genitalCounter].image)+`">`;
		}
	}
	if (playerGenitalString == "") {
		if (data.player.emotion != "robot") {
			playerGenitalString+= `<img class="`+classType+`" src="` + cleanupImage(`player/balls-`+playerSkin) + `">`;
		}
		else {
			playerGenitalString+= `<img class="`+classType+`" src="` + cleanupImage(`player/balls-robot`) + `">`;
		}
		if (data.player.genitals.includes("penis")) {
			if (data.player.emotion != "robot") {
				playerGenitalString+= `<img class="`+classType+`" src="` + cleanupImage(`player/`+data.player.genitals+`-`+playerSkin) + `">`;
			}
			else {
				playerGenitalString+= `<img class="`+classType+`" src="` + cleanupImage(`player/`+data.player.genitals+`-robot`) + `">`;
			}
		}
		else {
			playerGenitalString+= `<img class="`+classType+`" src="` + cleanupImage(`player/`+data.player.genitals) + `">`;
		}
	}

	//Emit the layers in order. Hair sits at the front of the list rather than being spliced
	//into the output string at a fixed offset the way it used to be.
	var drawnNames = "";
	for (var drawCounter = 0; drawCounter < drawList.length; drawCounter++) {
		var wornPiece = drawList[drawCounter];

		//The anchor is where the genital stack goes. It is a body layer, not a garment.
		if (isGenitalAnchor(wornPiece)) {
			if (showGenitals == true) {
				playerImage += playerGenitalString;
			}
			continue;
		}
		//Its art was folded into the genital stack above
		if (hasTag(wornPiece, "genitals")) {
			continue;
		}
		//This is a paperdoll, so underwear art cannot deform to fit whatever is drawn over it.
		//A covering garment has to take the underwear with it or the two clip through each other.
		if (hasTag(wornPiece, "underwear") && showGenitals != true) {
			continue;
		}
		if (hasTag(wornPiece, "underwear") && bottomless == true) {
			continue;
		}
		if (hasTag(wornPiece, "covering") && bottomless == true) {
			continue;
		}
		if (wornPiece.category == "lowerwear" && bottomless == true) {
			continue;
		}
		if (wornPiece.category == "upperwear" && topless == true) {
			continue;
		}
		//Worn pieces are unique by name, so this only ever fires on malformed data
		if (drawnNames.includes(wornPiece.index+";") == true) {
			continue;
		}
		drawnNames += wornPiece.index+";";

		//Reduce to the base body first. The rewrites below only convert away from the base, so a
		//path that already names a body cannot be pointed at a different one without this, which
		//is how a garment ended up stuck on the skintone it was last drawn for.
		var clothingArticle = clothingBaseVariants(cleanupImage(wornPiece.image));
		if (clothingArticle.includes("-masc") && data.player.gender == "fem" ) {
			clothingArticle = clothingArticle.replace("-masc", "-fem")
		}
		if (clothingArticle.includes("-penis") && data.player.genitals == "pussy" ) {
			clothingArticle = clothingArticle.replace("-penis", "-pussy")
		}
		if (clothingArticle.includes("-light") && playerSkin != "light" ) {
			clothingArticle = clothingArticle.replace("-light", "-"+playerSkin)
		}
		playerImage+= `<img class="`+classType+`" style="`+clothingStyle(wornPiece)+`" src="`+clothingArticle+`">`;

		//A Front piece is half of a garment; its Back half is drawn behind the body. Both halves
		//take the same offset, since they are one garment seen in one front-facing view.
		if (clothingArticle.includes("Front")) {
			backwearToAdd.push(`<img class="`+classType+`" style="`+clothingStyle(wornPiece, true)+`" src="`+clothingArticle.replace("Front", "Back")+`">`);
		}
	}

	for (var backwearCounter = 0; backwearCounter < backwearToAdd.length; backwearCounter++) {
		playerImage = backwearToAdd[backwearCounter]+playerImage;
	}
	//The empty full-canvas layer closes the stack, and it is the one layer that is always
	//present and never scaled or offset, so it carries the frame's border and drop shadow.
	//Every other layer draws a transparent border of the same width to keep the stack aligned.
	//Painting the border on all of them only looked like one frame while every piece was the
	//same size: a resized piece in Full Control dragged its own copy of the border with it.
	playerImage+= `<img class="`+classType+` playerImageEdge" src="` + cleanupImage(`player/player-empty`) + `">`;
	return playerImage
}

function drawCharacter(character, special) {
	console.info("Drawing character "+character+" with special "+special);
	for (characterIndex = 0; characterIndex < data.story.length; characterIndex++) {
		if (character == data.story[characterIndex].index) {
			var printedChar = data.story[characterIndex]
		}
	}
	var finalOutfit = printedChar.outfit;
	var finalEmotion = printedChar.emotion;
	var finished = false;
	for (characterIndex = 0; characterIndex < finishedCharactersArray.length; characterIndex++) {
		if (character == finishedCharactersArray[characterIndex]) {
			finished = true;
		}
	}
	
	if (finished == true) {
		var appendTag = "";
		for (expressionIndex = 0; expressionIndex < systemChars.length; expressionIndex++) {
			if (systemChars[expressionIndex] == printedChar.index && checkFlag(printedChar.index, "meat") == true) {
				appendTag = "-meat";
			}
		}
		var classType = "playerImage";
		if (special.includes("playerSelf;")) {
			special = special.replace("playerSelf;", "");
			classType = "playerSelf";
		}
		if (special.includes("textThumb;")) {
			special = special.replace("textThumb;", "");
			classType = "textThumb";
		}
		specialCounter = 0;
		while (special != "" && specialCounter < 100) {
			specialCommand = special.split(`:`)[0];
			console.log("Special command detected, "+specialCommand+"");
			switch (specialCommand) {
				case "clothes": {
					console.log(special.split(`;`)[0]);
					clothes = special.split(`;`)[0];
					clothes = clothes.replace("clothes:", "");
					if (character == "carpenter") {
						clothes = clothes.replace("-meat", "");
					}
					finalOutfit = clothes;
					break;
				}
				case "emotion": {
					expression = special.split(`;`)[0];
					expression = expression.replace("emotion:", "");
					finalEmotion = expression;
					break;
				}
				case "expression": {
					expression = special.split(`;`)[0];
					expression = expression.replace("expression:", "");
					finalEmotion = expression;
					break;
				}
				case "class": {
					classType = special.split(`;`)[0];
					classType = classType.replace("class:", "");
					break;
				}
			}
			special = special.replace(special.split(`;`)[0]+";", "");
			if (special != "") {
				console.log("Next special: "+special);
			}
			specialCounter += 1;
		}
		var finalBase = cleanupImage(character+"/model/base")
		if (character == "milf" && checkFlag("milf", "pregnant") != true) {
			finalBase = cleanupImage(character+"/model/base-alt");
		}
		var characterImage = `<img id="playerImage" class="`+classType+`" src="` + finalBase + `">`;
		characterImage += `<img id="playerImage" class="`+classType+`" src="` + cleanupImage(character+"/model/expressions/"+finalEmotion) + `">`;
		for (expressionIndex = 0; expressionIndex < expressionArray.length; expressionIndex++) {
			if (expressionArray[expressionIndex].index == finalEmotion) {
				if (character == "foxf" && fetishes("female") == false) {
					var finalArousal = "5";
				}
				else if (character == "foxm" && fetishes("male") != true) {
					var finalArousal = "5";
				}
				else {
					var finalArousal = expressionArray[expressionIndex].arousal;
				}
				if (printedChar.gender == "male" || finalArousal != "0" || appendTag == "-meat") {
					if (character == "milf") {
						if (checkFlag("milf", "pregnant") != true) {
							appendTag = "-alt";
						}
					}
					characterImage += `<img id="playerImage" class="`+classType+`" src="` + cleanupImage(character+"/model/arousal/"+finalArousal+appendTag)+ `">`;
				}
			}
		}
		if (finalOutfit != "nude") {
			if (character == "carpenter" || character == "shopkeep") {
				appendTag = "";
			}
			if (character == "milf") {
				if (finalOutfit == "clothed" && checkFlag("milf", "pregnant") != true) {
					appendTag = "-alt";
				}
			}
			//console.info("Final outfit: "+finalOutfit);
			//console.info("Final outfit: "+cleanupImage(character+"/model/clothing/"+finalOutfit+appendTag));
			characterImage += `<img id="playerImage" class="`+classType+`" src="` + cleanupImage(character+"/model/clothing/"+finalOutfit+appendTag)+ `">`;
		}
		if (character == "doe") {
			characterImage += `<img id="playerImage" class="`+classType+`" src="` + cleanupImage(character+"/model/arousal/"+finalArousal+appendTag)+ `">`;
		}
		console.log(characterImage);
		return characterImage
	}
}

function resolveAvatarHTML(speaker, playerStyle, isEgg) {
    // 1. Handle explicit "none" command
    if (speaker.image === "none") {
        return `<img class="thumbnailImage ${playerStyle}" src="${cleanupImage('none')}">`;
    }

    // 2. Handle the Player (and the Eggy state override)
    // We check both "player" and the actual name to catch all references
    if (speaker.id === "player" || speaker.id === data.player.name) {
        if (isEgg) {
            return `<img class="thumbnailImage ${playerStyle}" src="${cleanupImage('system/avatars/eggT')}">`;
        } else {
            // drawPlayer handles its own stacking, we just pass the parameters
            return drawPlayer(`class:thumbnailImage ${playerStyle};expression:${data.player.emotion};`);
        }
    }

    // 3. Handle explicit image overrides (altImage) passed into writeSpeech
    // If it's not empty and not "none", we use exactly what was passed.
    if (speaker.image !== "") {
        return `<img class="thumbnailImage ${playerStyle}" src="${cleanupImage(speaker.image)}">`;
    }

    // 4. Handle "new" layered characters
    if (speaker.type === "new") {
        return drawCharacter(speaker.id, `class:thumbnailImage ${playerStyle};`);
    }

    // 5. Handle "old" single-layer characters
    // Fallback to the standard folder structure: id/outfit/emotion
    let defaultPath = `${speaker.id}/${speaker.outfit}/${speaker.emotion}`;
    let avatarHTML = `<img class="thumbnailImage ${playerStyle}" src="${cleanupImage(defaultPath)}">`;

    // 6. Stack any spirits currently speaking on top of that portrait. Their images share the
    // host's canvas and .thumbnailImage is absolutely positioned, so the layers line up the same
    // way drawCharacter's do — no offsets needed here.
    if (speaker.spirits && speaker.spirits.length > 0) {
        for (let spiritIndex = 0; spiritIndex < speaker.spirits.length; spiritIndex++) {
            let spiritTarget = spiritArray.find(entry => entry.index === speaker.spirits[spiritIndex]);
            if (spiritTarget) {
                avatarHTML += `<img class="thumbnailImage ${playerStyle}" src="${cleanupImage(spiritTarget.image)}">`;
            }
        }
    }
    return avatarHTML;
}

function imageFailure(image) {
	var image = document.getElementById(image);
}

function passTime() {
	if (data.player.shortcuts == null) {
		data.player.shortcuts = [];
	}
	if (data.player.location != "playerHouse" && !data.player.shortcuts.includes(data.player.location) && grottoStarted == false) {
		data.player.shortcuts.push(data.player.location);
	}
	if (checkFlag("player", "gallery") != true) {
		switch (data.player.time) {
			case "Morning":
				savedLocations.morning = data.player.location;
				data.player.time = "Evening";
			break;
			case "Evening":
				savedLocations.evening = data.player.location;
				data.player.time = "Night";
			break;
			case "Night":
				if (data.player.currentScene == "newDay") {
					//data.player.time = "Morning";
				}
			break;
		}
	}
	checkTV();
}

function printShortcuts() {
	if (data.player.shortcuts == null) {
		data.player.shortcuts = [];
	}
	console.log(data.player.shortcuts);
	for (shortcutIndex = 0; shortcutIndex < data.player.shortcuts.length; shortcutIndex++) {
		var shortcutLine = `changeLocation('`+data.player.shortcuts[shortcutIndex]+`')`;
		var shortcutName = "Go straight back to "
		for (locationIndex = 0; locationIndex < locationArray.length; locationIndex++) {
			if (locationArray[locationIndex].index == data.player.shortcuts[shortcutIndex]) {
				shortcutName += locationArray[locationIndex].name;
			}
		}
		writeFunction(shortcutLine, shortcutName);
	}
	data.player.shortcuts = [];
}

//Text modification functions
function replaceCodenames(text) {
	//console.info(text)
	var codenameCheck = "";
	for (geminiLoop = 0; geminiLoop < 5; geminiLoop++) {
		text = text.replace('SCENE', data.player.currentScene);
		if (data.player.nickname != null) {
			text = text.replace('*Master', data.player.nickname);
			text = text.replace('*master', data.player.nickname);
		}
		text = text.replace('playerF', data.player.name);
		text = text.replace('<3', "❤");
		text = text.replace('roobyredF', roobyNames[0]);
		text = text.replace('roobywhiteF', roobyNames[1]);
		text = text.replace('roobyblackF', roobyNames[2]);
		text = text.replace('roobyyellowF', roobyNames[3]);
		for (shortcutIndex = 0; shortcutIndex < characterShortcuts.length; shortcutIndex++) {
			text = text.replace(characterShortcuts[shortcutIndex].index+'F', characterShortcuts[shortcutIndex].full+"F");
		}
		switch (data.player.gender) {
			case "masc": {
				text = text.replace("*he", "he");
				text = text.replace("*He", "He");
				text = text.replace("*HE", "HE");
				text = text.replace("*dude", "dude");
				text = text.replace("*Dude", "Dude");
				text = text.replace("*DUDE", "DUDE");
				text = text.replace("*brother", "brother");
				text = text.replace("*Brother", "Brother");
				text = text.replace("*BROTHER", "BROTHER");
				text = text.replace("*bro", "bro");
				text = text.replace("*Bro", "Bro");
				text = text.replace("*BRO", "BRO");
				text = text.replace("*bastard", "bastard");
				text = text.replace("*Bastard", "Bastard");
				text = text.replace("*BASTARD", "BASTARD");
				text = text.replace("*his", "his");
				text = text.replace("*His", "His");
				text = text.replace("*HIS", "HIS");
				text = text.replace("*men", "men");
				text = text.replace("*Men", "Men");
				text = text.replace("*MEN", "MEN");
				text = text.replace("*man", "man");
				text = text.replace("*Man", "Man");
				text = text.replace("*MAN", "MAN");
				text = text.replace("*him", "him");
				text = text.replace("*Him", "Him");
				text = text.replace("*HIM", "HIM");
				text = text.replace("*boy", "boy");
				text = text.replace("*Boy", "Boy");
				text = text.replace("*BOY", "BOY");
				text = text.replace("*guy", "guy");
				text = text.replace("*Guy", "Guy");
				text = text.replace("*GUY", "GUY");
				text = text.replace("*mister", "mister");
				text = text.replace("*Mister", "Mister");
				text = text.replace("*MISTER", "MISTER");
				text = text.replace("*sir", "sir");
				text = text.replace("*Sir", "Sir");
				text = text.replace("*SIR", "SIR");
				text = text.replace("*male", "male");
				text = text.replace("*Male", "Male");
				text = text.replace("*MALE", "MALE");
				text = text.replace("*geezer", "geezer");
				text = text.replace("*Geezer", "Geezer");
				text = text.replace("*GEEZER", "GEEZER");
				text = text.replace("*master", "master");
				text = text.replace("*Master", "Master");
				text = text.replace("*MASTER", "MASTER");
				text = text.replace("*father", "father");
				text = text.replace("*Father", "Father");
				text = text.replace("*FATHER", "FATHER");
				text = text.replace("*daddy", "daddy");
				text = text.replace("*Daddy", "Daddy");
				text = text.replace("*DADDY", "DADDY");
				text = text.replace("*gentleman", "gentleman");
				text = text.replace("*Gentleman", "Gentleman");
				text = text.replace("*GENTLEMAN", "GENTLEMAN");
				break;
			}
			case "fem": {
				text = text.replace("*he", "she");
				text = text.replace("*He", "She");
				text = text.replace("*HE", "SHE");
				text = text.replace("*dude", "lady");
				text = text.replace("*Dude", "Lady");
				text = text.replace("*DUDE", "LADY");
				text = text.replace("*brother", "sister");
				text = text.replace("*Brother", "Sister");
				text = text.replace("*BROTHER", "SISTER");
				text = text.replace("*bro", "sis");
				text = text.replace("*Bro", "Sis");
				text = text.replace("*BRO", "SIS");
				text = text.replace("*bastard", "bitch");
				text = text.replace("*Bastard", "Bitch");
				text = text.replace("*BASTARD", "BITCH");
				text = text.replace("*his", "her");
				text = text.replace("*His", "Her");
				text = text.replace("*HIS", "HER");
				text = text.replace("*man", "woman");
				text = text.replace("*Man", "Woman");
				text = text.replace("*MAN", "WOMAN");
				text = text.replace("*men", "women");
				text = text.replace("*Men", "Women");
				text = text.replace("*MEN", "WOMEN");
				text = text.replace("*him", "her");
				text = text.replace("*Him", "Her");
				text = text.replace("*HIM", "HER");
				text = text.replace("*boy", "girl");
				text = text.replace("*Boy", "Girl");
				text = text.replace("*BOY", "GIRL");
				text = text.replace("*guy", "girl");
				text = text.replace("*Guy", "Girl");
				text = text.replace("*GUY", "GIRL");
				text = text.replace("*dude", "dudette");
				text = text.replace("*Dude", "Dudette");
				text = text.replace("*DUDE", "DUDETTE");
				text = text.replace("*mister", "miss");
				text = text.replace("*Mister", "Miss");
				text = text.replace("*MISTER", "MISS");
				text = text.replace("*sir", "ma'am");
				text = text.replace("*Sir", "Ma'am");
				text = text.replace("*SIR", "MA'AM");
				text = text.replace("*male", "female");
				text = text.replace("*Male", "Female");
				text = text.replace("*MALE", "FEMALE");
				text = text.replace("*geezer", "hag");
				text = text.replace("*Geezer", "Hag");
				text = text.replace("*GEEZER", "HAG");
				text = text.replace("*master", "mistress");
				text = text.replace("*Master", "Mistress");
				text = text.replace("*MASTER", "Mistress");
				text = text.replace("*father", "mother");
				text = text.replace("*Father", "Mother");
				text = text.replace("*FATHER", "MOTHER");
				text = text.replace("*daddy", "mommy");
				text = text.replace("*Daddy", "Mommy");
				text = text.replace("*DADDY", "MOMMY");
				text = text.replace("*gentleman", "lady");
				text = text.replace("*Gentleman", "Lady");
				text = text.replace("*GENTLEMAN", "LADY");
				break;
			}
		}
		for (codenameIndex = 0; codenameIndex < data.story.length; codenameIndex++) {
			codenameCheck = data.story[codenameIndex].index + "F";
			text = text.replace(codenameCheck, data.story[codenameIndex].fName);
			codenameCheck = data.story[codenameIndex].index + "L";
			text = text.replace(codenameCheck, data.story[codenameIndex].lName);
		}
	}
	if (data.player.pronouns == true && text.includes('onclick') == false) {
		var pronounArray = ["I", "We", "You", "He", "She", "It", "They", "Me", "Us", "You", "Him", "Her", "Them", "Mine", "Ours", "Yours", "His", "Hers", "Its", "Theirs", "My", "Our", "Your", "Their", "Myself", "Ourselves", "Yourself", "Himself", "Herself", "Itself", "Themselves", "All", "Another", "Any", "Anybody", "Anyone", "Anything", "Both", "Each", "Eachother", "Either", "Everybody", "Everyone", "Everything", "Few", "Many", "Most", "Neither", "Nobody", "None", "No one", "Nothing", "One", "Other", "Others", "Several", "Some", "Somebody", "Someone", "Something", "Such", "That", "These", "This", "Those", "What", "Whatever", "Which", "Whichever", "Who", "Whoever", "Whom", "Whomever", "Whose", "As", "That", "Thou", "Thee", "Thy", "Thine", "Ye"];
		for (geminiLoop = 0; geminiLoop < 10; geminiLoop++) {
			for (pronounIndex = 0; pronounIndex < pronounArray.length; pronounIndex++) {
				text = text.replace(" "+pronounArray[pronounIndex].toLowerCase()+" ", " ");
				text = text.replace(" "+pronounArray[pronounIndex].toLowerCase()+".", ".");
				text = text.replace(" "+pronounArray[pronounIndex].toLowerCase()+"'", "'");
				text = text.replace(pronounArray[pronounIndex]+" ", "");
				text = text.replace(pronounArray[pronounIndex]+".", ".");
				text = text.replace(pronounArray[pronounIndex]+"'", "'");
			}
			text = text.replace(" I ", "");
		}
	}
	if (data.player.uwu == true && text.includes('onclick') == false) {
		for (uwuLoop = 0; uwuLoop < 30; uwuLoop++) {
			text = text.replace('<br>', "TESTTHING");
			text = text.replace('th', "d");
			text = text.replace('Th', "D");
			text = text.replace('what', "wat");
			text = text.replace('What', "Wat");
			text = text.replace('l', "w");
			text = text.replace('r', "w");
			text = text.replace('L', "W");
			text = text.replace('R', "W");
			text = text.replace('TESTTHING', "<br>");
		}
		switch (getRandomInt(15)) {
			case 0:
				text = text + " ♥w♥";
			break;
			case 1:
				text = text + " (˘ω˘)";
			break;
			case 2:
				text = text + " (U ᵕ U❁)";
			break;
			case 3:
				text = text + " ( ˊ.ᴗˋ )";
			break;
			case 4:
				text = text + " ( ͡o ꒳ ͡o )";
			break;
			case 5:
				text = text + " ( ´ω` )۶";
			break;
			case 6:
				text = text + " OwO";
			break;
			case 7:
				text = text + " (*ฅ́˘ฅ̀*)";
			break;
			case 8:
				text = text + " ( ͡o ᵕ ͡o )";
			break;
			case 9:
				text = text + " ✧･ﾟ: *✧･ﾟ♡*(ᵘʷᵘ)*♡･ﾟ✧*:･ﾟ✧";
			break;
			case 10:
				text = text + " ★⌒ヽ(˘꒳˘ *)";
			break;
			case 11:
				text = text + " (◕ ˬ ◕✿)";
			break;
			case 12:
				text = text + " (◕∇◕✿)";
			break;
			case 13:
				text = text + " (ꈍ ᴗ ꈍ✿)";
			break;
			case 14:
				text = text + " (◕‸ ◕✿) *pout*";
			break;
			case 15:
				text = text + " (≖ ︿ ≖ ✿)";
			break;
		}
	}
	text = text.replace('<spooky>', "<span style='font-family:spooky;'>");
	text = text.replace('</spooky>', "</span>");
	return text;
}

//Replaces a requirement alias only when it ends a whole token (followed by ";", a space, or the
//end of the string). A bare .replace() also matched inside longer requirements, so the "preg"
//alias ate the front of "?fetish pregnancy" and left "nancy;" behind as phantom junk (same for
//"rim"/"rimming" leaving "ming;", "?shop"/"?shopkeep" leaving "keep;", etc).
function replaceAliasToken(string, needle, replacement) {
	var searchFrom = 0;
	var idx = string.indexOf(needle, searchFrom);
	while (idx != -1) {
		var after = string[idx + needle.length];
		if (after == undefined || after == " " || after == ";") {
			var newToken = replacement;
			//Keep exactly one ";" between the replacement and whatever followed the alias
			if (after == ";" && newToken[newToken.length-1] == ";") {
				newToken = newToken.slice(0, -1);
			}
			if (after == undefined && newToken[newToken.length-1] != ";") {
				newToken += ";";
			}
			return string.slice(0, idx) + newToken + string.slice(idx + needle.length);
		}
		searchFrom = idx + 1;
		idx = string.indexOf(needle, searchFrom);
	}
	return string;
}

function checkRequirements(string, cull) {
	/*Edge case scenario for removing system text from the input string*/
	if (string[0] == " ") {
		string = string.substring(1);
	}
	//console.info("Checking requirements for: "+string);


	var removedRequirements = [];
	var requirementLimit = 200;
	var requirementCount = 0;
	if (cull == undefined) {
		cull = false;
	}
	var requirementAliases = [
		["boys", "fetish male;"],
		["boy", "fetish male;"],
		["males", "fetish male;"],
		["male", "fetish male;"],
		["futanari", "fetish dickgirl;"],
		["futa", "fetish dickgirl;"],
		["dickgirls", "fetish dickgirl;"],
		["dickgirl", "fetish dickgirl;"],
		["females", "fetish female;"],
		["female", "fetish female;"],
		["girls", "fetish female;"],
		["girl", "fetish female;"],

		["rosebud", "fetish rosebud;"],
		["prolapse", "fetish rosebud;"],
		["sounding", "fetish urethral;"],
		["meat", "mode carnivore;"],
		["carnivore", "mode carnivore;"],
		["veggie", "mode vegetarian;"],
		["vegetarian", "mode vegetarian;"],

		["sounding", "fetish urethral;"],
		["urethral", "fetish urethral;"],
		["prolapse", "fetish rosebud;"],
		["rosebud", "fetish rosebud;"],
		["sub", "fetish playerSub;"],
		["playersub", "fetish playerSub;"],
		["playerSub", "fetish playerSub;"],
		["preg", "fetish pregnancy;"],
		["pregnancy", "fetish pregnancy;"],
		["atwt", "fetish atw;"],
		["all the way through", "fetish atw;"],
		["atw", "fetish atw;"],
		["ballbusting", "fetish cbt;"],
		["cbt", "fetish cbt;"],
		["urethral", "fetish urethral;"],
		["unusual", "fetish urethral;"],
		["orifice", "fetish urethral;"],
		["ws", "fetish watersports;"],
		["pee", "fetish watersports;"],
		["piss", "fetish watersports;"],
		["pissing", "fetish watersports;"],
		["watersports", "fetish watersports;"],
		["anilingus", "fetish rimming;"],
		["rim", "fetish rimming;"],
		["rimjob", "fetish rimming;"],
		["rimjobs", "fetish rimming;"],
		["rimming", "fetish rimming;"],
		["sharing", "fetish threesomes;"],
		["threesome", "fetish threesomes;"],
		["threesomes", "fetish threesomes;"],
		["feral", "fetish feral;"],
		["ferals", "fetish feral;"],
		["bestiality", "fetish feral;"],
		["zoo", "fetish feral;"],
		["zoophilia", "fetish feral;"],
		["weird", "fetish weird;"],
	]
	for (aliasIndex = 0; aliasIndex < requirementAliases.length; aliasIndex++) {
		var stringsToTest = [
			"?"+requirementAliases[aliasIndex][0],
			"!"+requirementAliases[aliasIndex][0],
			"?fetish "+requirementAliases[aliasIndex][0],
			"!fetish "+requirementAliases[aliasIndex][0],
		];

		for (stringIndex = 0; stringIndex < stringsToTest.length; stringIndex++) {
			if (string.includes(stringsToTest[stringIndex]) == true) {
				string = replaceAliasToken(string, stringsToTest[stringIndex], stringsToTest[stringIndex][0]+requirementAliases[aliasIndex][1]);
			}
			if (string.includes ("fetish fetish ")) {
				string = string.replace ("fetish fetish ", "fetish ");
			}
			if (string.includes (";;")) {
				string = string.replace (";;", ";");
			}
		}
	}
	var requirementAliases = [
		["?achievement", "?trophy"],
		["!achievement", "!trophy"],
		["!mayor", "!flag mayor meat"],
		["?mayor", "?flag mayor meat"],
		["!mayorMeat", "!flag mayor meat"],
		["?mayorMeat", "?flag mayor meat"],
		["!mayorVeggie", "?flag mayor meat"],
		["?mayorVeggie", "!flag mayor meat"],
		["!carp", "!carpenter"],
		["?carp", "?carpenter"],
		["!carpenter", "!flag carpenter meat"],
		["?carpenter", "?flag carpenter meat"],
		["!carpenterMeat", "!flag carpenter meat"],
		["?carpenterMeat", "?flag carpenter meat"],
		["!carpenterVeggie", "?flag carpenter meat"],
		["?carpenterVeggie", "!flag carpenter meat"],
		["!shop", "!shopkeep"],
		["?shop", "?shopkeep"],
		["!shopkeep", "!flag shopkeep meat"],
		["?shopkeep", "?flag shopkeep meat"],
		["!shopkeepMeat", "!flag shopkeep meat"],
		["?shopkeepMeat", "?flag shopkeep meat"],
		["!shopkeepVeggie", "?flag shopkeep meat"],
		["?shopkeepVeggie", "!flag shopkeep meat"],
	]
	for (aliasIndex = 0; aliasIndex < requirementAliases.length; aliasIndex++) {
		if (string.includes(requirementAliases[aliasIndex][0]) == true) {
			var stringBeforeAlias = string;
			string = replaceAliasToken(string, requirementAliases[aliasIndex][0], requirementAliases[aliasIndex][1]);
			if (string != stringBeforeAlias) {
				console.info("Alias detected: "+requirementAliases[aliasIndex][0]);
				console.info("New string: "+string);
			}
		}
	}

	//console.info("Now checking requirements of string "+string);
	var finalResult = true;
	while (requirementCount < requirementLimit && string.includes("?nude") == true) {
		var check = "?nude;"
		//Asks the renderer rather than looking for the old empty sentinel garments by name, so
		//what NPCs react to can never drift from what is actually on screen
		if (isBottomless(data.player.clothes) == false || isTopless(data.player.clothes) == false) {
			finalResult = false;
		}
		string = string.replace(`?nude;`, ``);
		requirementCount++
		removedRequirements.push(check);
	}
	while (requirementCount < requirementLimit && string.includes("!nude") == true) {
		var check = "!nude;"
		if (isBottomless(data.player.clothes) == true && isTopless(data.player.clothes) == true) {
			finalResult = false;
		}
		string = string.replace(`!nude;`, ``);
		requirementCount++
		removedRequirements.push(check);
	}
	while (requirementCount < requirementLimit && string.includes("?nutmeg") == true && string.includes(";") == true) {
		var check = "?nutmeg;"
		if (doeRemoved == true) {
			finalResult = false;
		}
		string = string.replace(`?nutmeg;`, ``);
		requirementCount++
		removedRequirements.push(check);
	}
	//Without this handler !nutmeg; fell through unparsed and silently PASSED, so events meant
	//only for restoration-mod-less games (like the grotto "none" filler) fired alongside the
	//restored ones whenever the mod was installed.
	while (requirementCount < requirementLimit && string.includes("!nutmeg") == true && string.includes(";") == true) {
		var check = "!nutmeg;"
		if (doeRemoved == false) {
			finalResult = false;
		}
		string = string.replace(`!nutmeg;`, ``);
		requirementCount++
		removedRequirements.push(check);
	}
	while (requirementCount < requirementLimit && string.includes("?day") == true && string.includes(";") == true) {
		var check = string.split(`?day `).pop().split(`;`)[0];
		if (data.player.day < check) {
			finalResult = false;
		}
		string = string.replace(`?day `+check+`;`, ``);
		requirementCount++
		removedRequirements.push(`?day `+check+`;`);
	}
	while (requirementCount < requirementLimit && string.includes("!location ") == true && string.includes(";") == true) {
		var check = string.split(`!location `).pop().split(`;`)[0];
		if (check.includes(data.player.location) == true) {
			finalResult = false;
		}
		string = string.replace(`!location `+check+`;`, ``);
		requirementCount++
		removedRequirements.push(`!location `+check+`;`);
	}
	while (requirementCount < requirementLimit && string.includes("?location ") == true && string.includes(";") == true) {
		var check = string.split(`?location `).pop().split(`;`)[0];
		if (data.player.gps == true && data.player.location == "map") {
			//Do nothing
		}
		else {
			if (!grottoPosition) {
				grottoPosition = "PLACEHOLDER FOR NOT BEING IN GROTTO";
			}
			if (check.includes(data.player.location) != true && check.includes(data.player.fakeLocation) != true && check.includes(grottoPosition) != true) {
				finalResult = false;
			}
			if (grottoPosition == "PLACEHOLDER FOR NOT BEING IN GROTTO") {
				grottoPosition = "";
			}
		}
		string = string.replace(`?location `+check+`;`, ``);
		requirementCount++
		removedRequirements.push(`?location `+check+`;`);
	}
	while (requirementCount < requirementLimit && string.includes("!item ") == true && string.includes(";") == true) {
		var check = string.split(`!item `).pop().split(`;`)[0];
		if (checkItem(check) == true) {
			finalResult = false;
		}
		string = string.replace(`!item `+check+`;`, ``);
		requirementCount++
		removedRequirements.push(`!item `+check+`;`);
	}
	while (requirementCount < requirementLimit && string.includes("?item ") == true && string.includes(";") == true) {
		var check = string.split(`?item `).pop().split(`;`)[0];
		if (checkItem(check) != true) {
			finalResult = false;
		}
		string = string.replace(`?item `+check+`;`, ``);
		requirementCount++
		removedRequirements.push(`?item `+check+`;`);
	}
	while (requirementCount < requirementLimit && string.includes("!skill ") == true && string.includes(";") == true) {
		var check = string.split(`!skill `).pop().split(`;`)[0];
		if (checkSkill(check) >= true) {
			finalResult = false;
		}
		string = string.replace(`!skill `+check+`;`, ``);
		requirementCount++
		removedRequirements.push(`!skill `+check+`;`);
	}
	while (requirementCount < requirementLimit && string.includes("?skill ") == true && string.includes(";") == true) {
		var check = string.split(`?skill `).pop().split(`;`)[0];
		if (checkSkill(check) < check) {
			finalResult = false;
		}
		string = string.replace(`?skill `+check+`;`, ``);
		requirementCount++
		removedRequirements.push(`?skill `+check+`;`);
	}
	while (requirementCount < requirementLimit && string.includes("?trophy ") == true && string.includes(";") == true) {
		var check = string.split(`?trophy `).pop().split(`;`)[0];
		finalResult = false;
		for (trophyCheckIndex = 0; trophyCheckIndex < globalAchievementArray.length; trophyCheckIndex++) {
			for (trophyChecker = 0; trophyChecker < data.achievements.length; trophyChecker++) {
				if (data.achievements[trophyChecker] == globalAchievementArray[trophyCheckIndex].index && globalAchievementArray[trophyCheckIndex].index == check) {
					console.log("Checking trophy "+data.achievements[trophyChecker]+" vs "+globalAchievementArray[trophyCheckIndex].index+" with a result of "+finalResult);
					finalResult = true;
				}
			}
		}
		string = string.replace(`?trophy `+check+`;`, ``);
		requirementCount++
		removedRequirements.push(`?trophy `+check+`;`);
	}
	while (requirementCount < requirementLimit && string.includes("?collectables ") == true && string.includes(";") == true) {
		var check = string.split(`?collectables `).pop().split(`;`)[0];
		var requirement = string.split(check+`; `).pop().split(`;`)[0];


		if (countCollectables(check)[0] == countCollectables(check)[1]) {
			var collected = 1000;
		}
		else {
			var collected = countCollectables(check)[1];
		}
		if (collected < requirement) {
			finalResult = false;
		}
		console.log("Checking collectables "+check+" with a requirement of "+requirement+" and a result of "+finalResult);
		string = string.replace(`?collectables `+check+`; `+requirement+`;`, ``);
		requirementCount++
		removedRequirements.push(`?collectables `+check+`; `+requirement+`;`);
	}
	string = string.replace("!complete ", "!completed ");
	string = string.replace("!complete ", "!completed ");
	string = string.replace("!complete ", "!completed ");
	string = string.replace("?complete ", "?completed ");
	string = string.replace("?complete ", "?completed ");
	string = string.replace("?complete ", "?completed ");
	while (requirementCount < requirementLimit && string.includes("?completed ") == true && string.includes(";") == true) {
		var check = string.split(`?completed `).pop().split(`;`)[0];
		if (check == "OLD") {
			for (jiggyCheckIndex = 0; jiggyCheckIndex < finishedBatches.length; jiggyCheckIndex++) {
				if (checkRequirements(`!completed Sub Batch `+finishedBatches[jiggyCheckIndex]+`;`) == true) {
					finalResult = false;
				}
			}
		}
		else if (check == "NEW") {
			if (checkRequirements(`?completed Sub Batch `+newestBatch+`;`) != true) {
				finalResult = false;
			}
		}
		else if (countCategory("jiggy", check)[0] == 0) {
			finalResult = false;
		}
		else if (countCategory("jiggy", check)[1] < countCategory("jiggy", check)[0]) {
			finalResult = false;
		}
		//console.info(countCategory("jiggy", check));
		string = string.replace(`?completed `+check+`;`, ``);
		requirementCount++
		removedRequirements.push(`?completed `+check+`;`);
	}
	while (requirementCount < requirementLimit && string.includes("!completed ") == true && string.includes(";") == true) {
		var check = string.split(`!completed `).pop().split(`;`)[0];
		if (check == "OLD") {
			var completedBatches = 0;
			for (jiggyCheckIndex = 0; jiggyCheckIndex < finishedBatches.length; jiggyCheckIndex++) {
				if (checkRequirements(`?completed Sub Batch `+finishedBatches[jiggyCheckIndex]+`;`) == true) {
					completedBatches++;
				}
			}
			if (completedBatches == finishedBatches.length) {
				finalResult = false;
			}
		}
		else if (check == "NEW") {
			if (checkRequirements(`?completed Sub Batch `+newestBatch+`;`) == true) {
				finalResult = false;
			}
		}
		else if (countCategory("jiggy", check)[1] == countCategory("jiggy", check)[0]) {
			finalResult = false;
		}
		//console.info(countCategory("jiggy", check));
		string = string.replace(`!completed `+check+`;`, ``);
		requirementCount++
		removedRequirements.push(`!completed `+check+`;`);
	}
	while (requirementCount < requirementLimit && string.includes("?money ") == true && string.includes(";") == true) {
		var check = string.split(`?money `).pop().split(`;`)[0];
		if (data.player.money < check && checkFlag("player", "money") != true) {
			finalResult = false;
		}
		string = string.replace(`?money `+check+`;`, ``);
		requirementCount++
		removedRequirements.push(`?money `+check+`;`);
	}
	while (requirementCount < requirementLimit && string.includes("!money ") == true && string.includes(";") == true) {
		var check = string.split(`!money `).pop().split(`;`)[0];
		if (data.player.money >= check) {
			finalResult = false;
		}
		string = string.replace(`!money `+check+`;`, ``);
		requirementCount++
		removedRequirements.push(`!money `+check+`;`);
	}
	while (requirementCount < requirementLimit && string.includes("!time ") == true && string.includes(";") == true) {
		var check = string.split(`!time `).pop().split(`;`)[0];
		if (data.player.time == check) {
			finalResult = false;
		}
		string = string.replace(`!time `+check+`;`, ``);
		requirementCount++
		removedRequirements.push(`!time `+check+`;`);
	}
	while (requirementCount < requirementLimit && string.includes("?time ") == true && string.includes(";") == true) {
		var check = string.split(`?time `).pop().split(`;`)[0];
		if (check.includes(data.player.time) != true) {
			finalResult = false;
		}
		string = string.replace(`?time `+check+`;`, ``);
		requirementCount++
		removedRequirements.push(`?time `+check+`;`);
	}
	while (requirementCount < requirementLimit && string.includes("?holiday ") == true && string.includes(";") == true) {
		var check = string.split(`?holiday `).pop().split(`;`)[0];
		if (data.player.holiday.includes(check) != true) {
			finalResult = false;
		}
		string = string.replace(`?holiday `+check+`;`, ``);
		requirementCount++
		removedRequirements.push(`?holiday `+check+`;`);
	}
	while (requirementCount < requirementLimit && string.includes("!holiday ") == true && string.includes(";") == true) {
		var check = string.split(`!holiday `).pop().split(`;`)[0];
		if (data.player.holiday.includes(check) == true) {
			finalResult = false;
		}
		string = string.replace(`!holiday `+check+`;`, ``);
		requirementCount++
		removedRequirements.push(`!holiday `+check+`;`);
	}
	if (string.includes("?parity") == true && string.includes(";") == true) {
		var check = string.split(`?parity `).pop().split(`;`)[0];
		switch (check) {
			case "even": {
				if (data.player.day%2 == 1) {
					finalResult = false;
				}
				break;
			}
			case "odd": {
				if (data.player.day%2 == 0) {
					finalResult = false;
				}
				break;
			}
			default: {
				console.log("Error! Parity defined but an invalid parity used. BE sure to use either even or odd, and make sure you have a semicolon afterwards.");
			}
		}
		string = string.replace(`?parity `+check+`;`, ``);
		requirementCount++
		removedRequirements.push(`?parity `+check+`;`);
	}


	while (requirementCount < requirementLimit && string.includes("?fetish ") == true && string.includes(";") == true) {
		var check = string.split(`?fetish `).pop().split(`;`)[0];
		if (fetishes(check) != true) {
			finalResult = false;
		}
		string = string.replace(`?fetish `+check+`;`, ``);
		requirementCount++
		removedRequirements.push(`?fetish `+check+`;`);
	}
	while (requirementCount < requirementLimit && string.includes("!fetish ") == true && string.includes(";") == true) {
		var check = string.split(`!fetish `).pop().split(`;`)[0];
		if (fetishes(check) == true) {
			finalResult = false;
		}
		string = string.replace(`!fetish `+check+`;`, ``);
		requirementCount++
		removedRequirements.push(`!fetish `+check+`;`);
	}
	while (requirementCount < requirementLimit && string.includes("!mode") == true && string.includes(";") == true) {
		var check = string.split(`!mode `).pop().split(`;`)[0];
		switch (check) {
			case "carnivore": {
				if (data.player.carnivore == true) {
					finalResult = false;
				}
				break;
			}
			case "vegetarian": {
				if (data.player.vegetarian == true) {
					finalResult = false;
				}
				break;
			}
		}
		string = string.replace(`!mode `+check+`;`, ``);
		requirementCount++
		removedRequirements.push(`!mode `+check+`;`);
	}
	while (requirementCount < requirementLimit && string.includes("?mode") == true && string.includes(";") == true) {
		var check = string.split(`?mode `).pop().split(`;`)[0];
		switch (check) {
			case "carnivore": {
				if (data.player.carnivore != true) {
					finalResult = false;
				}
				break;
			}
			case "vegetarian": {
				if (data.player.vegetarian != true) {
					finalResult = false;
				}
				break;
			}
		}
		string = string.replace(`?mode `+check+`;`, ``);
		requirementCount++
		removedRequirements.push(`?mode `+check+`;`);
	}


	while (requirementCount < requirementLimit && string.includes("!gender") == true && string.includes(";") == true) {
		var check = string.split(`!gender `).pop().split(`;`)[0];
		switch (check) {
			case "male": 
			case "man": 
			case "masc": 
				if (data.player.gender == "masc") {
					finalResult = false;
				}
			break;
			case "female": 
			case "woman": 
			case "fem": 
				if (data.player.gender == "fem") {
					finalResult = false;
				}
			break;
			default: {
				console.log("Error! Parity defined but an invalid parity used. BE sure to use either even or odd, and make sure you have a semicolon afterwards.");
			}
		}
		string = string.replace(`!gender `+check+`;`, ``);
		requirementCount++
		removedRequirements.push(`!gender `+check+`;`);
	}
	while (requirementCount < requirementLimit && string.includes("?gender") == true && string.includes(";") == true) {
		var check = string.split(`?gender `).pop().split(`;`)[0];
		switch (check) {
			case "male": 
			case "man": 
			case "masc": 
				if (data.player.gender != "masc") {
					finalResult = false;
				}
			break;
			case "female": 
			case "woman": 
			case "fem": 
				if (data.player.gender != "fem") {
					finalResult = false;
				}
			break;
			default: {
				console.log("Error! Parity defined but an invalid parity used. BE sure to use either even or odd, and make sure you have a semicolon afterwards.");
			}
		}
		string = string.replace(`?gender `+check+`;`, ``);
		requirementCount++
		removedRequirements.push(`?gender `+check+`;`);
	}


	while (requirementCount < requirementLimit && string.includes("?flag player ") == true && string.includes(";") == true) {
		var check = string.split(`?flag player `).pop().split(`;`)[0];
		//Check the super-expanded flag list, not the raw save string, so condensed flags still count
		if (expandedPlayerFlagString().includes(check) != true) {
			finalResult = false;
		}
		string = string.replace(`?flag player `+check+`;`, ``);
		requirementCount++
		removedRequirements.push(`?flag player `+check+`;`);
	}
	while (requirementCount < requirementLimit && string.includes("!flag player ") == true && string.includes(";") == true) {
		var check = string.split(`!flag player `).pop().split(`;`)[0];
		if (expandedPlayerFlagString().includes(check) == true) {
			finalResult = false;
		}
		string = string.replace(`!flag player `+check+`;`, ``);
		requirementCount++
		removedRequirements.push(`!flag player `+check+`;`);
	}
	var listOfCharacters = [];
	for (characterCheckIndex = 0; characterCheckIndex < data.story.length; characterCheckIndex++) {
		listOfCharacters.push(data.story[characterCheckIndex].index);
	}
	if (storageArray.modName != "") {
		for (characterCheckIndex = 0; characterCheckIndex < storageArray.customCharacters.length; characterCheckIndex++) {
			listOfCharacters.push(storageArray.customCharacters[characterCheckIndex].index);
		}
	}
	for (characterCheckIndex = 0; characterCheckIndex < listOfCharacters.length; characterCheckIndex++) {
		var listOfNicknames = [["fash", "fashionista"], ["shop", "shopkeep"], ["sado", "sadogato"], ["carp", "carpenter"]];
		for (nicknameIndex = 0; nicknameIndex < listOfNicknames.length; nicknameIndex++) {
			if (string.includes(" "+listOfNicknames[nicknameIndex][0]+" ") == true) {
				string = string.replace(" "+listOfNicknames[nicknameIndex][0]+" ", " "+listOfNicknames[nicknameIndex][1]+" ");
			}
		}
		var corruptionTarget = listOfCharacters[characterCheckIndex];
		while (requirementCount < requirementLimit && string.includes("!encountered "+corruptionTarget+";") == true) {
			requirementCount++
			var check = `!encountered `+corruptionTarget+`;`
			if (encounteredCheckReal(corruptionTarget) == true) {
				finalResult = false;
			}
			string = string.replace(check, ``);
			removedRequirements.push(check);
		}
		while (requirementCount < requirementLimit && string.includes("?encountered "+corruptionTarget+";") == true) {
			requirementCount++
			var check = `?encountered `+corruptionTarget+`;`
			if (encounteredCheckReal(corruptionTarget) == false) {
				finalResult = false;
			}
			string = string.replace(check, ``);
			removedRequirements.push(check);
		}
		while (requirementCount < requirementLimit && string.includes("?trust "+corruptionTarget) == true) {
			requirementCount++
			
			var check = string.split(`?trust `+corruptionTarget+` `)[1].split(`;`)[0];
			//console.info(check)
			if (checkTrust(corruptionTarget) != check) {
				finalResult = false;
			}
			string = string.replace(`?trust `+corruptionTarget+` `+check+`;`, ``);
			removedRequirements.push(`?trust `+corruptionTarget+` `+check+`;`);
		}
		while (requirementCount < requirementLimit && string.includes("!trust "+corruptionTarget) == true) {
			requirementCount++
			var check = string.split(`!trust `+corruptionTarget+` `)[1].split(`;`)[0];
			//console.info(check)
			if (checkTrust(corruptionTarget) == check) {
				finalResult = false;
			}
			string = string.replace(`!trust `+corruptionTarget+` `+check+`;`, ``);
			removedRequirements.push(`!trust `+corruptionTarget+` `+check+`;`);
			//console.info(removedRequirements)
		}
		while (requirementCount < requirementLimit && string.includes("?minTrust "+corruptionTarget) == true) {
			requirementCount++
			var check = string.split(`?minTrust `+corruptionTarget+` `).pop().split(`;`)[0];
			if (checkTrust(corruptionTarget) < check) {
				finalResult = false;
			}
			string = string.replace(`?minTrust `+corruptionTarget+` `+check+`;`, ``);
			removedRequirements.push(`?minTrust `+corruptionTarget+` `+check+`;`);
		}
		while (requirementCount < requirementLimit && string.includes("?maxTrust "+corruptionTarget) == true) {
			requirementCount++
			var check = string.split(`?maxTrust `+corruptionTarget+` `).pop().split(`;`)[0];
			if (checkTrust(corruptionTarget) > check) {
				finalResult = false;
			}
			string = string.replace(`?maxTrust `+corruptionTarget+` `+check+`;`, ``);
			removedRequirements.push(`?maxTrust `+corruptionTarget+` `+check+`;`);
		}
		while (requirementCount < requirementLimit && string.includes("?trustMin "+corruptionTarget) == true) {
			requirementCount++
			var check = string.split(`?trustMin `+corruptionTarget+` `).pop().split(`;`)[0];
			if (checkTrust(corruptionTarget) < check) {
				//console.info(`!trustMin `+corruptionTarget+` `+check+`;`);
				finalResult = false;
			}
			string = string.replace(`?trustMin `+corruptionTarget+` `+check+`;`, ``);
			removedRequirements.push(`?trustMin `+corruptionTarget+` `+check+`;`);
		}
		while (requirementCount < requirementLimit && string.includes("?trustMax "+corruptionTarget) == true) {
			requirementCount++
			var check = string.split(`?trustMax `+corruptionTarget+` `).pop().split(`;`)[0];
			if (checkTrust(corruptionTarget) > check) {
				finalResult = false;
			}
			string = string.replace(`?trustMax `+corruptionTarget+` `+check+`;`, ``);
			removedRequirements.push(`?trustMax `+corruptionTarget+` `+check+`;`);
		}
		while (requirementCount < requirementLimit && string.includes("!flag "+corruptionTarget) == true) {
			requirementCount++
			var check = string.split(`!flag `+corruptionTarget+` `).pop().split(`;`)[0];
			if (checkFlag(corruptionTarget, check) == true) {
				finalResult = false;
			}
			string = string.replace(`!flag `+corruptionTarget+` `+check+`;`, ``);
			removedRequirements.push(`!flag `+corruptionTarget+` `+check+`;`);
		}
		while (requirementCount < requirementLimit && string.includes("?flag "+corruptionTarget) == true) {
			requirementCount++
			var check = string.split(`?flag `+corruptionTarget+` `).pop().split(`;`)[0];
			//console.info(check)
			if (checkFlag(corruptionTarget, check) == false) {
				finalResult = false;
			}
			string = string.replace(`?flag `+corruptionTarget+` `+check+`;`, ``);
			removedRequirements.push(`?flag `+corruptionTarget+` `+check+`;`);
		}
		while (requirementCount < requirementLimit && string.includes("!gallery "+corruptionTarget) == true) {
			requirementCount++
			var check = string.split(`!gallery `+corruptionTarget+` `).pop().split(`;`)[0];
			if (galleryCheck(corruptionTarget, check) == true) {
				finalResult = false;
			}
			string = string.replace(`!gallery `+corruptionTarget+` `+check+`;`, ``);
			removedRequirements.push(`!gallery `+corruptionTarget+` `+check+`;`);
		}
		while (requirementCount < requirementLimit && string.includes("?gallery "+corruptionTarget) == true) {
			requirementCount++
			var check = string.split(`?gallery `+corruptionTarget+` `).pop().split(`;`)[0];
			//console.info(check)
			if (galleryCheck(corruptionTarget, check) == false) {
				finalResult = false;
			}
			string = string.replace(`?gallery `+corruptionTarget+` `+check+`;`, ``);
			removedRequirements.push(`?gallery `+corruptionTarget+` `+check+`;`);
		}
	}
	if (string.includes("?trust ") || string.includes("?minTrust ") || string.includes("?trustMin ")|| string.includes("?flag ")) {
		//var check = string.split(`?flag`).pop().split(`;`)[0];
		//var check = string.split(` `).pop().split(` `)[0];
		//if (listOfCharacters.includes(check) == false) {} 
		finalResult = false
	}
	if (cull)
		if (cull == "extract") {
		//use startingString to get all the requirements removed by previous step
		console.info(removedRequirements)
		return removedRequirements
	}
	//console.info(finalResult)
	if (cull == true) {
		if (requirementCount >= requirementLimit) {
			return string + "<br>Syntax error! Are you missing a semicolon on the above line?";
		}
		return string
	}
	else {
		return finalResult;
	}
}

function cullRequirements(string) {
	string = checkRequirements(string, true);
	return string;
}

//Scene writing
var HTMLContainer = "output";
//Folds spirit lines into the line they belong to, so a block written as
//	trap Hello, playerF.
//	lusty I thought I heard clapping!
//	weepy I miss having hands.
//	lusty Not that kind of clapping~
//reaches writeHTML's main loop as a single speech line for Thorne, carrying the spirits' dialogue
//as colored segments and a trailing "; spirits lusty,weepy" marker the sp case reads back off.
//
//This runs as a pass over the whole array before the loop starts rather than as a lookahead inside
//it. Looking ahead mid-loop would mean mutating lines[] and lineCounter underneath every other
//command in the switch; doing it up front means nothing else in writeHTML has to know spirits exist.
//
//A spirit attaches to the nearest host line above it, and only across an unbroken run of that
//host's own lines and its spirits — anything else in between (narration, a button, an eval) ends
//the run, and the next spirit opens a fresh block with the host silent. Blank lines don't break a
//run, since template-literal indentation produces them between almost every written line.
function fuseSpiritLines(lines) {
	if (typeof spiritArray == "undefined" || spiritArray.length == 0) {
		return lines;
	}
	var fusedLines = [];
	//The line currently collecting spirits, as a position in fusedLines. -1 means no run is open.
	var hostPosition = -1;
	var hostIndex = "";
	//Gathered per run: the colored dialogue segments, and the spirits to overlay (first mention
	//only — a spirit that speaks twice in one block still gets drawn once).
	var hostSegments = [];
	var hostSpirits = [];
	//Writes the finished run back over the host's line. Called before opening any new run and once
	//more at the end, so the last block in a scene isn't left unfused.
	function closeSpiritRun() {
		if (hostPosition > -1 && hostSegments.length > 0) {
			fusedLines[hostPosition] += hostSegments.join("");
			if (hostSpirits.length > 0) {
				fusedLines[hostPosition] += "; spirits " + hostSpirits.join(",");
			}
		}
		hostPosition = -1;
		hostIndex = "";
		hostSegments = [];
		hostSpirits = [];
	}
	for (var spiritLineIndex = 0; spiritLineIndex < lines.length; spiritLineIndex++) {
		//Match the normalization the main loop does, on a copy — the real line is left alone so
		//that anything not fused reaches the switch exactly as it was written.
		var trimmedLine = lines[spiritLineIndex].replace(/\t/g, "");
		while (trimmedLine.charAt(0) == " ") {
			trimmedLine = trimmedLine.substring(1);
		}
		if (trimmedLine == "") {
			fusedLines.push(lines[spiritLineIndex]);
			continue;
		}
		var firstWord = cullRequirements(trimmedLine).replace(/ .*/, '');
		var spiritTarget = null;
		var isHostName = false;
		for (var spiritIndex = 0; spiritIndex < spiritArray.length; spiritIndex++) {
			if (spiritArray[spiritIndex].index == firstWord) {
				spiritTarget = spiritArray[spiritIndex];
			}
			if (spiritArray[spiritIndex].host == firstWord) {
				isHostName = true;
			}
		}
		if (spiritTarget != null) {
			//A spirit belonging to somebody other than the open run's host starts its own block.
			if (hostPosition == -1 || hostIndex != spiritTarget.host) {
				closeSpiritRun();
				fusedLines.push(spiritTarget.host);
				hostPosition = fusedLines.length - 1;
				hostIndex = spiritTarget.host;
			}
			//Spirit lines take requirements like any other line. Checked here because the main loop
			//will only ever see the fused result, and a spirit whose requirements fail should drop
			//out of the block without taking the rest of it with it.
			if (checkRequirements(trimmedLine) == true) {
				var spiritBody = cullRequirements(trimmedLine).substring(firstWord.length);
				while (spiritBody.charAt(0) == " ") {
					spiritBody = spiritBody.substring(1);
				}
				if (spiritBody != "") {
					//The host's own line already holds text unless the block opened on a spirit, in
					//which case the first segment must not lead with a separator.
					var separator = "<br>";
					if (fusedLines[hostPosition] == hostIndex && hostSegments.length == 0) {
						separator = " ";
					}
					hostSegments.push(separator + `<span style='color:` + spiritTarget.color + `'>` + spiritBody + `</span>`);
					if (hostSpirits.includes(spiritTarget.index) == false) {
						hostSpirits.push(spiritTarget.index);
					}
				}
			}
			continue;
		}
		//Any other line ends the run. A host's own line then opens a new one, so consecutive host
		//lines each keep their own spirits instead of pooling into the first.
		closeSpiritRun();
		fusedLines.push(lines[spiritLineIndex]);
		if (isHostName == true) {
			hostPosition = fusedLines.length - 1;
			hostIndex = firstWord;
		}
	}
	closeSpiritRun();
	return fusedLines;
}

function writeHTML(text, container) {
	if (!container || container == undefined) {
		HTMLContainer = "output";
	}
	else {
		HTMLContainer = container;
	}
	//console.info(HTMLContainer)
	//console.info(HTMLContainer)
	//Separate the text into lines
	var lines = text.split('\n');
	//Fold any spirit lines into the lines they belong to before the loop begins, so the switch below
	//only ever deals with one speech line per dialogue box
	lines = fuseSpiritLines(lines);
	//For each of these lines
	for(var lineCounter = 0;lineCounter < lines.length;lineCounter++){
		//Remove all tabs from the line, in case we use tab spacing
		while (lines[lineCounter].includes('\t') == true) {
			lines[lineCounter] = lines[lineCounter].replace(`\t`, ``);
		}
		while (lines[lineCounter].charAt(0) == " ") {
			lines[lineCounter] = lines[lineCounter].substring(1);
		}
		//If the line is not empty (we don't want to print empty lines)
		if (lines[lineCounter] != "" && checkRequirements(lines[lineCounter]) == true) {
			lines[lineCounter] = cullRequirements(lines[lineCounter]);
			//Grab the first word of the line to use as the command
			var command = lines[lineCounter].replace(/ .*/,'');
			if (lines[lineCounter].slice(-1) == " ") {
				lines[lineCounter] = lines[lineCounter].slice(0, -1);
			}
			console.log("Line is "+lines[lineCounter]);
			//Depending on which command, execute different code. Convert the command to lowercase as well in case we used Sp instead of sp, as js is case-sensitive.
			
			for (i = 0; i < definitionArray.length; i++) {
				if (command.toLowerCase() == definitionArray[i].shortcut) {
					lines[lineCounter] = lines[lineCounter].replace(definitionArray[i].shortcut, definitionArray[i].result);
				}
				//console.log("Shortcut replaced, line is now "+lines[lineCounter]);
			}
			var command = lines[lineCounter].replace(/ .*/,'');
			//New writeHTML in VN format
			if (data.player.style == "vn" && readingNovel == false) {
				readingNovel = true;
				//console.info(lines)
				readingNovel = false;
				break;
			}
			//Traditional writeHTML in non-VN format
			else {
				switch (command.toLowerCase()) {
					case "define": {
						//Remove the command from the line we actually want to print.
						var definitionShortcut = lines[lineCounter].split(`define `).pop().split(` = `)[0];
						lines[lineCounter] = lines[lineCounter].replace(`define `+definitionShortcut+` = `, ``);
						var definitionResult = lines[lineCounter];
						var overWrite = false;
						for (i = 0; i < definitionArray.length; i++) {
							if (definitionArray[i].shortcut == definitionShortcut) {
								overWrite = true;
								definitionArray[i].shortcut = definitionShortcut;
								definitionArray[i].result = definitionResult;
							}
						}
						if (overWrite == false) {
							var definition = {shortcut: definitionShortcut, result: definitionResult};
							definitionArray.push(definition);
						}
						console.log("Now writing definition statement, using shortcut "+definitionShortcut+" for result "+definitionResult+", overwrite value is "+overWrite);
						break;
					}
					case "outfit": {//Replace the character's (second word) current outfit
						lines[lineCounter] = lines[lineCounter].replace("outfit ", "")
						var characterTarget = lines[lineCounter].replace(/ .*/,'');
						//Remove the character's name from the command (and the following space, whatever is left should be the costume)
						lines[lineCounter] = lines[lineCounter].replace(characterTarget+" ", "")
						if (characterTarget == "fash") {
							characterTarget = "fashionista";
						}
						if (characterTarget == "shop") {
							characterTarget = "shopkeep";
						}
						if (characterTarget == "sado") {
							characterTarget = "sadogato";
						}
						var characterInStory = data.story.find(character => character.index == characterTarget);
						if (characterInStory) {
							if (lines[lineCounter].includes("default") == true) {
								lines[lineCounter] = characterInStory.outfitDefault;
								console.log("Now resetting outfit to default for "+characterTarget);
							}
							//If 'permanent' is present, replace the default outfit and remove the word, and either a preceeding space or a following space, so that it doesn't matter where permanent is written.
							if (lines[lineCounter].includes("permanent")) {
								lines[lineCounter] = lines[lineCounter].replace("permanent ", "")
								lines[lineCounter] = lines[lineCounter].replace(" permanent", "")
								characterInStory.outfitDefault = lines[lineCounter];
							}
							characterInStory.outfit = lines[lineCounter];
							console.log("Now replacing outfit, replacing "+characterTarget+"'s outfit with "+lines[lineCounter]+". outfit to reset to is "+characterInStory.outfitDefault);
						}
						else {
							console.error("Error! "+characterTarget+" ID not found! ");
						}
						break;
					}
					case "bg": {
						//Get the location of the image
						var background = lines[lineCounter].split(command+` `).pop().split(`;`)[0];
						changeBG(cleanupImage(background))
						//writeImage(location);
						break;
					}
					case "t": {
						//Remove the command from the line we actually want to print.
						lines[lineCounter] = lines[lineCounter].replace(command+` `, ``);
						//Execute the writeText command to print everything left to the screen.
						if (checkRequirements(lines[lineCounter]) == true) {
							writeCenteredText(lines[lineCounter]);
						}
						//Don't execute any of the below switch cases.
						break;
					}
					case "special": {
						lines[lineCounter] = lines[lineCounter].replace(command+` `, ``);
						if (checkRequirements(lines[lineCounter]) == true) {
							writeSpecial(lines[lineCounter]);
						}
						break;
					}
					case "sp": {
						//console.info("Now writing speech line "+lines[lineCounter]);
						//Spirits ride along at the very end of the line, put there by fuseSpiritLines
						//before the loop started. Taken off first, and located by position rather than
						//by splitting on the word, so dialogue that happens to mention spirits can't
						//be mistaken for the marker.
						var spirits = "";
						var spiritMarker = lines[lineCounter].lastIndexOf("; spirits ");
						if (spiritMarker > -1) {
							spirits = lines[lineCounter].substring(spiritMarker + 10);
							lines[lineCounter] = lines[lineCounter].substring(0, spiritMarker);
						}
						//Get the name of our speaker, anchored to the front of the line. Splitting on
						//the command and taking the last piece instead broke on any line containing a
						//word that ends in the command followed by a space — "sp trap; a gasp escaped
						//him" resolved the speaker as "escaped him". No shipped line happens to trip
						//it, but fusing several spirit lines into one line makes it far likelier.
						var name = lines[lineCounter].substring(command.length + 1).split(`;`)[0];
						//If "; altName" is in our code we want to use an alternate name for the character, so use that. Otherwise set the altName variable blank.
						if (lines[lineCounter].includes("; altName")) {
							var altName = lines[lineCounter].split(`altName `).pop().split(`;`)[0];
							lines[lineCounter] = lines[lineCounter].replace(`altName `+altName+`; `, ``);
						}
						else {
							var altName = "";
						}
						//If "; altColor" is in our code we want to specify a specific color for the character, so use that. Otherwise set the altColor variable blank.
						if (lines[lineCounter].includes("; altColor")) {
							var altColor = lines[lineCounter].split(`altColor `).pop().split(`;`)[0];
							lines[lineCounter] = lines[lineCounter].replace(`altColor `+altColor+`; `, ``);
						}
						else {
							var altColor = "";
						}
	
						if (lines[lineCounter].includes("; special")) {
							var special = lines[lineCounter].split(`special `).pop().split(`;`)[0];
							lines[lineCounter] = lines[lineCounter].replace(`special `+special+`; `, ``);
						}
						else {
							var special = "";
						}
						if (lines[lineCounter].includes("special secret;")) {
							special = lines[lineCounter].split(`special `).pop().split(`;`)[0];
							lines[lineCounter] = lines[lineCounter].replace(`special `+special+`; `, ``);
						}
						//Remove the command from the line we actually want to print.
						lines[lineCounter] = lines[lineCounter].replace(command+` `+name+`; `, ``);
						//If "; im" is in our code we want to specify a specific profile image, so use that. Otherwise set the image variable blank so it can be automatically found.
						var image = "";
						if (lines[lineCounter].includes("im ")) {
							if (lines[lineCounter].includes(".jpg;") || lines[lineCounter].includes(".png;")|| lines[lineCounter].includes(".webp;")) {
								var image = lines[lineCounter].substring(
									lines[lineCounter].indexOf("im ") + 3, 
									lines[lineCounter].indexOf("; ")
								);
								lines[lineCounter] = lines[lineCounter].replace(`im `+image+`; `, ``);
								image = cleanupImage(image);
							}
						}
						else {
							image = "";
						}
						//If "; altColor" is in our code we want to specify a specific color for the character, so use that. Otherwise set the altColor variable blank.
						if (lines[lineCounter].includes("altImage")) {
							var altImage = lines[lineCounter].split(`altImage `).pop().split(`;`)[0];
							lines[lineCounter] = lines[lineCounter].replace(`altImage `+altImage+`; `, ``);
							image = cleanupImage(altImage);
						}
						if (lines[lineCounter].includes("altImg")) {
							var altImage = lines[lineCounter].split(`altImg `).pop().split(`;`)[0];
							lines[lineCounter] = lines[lineCounter].replace(`altImg `+altImage+`; `, ``);
							image = cleanupImage(altImage);
						}
						
						//New code for emotion switching:
						// First handle explicit "emotion X;" syntax
						var emotion = "";
						var emotionInDialogue = "";

						if (lines[lineCounter].includes("emotion ")) {
							// Extract emotion value
							var explicitEmotion = lines[lineCounter].split("emotion ").pop().split(";")[0];

							emotion = explicitEmotion;
							emotionInDialogue = explicitEmotion;

							// Remove the entire "emotion X;" from the line
							lines[lineCounter] = lines[lineCounter].replace(`emotion ${explicitEmotion}; `, "");
						}

						// If no explicit emotion was found, fall back to shorthand
						if (emotion === "") {
							emotion = cullRequirements(lines[lineCounter]).replace(/ .*/, '');
						}
						
						for (neoCharIndex = 0; neoCharIndex < finishedCharactersArray.length; neoCharIndex++) {
							if (finishedCharactersArray[neoCharIndex] == name) {
								//console.info("Found "+name);
								for (x = 0; x < expressionArray.length; x++) {
									if (expressionArray[x].index == emotion) {
										emotionInDialogue = emotion;
									}
									else if (expressionArray[x].alts.includes(emotion)) {
										emotionInDialogue = emotion;
										emotion = expressionArray[x].index;
										//console.info("Emotion detected as "+emotionInDialogue);
									}
								}
							}
						}
						if (emotionInDialogue == "") {
							for (x = 0; x < expressionArray.length; x++) {
								if (expressionArray[x].index == emotion) {
									emotionInDialogue = emotion;
								}
								else if (expressionArray[x].alts.includes(emotion)) {
									emotionInDialogue = emotion;
									emotion = expressionArray[x].index;
									console.info("Emotion detected as "+emotionInDialogue);
								}
							}
						}
						//After checking emotions against the array (they should always be lowercase), replace the character's current emotion and remove the emotion from the dialogue
						if (emotionInDialogue != "") {
							//Copied code from writeSpeech to find the current character 
							console.info("Emotion detected. '"+name+"' should take emotion "+emotion);
							if (name == "player") {
								data.player.emotion = emotion;
							}
							else {
								var characterInStory = data.story.find(character => character.index === name);
								if (characterInStory) {
									characterInStory.emotion = emotion;
								}
								else if (storageArray.modName != "") {
									var characterInStorage = storageArray.customCharacters.find(character => character.index === name);
									if (characterInStorage) {
										characterInStorage.emotion = emotion;
									}
								}
							}
							lines[lineCounter] = lines[lineCounter].replace(
								new RegExp("^" + emotionInDialogue + "\\s+"),
								""
							);
						}
						//Emotions are cleaned up and reset in changeLocation
	
						if (characterInStory) {
							finalName = characterInStory.fName;
							finalColor = characterInStory.color;
							var characterOutfit = characterInStory.outfit;
							var characterEmotion = characterInStory.emotion;
	
							if (img === "") {
								finalImg = `${name}/${characterOutfit}/${characterEmotion}`;
								finalImg = cleanupImage(finalImg);
							}
						}
						
						//Execute the writeSpeech command to print everything we have left.
						if (checkRequirements(lines[lineCounter]) == true) {
							if (activeWindow != "phone") {
								writeSpeech(name, image, cullRequirements(lines[lineCounter]), altName, altColor, special, spirits);
							}
							else {
								writePhoneSpeech(name, image, cullRequirements(lines[lineCounter]));
							}
						}
						break;
					}
					case "im": {
						//Get the location of the image
						var location = lines[lineCounter].split(command+` `).pop().split(`;`)[0];
						//If "; cap" is in our code we want to attach a caption to our image. Otherwise leave the caption blank.
						if (lines[lineCounter].includes("; cap")) {
							var caption = lines[lineCounter].split(`cap `).pop().split(`;`)[0];
						}
						else {
							var caption = "";
						}
						//Bring up the image on screen. Since we aren't printing the line itself we don't need to clean it by removing commands.
						if (checkRequirements(lines[lineCounter]) == true) {
							if (activeWindow != "phone") {
								writeBig(location, caption);
							}
							else {
								writePhoneImage(location, caption);
							}
						}
						break;
					}
					case "trans": {
						var color = "";
						if (lines[lineCounter].includes("color ") && lines[lineCounter].includes(";")) {
							var color = lines[lineCounter].split(`color `).pop().split(`;`)[0];
							lines[lineCounter] = lines[lineCounter].replace(`color `+color+`;`, ``);
						}
						//Get the label of our button
						var target = lines[lineCounter].split(`trans `).pop().split(`;`)[0];
						var name = lines[lineCounter].replace(`trans `+target+`;`, ``);
						//If "; arg" is in our code we want the function to have a special argument. Otherwise leave the argument section blank
						if (checkRequirements(lines[lineCounter]) == true) {
							if (lines[lineCounter].includes("name ") && lines[lineCounter].includes(";")) {
								name = lines[lineCounter].split(`name `).pop().split(`;`)[0];
							}
							else {
								name = cullRequirements(name);
							}
							writeFunction("writeScene('"+data.player.currentCharacter+"', '"+target+"')", name, color);
						}
						break;
					}
					case "mtrans": {
						//Extra alternate transition button meant to be used inside events
						gtransSwitch = true;
						var color = "";
						if (lines[lineCounter].includes("color ") && lines[lineCounter].includes(";")) {
							var color = lines[lineCounter].split(`color `).pop().split(`;`)[0];
							lines[lineCounter] = lines[lineCounter].replace(`color `+color+`;`, ``);
						}
						//Get the label of our button
						var target = lines[lineCounter].split(`mtrans `).pop().split(`;`)[0];
						var name = lines[lineCounter].replace(`mtrans `+target+`;`, ``);
						//If "; arg" is in our code we want the function to have a special argument. Otherwise leave the argument section blank
						if (checkRequirements(lines[lineCounter]) == true) {
							if (lines[lineCounter].includes("name ") && lines[lineCounter].includes(";")) {
								name = lines[lineCounter].split(`name `).pop().split(`;`)[0];
							}
							else {
								name = cullRequirements(name);
							}
							writeFunction("writeScene('"+data.player.currentCharacter+"', '"+target+"')", name, color);
						}
						break;
					}
					case "cancel": {
						if (checkRequirements(lines[lineCounter]) == true) {
							writeFunction("writeScene('"+data.player.currentCharacter+"', 'cancel')", "Go back");
						}
						break;
					}
					case "event": {
						writeEvent(lines[lineCounter].split(`event `).pop().split(`;`)[0]);
						break;
					}
					case "finish": {
						if (checkRequirements(lines[lineCounter]) == true) {
							if (checkFlag("player", "gallery") == true) {
								writeHTML("button Back; writeScene('system', 'gallery');");
							}
							else {
								if (grottoStarted == true) {
									writeFunction("grottoMove(grottoPosition)", "Back to Exploration");
								}
								else {
									writeFunction("changeLocation(data.player.location)", "Finish");
								}
							}
						}
						break;
					}
					case "raisetrust": {
						var character = lines[lineCounter].split(`raiseTrust `).pop().split(`;`)[0];
						
						var trust = lines[lineCounter].replace(`raiseTrust `+character+`; `, ``);
						//console.debug("Trying to add "+trust+" to "+character+"'s trust value");
						while (trust.charAt(0) == " ") {
							trust = trust.substring(1);
						}
						if (checkRequirements(trust) == true) {
							trust = cullRequirements(trust);
							raiseTrust(character, parseInt(trust));
						}
						break;
					}
					case "addtrust": {
						var character = lines[lineCounter].split(`addTrust `).pop().split(`;`)[0];
						
						var trust = lines[lineCounter].replace(`addTrust `+character+`; `, ``);
						//console.debug("Trying to add "+trust+" to "+character+"'s trust value");
						while (trust.charAt(0) == " ") {
							trust = trust.substring(1);
						}
						if (checkRequirements(trust) == true) {
							trust = cullRequirements(trust);
							raiseTrust(character, parseInt(trust));
						}
						break;
					}
					case "settrust": {
						var character = lines[lineCounter].split(`setTrust `).pop().split(`;`)[0];
						
						var trust = lines[lineCounter].replace(`setTrust `+character+`; `, ``);
						//console.debug("Trying to add "+trust+" to "+character+"'s trust value");
						while (trust.charAt(0) == " ") {
							trust = trust.substring(1);
						}
						if (checkRequirements(trust) == true) {
							trust = cullRequirements(trust);
							setTrust(character, parseInt(trust));
						}
						break;
					}
					case "addflag": {
						var character = lines[lineCounter].split(`addflag `).pop().split(`;`)[0];
						
						var flag = lines[lineCounter].replace(`addflag `+character+`; `, ``);
						while (flag.charAt(0) == " ") {
							flag = flag.substring(1);
						}
						if (checkRequirements(flag) == true) {
							addFlag(character, cullRequirements(flag));
						}
						break;
					}
					case "removeflag": {
						var character = lines[lineCounter].split(`removeflag `).pop().split(`;`)[0];
						
						var flag = lines[lineCounter].replace(`removeflag `+character+`; `, ``);
						while (flag.charAt(0) == " ") {
							flag = flag.substring(1);
						}
						if (checkRequirements(flag) == true) {
							removeFlag(character, cullRequirements(flag));
						}
						break;
					}
					case "toggleflag": {
						var character = lines[lineCounter].split(`toggleflag `).pop().split(`;`)[0];
						
						var flag = lines[lineCounter].replace(`toggleflag `+character+`; `, ``);
						while (flag.charAt(0) == " ") {
							flag = flag.substring(1);
						}
						console.log("Toggleflag command detected, character is "+character+" and flag is "+flag+". Flag is currently "+checkFlag(character, flag));
						if (checkFlag(character, flag) == true) {
							removeFlag(character, cullRequirements(flag));
						}
						else {
							addFlag(character, cullRequirements(flag));
						}
						break;
					}
					case "func": { //func onclick; Name
						var func = lines[lineCounter].split(`func `).pop().split(`;`)[0];
						var name = lines[lineCounter].split(`;`)[1];
						if (checkRequirements(lines[lineCounter]) == true) {
							writeFunction(func, name);
						}
						break;
					}
					case "button": { // button NAME; f FUNCTION; arg SPECIAL ARGUMENTS;
						var color = "";
						if (lines[lineCounter].includes("color ") && lines[lineCounter].includes(";")) {
							var color = lines[lineCounter].split(`color `).pop().split(`;`)[0];
							lines[lineCounter] = lines[lineCounter].replace(`color `+color+`;`, ``);
						}
						//Erase any extra space if it's the final character
						while (lines[lineCounter].charAt(lines[lineCounter].length-1) == " ") {
							lines[lineCounter] = lines[lineCounter].slice(0, -1);
						}
						//Get the label of our button
						var name = lines[lineCounter].split(`button `).pop().split(`;`)[0];
						//Get the function we want our button to perform
						var func = lines[lineCounter].split(`; `).pop().split(`;`)[0];
						//Write the button to the screen using the information we've collected.
						if (checkRequirements(lines[lineCounter]) == true) {
							writeFunction(func, name, color);
						}
						break;
					}
					case "dual": {
						//dual sp1 miko; sp2 itako; im1 images/miko/miko.jpg; im2 images/itako/itako.jpg; altColor1 #A368A5; altColor2 #A34E32; Hello!
						if (checkRequirements(lines[lineCounter]) == true) {
							//Obtain the first name
							var name1 = lines[lineCounter].split(`sp1 `).pop().split(`;`)[0];
							//Obtain the second name
							var name2 = lines[lineCounter].split(`sp2 `).pop().split(`;`)[0];
							
							
							//Check for alternate images
							if (lines[lineCounter].includes("; im1")) {
								var altImage1 = lines[lineCounter].split(`im1 `).pop().split(`;`)[0];
								lines[lineCounter] = lines[lineCounter].replace(`im1 `+altImage1+`; `, ``);
							}
							else {
								var altImage1 = "";
							}
							if (lines[lineCounter].includes("; im2")) {
								var altImage2 = lines[lineCounter].split(`im2 `).pop().split(`;`)[0];
								lines[lineCounter] = lines[lineCounter].replace(`im2 `+altImage2+`; `, ``);
							}
							else {
								var altImage2 = "";
							}
							
							//Check for alternate colors
							if (lines[lineCounter].includes("; altColor1")) {
								var altColor1 = lines[lineCounter].split(`altColor1 `).pop().split(`;`)[0];
								lines[lineCounter] = lines[lineCounter].replace(`altColor1 `+altColor1+`; `, ``);
							}
							else {
								var altColor1 = "";
							}
							if (lines[lineCounter].includes("; altColor2")) {
								var altColor2 = lines[lineCounter].split(`altColor2 `).pop().split(`;`)[0];
								lines[lineCounter] = lines[lineCounter].replace(`altColor2 `+altColor2+`; `, ``);
							}
							else {
								var altColor2 = "";
							}
							lines[lineCounter] = lines[lineCounter].replace(command+` sp1 `+name1+`; sp2 `+name2+`; `, ``);
							//console.info(lines[lineCounter])
							//New code for emotion switching:
							//Grab the first word of the dialogue to see if it's one of the game's defined emotions
							var emotion = cullRequirements(lines[lineCounter]).replace(/ .*/,'');
							let originalEmotion = emotion;
							//console.info("Testing for emotion detection, word is "+emotion);
							var emotionInDialogue = "";

							for (neoCharIndex = 0; neoCharIndex < finishedCharactersArray.length; neoCharIndex++) {
								if (finishedCharactersArray[neoCharIndex] == name1) {
									//console.info("Found "+name);
									for (x = 0; x < expressionArray.length; x++) {
										if (expressionArray[x].index == emotion) {
											emotionInDialogue = emotion;
										}
										else if (expressionArray[x].alts.includes(emotion)) {
											emotionInDialogue = emotion;
											emotion = expressionArray[x].index;
											//console.info("Emotion detected as "+emotionInDialogue);
										}
									}
								}
							}
							//Same fallback the single-speaker path uses. This used to check emotionArray,
							//the fifteen-name legacy set with no alts, which meant a character outside
							//finishedCharactersArray could take an expression in a solo line but not in
							//a dual one — the word just printed as dialogue instead.
							if (emotionInDialogue == "") {
								for (x = 0; x < expressionArray.length; x++) {
									if (expressionArray[x].index == emotion) {
										emotionInDialogue = emotion;
									}
									else if (expressionArray[x].alts.includes(emotion)) {
										emotionInDialogue = emotion;
										emotion = expressionArray[x].index;
									}
								}
							}

							//After checking emotions against the array (they should always be lowercase), replace the character's current emotion and remove the emotion from the dialogue
							if (emotionInDialogue != "") {
								//Copied code from writeSpeech to find the current character 
								console.log("Emotion detected. '"+name1+"' should take emotion "+emotion);
								if (name1 == "player") {
									data.player.emotion = emotion;
								}
								if (name2 == "player") {
									data.player.emotion = emotion;
								}
								var characterInStory = data.story.find(character => character.index === name1);
								if (characterInStory) {
									characterInStory.emotion = emotion;
								}
								var characterInStory = data.story.find(character => character.index === name2);
								if (characterInStory) {
									characterInStory.emotion = emotion;
								}
								lines[lineCounter] = lines[lineCounter].replace(originalEmotion, "");
							}
	
							//Emotions are cleaned up and reset in changeLocation
							//Remove the names, leaving only the line we want to print
							
							writeDual(name1, altImage1, name2, altImage2, cullRequirements(lines[lineCounter]), altColor1, altColor2);
						}
						break;
					}
					case "bar": {
						//bar Fitness; im images/neet/gymT.png; progress 41; maximum 100;
						if (checkRequirements(lines[lineCounter]) == true) {
							var title = lines[lineCounter].split(command+` `).pop().split(`;`)[0];
							lines[lineCounter] = lines[lineCounter].replace(`bar `+title+`; `, ``);
							
							var img = lines[lineCounter].split(`im `).pop().split(`;`)[0];
							lines[lineCounter] = lines[lineCounter].replace(`im `+img+`; `, ``);
							
							var progress = lines[lineCounter].split(`progress `).pop().split(`;`)[0];
							lines[lineCounter] = lines[lineCounter].replace(`progress `+progress+`; `, ``);
							
							if (lines[lineCounter].includes("maximum ")) {
								var maximum = lines[lineCounter].split(`maximum `).pop().split(`;`)[0];
								lines[lineCounter] = lines[lineCounter].replace(`maximum `+maximum+`; `, ``);
							}
							else {
								var maximum = 100
							}
							writeBar(img, title, progress, maximum);
						}
						break;
					}
					case "eval": {
						var code = lines[lineCounter].split(`eval `).pop().split(`;`)[0];
						eval(code)
						break;
					}
					case "passtime": {
						if (checkRequirements(lines[lineCounter]) == true) {
							passTime();
						}
						break;
					}
					//This is for convenience. If the line is just an elipses, replace it with a horizontal line cutting across the screen.
					case "...": {
						writeText("...");
						break;
					}
					//If the command isn't found in the list above then the code can't be parsed (understood), print an error code in red.
					default: {
						writeText("<span style='color:red'>Unknown command. The line '"+lines[lineCounter]+"' could not be parsed.");
					}
				}
			}
		}
	}
}

//Scene writing - plain text
function writeText (text, special) {
	if (!special) {
		special = "false";
	}
	text = cullRequirements(text);
	var newLine = document.createElement("div");
	if (text == "...") {
		newLine.innerHTML += `
			<hr>
		`;
	}
	else {
		var textToPrint = replaceCodenames(text);
		if (special.includes("special")) {
			textToPrint = "<p class='specialText'>" + textToPrint + "</p>";
		}
		if (special.includes("centered")) {
			textToPrint = "<p class='centeredText'>" + textToPrint + "</p>";
		}
		if (special.includes("false")) {
			textToPrint = "<p class='rawText'>" + textToPrint + "</p>";
		}
		switch (data.player.style) {
			case "lobotomy": {
				newLine.innerHTML += `
					<span class='lobotomyText'>` + textToPrint + `</span>
				`;
				break;
			}
			default: {
				newLine.innerHTML += `
					` + textToPrint + `
				`;
			}
		}
	}
	
	document.getElementById(HTMLContainer).appendChild(newLine);
}

function writeCenteredText (text) {
	writeText(text, "centered");
}

function writeSpecial (text) {
	writeText(text, "special");
}

var uniqueIDCounter = 100;
function handleImageError() {
	console.log("Image error, trying to find backup image for image ID "+this.id);
	var backupImage = this.src.replace(imageFormat, imageBackup)
	document.getElementById(this.id).src = backupImage
}

//Scene writing - dialogue
function writeSpeech (name, img, text, altName, altColor, special, spirits) {
	console.log("Writing speech for "+name+" with image ID: "+img+" special commands: "+special);
	//0. Initialize variables
	//Spirits overlaid on the speaker's portrait, for characters who emote through them. Arrives as
	//the comma list writeHTML lifted off the line, or as an array from a direct call; every other
	//caller passes nothing at all and gets the empty list.
	if (typeof spirits === "string") {
		spirits = spirits.split(",").map(entry => entry.trim()).filter(entry => entry != "");
	}
	if (!spirits) {
		spirits = [];
	}
	var rawSpeakerArray = [name]
	var finalColors = [];
	var secret = false;
	// When set (via the "editable" special), the speaker's portrait becomes click-to-replace for that
	// character's currently-shown expression image. Used by the mod creator's new-character screen so
	// a modder can set the default look in one click. No effect on normal speech.
	var makeEditable = false;
	var targetElement = HTMLContainer;
	
	// 1. Parse special commands
    if (special) {
        let specialCommands = special.split(';');
        
        for (let i = 0; i < specialCommands.length; i++) {
            let currentCommand = specialCommands[i].trim(); // Trim whitespace just in case
            
            switch (currentCommand) {
                case "dual": {
                    // Grab the next item in the array as the target, then skip it
                    let dualTarget = specialCommands[i + 1].trim(); 
                    console.info("Dual target: " + dualTarget);
                    rawSpeakerArray.push(dualTarget);
                    i++; // Increment index so we don't process the name as a command
                    break;
                }
                case "target": {
                    targetElement = specialCommands[i + 1].trim();
                    console.log("Target element: " + targetElement);
                    i++; 
                    break;
                }
                case "secret": {
                    secret = true;
                    break;
                }
                case "editable": {
                    makeEditable = true;
                    break;
                }
            }
        }
    }
	
	//2. Hydrate variables
	let hydratedSpeakerArray = [];
    
    for (let i = 0; i < rawSpeakerArray.length; i++) {
        let rawName = rawSpeakerArray[i];
        
        // Initialize the object with defaults
        let newSpeaker = {
            id: rawName,
            printName: rawName,
            image: img,
            color: "#FFFFFF",
            type: "old",
            outfit: "",
            emotion: ""
        };
		console.info(newSpeaker);
        
        // Find in story data OR custom mod array
		let speakerHydrated = data.story.find(char => char.index === rawName);
		if (!speakerHydrated && storageArray.modName !== "") {
			speakerHydrated = storageArray.customCharacters.find(char => char.index === rawName);
		}
        
        if (speakerHydrated) {
            newSpeaker.printName = speakerHydrated.fName;
            newSpeaker.color = speakerHydrated.color;
            newSpeaker.emotion = speakerHydrated.emotion;
            
            let currentOutfit = speakerHydrated.outfit;
			if (["mayor", "carpenter", "shopkeep"].includes(speakerHydrated.index)) {
				if (checkFlag(speakerHydrated.index, "meat") === true) {
					currentOutfit += "-meat";
				}
			}
			newSpeaker.outfit = currentOutfit;
			
			if (finishedCharactersArray.includes(rawName)) {
				newSpeaker.type = "new";
			}
			//Only the leading speaker carries spirits — in a dual line they belong to the character
			//they haunt, not to whoever is standing opposite him.
			if (i === 0 && spirits.length > 0) {
				newSpeaker.spirits = spirits;
			}
        }
		
		//Player color default here
		if (newSpeaker.id === "player") {
			if (!data.player.color) {
				data.player.color = "#86b4dc";
			}
			newSpeaker.color = data.player.color;
			newSpeaker.printName = data.player.name;
			if (data.player.emotion == "robot") {
				newSpeaker.printName = "Robo-"+data.player.name;
			}
		}
			
		// Apply overrides from the function parameters (altName, altColor)
        if (secret) {
            // If secret, force "???" unless altName explicitly overrides it
            newSpeaker.printName = (altName) ? altName : "???";
        } else if (i === 0 && altName) {
            newSpeaker.printName = altName;
        }

        if (i === 0 && altColor) {
            newSpeaker.color = altColor;
        }

        // Generate and store the exact HTML string directly on the object
        newSpeaker.avatarHTML = resolveAvatarHTML(newSpeaker, data.player.style, data.player.egg);

        // Push the fully hydrated and ready-to-render objec
        hydratedSpeakerArray.push(newSpeaker);
    }
	
	//3. Process dialogue text
    let processedText = text; // Work on a mutable copy

    // A. Expand global codenames first
    processedText = replaceCodenames(processedText);

    let primarySpeaker = hydratedSpeakerArray[0];

    // B. Apply "Slavic" accents (Bat and Bear)
    if (primarySpeaker.id === "bat" || primarySpeaker.id === "bear") {
        // Use global regex (/g) to replace all Ws/ws without needing a 30x loop
        processedText = processedText.replace(/W/g, "V");
        processedText = processedText.replace(/w/g, "v");
    }

    // C. Apply Bear's specific N -> Ny accent
    if (primarySpeaker.id === "bear") {
        // The /g flag already hits every word in the sentence, so the loop is removed
        processedText = processedText.replace(/\bN(?!y)/g, "Ny");
        processedText = processedText.replace(/\bn(?!y)/g, "ny");
    }

    // D. Apply Eggy Override (Text Only - avatar was handled in Step 2!)
    if (data.player.egg === true && (primarySpeaker.id === "player" || primarySpeaker.id === data.player.name)) {
        processedText = eggyLines[Math.floor(Math.random() * eggyLines.length)];
    }
	
	//4. Build Dom Structure
	
	
	//5. Styling & assembly
    let dialogueContainer = document.createElement("div");
    dialogueContainer.classList.add("dialogueContainer", data.player.style);

    let textContainer = document.createElement("div");
    textContainer.classList.add("textContainer", data.player.style);

    let textBorder = document.createElement("div");
    textBorder.classList.add("textBorder", data.player.style);

    let textContent = document.createElement("div");
    textContent.classList.add("textContent", data.player.style);

    // Build the "Name1 & Name2" string cleanly in one line
    let finalNameSequenceToPrint = hydratedSpeakerArray.map(speaker => 
        `<span style='color:${speaker.color}'>${speaker.printName}</span>`
    ).join(" & ");

    let thumbnailContainers = [];
    // We store the name plates in memory but ONLY append them in the switch statement if needed
    let nameContainers = []; 

    for (let i = 0; i < hydratedSpeakerArray.length; i++) {
        let currentSpeaker = hydratedSpeakerArray[i];

        let thumbnailContainer = document.createElement("div");
        thumbnailContainer.classList.add("thumbnailContainer", data.player.style);

        let thumbnailBorder = document.createElement("div");
        thumbnailBorder.classList.add("thumbnailBorder", data.player.style);
        
        // Inject the pre-rendered avatar HTML
        thumbnailBorder.innerHTML = currentSpeaker.avatarHTML;
		
		// RESTORE ID AND ONERROR HANDLING HERE
		let imgNode = thumbnailBorder.querySelector("img.thumbnailImage");
		if (imgNode) {
			imgNode.id = uniqueIDCounter;
			uniqueIDCounter += 1;
			imgNode.onerror = handleImageError;

			// "editable" portraits (mod overview): clicking replaces the character's currently-shown
			// expression image directly — a one-click way to set the default look. Self-contained file
			// input (not the modEditableImage class) so the global rename-prompt handler doesn't also
			// fire; updates the portrait in place once the new image is stored.
			if (makeEditable) {
				imgNode.style.cursor = "pointer";
				imgNode.dataset.tooltip = "Click to replace this character's default expression image.";
				const editablePath = `${currentSpeaker.id}/${currentSpeaker.outfit}/${currentSpeaker.emotion}`;
				imgNode.onclick = () => {
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
							await replaceImage(editablePath, file);
						} catch (e) {
							return; // convertToWebP already alerted on failure
						}
						imgNode.src = cleanupImage(editablePath); // show the new image right away
					});
					input.click();
				};
			}
		}

        // Apply secret silhouette filter to the whole border container
        if (secret) {
            thumbnailBorder.style.filter = "brightness(0%)";
        }

        // Build the name container for memory (used by Persona and Royalty)
        let nameContainer = document.createElement("div");
        nameContainer.classList.add("nameContainer", data.player.style);
        let nameContent = document.createElement("p");
        nameContent.classList.add("nameContent", data.player.style);
        nameContainer.appendChild(nameContent);

        // Store references
        thumbnailContainer.appendChild(thumbnailBorder);
        thumbnailContainers.push(thumbnailContainer);
        nameContainers.push({ wrapper: nameContainer, text: nameContent });

        // Append to parent
        dialogueContainer.appendChild(thumbnailContainer);
    }

    // 5. Styling
    let primaryColor = hydratedSpeakerArray[0].color;
    let hasMultipleSpeakers = hydratedSpeakerArray.length > 1;

    switch (data.player.style) {
        case "lobotomy": {
            dialogueContainer.style.borderColor = primaryColor;
            for (let i = 0; i < hydratedSpeakerArray.length; i++) {
                thumbnailContainers[i].style.backgroundColor = hydratedSpeakerArray[i].color;
            }

            let dialogueName = document.createElement("p");
            dialogueName.classList.add("textName", data.player.style);
            dialogueName.style.color = primaryColor;
            dialogueName.innerHTML = finalNameSequenceToPrint;
            textContent.appendChild(dialogueName);
            break;
        }

        case "royalty": {
            textBorder.style.borderColor = primaryColor;
            if (hasMultipleSpeakers) { 
                textBorder.style.borderColor = "transparent";
                textBorder.style.borderImage = `linear-gradient(to right, ${primaryColor}, ${hydratedSpeakerArray[1].color}) 1`;
            }

            for (let i = 0; i < hydratedSpeakerArray.length; i++) {
                let speakerColor = hydratedSpeakerArray[i].color;

                // Configure and append Nameplate
                nameContainers[i].wrapper.style.borderColor = speakerColor;
                nameContainers[i].text.style.color = speakerColor;
                nameContainers[i].text.innerHTML = hydratedSpeakerArray[i].printName;
                thumbnailContainers[i].appendChild(nameContainers[i].wrapper);

                // Create the shadow clone natively
                let thumbnailShadow = document.createElement("div");
                thumbnailShadow.classList.add("thumbnailImage", "royalty");
                thumbnailShadow.innerHTML = hydratedSpeakerArray[i].avatarHTML;
                thumbnailShadow.style.position = "absolute";
                thumbnailShadow.style.filter = `drop-shadow(2px 2px 0 ${speakerColor}) drop-shadow(-5px -5px 0 ${speakerColor})`;
                thumbnailShadow.style.webkitFilter = `drop-shadow(2px 2px 0 ${speakerColor}) drop-shadow(-2px -2px 0 ${speakerColor})`;
                
                // Slip it behind the main image
                let borderEl = thumbnailContainers[i].querySelector('.thumbnailBorder');
                borderEl.insertBefore(thumbnailShadow, borderEl.firstChild);
            }
            break;
        }

        case "persona": {
            textContent.style.borderColor = primaryColor;

            for (let i = 0; i < hydratedSpeakerArray.length; i++) {
                let speakerColor = hydratedSpeakerArray[i].color;
                if (i > 0) textContent.style.borderColor = speakerColor; // Overrides with final color
                thumbnailContainers[i].style.boxShadow = `0px 5px ${speakerColor}`;
            }

            // 1. Get the primary name container
			let pNameContainer = nameContainers[0].wrapper;
			
			// 2. Remove it from its current thumbnail parent first!
			if (pNameContainer.parentNode) {
				pNameContainer.parentNode.removeChild(pNameContainer);
			}

			// 3. Setup the nameplate contents
			nameContainers[0].text.innerHTML = finalNameSequenceToPrint;
            
            let textNameWhite = document.createElement("div");
            textNameWhite.classList.add("textNamePersonaWhite");
            textNameWhite.style.borderColor = primaryColor;
            pNameContainer.appendChild(textNameWhite);
            
            let textNameBlack = document.createElement("div");
            textNameBlack.classList.add("textNamePersonaBlack");
            pNameContainer.appendChild(textNameBlack);
            
            let textNameArrow = document.createElement("div");
            textNameArrow.classList.add("personaNameArrow");
            pNameContainer.appendChild(textNameArrow);
            
            let textNameArrowShadow = document.createElement("div");
            textNameArrowShadow.classList.add("personaNameArrowShadow");
            textNameArrowShadow.style.borderRightColor = primaryColor;
            pNameContainer.appendChild(textNameArrowShadow);
			
            textBorder.appendChild(textContent);
            textBorder.insertBefore(pNameContainer, textContent);
            break;
        }

        case "syrup": {
            dialogueContainer.style.borderColor = primaryColor;
            if (hasMultipleSpeakers) { 
                dialogueContainer.style.borderColor = "transparent";
                dialogueContainer.style.borderImage = `linear-gradient(to right, ${primaryColor}, ${hydratedSpeakerArray[1].color}) 1`;
            }

            let dialogueTextDivorcer = document.createElement("div");
            textContent.appendChild(dialogueTextDivorcer);
            
            let dialogueName = document.createElement("p");
            dialogueName.classList.add("textName", data.player.style);
            dialogueName.innerHTML = finalNameSequenceToPrint;
            dialogueTextDivorcer.appendChild(dialogueName);
            
            let dialogueDivider = document.createElement("hr");
            dialogueDivider.classList.add("textDivider", data.player.style);
            dialogueDivider.style.borderColor = primaryColor;
            
            if (hasMultipleSpeakers) { 
                dialogueDivider.style.borderColor = "transparent";
                dialogueDivider.style.borderImage = `linear-gradient(to right, ${primaryColor}, ${hydratedSpeakerArray[1].color}) 1`;
                dialogueDivider.style.clipPath = "ellipse(50% 50%)";
            }
            dialogueTextDivorcer.appendChild(dialogueDivider);
            
            // 1. Create the SVG element
			let heartsSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			heartsSVG.setAttribute("xmlns", "http://www.w3.org/2000/svg");
			heartsSVG.setAttribute("version", "1.0");
			heartsSVG.setAttribute("viewBox", "0 0 340.000000 224.000000");
			heartsSVG.setAttribute("preserveAspectRatio", "xMidYMid meet");
			heartsSVG.style.cssText = "height: 150px; position: absolute; width: 225px; right: 15px; top: 15px; z-index: -1;";
			heartsSVG.classList.add("dialogueBackground", data.player.style);

			// 2. Create the group (g)
			let g = document.createElementNS("http://www.w3.org/2000/svg", "g");
			g.setAttribute("transform", "translate(0.000000,224.000000) scale(0.100000,-0.100000)");
			g.setAttribute("fill", primaryColor); // This applies your color
			g.setAttribute("opacity", "0.3");
			g.setAttribute("stroke", "none");

			// 3. Define the paths
			const paths = [
				"M2590 2180 c-91 -12 -142 -52 -171 -132 -26 -74 19 -181 170 -406 132 -196 142 -207 167 -194 18 9 37 17 97 41 211 84 365 169 424 233 28 30 53 89 53 125 -1 76 -101 185 -182 198 -50 9 -131 -3 -186 -26 -61 -27 -76 -24 -108 19 -51 67 -78 94 -119 117 -48 27 -85 34 -145 25z",
				"M287 2126 c-15 -7 -43 -26 -61 -44 -81 -76 -106 -209 -86 -455 7 -87 16 -160 20 -162 4 -2 20 0 36 5 16 6 78 26 138 46 99 32 138 47 231 90 67 31 132 107 153 178 15 51 -1 126 -33 156 -24 22 -36 23 -180 8 -29 -3 -30 -1 -37 47 -11 83 -19 104 -48 125 -32 23 -90 25 -133 6z",
				"M1871 942 c-67 -11 -115 -81 -145 -214 -7 -29 -23 -35 -54 -19 -68 34 -186 42 -228 15 -45 -30 -76 -98 -77 -168 -1 -107 37 -170 148 -245 69 -47 193 -111 215 -111 5 0 18 -4 28 -9 23 -12 60 -26 102 -41 19 -7 44 -16 55 -21 58 -24 111 -37 120 -28 10 10 30 81 75 274 37 161 48 295 30 370 -30 126 -153 216 -269 197z"
			];

			// 4. Add paths to group
			paths.forEach(d => {
				let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
				path.setAttribute("d", d);
				g.appendChild(path);
			});

			heartsSVG.appendChild(g);
			textContent.appendChild(heartsSVG);
            break;
        }

        default: {
            dialogueContainer.style.borderColor = primaryColor;
            for (let i = 0; i < hydratedSpeakerArray.length; i++) {
                thumbnailContainers[i].style.borderColor = hydratedSpeakerArray[i].color;
            }

            let dialogueName = document.createElement("p");
            dialogueName.classList.add("textName", data.player.style);
            dialogueName.innerHTML = finalNameSequenceToPrint;
            textContent.appendChild(dialogueName);
        }
    }

    // 6. Append to dom
    dialogueContainer.appendChild(textContainer);
    textContainer.appendChild(textBorder);
    textBorder.appendChild(textContent);

    let dialogueText = document.createElement("p");
    // processedText is the variable we created in Step 3!
    dialogueText.innerHTML = processedText; 
    textContent.appendChild(dialogueText);

    document.getElementById(targetElement).appendChild(dialogueContainer);
}

function writeDual (name1, img1, name2, img2, text, altColor1, altColor2) { 
	//Special function for writing speech of two characters
	writeSpeech(name1, img1, text, "", "", "dual; "+name2+";");

	/* OLD CODE
	writeSpeech(name1, img1, text);
	var listOfSpeech = document.getElementsByClassName("dialogueContainer");
	for (i = 0; i < listOfSpeech.length; i++) {
		console.log(listOfSpeech[i].children[1].children[0].children[0].children[3].innerHTML)
		if (listOfSpeech[i].children[1].children[0].children[0].children[3].innerHTML == text) {
			
		}
	}
	//Does not use a lot of the safety checks as writeSpeech!
	console.debug("Writing dual speech. Name1: "+name1+", image 1:"+img1+", Name2:"+name2+", image 2:"+img2+", text to print: "+text+", Alt color 1:"+altColor1+", Alt color 2:"+altColor2);
	var finalName1 = name1;
	var finalImg1 = img1;
	var finalColor1 = "";
	var finalName2 = name2;
	var finalImg2 = img2;
	var finalColor2 = "";
	for (i = 0; i < data.story.length; i++) {
		if (data.story[i].index == name1) {
			finalName1 = data.story[i].fName;
			finalColor1 = data.story[i].color;
			var characterOutfit1 = data.story[i].outfit;
			var characterEmotion1 = data.story[i].emotion;
			if (img1 === "") {
				finalImg1 = `images-`+imageFormat+`/${name1}/${characterOutfit1}/${characterEmotion1}.webp`;
			}
		}
		if (data.story[i].index == name2) {
			finalName2 = data.story[i].fName;
			finalColor2 = data.story[i].color;
			var characterOutfit2 = data.story[i].outfit;
			var characterEmotion2 = data.story[i].emotion;
			if (img2 === "") {
				finalImg2 = `images-`+imageFormat+`/${name2}/${characterOutfit2}/${characterEmotion2}.webp`;
			}
		}
	}
	
	if (name1 == "player") {
		finalImg1 = "images-webp/system/profiles/" + data.player.character + ".jpg";
		finalName1 = data.player.name;
		finalColor1 = "#86b4dc";
	}
	if (name2 == "player") {
		finalImg2 = "images-webp/system/profiles/" + data.player.character + ".jpg";
		finalName2 = data.player.name;
		finalColor2 = "#86b4dc";
	}
	if (altColor1 != null && altColor1 != "") {
		finalColor1 = altColor1;
	}
	if (altColor2 != null && altColor2 != "") {
		finalColor2 = altColor2;
	}
	var dialogueContainer = document.createElement("div");
	dialogueContainer.classList.add("dialogueContainer");
	dialogueContainer.classList.add(data.player.style);
	var thumbnailContainer = document.createElement("div");
	thumbnailContainer.classList.add("thumbnailContainer");
	thumbnailContainer.classList.add(data.player.style);
	var thumbnailBorder = document.createElement("div");
	thumbnailBorder.classList.add("thumbnailBorder");
	thumbnailBorder.classList.add(data.player.style);
	var thumbnailImage = document.createElement("img");
	thumbnailImage.classList.add("thumbnailImage");
	thumbnailImage.classList.add(data.player.style);
	var nameContainer = document.createElement("div");
	nameContainer.classList.add("nameContainer");
	nameContainer.classList.add(data.player.style);
	var nameContent = document.createElement("p");
	nameContent.classList.add("nameContent");
	nameContent.classList.add(data.player.style);
	var thumbnailContainer2 = document.createElement("div");
	thumbnailContainer2.classList.add("thumbnailContainer");
	thumbnailContainer2.classList.add(data.player.style);
	var thumbnailBorder2 = document.createElement("div");
	thumbnailBorder2.classList.add("thumbnailBorder");
	thumbnailBorder2.classList.add(data.player.style);
	var thumbnailImage2 = document.createElement("img");
	thumbnailImage2.classList.add("thumbnailImage");
	thumbnailImage2.classList.add(data.player.style);
	var nameContainer2 = document.createElement("div");
	nameContainer2.classList.add("nameContainer");
	nameContainer2.classList.add(data.player.style);
	var nameContent2 = document.createElement("p");
	nameContent2.classList.add("nameContent");
	nameContent2.classList.add(data.player.style);
	var textContainer = document.createElement("div");
	textContainer.classList.add("textContainer");
	textContainer.classList.add(data.player.style);
	var textBorder = document.createElement("div");
	textBorder.classList.add("textBorder");
	textBorder.classList.add(data.player.style);
	var textContent = document.createElement("div");
	textContent.classList.add("textContent");
	textContent.classList.add(data.player.style);

	thumbnailImage.src = finalImg1;
	thumbnailImage2.src = finalImg2;

	dialogueContainer.appendChild(thumbnailContainer);
		thumbnailContainer.appendChild(thumbnailBorder);
			thumbnailBorder.appendChild(thumbnailImage);
		thumbnailContainer.appendChild(nameContainer);
			nameContainer.appendChild(nameContent);
	dialogueContainer.appendChild(thumbnailContainer2);
		thumbnailContainer2.appendChild(thumbnailBorder2);
			thumbnailBorder2.appendChild(thumbnailImage2);
		thumbnailContainer2.appendChild(nameContainer2);
			nameContainer2.appendChild(nameContent2);
	dialogueContainer.appendChild(textContainer);
		textContainer.appendChild(textBorder);
			textBorder.appendChild(textContent);

	switch (data.player.style) {
		case "lobotomy": {
			dialogueContainer.style.borderColor = finalColor1;
			thumbnailContainer.style.backgroundColor = finalColor1;
			thumbnailContainer2.style.backgroundColor = finalColor2;
			
			var dialogueName = document.createElement("p");
			dialogueName.classList.add("textName");
			dialogueName.classList.add(data.player.style);
			dialogueName.innerHTML = `<span style = "color:`+finalColor1+`">`+ finalName1 + `</span> & <span style = "color:`+finalColor2+`">`+ finalName2 + `</span>`;
			textContent.appendChild(dialogueName);
			thumbnailContainer.removeChild(nameContainer);
			thumbnailContainer2.removeChild(nameContainer2);
			break;
		}
		case "royalty": {
			nameContainer.style.borderColor = finalColor1;
			
			nameContent.style.color = finalColor1;
			nameContent.innerHTML = finalName1;
			
			textBorder.style.borderColor = finalColor1;
			
			var thumbnailShadow = document.createElement("img");
			thumbnailShadow.classList.add("thumbnailImage");
			thumbnailShadow.classList.add("royalty");
			thumbnailShadow.src = finalImg1;
			//thumbnailBorder.appendChild(thumbnailImage);
			thumbnailShadow.style.position = "absolute";
			thumbnailShadow.style.filter = `drop-shadow(2px 2px 0 `+finalColor1+`) drop-shadow(-5px -5px 0 `+finalColor1+`)`;
			thumbnailShadow.style.webkitFilter = `drop-shadow(2px 2px 0 `+finalColor1+`) drop-shadow(-2px -2px 0 `+finalColor1+`)`;
			thumbnailBorder.insertBefore(thumbnailShadow, thumbnailImage);
			
			nameContainer2.style.borderColor = finalColor2;
			
			nameContent2.style.color = finalColor2;
			nameContent2.innerHTML = finalName2;
			
			var thumbnailShadow2 = document.createElement("img");
			thumbnailShadow2.classList.add("thumbnailImage");
			thumbnailShadow2.classList.add("royalty");
			thumbnailShadow2.src = finalImg2;
			//thumbnailBorder.appendChild(thumbnailImage);
			thumbnailShadow2.style.position = "absolute";
			thumbnailShadow2.style.filter = `drop-shadow(2px 2px 0 `+finalColor2+`) drop-shadow(-5px -5px 0 `+finalColor2+`)`;
			thumbnailShadow2.style.webkitFilter = `drop-shadow(2px 2px 0 `+finalColor2+`) drop-shadow(-2px -2px 0 `+finalColor2+`)`;
			thumbnailBorder2.insertBefore(thumbnailShadow2, thumbnailImage2);
			break;
		}
		case "persona": {
			thumbnailContainer.style.boxShadow = `0px 5px `+finalColor1;
			thumbnailContainer2.style.boxShadow = `0px 5px `+finalColor2;
			
			thumbnailContainer.removeChild(nameContainer);
			thumbnailContainer2.removeChild(nameContainer2);
			textBorder.insertBefore(nameContainer, textContent);
			
			nameContent.innerHTML = `<span style = "color:`+finalColor1+`">`+ finalName1 + `</span> & <span style = "color:`+finalColor2+`">`+ finalName2 + `</span>`;
			
			textContent.style.borderColor = finalColor1;
			
			var textNameWhite = document.createElement("div");
			textNameWhite.classList.add("textNamePersonaWhite");
			textNameWhite.style.borderColor = finalColor1;
			nameContainer.appendChild(textNameWhite);
			
			var textNameBlack = document.createElement("div");
			textNameBlack.classList.add("textNamePersonaBlack");
			nameContainer.appendChild(textNameBlack);
			
			var textNameArrow = document.createElement("div");
			textNameArrow.classList.add("personaNameArrow");
			nameContainer.appendChild(textNameArrow);
			
			var textNameArrowShadow = document.createElement("div");
			textNameArrowShadow.classList.add("personaNameArrowShadow");
			textNameArrowShadow.style.borderRightColor = finalColor1;
			nameContainer.appendChild(textNameArrowShadow);
			break;
		}
		case "syrup": {
			var dialogueName = document.createElement("p");
			dialogueName.classList.add("textName");
			dialogueName.classList.add(data.player.style);
			dialogueName.innerHTML = `<span style = "color:`+finalColor1+`">`+ finalName1 + `</span> & <span style = "color:`+finalColor2+`">`+ finalName2 + `</span>`;
			textContent.appendChild(dialogueName);
			thumbnailContainer.removeChild(nameContainer);
			thumbnailContainer2.removeChild(nameContainer2);
			
			var dialogueDivider = document.createElement("img");
			dialogueDivider.src = "images-webp/system/ui/dialogueSeparator.${imageFormat}";
			dialogueDivider.classList.add("dialogueDivider");
			dialogueDivider.classList.add(data.player.style);
			textContent.appendChild(dialogueDivider);
			
			var dialogueBackground = document.createElement("img");
			dialogueBackground.src = "images-webp/system/ui/dialogueHearts.${imageFormat}";
			dialogueBackground.classList.add("dialogueBackground");
			dialogueBackground.classList.add(data.player.style);
			textContent.appendChild(dialogueBackground);
			break;
		}
		default: {
			dialogueContainer.style.borderColor = finalColor1;
			thumbnailContainer.style.borderColor = finalColor1;
			thumbnailContainer2.style.borderColor = finalColor2;
			
			var dialogueName = document.createElement("p");
			dialogueName.classList.add("textName");
			dialogueName.classList.add(data.player.style);
			dialogueName.innerHTML = `<span style = "color:`+finalColor1+`">`+ finalName1 + `</span> & <span style = "color:`+finalColor2+`">`+ finalName2 + `</span>`;
			textContent.appendChild(dialogueName);
			thumbnailContainer.removeChild(nameContainer);
			thumbnailContainer2.removeChild(nameContainer2);
		}
	}
			
	var dialogueText = document.createElement("p");
	dialogueText.innerHTML = replaceCodenames(text);
	textContent.appendChild(dialogueText);
	document.getElementById(HTMLContainer).appendChild(dialogueContainer);
	*/
}

//Scene writing - images
function writeBig (img, cap) {
	var overlayArray = [];
	img = cleanupImage(img);
	var backupString = ``;
	/*
	backupString = img.replace(imageFormat, imageBackup)
	backupString = backupString.replace(imageFormat, imageBackup)
	backupString = `onerror="javascript:this.src='`+backupString+`';"`
	*/
	if (imagesDisabled != true) {
		var basePath = img.replace("."+imageFormat, "");
		basePath = basePath.replace("images-"+imageFormat+"/", "");
		var imgStringID = img+getRandomInt(1000);
		console.info(img)
		var cssColor = "#FCEBB5";
		if (data.player.style == "persona" || data.player.style == "lobotomy") {
			for (i = 0; i < data.story.length; i++) {
				if (img.includes(data.story[i].index) == true) {
					cssColor = data.story[i].color;
					break;
				}
			}
		}

		if (typeof animatedImages !== "undefined" && animatedImages.has(basePath) && fetishes("animated") == true) {
			// Load video
			cssColor = "#ff6c6cff";
			// Check if a .mp4 video exists and add it in a separate container
			var videoSrc = img.replace(/\.(webp|png|jpg|jpeg|gif)$/i, '.mp4');
			videoSrc = videoSrc.replace("images-"+imageFormat, 'images-mp4');
			var videoStringID = imgStringID + "-video";
			
			// Create a separate container for the video
			document.getElementById(HTMLContainer).innerHTML += "<div class='bigPictureContainer' id = '" + videoStringID + "' style = 'position: relative;border:5px solid "+cssColor+";border-radius: 30px;width:fit-content;max-height:70vh;margin:auto;overflow:hidden;margin-top:20px;'>";
			
			// Try to load video (works with file:// protocol)
			var videoElement = document.createElement('video');
			videoElement.className = 'bigPicture';
			videoElement.style.cssText = 'border:none;border-radius:initial;width:100%;max-height:70vh;display:block;';
			videoElement.autoplay = true;
			videoElement.loop = true;
			videoElement.muted = true;
			videoElement.playsInline = true;
			videoElement.preload = "auto";
			videoElement.onclick = function() { scrapbookSave(img, videoStringID); };
		
			// Handle errors - if video doesn't exist, remove the entire container
			videoElement.onerror = function() {
				console.log("Video failed to load: " + videoSrc);
				var videoContainer = document.getElementById(videoStringID);
				if (videoContainer && videoContainer.parentNode) {
					videoContainer.parentNode.removeChild(videoContainer);
				}
			};
		
		
			// Handle successful load
			videoElement.onloadeddata = function() {
				console.log("Video loaded successfully: " + videoSrc);
			};
			
			videoElement.src = videoSrc;
			document.getElementById(videoStringID).appendChild(videoElement);
		} 
		else {
			document.getElementById(HTMLContainer).innerHTML += "<div class='bigPictureContainer' id = '" + imgStringID + "' style = 'position: relative;border:5px solid "+cssColor+";border-radius: 30px;width:fit-content;max-height:70vh;margin:auto;overflow:hidden;'>";
			var drawString = ``;
			drawString += `
				<img class="bigPicture"
				style="border:none;border-radius:initial;width:100%;max-height:70vh;"
				id = "` + imgStringID + `" `+backupString+`
				src="` + img + `"
				onclick="scrapbookSave('`+img+`', '`+imgStringID+`')"
				data-path="` + img + `"
				>
			`;
			document.getElementById(imgStringID).innerHTML += drawString;
		}

		if (cap != undefined) {
			playerX = "";
			var playerInstances = [];
			special = cap
			specialCounter = 0;
			var extras = ``;
			while (special != "" && specialCounter < 100) {
				var playerShadow = "";
				if (special.includes("nude#") == true) {
					special = special.replace("nude#", "");
					extras += `nude;`;
				}
				if (special.includes("bottomless#") == true) {
					special = special.replace("bottomless#", "");
					extras += `bottomless;`;
				}
				if (special.includes("topless#") == true) {
					special = special.replace("topless#", "");
					extras += `topless;`;
				}
				console.debug(extras)
				specialCommand = special.split(`:`)[0];
				console.debug("Special command detected, "+specialCommand+"");
				switch (specialCommand) {
					case "player": {
                        playerXY = special.split(`player: `).pop().split(`#`)[0];
                        playerXY = playerXY.replace("player:", "");
                        playerX = playerXY.split("-")[0];
                        playerX = playerX.replace("+", "-");
                        playerY = playerXY.split("-")[1];
                        playerY = playerY.replace("+", "-");
                        playerScale = playerXY.split("-")[2];
                        
                        // Save each avatar's coordinates
                        playerInstances.push({ x: playerX, y: playerY, scale: playerScale });
                        break;
                    }
					case "clothes": {
						clothes = special.split(`clothes: `).pop().split(`#`)[0];
						clothes = clothes.replace("#", ";");
						if (clothes.includes(";") != true) {
							clothes += ";";
						}
						console.info("Clothes: "+clothes);
						extras += clothes;
						break;
					}
					case "shadow": {
						var shadowXY = special.split(`shadow: `).pop().split(`#`)[0];
						shadowXY = shadowXY.replace("shadow:", "");
						if (shadowXY.includes("-") != true) {
							shadowX = 20;
							shadowY = 20;
						}
						else {
							shadowX = shadowXY.split("-")[0];
							shadowY = shadowXY.split("-")[1];
						}
						playerShadow = `filter: drop-shadow(`+shadowX+`px `+shadowY+`px 10px #000000AA);`;
						break;
					}
					case "expression": {
						playerExp = special.split(`expression: `).pop().split(`#`)[0];
						playerExp = playerExp.replace("expression:", "");
						playerExp = playerExp.replace("#", "");
						break;
					}
					case "overlay": {
						overlayImage = special.split(`overlay: `).pop().split(`#`)[0];
						overlayImage = overlayImage.replace("overlay:", "");
						overlayArray.push(overlayImage);
						break;
					}
				}
				console.info(overlayArray)
				//EX: player:1-9;
				//writeText("Special command detected, "+special+", removing "+special.split(`#`)[0]+"#");
				special = special.replace(special.split(`#`)[0]+"#", "");
				specialCounter++;
			}
			if (playerInstances.length > 0) {
                for (var j = 0; j < playerInstances.length; j++) {
                    document.getElementById(imgStringID).innerHTML += `
                        <div class="playerPicture" style="`+playerShadow+`position:absolute;width:100%;max-height:initial;left:`+playerInstances[j].x+`%; top:`+playerInstances[j].y+`%;transform:scale(`+playerInstances[j].scale+`);">`+drawPlayer('playerSelf;expression:'+playerExp+';'+extras)+`</div>
                    `;
                }
            }
		}

		if (data.player.blacklistMode == true) {
			document.getElementById(HTMLContainer).innerHTML += `
				<p class="choiceText" id = "` + img + `Button" onclick="blacklistImage('` + img + `')">
					Blacklist this image
				</p>
			`;
		}
		if (storageArray.modName != "") {
			document.getElementById(HTMLContainer).innerHTML += `
				<p class="centeredText" id = "modImagePath" data-img="` + img + `" data-path="` + cap + `">
					`+cap+`
				</p>
			`;
		}
		document.getElementById(HTMLContainer).innerHTML += "<br>";
		if (overlayArray.length > 0) {
			for (i = 0; i < overlayArray.length; i++) {
				document.getElementById(imgStringID).innerHTML += `
					<img src="`+cleanupImage(overlayArray[i])+`" class="playerPicture" style="position:absolute;width:100%;max-height:initial;left:0;top:0;"></div>
				`;
			}
		}
	}
}

function writeTaste(img) {
	//Flip a coin to determine if the image is meat or veggie
	var coinFlip = Math.floor(Math.random() * 2);
	if (coinFlip == 1) {
		var taste = "Meat";
	}
	else {
		var taste = "Veggie";
	}
	if (data.player.carnivore == true) {
		taste = "Meat";
	}
	if (data.player.vegetarian == true) {
		taste = "Veggie";
	}
	randomGender = taste;
	writeBig(img+taste);
}

function wrongImageSet() {
	/*
	if (gameType = "fleshy") {
		gameType = "furry";
		console.info("Not playing with both image packs. Changing to furry mode.")
		//drawModeButton = false;
		titleURL = cleanupImage("system/ui/titleEmpty");
		writeScene("system", "start");
	}
	else {
	}
	*/
	finalImageSet = "png";
	if (titleAttempts > 0) {
		if (imageFormat == "png") {
			finalImageSet = "webp";
			console.error("Failure to write test image. Player is playing png version of the game but lacks png images.")
		}
		if (imageFormat == "webp") {
			finalImageSet = "png";
			console.error("Failure to write test image. Player is playing webp version of the game but lacks webp images.")
		}
		imageFormat = finalImageSet;
		writeScene("system", "start");
		//generateWindow("imageFailure1")
		titleAttempts -=1;
	}
}

function noImageSet() {
	console.error("Backup image failed to load!.")
	generateWindow("imageFailure2")
}

//writeCap used to live here. It dumped an image's generation info to the console and nothing
//else, and it never worked: its lookup compared raw paths against imageList entries written as
//"images/..." while every caller passed "images-webp/...", so it never matched a single entry.
//Clicking a big picture now saves it to the scrapbook instead, which is where that information
//is actually readable. See scrapbookSave and the scrapbook window in scripts/menus/logbook.js.


function writeMed (img, cap) {
	if (img.includes('profile') == true) {
		if (data.player.pervert != true) {
			var checkForError = "";
			var pervertImage = img;
		}
		else {
			var backupImage = img;
			var checkForError = `onerror ="javascript:this.src='`+backupImage+`'"`;
			if (data.player.carnivore == true && name == "principal" || name == "incubus" || name == "secretary") {
				//Empty space to signify that victoria and lily should not have pervert mode images in carnivore mode.
			}
			else {
				img = img.replace('profile', 'profileP');
				console.log(img);
			}
		}
	}
	if (imagesDisabled != true) {
	document.getElementById(HTMLContainer).innerHTML += `
		<img class="medPicture" src="` + img + `"`+checkForError+` title="` + cap + `">
		<br>
	`;
	}
}

//Scene writing - misc
function writeBar(img, title, progress, cap) {
	//If the progress bar element is present, set the output to the progress bar. Otherwise, set it to the output.
	var progressBar = document.getElementById('progressBar');
	if (progressBar) {
		var target = "target; progressBar;";
	}
	else {
		var target = "output";
	}

	//Check if the image includes one of the character's indexes
	for (i = 0; i < data.story.length; i++) {
		if (img.includes(data.story[i].index)) {
			var characterTarget = data.story[i].index;
		}
	}
	if (img.includes('player')) {
		var characterTarget = "player";
	}

	//Fail case in case of no cap
	if (cap == null) {
		cap = 100;
	}

	//Handle color of bar
	var percentage = progress / cap;
	var barSize = percentage * 100;
	var color = "background-color: red;";
	if (percentage > 0.1) {
		color = "background-image: linear-gradient(to right, red, orange);";
	}
	if (percentage > 0.4) {
		color = "background-image: linear-gradient(to right, red, orange, yellow);";
	}
	if (percentage > 0.7) {
		color = "background-image: linear-gradient(to right, red, orange, yellow, green);";
	}
	if (progress == cap) {
		color = "background-color: #1ce01c;";
	}
	console.log("Writing progress bar. Image: "+img+", Title: "+title+", Progress: "+progress+", Cap: "+cap+", Progress percentage: "+percentage+", Color: "+color);

	//If there is a character, use that character for the speech and set the title to the altName. Otherwise, use the title.
	if (characterTarget) {
		writeSpeech(characterTarget, ``, `
			<div class="progressBar" style="background-color: #565656;border-radius: 13px;padding: 3px;min-width:30vw;">
				<div style="`+color+`width: `+barSize+`%;height: 20px;border-radius: 10px;"></div>
			</div>
			<p>`+progress+` / `+cap+`</p>
		`, title, "", target);
	}
	else {
		writeSpeech(title, img, `
			<div class="progressBar" style="background-color: #565656;border-radius: 13px;padding: 3px;min-width:30vw;">
				<div style="`+color+`width: `+barSize+`%;height: 20px;border-radius: 10px;"></div>
			</div>
			<p>`+progress+` / `+cap+`</p>
		`, "", "", target);
	}
	/*
	document.getElementById(HTMLContainer).innerHTML += `
		<div class="textBox" style="border-bottom:none; padding:0px;">
			<img class = "textThumb" src = "
				`+img+`">
			<div class="textBoxContent">
				<p class = "textName" style = "margin:15px;">`+title+`</p>
				<div class="progressBar" style="background-color: #565656;border-radius: 13px;padding: 3px;">
					<div style="background-color: orange;width: `+progress+`%;height: 20px;border-radius: 10px;"></div>
				</div>
				<p class = "textName" style = "margin:15px;">`+progress+` / `+cap+`</p>
			</div>
		</div>
	`;
	*/
}

function writeFunction (name, func, color) {
	if (color == null || color == "") {
		color = "#0593F8";
	}
	switch (color) {
		case "blue":
			color = "#B7BDFF"
		break;
		case "red":
			color = "#FF0019"
		break;
		case "green":
			color = "#00FF1D"
		break;
	}
	switch (data.player.style) {
		case "lobotomy": {
			var skewNumber = getRandomInt(8);
			skewNumber -= 4;
			var borderNumber = getRandomInt(2) + 3;
			var rotationNumber = getRandomInt(2) -1;
			if (skewNumber >= 0) {
				skewNumber += getRandomInt(3);
			}
			if (skewNumber <= 0) {
				skewNumber -= getRandomInt(3);
			}
			var reverseSkew = skewNumber - skewNumber - skewNumber;
			var rotationReverse = rotationNumber - rotationNumber - rotationNumber;
			console.log('skewnumber is ' +skewNumber + ' rotationnumber is '+ rotationNumber);
			document.getElementById(HTMLContainer).innerHTML += `
			<div class="choiceFrameLobotomy" 
			style ="
				-moz-transform: skew(`+skewNumber+`deg, 0deg);
				-webkit-transform: skew(`+skewNumber+`deg, 0deg);
				-o-transform: skew(`+skewNumber+`deg, 0deg);
				-ms-transform: skew(`+skewNumber+`deg, 0deg);
				transform: skew(`+skewNumber+`deg, 0deg);
				border: solid `+borderNumber+`px `+color+`;
			">
			<p class="choiceTextLobotomy" 
			style ="
				-moz-transform: skew(`+reverseSkew+`deg, 0deg);
				-webkit-transform: skew(`+reverseSkew+`deg, 0deg);
				-o-transform: skew(`+reverseSkew+`deg, 0deg);
				-ms-transform: skew(`+reverseSkew+`deg, 0deg);
				transform: skew(`+reverseSkew+`deg, 0deg);
			" 
			onclick="` + name + `">
				` + replaceCodenames(func) + `
			</p>
			</div>
			`;
			break;
		}
		case "persona": {
			var skewNumber = 5;
			var reverseSkew = skewNumber - skewNumber - skewNumber;
			console.log('skewnumber is ' +skewNumber + ' rotationnumber is '+ rotationNumber);
			document.getElementById(HTMLContainer).innerHTML += `
			<div class="choiceFramePersona" onclick="` + name + `"
			style ="
				-moz-transform: skew(`+skewNumber+`deg, 0deg);
				-webkit-transform: skew(`+skewNumber+`deg, 0deg);
				-o-transform: skew(`+skewNumber+`deg, 0deg);
				-ms-transform: skew(`+skewNumber+`deg, 0deg);
				transform: skew(`+skewNumber+`deg, 0deg);
			">
			<p class="choiceTextPersona" 
			style ="
				-moz-transform: skew(`+reverseSkew+`deg, 0deg);
				-webkit-transform: skew(`+reverseSkew+`deg, 0deg);
				-o-transform: skew(`+reverseSkew+`deg, 0deg);
				-ms-transform: skew(`+reverseSkew+`deg, 0deg);
				transform: skew(`+reverseSkew+`deg, 0deg);
			" 
			>
				` + replaceCodenames(func) + `
			</p>
			</div>
			`;
			break;
		}
		default: {
			document.getElementById(HTMLContainer).innerHTML += `
				<p class="choiceText" onclick="` + name + `"
				style = "border-bottom: 3px solid `+color+`; color: `+color+`"
				>
					` + replaceCodenames(func) + `
				</p>
			`;
		}
	}
}

function writeArtifactList() {
	var galleryFontSize = "var(--fs-xlarge, 1.5em)";
	for (artifactIndex = 0; artifactIndex < artifactArray.length; artifactIndex++) {
		if (checkItem(artifactArray[artifactIndex]) == true) {
			generateGalleryTab(
				"#FCEBB5", 
				"artifacts/"+artifactArray[artifactIndex]+"1", 
				countScenes(artifactArray[artifactIndex])[0]+`/`+countScenes(artifactArray[artifactIndex])[1],
				"var(--fs-xlarge, 1.5em)", 
				getItemName(artifactArray[artifactIndex]), 
				"writeScene('system', 'artifact-"+artifactArray[artifactIndex]+"');"
			);
		}
	}
}

function printCardSheet(startingNumber) {
	for (i = 0; i < 30; i++) {
		printCard(i + startingNumber, 'galleryGrid');
	}
	printCardButtons(startingNumber);
}

function printCardButtons(startingNumber) {
	if (collectablesPage != 0) {
		document.getElementById('galleryGrid').innerHTML += `
			<p class="choiceText" onclick="prevCardSheet(`+startingNumber+`)"
			style = "border-bottom: 3px solid #0593F8; color: #0593F8"
			>
				Previous Page
			</p>
		`;
	}
	if (startingNumber < globalCollectablesArray.length - 30) {
		document.getElementById('galleryGrid').innerHTML += `
			<p class="choiceText" onclick="nextCardSheet(`+startingNumber+`)"
			style = "border-bottom: 3px solid #0593F8; color: #0593F8"
			>
				Next Page
			</p>
		`;
	}
}

function nextCardSheet(startingNumber) {
	document.getElementById('galleryGrid').innerHTML = '';
	collectablesPage++;
	printCardSheet(startingNumber + 30);
}

function prevCardSheet(startingNumber) {
	document.getElementById('galleryGrid').innerHTML = '';
	collectablesPage--;
	printCardSheet(startingNumber - 30);
}

function printCard(index, target) {
	var type = "pocketmanz"
	globalCollectablesArray[index].image = cleanupImage(globalCollectablesArray[index].image)
	var cardBrightness = "var(--card-brightness, 80%)";
	var cardToPrint = globalCollectablesArray[index]
	if(globalCollectablesArray[index].name) {
		var finalName = globalCollectablesArray[index].name;
	}
	else {
		var finalName = "Unnamed Card";
	}
	if(globalCollectablesArray[index].color) {
		var finalColor = globalCollectablesArray[index].color;
	}
	else {
		var finalColor = "#AAAAAA";
	}
	if (globalCollectablesArray[index].frame) {
		var finalRarity = globalCollectablesArray[index].frame;
	}
	else {
		globalCollectablesArray[index].frame = "common";
	}
	if (globalCollectablesArray[index].frame.includes("vertical")) {
		document.getElementById(target).innerHTML += `
			<div id="wardrobe`+globalCollectablesArray[index].index+`"
			onmouseover="wardrobeMouseOver('wardrobe`+globalCollectablesArray[index].index+`')"
			onmouseout="wardrobeMouseOut('wardrobe`+globalCollectablesArray[index].index+`')"
			style="filter:brightness(`+cardBrightness+`);position:relative;width:100%;aspect-ratio:1/1.25;border-radius:15px;text-align:center;max-width:80vw;margin:auto;margin-bottom:2%;">
				
			</div>
		`;

		document.getElementById(`wardrobe`+globalCollectablesArray[index].index).innerHTML += `
			<img class="bigPicture" src="`+cleanupImage("none")+`"
			onclick="cardZoom('`+globalCollectablesArray[index].image+`', '`+type+`')",
			style="background:`+finalColor+`;width: 100%; height: 100%;max-height:none; max-width:none; cursor: pointer;position:absolute;border:none;border-radius:5%;">
		`;

		document.getElementById(`wardrobe`+globalCollectablesArray[index].index).innerHTML += `
			<img class="bigPicture" src="` + globalCollectablesArray[index].image + `"
			onclick="cardZoom('`+globalCollectablesArray[index].image+`', '`+type+`')",
			style="aspect-ratio:2/3;width: 70%; top: 11.5%; left: 15%;max-height:none; cursor: pointer;position:absolute;border:none;border-radius:initial;">
			<img class="bigPicture" src="` + cleanupImage("pocketmanz/frame-vertical") + `"
			onclick="cardZoom('`+globalCollectablesArray[index].image+`', '`+type+`')",
			style="width: 100%; max-height:none; max-width:none; cursor: pointer;position:absolute;border:none;border-radius:initial;">
			<p style="
				position:inherit;
				font-family: simple summer;
				color:#FFD800;
				font-size:var(--fs-huge, 3rem);
				text-shadow: 4px 4px black;
				top:4%;
			">`+finalName+`</p>
		`;
	}
	else {
		document.getElementById(target).innerHTML += `
			<div id="wardrobe`+globalCollectablesArray[index].index+`"
			onmouseover="wardrobeMouseOver('wardrobe`+globalCollectablesArray[index].index+`')"
			onmouseout="wardrobeMouseOut('wardrobe`+globalCollectablesArray[index].index+`')"
			style="filter:brightness(`+cardBrightness+`);position:relative;width:100%;aspect-ratio:1/1.25;border-radius:15px;text-align:center;max-width:80vw;margin:auto;margin-bottom:2%;">
				
			</div>
		`;

		document.getElementById(`wardrobe`+globalCollectablesArray[index].index).innerHTML += `
			<img class="bigPicture" src="`+cleanupImage("none")+`"
			onclick="cardZoom('`+globalCollectablesArray[index].image+`', '`+type+`')",
			style="background:`+finalColor+`;width: 100%; height: 100%;max-height:none; max-width:none; cursor: pointer;position:absolute;border:none;border-radius:5%;">
		`;
		
		if (globalCollectablesArray[index].frame == "rare") {
			document.getElementById(`wardrobe`+globalCollectablesArray[index].index).innerHTML += `
				<img class="bigPicture shimmer" src="`+cleanupImage("pocketmanz/foilDotOuterBack")+`"
				onclick="cardZoom('`+globalCollectablesArray[index].image+`', '`+type+`')",
				style="opacity: 30%;width: 100%; height: 100%;max-height:none; max-width:none; cursor: pointer;position:absolute;border:none;border-radius:5%;">
			`;
			document.getElementById(`wardrobe`+globalCollectablesArray[index].index).innerHTML += `
				<img class="bigPicture" src="` + cleanupImage("pocketmanz/foilDotOuterFront") + `"
				onclick="cardZoom('`+globalCollectablesArray[index].image+`', '`+type+`')",
				style="width: 100%; height: 100%;max-height:none; max-width:none; cursor: pointer;position:absolute;border:none;border-radius:5%;">
			`;
		}

		document.getElementById(`wardrobe`+globalCollectablesArray[index].index).innerHTML += `
			<img class="bigPicture" src="` + globalCollectablesArray[index].image + `"
			onclick="cardZoom('`+globalCollectablesArray[index].image+`', '`+type+`')",
			style="width: 78%; top: 11.5%; left: 11%;max-height:none; cursor: pointer;position:absolute;border:none;border-radius:initial;">
			<img class="bigPicture" src="` + cleanupImage("pocketmanz/frame") + `"
			onclick="cardZoom('`+globalCollectablesArray[index].image+`', '`+type+`')",
			style="width: 100%; max-height:none; max-width:none; cursor: pointer;position:absolute;border:none;border-radius:initial;">
			<p style="
				position:inherit;
				font-family: simple summer;
				color:#FFD800;
				font-size:var(--fs-huge, 3rem);
				text-shadow: 4px 4px black;
				top:57%;
			">`+finalName+`</p>
		`;
	}
}

function writeChangelog(command) {
	var returnString = "";
	switch (command) {
		case "v7":
			returnString = `
				<img class="bigPicture" style="border-radius: 5px;" src="` + cleanupImage("changelog/"+command) + `">
				v7 - Nuns don't watch Tellyvision
				Content:
					- New Character: Khanna, the Tiger Nun
					- New Artifact: Tellyvision
					- New Tellyvision shows: Bitch Medicenter - The Catgirl & Futa Fight - ROOBY
					- Added a bunch of new Tellyvision commercials
					- New scenes for Jasper and Garnet
					- New Mimic encounters while digging
					- 40+ new jiggies available via digging
					- 3 full new outfits available via digging, with special collage jiggies for collecting them all
					- Replaced the old placeholder collectables with new ones.
				Other changes:
					- Added a quick shortcut to your last location in the morning.
					- Overhauled the player's expressions across all three skintones to make them more distinct.
					- Added category buttons to sort the jiggies.
					- Moved a number of the v6 jiggies into chests so you collect multiple at once.
					- Changed the collectables categories to "Fruit, Critters, and Treasures".
					- You can now actually collect the treasures obtained via digging.
					- You can now use fruit from the inventory directly to restore stamina.
					- All old placeholder items have been deleted.
					- Added a mailbox to the player's home, mostly for updates and news.
				Bugfixes:
					- Several unobtainable jiggies such as Gobbo supremacy are now properly available.
					- Fixed a bug where Helena would appear on the carnivore route.
					- Fixed broken images in the fetish select menu.
					- Fixed getting the wrong items when starting a carnivore and vegetarian save.
					- Fixed the fetish menu breaking in the collection room.
					- Fixed Riley showing his haircut scenes even if you haven't triggered their starting event.
				Upcoming:
					- Sorbet, Sharly, and Nutmeg & Cinnamon are the last characters who need model updates.
					- Re-checking the color sets for clothing.
					- Adding the Plap Pal cards to the game proper.
					- Getting invited to Marlow's and Khanna's homes.
					- Foxes double blowjob scene.
					- Monster fucker Permit.
			`;
		break;
		case "v8":
			returnString = `
				<img class="bigPicture" style="border-radius: 5px;" src="` + cleanupImage("changelog/"+command) + `">
				v8 - Sex With Fish
				Content:
					- New Fanmade Character: Tink, by EvilCrucifix
					- New Portal Onahole and Time Stopwatch scenes for Sharly
					- New wallbutt, and Denial Pill scenes for Marlow
					- You can now visit Marlow's house
					- New Threesome scene with Jasper and Garnet
					- New short morning events for Sorbet and Marlow
					- New jiggies and magazines obtainable via digging
					- Added the Monster Fucker Permit, obtained by bringing a worm from the wilderness to the foxes
					- Added new fuckable critters: Lurm and Fooba
					- Added compatibility with Aranom's animated images mod
				Other changes:
					- Added new expression sets for Sorbet and Sharly
					- Grouped old jiggies to make collection easier
					- Added new content toggles for unusual insertion, all the way through, and weird content (weird toggle only appears after you've brought the unknown worm to the foxes)
					- Individual jiggy categories now show obtained and completed counts.
					- Replaced the trophy images for collecting all tarot cards and pocketmanz cards.
				Bugfixes:
					- Fixed a bug affecting Riley, Sharly, and Bluebell which caused werid dialogue stuff.
					- Fixed fetish settings not appropriately being set.
					- Fixed Angelica's alternate outfits not having expressions.
					- Fixed the jiggies easy mode button not appearing.
					- Fixed Riley showing haircut options too early, and not appearing at all.
					- Fixed random jiggies showing just a question mark block.
					- Fixed a bug where digging in carnivore mode would freeze the game.
					- Fixed some clothes being impossible to remove.
					- Fixed the deity and fox jiggies not being obtainable.
					- Fixed the tan skin option not matching the hyper dick or the default female face.
					- Fixed a bug where the result images from the fire trio jiggy wasn't displaying.
				Upcoming:
					- Nutmeg & Cinnamon, the last remaining core characters.
					- More monster fucker permit usage.
					- Adding the Plap Pal cards to the game proper.
					- Getting invited to Khanna's home.
			`;
		break;
		case "v9":
			returnString = `
				<img class="bigPicture" style="border-radius: 5px;" src="` + cleanupImage("changelog/"+command) + `">
				v9 - My Deer Friends (Released on my birthday, Jan 9th)
				Content:
					- New Character pair: Nutmeg & Cinnamon
					- Added a repeatable petting scene for Angelica, Cayenne, Sorbet, Mary-Lou, Marlow, Riley, and Helena
					- You can now visit Khanna's church
					- Added the DQ and Holofuta magazine images as jiggies
				Other changes:
					- Reworked the jiggy game to make more interesting shapes
					- Misc jiggies are no longer required for the jiggy completion achievement
				Bugfixes:
					- Replaced an image in Bluebell's meaty magazine where she had a pusspuss
					- Fixed the missing bar jiggy
				Upcoming:
					- With all core characters being added and using their new avatars, I can finally get the ball rolling on the non-furry version.
					- I'm several drafts into v9 of my generative model, so expect an update to the guides in the technology wing.
					- A new tellyvision show starring an emo girl investigating weird critters.
					- Multiple scenes and jiggies are already finished, but I didn't have time to finish/test them. So expect another update soon.
					- More monster fucker permit usage.
					- Adding the Plap Pal cards to the game proper.
			`;
		break;
		case "v10":
			returnString = `
				<img class="bigPicture" style="border-radius: 5px;" src="` + cleanupImage("changelog/"+command) + `">
				v10 - Heavy on Petting
				Content:
					- Added 4 new scenes for Nutmeg and Cinnamon each, starting with being invited to their home.
					- Added 3 new petting scenes with Bluebell (make smalltalk and ask to pet her, then purchase the new scenes)
					- Added 3 new repeatable scenes with Helena.
					- Added another repeatable and a wallbutt scene for Khanna.
					- Added almost 40 new jiggies, obtainable via digging as subscriber batch 4.
					- Added 4 new short commercials for the Tellyvision.
				Other changes:
					- Added a toggle in the preferences menu to disable rimming/anilingus.
					- Each subsciber batch and the Syrup set of jiggies now has their own collection trophy.
					- Jiggies no longer have a completion trophy, instead the categories will display a crown at full collection + completion.
				Bugfixes:
					- Disabling urethral sounding now properly disables Marlow's bathtime morning event.
					- Included all v9.1 bugfixes.
					- Nutmeg now uses the 'girls with dicks' preferences toggle, instead of the male characters toggle.
				Upcoming:
					- An update to the Technology Wing's stable diffusion guide
					- More progress on the non-furry version
					- I'm several drafts into v9 of my generative model, so expect an update to the guides in the technology wing.
					- A new tellyvision show starring an emo girl investigating weird critters.
					- More monster fucker permit usage.
					- Adding the Plap Pal cards to the game proper.
			`;
		break;
		case "v11":
			returnString = `
				<img class="bigPicture" style="border-radius: 5px;" src="` + cleanupImage("changelog/"+command) + `">
				v11 - Art of the Artifact
				New Content:
					- 4 New Scenes involving Cayenne
					- Added the new Star-Crossed Cherry artifact with 4 scenes
					- Added 2 new Denial Pills scenes
					- Added 3 public indecency scenes for if you walk through Pinecone Plaza naked. One for Angelica, one for Helena, and one for Khanna/Sharly.
					- Added Subscriber Batch 5 Jiggies (Between 70~80 total)
					- Added the Grotto - An explorable location that can appear during the diggy minigame. The number of events included depend heavily on your enabled fetishes.
				Removed Content:
					- Nutmeg and Cinnamon have been removed from the official copy of the game
					- The Holofuta magazine and several jiggies have been removed from the official copy of the game
				Other changes:
					- Updated the Content Restoration Mod
					- Added full mod support available via the title screen, compatible with both desktop and mobile versions of the game
					- Added in-game mod creation tools accessible via the museum's Technology Wing
					- Added a scene for players with far too much money which rewards you with boobies and Lightning McCrocs
					- New Cheat: infinity - Toggles inventory and money caps
					- New Cheat: boobies - Instantly triggers the too much money scene without needing $1000
					- Separated magazine jiggies into their own categories
					- Added 800 more images to the random jiggy pools
					- Added more music tracks to the game's playlist
					- Increased the amount of jiggies obtained via the diggy minigame
					- Increased the grid size and amount of treasure that appears in the diggy minigame
				Bugfixes:
					- Fixed a missing image involving Tink
					- Resized the Pleated Skirt to fit properly on the player's body
					- Huge swaths of code needed to be restructured for the sake of mod support, which probably both fixed and introduced lots of bugs
				Upcoming:
					- Actual content involving the Sphinx in the grotto
					- A continuation to Helena's training
					- More content relating to the Star-Crossed Cherries
					- An update to the Technology Wing's stable diffusion guide
					- More progress on the non-furry version
					- A new tellyvision show starring an emo girl investigating weird critters.
					- More monster fucker permit usage.
					- Adding the Plap Pal cards to the game proper.
			`;
		break;
		case "v12":
			returnString = `
				<img class="bigPicture" style="border-radius: 5px;" src="` + cleanupImage("changelog/"+command) + `">
				v12 - We Dream of a Clean Steam
				New Content:
					- New Tink artifact available in the diggy game, new followup scene after you've obtained her new artifact scene and the chainsaw one.
					- Four new scenes for Helena as we approach the end of her training arc
					- New tentacle pit location in the grotto where you can find Garnet and Jasper stuck for a new scene each
					- Denial pill scene added for the foxes, obtained via using the pills and heading to the museum.
					- Lamy the sphinx's first scene added
					- Three new Bitch Medicenter scenes available via the tellyvision
					- Over fourty new jiggies added via gathering, digging, or purchasing from Lamy the sphinx
					- Over a dozen full new clothing sets added to the diggy minigame
					- New Assple item usable after earning the Monster Fucker Permit (found in the grotto or the orchard if you have the permit)
				Removed Content:
					- Subscriber batch jiggies have been moved to the Content Restoration Mod along with the new Nutmeg & Cinnamon Time Stopwatch scenes
					- The DQ magazine, pocketmanz cards, and certain grotto encounters such as the fairies have been moved to the Content Restoration Mod
				Other changes:
					- Updated the Content Restoration Mod
					- Redid a large swath of the game's CSS code to improve mobile landscape performance and combine the index.html and mobile.html files into a single version.
					- Changed mods to use a separate local storage location from save data, meaning you can now save and load as normal after installing mods
					- Roob futa fight and jiggy color palletes have been altered
					- Made sweeping changes to the jiggy game, improving piece shuffling and preventing the game from refreshing on mobile mid-game.
					- The Roob outfits have been combined so you don't need to collect individual pieces anymore
					- The navigation window is now a square instead of a rectangle
					- Added a manual customization tab to the wardrobe
					- Added an outfits tab to the wardrobe, allowing you to save outfits, or wear premade ones including winning outfits from the Community Outfit Contest if you have all the parts
				Bugfixes:
					- Fixed a massive number of critical bugs involving the in-game mod creation tools. 
					- Fixed several bugs with the jiggy minigame
					- Using the 'passion for fashion' cheat now properly unlocks the wardrobe
			`;
		break;
		case "v13":
			returnString = `
				v13 - Divinity
				New Content:
					- New character: Deity, the forgotten guardian spirit of the forest. Recover an ancient artifact, rebuild his power and build him a home!
					- New character: Thorne, a cutie-patootie plant boy inspirited by ghosts, connected to deityF.
					- New artifact: A strange essence-extracting plug, dug up from the ruins grotto. One scene with fashF for now
					- New Khanna scene: the angel outfit she gives you and the scene that plays when you visit her church wearing the full set. Plus a scene with the Star-Crossed Cherry, and the portal onahole.
					- New Riley and Khanna morning scenes.
					- Added a demo for Honeycomb Catacombs to the title screen. Only 3 lewd events from progressing Nettle's venom weakness right now
				Other changes:
					- New Scrapbook: a new section of the logbook, sold at the store. With it enabled, tap any large picture to keep it, along with the notes it was generated from. Browse what you've saved in a grid, read the full notes, and delete what you don't need. Modded pictures keep their notes too.
					- Multiple new outfits!
					- Full control mode added to clothes, letting you wear whatever you want at varying sizes too!
				Bugfixes:
					- Cleaned up and corrected a number of scenes.
					- Includes all bugfixes from v12 hotfixes
					- Fixed a bug where jiggies from Angelica, Bluebell, and Cayenne would ignore their genders
					- Fixed a number of different duplicate and missing thumbnails
				Content Restoration Mod v4:
					- Added Plapworld magazine 
					- Added more Beast Breed magazine images
					- Added Sub Batch 7
					- Added DOA collage jiggies for sale at Lamy's shop
			`;
		break;
	}
	
	returnString = returnString.split("\n")
	for (var returnIndex = 0; returnIndex < returnString.length; returnIndex++) {
		if (returnString[returnIndex].includes(command + " - ")){
			returnString[returnIndex] = `<p class='specialText'>`+returnString[returnIndex]
		}
		if (returnString[returnIndex].includes("Content:") || returnString[returnIndex].includes("Other changes:") || returnString[returnIndex].includes("Bugfixes:") || returnString[returnIndex].includes("Upcoming:")){
			returnString[returnIndex] = `</p><p class='rawText'>`+returnString[returnIndex]
		}
	}
	returnString = returnString.join("<br>")+"</p>";
	return returnString;
}

function writeTest(character) {
	switch (character) {
		case "mayor":
		case "carpenter":
			if (checkFlag(character, "meat") == true) {
				var outfits = ["clothed", "nude"];
			}
			else {
				var outfits = ["clothed", "nude", "pregnant"];
			}
			break;
		case "shopkeep":
			if (checkFlag(character, "meat") == true) {
				var outfits = ["clothed", "nude", "magical"];
			}
			else {
				var outfits = ["clothed", "nude", "magical", "pregnant"];
			}
			break;
		case "milf":
		case "sadogato":
			var outfits = ["nude", "magical", "pregnant"];
			break;
		case "wolf":
			var outfits = ["clothed", "magical", "nude", "pregnant"];
			break;
		case "nun":
			var outfits = ["clothed", "magical", "nude", "pregnant"];
			break;
		case "mommy":
			var outfits = ["clothed", "magical", "nude", "pregnant", "dick"];
			break;
		case "mesu":
			var outfits = ["clothed", "nude", "maid"];
			break;
		case "doe":
			var outfits = ["clothed", "magical", "nude"];
			break;
		case "fashionista":
			var outfits = ["clothed", "magical", "nude"];
			break;
		case "foxf":
		case "foxm":
			var outfits = ["clothed", "nude"];
			break;
		case "hyena":
			var outfits = ["clothed", "nude", "pocket"];
			break;
		case "deity":
			//"feral" is his day-to-day form and the only folder with a full expression set;
			//"nude" is the anthro form, still just a base and a happy until it gets filled in.
			var outfits = ["feral", "nude"];
			break;
		case "trap":
			var outfits = ["clothed"];
			break;
	}
	for (coreIndex = 0; coreIndex < coreCharactersArray.length; coreIndex++) {
		if (coreCharactersArray[coreIndex].index == character) {
			var defaultOutfit = coreCharactersArray[coreIndex].outfit;
			for (outfitIndex = 0; outfitIndex < outfits.length; outfitIndex++) {
				writeHTML(`outfit `+character+` `+outfits[outfitIndex]);
				writeHTML(character+` happy Test Test test test test test test test test test test test<br>test<br>test<br>test<br>test<br>test<br>test
				eval data.player.style = "basic"
				`+character+` Basic style test
				eval data.player.style = "persona"
				`+character+` Persona style test
				eval data.player.style = "royalty"
				`+character+` Vaporwave style test
				eval data.player.style = "lobotomy"
				`+character+` Lobotomy style test
				eval data.player.style = "syrup"
				`);
				//A character who emotes through spirits has no expression set of his own, so showing
				//him every expression would just ask for 36 images that were never drawn. His
				//portrait varies by which spirits are speaking, so test that instead: each one on
				//its own, then all of them stacked at once.
				var hostSpirits = [];
				for (var spiritTestIndex = 0; spiritTestIndex < spiritArray.length; spiritTestIndex++) {
					if (spiritArray[spiritTestIndex].host == character) {
						hostSpirits.push(spiritArray[spiritTestIndex]);
					}
				}
				if (hostSpirits.length > 0) {
					for (spiritTestIndex = 0; spiritTestIndex < hostSpirits.length; spiritTestIndex++) {
						writeHTML(character+` Test line, spoken with `+hostSpirits[spiritTestIndex].index+` alongside.
						`+hostSpirits[spiritTestIndex].index+` Test`);
					}
					var everySpiritTest = character+` Test line, spoken with every spirit at once.`;
					for (spiritTestIndex = 0; spiritTestIndex < hostSpirits.length; spiritTestIndex++) {
						everySpiritTest += `
						`+hostSpirits[spiritTestIndex].index+` Test`;
					}
					writeHTML(everySpiritTest);
					//A block that opens on a spirit, so the host stays silent and carries their voices
					writeHTML(hostSpirits[0].index+` Test line with no host line above it.`);
					continue;
				}
				//Walks expressionArray, the set the engine actually resolves dialogue against.
				//This used to walk emotionArray, a fifteen-name list predating the current
				//expressions, which left most of a character's set untested — for deity that was
				//23 of his 37 images never once shown.
				for (emotionIndex = 0; emotionIndex < expressionArray.length; emotionIndex++) {
					if (expressionArray[emotionIndex].index != "happy") {
						var printLine = true;
						//Three expressions are only drawn for some of the cast; everything else in
						//expressionArray exists for anyone with a model, so it prints unconditionally.
						for (var partialIndex = 0; partialIndex < partialExpressions.length; partialIndex++) {
							if (partialExpressions[partialIndex].index == expressionArray[emotionIndex].index
								&& partialExpressions[partialIndex].characters.includes(character) == false) {
								printLine = false;
							}
						}
						if (printLine == true) {
							writeHTML(character+` `+expressionArray[emotionIndex].index+ ` Test`);
						}
					}
				}
			}
		}
	}
	writeHTML(`outfit `+character+` `+defaultOutfit);
	writeHTML(`trans cancel; Finish`)
}

function writeQuoRepeats() {
	document.getElementById(HTMLContainer).innerHTML += `
		<div id="wardrobeGrid" style="display:grid; grid-template-columns:repeat(var(--wardrobe-cols, 3), 1fr);">
		</div>
	`;
	//Go through global event array to find all events involving this character and have repeat in the name
	for (characterIndex = 0; characterIndex < globalEventArray.length; characterIndex++) {
		if (globalEventArray[characterIndex].index == data.player.currentCharacter) {
			//console.info(globalEventArray[characterIndex].index);
			for (eventIndexCounter = 0; eventIndexCounter < globalEventArray[characterIndex].events.length; eventIndexCounter++) {
				if (globalEventArray[characterIndex].events[eventIndexCounter].index.includes("repeat")) {
					var printButton = true;
					console.log(globalEventArray[characterIndex].events[eventIndexCounter].index);
					if (globalEventArray[characterIndex].events[eventIndexCounter].requirements) {
						var finalRequirements = globalEventArray[characterIndex].events[eventIndexCounter].requirements
					}
					else {
						var finalRequirements = "";
					}
					var sceneEarned = galleryCheck(data.player.currentCharacter, globalEventArray[characterIndex].events[eventIndexCounter].index) == true;
					if (sceneEarned != true) {
						var onClickEncounter = globalEventArray[characterIndex].events[eventIndexCounter].index+"First";
					}
					else {
						var onClickEncounter = globalEventArray[characterIndex].events[eventIndexCounter].index+"Repeat";
					}
					//console.info(globalEventArray[characterIndex]);
					if (fetishes(globalEventArray[characterIndex].events[eventIndexCounter].tags) == false) {
						printButton = false;
					}
					if (printButton == true) {
						//A scene the player already unlocked in the gallery stays replayable even
						//if its requirements no longer pass on this save (rebalanced trust
						//thresholds, flags that older versions never granted) — otherwise earned
						//content shows up as a locked mystery tile with no way to re-earn it.
						if (checkRequirements(finalRequirements) == true || sceneEarned == true) {
							//console.info(globalEventArray[characterIndex]);
							thumbnailImage = cleanupImage(globalEventArray[characterIndex].events[eventIndexCounter].image);
							if (galleryCheck(globalEventArray[characterIndex].index, globalEventArray[characterIndex].events[eventIndexCounter].index) != true) {
								var finalBrightness = 20;
							}
							else {
								var finalBrightness = 100;
							}
							document.getElementById('wardrobeGrid').innerHTML += `
								<img class="gridPicture" style="filter:brightness(`+finalBrightness+`%);cursor:pointer;"
								id="wardrobe`+globalEventArray[characterIndex].events[eventIndexCounter].index+`" 
								src="` + thumbnailImage + `"
								onclick="writeScene('`+data.player.currentCharacter+`', '`+onClickEncounter+`')">
							`;
						}
						else {
							thumbnailImage = cleanupImage("jiggy/secret");
							document.getElementById('wardrobeGrid').innerHTML += `
								<img class="gridPicture" 
								id="wardrobe`+globalEventArray[characterIndex].events[eventIndexCounter].index+`" 
								src="` + thumbnailImage + `"
								style="filter:brightness(20%);cursor:auto;">
							`;
						}
					}
				}
			}
		}
	}
}


function generateOnahole() {
	document.getElementById(HTMLContainer).innerHTML = '';
	var finalOverlay = "";
	for (characterIndex = 0; characterIndex < data.story.length; characterIndex++) {
		console.info("Character "+data.story[characterIndex].index+" has hole finish "+checkFlag(data.story[characterIndex].index, "holeFinish"));
		if (checkFlag(data.story[characterIndex].index, "holeFinish") == true) {
			finalOverlay += "overlay:"+cleanupImage("artifacts/holes/"+data.story[characterIndex].index)+"#";
		}
	}
	if (data.player.vegetarian == true) {
		finalOverlay += "overlay:artifacts/shelf-noMeat#";
	}
	if (data.player.carnivore == true) {
		finalOverlay += "overlay:artifacts/shelf-noVeggie#";
	}
	console.info(finalOverlay);
	writeBig("artifacts/shelfEmpty", finalOverlay);
	document.getElementById(HTMLContainer).innerHTML += `
		<div id="wardrobeGrid" style="display:grid; grid-template-columns:repeat(var(--wardrobe-cols, 3), 1fr);">
		</div>
	`;
	var endingString = "";
	for (characterIndex = 0; characterIndex < data.story.length; characterIndex++) {
		var displayEvent = true;
		if (data.player.vegetarian == true) {
			if (data.story[characterIndex].gender == "male") {
				displayEvent = false;
			}
		}
		if (data.player.carnivore == true) {
			if (data.story[characterIndex].gender == "female") {
				displayEvent = false;
			}
		}
		if (data.player.characterWhitelist.includes(data.story[characterIndex].index) == true) {
			displayEvent = true;
		}
		if (data.player.characterBlacklist.includes(data.story[characterIndex].index) == true) {
			displayEvent = false;
		}
		if (displayEvent == true) {
			if (checkFlag("shop", "holeFinish") != true) {
				addFlag("shop", "holeReady");
			}
			if (checkFlag(data.story[characterIndex].index, "holeFinish") == true || checkFlag(data.story[characterIndex].index, "holeReady") == true) {
				thumbnailImage = cleanupImage(data.story[characterIndex].index+"/hole00");
				document.getElementById('wardrobeGrid').innerHTML += `
					<img class="gridPicture" 
					id="wardrobe`+data.story[characterIndex].index+`" 
					src="` + thumbnailImage + `"
					onclick="writeScene('`+data.story[characterIndex].index+`', 'hole-`+data.story[characterIndex].index+`')">
				`;
			}
			else {
				thumbnailImage = cleanupImage("jiggy/secret");
				var endingString = "t There are still characters you can ask about using the onahole..."
			}
		}
	}
}

function equipPill() {
	wearClothesByName("Supercharged Balls");
	removeFlag('player', 'pill-random1');
	removeFlag('player', 'pill-random2');
	data.player.pillCounter = 0;
}

function checkWatch() {
	if (data.player.holiday != "pill") {
		if (checkWearing("Supercharged Balls") == true) {
			//Used to be taken off by swapping the lowerwear slot back to its empty sentinel, which
			//only worked while the balls counted as trousers. They are a body layer now.
			removeClothesByName("Supercharged Balls");
		}
	}
	switch (data.player.holiday) {
		case "watch": {
			var finalScene = "watch-random1";
			if (checkFlag("player", "watch-random") == true) {
				finalScene = "watch-random2";
			}
			writeSpeech("Time Stopwatch", cleanupImage("artifacts/watch1"), `
				<p class="textContentSyrup switch" onclick="writeScene('system', '`+finalScene+`')">Check the Watch</p>
			`, "", data.player.color, ""
			);
			break;
		}
		case "pill": {
			if (data.player.pillCounter == null) {
				data.player.pillCounter = 0;
			}
			var color = "background-color: red;";
			if (data.player.pillCounter > 10) {
				color = "background-image: linear-gradient(to right, red, orange);";
			}
			if (data.player.pillCounter > 40) {
				color = "background-image: linear-gradient(to right, red, orange, yellow);";
			}
			if (data.player.pillCounter > 70) {
				color = "background-image: linear-gradient(to right, red, orange, yellow, white);";
			}
			if (data.player.pillCounter == 100) {
				color = "background-color: #FFFFFF;";
			}
			writeSpeech("Sperm Levels", cleanupImage("artifacts/pills/pill-equip1-light"), `
				<div class="progressBar" style="background-color: #565656;border-radius: 13px;padding: 3px;min-width:30vw;">
					<div style="`+color+`width: `+data.player.pillCounter+`%;height: 20px;border-radius: 10px;"></div>
				</div>
				<p>`+data.player.pillCounter+` / `+100+`</p>
			`, "", data.player.color, ""
			);
			if (data.player.pillCounter == 100) {
				var finalScene = "pill-random1";
				if (checkFlag("player", "pill-random1") == true) {
					finalScene = "pill-random2";
				}
				if (checkFlag("player", "pill-random2") == true) {
					finalScene = "pill-fail";
				}
				writeScene("system", finalScene);
				data.player.pillCounter = 0;
			}
			else {
				data.player.pillCounter += 20;
			}
			break;
		}
	}
}

var tvScene = "";
function checkTV() {
	var legalSceneArray = [];
	for (var sceneIndex = 0; sceneIndex < globalEventArray[0].events.length; sceneIndex++) {
		if (globalEventArray[0].events[sceneIndex].index.includes("-telly-")) {
			if (checkRequirements(globalEventArray[0].events[sceneIndex].requirements) == true && galleryCheck('player', globalEventArray[0].events[sceneIndex].index) == false) {
				if (globalEventArray[0].events[sceneIndex].name != "mini") {
					legalSceneArray.push(globalEventArray[0].events[sceneIndex].index)
				}
			}
		}
	}
	if (legalSceneArray.length == 0) {
		for (var sceneIndex = 0; sceneIndex < globalEventArray[0].events.length; sceneIndex++) {
			if (globalEventArray[0].events[sceneIndex].index.includes("-telly-")) {
				if (!globalEventArray[0].events[sceneIndex].tags) {
					globalEventArray[0].events[sceneIndex].tags = "";
				}
				if (checkRequirements(globalEventArray[0].events[sceneIndex].requirements) == true && checkFlag('player', globalEventArray[0].events[sceneIndex].index) == false && fetishes(globalEventArray[0].events[sceneIndex].tags) == true) {
						legalSceneArray.push(globalEventArray[0].events[sceneIndex].index)
				}
			}
		}
	}
	if (legalSceneArray.length == 0) {
		tvScene = "";
	}
	else {
		tvScene = legalSceneArray[Math.floor(Math.random() * legalSceneArray.length)];
	}
	if (tvScene != "") {
		addFlag("player", "tvNew");
	}
	else {
		removeFlag("player", "tvNew");
	}
}

function watchTV(){
	if (tvScene != "") {
		writeEvent("player", tvScene);
		addFlag("player", tvScene);
	}
	else {
		writeHTML(`
			t Commercial placeholder
			finish
		`)
	}
	removeFlag("player", "tvNew");
}

function rerunTV(){
	document.getElementById(HTMLContainer).innerHTML += `
		<div id="wardrobeGrid" style="display:grid; grid-template-columns:repeat(var(--wardrobe-cols, 3), 1fr);">
		</div>
	`;
	for (var sceneIndex = 0; sceneIndex < globalEventArray[0].events.length; sceneIndex++) {
		if (globalEventArray[0].events[sceneIndex].index.includes("-telly-")) {
			if (checkFlag('player', globalEventArray[0].events[sceneIndex].index) == true && fetishes(globalEventArray[0].events[sceneIndex].tags) == true) {
			console.info(globalEventArray[0].events[sceneIndex].index);
				document.getElementById('wardrobeGrid').innerHTML += `
					<img class="bigPicture" id="wardrobe`+globalEventArray[0].events[sceneIndex].index+`" src="` + cleanupImage(globalEventArray[0].events[sceneIndex].image) + `"
					onclick="galleryEvent('`+globalEventArray[0].index+`','`+globalEventArray[0].events[sceneIndex].index+`')",
					onmouseover="wardrobeMouseOver('wardrobe`+globalEventArray[0].events[sceneIndex].index+`')"
					onmouseout="wardrobeMouseOut('wardrobe`+globalEventArray[0].events[sceneIndex].index+`')"
					style="filter:brightness(50%);max-height:initial;width:100%;">
				`;
			}
		}
	}
}