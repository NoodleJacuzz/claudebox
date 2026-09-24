//===================================================================================================
//HONEYCOMB CATACOMBS -- sprite fit audit (developer tool, never loaded by the game)
//===================================================================================================
//Which enemies are drawn partly off the screen, in every encounter, at whatever window shape is being
//tested. Built 2026-09-21 for the root FEEDBACK inbox items IN-4 ("Soakcap's sprite is gigantic") and
//IN-5 ("The Pale Dray doesn't fit on the dang screen"), both of which were reported by eye and both of
//which turned out to understate the problem -- the Head Gardener is cut off far worse than either.
//
//WHAT DECIDES A SPRITE'S SIZE. `presentation.scale` on the enemy's content-table entry, multiplied
//through the battle layout. There is no clamp anywhere that keeps the result inside the stage, so a
//scale that looks right in one window shape hangs off the top or the side in another. This tool is the
//measurement that tells the difference; a screenshot cannot, because a sprite cut off at the top still
//looks deliberate.
//
//Use, in the Browser pane with the dev server running:
//  1. Load the game, then load this file into the page (it does not survive a reload):
//       await new Promise(r=>{var s=document.createElement('script');s.src='/!designDocs/honeycomb/tools/audit-sprite-fit.js?'+Date.now();s.onload=r;document.head.appendChild(s);})
//  2. await hcSpriteFit.run()                 -- every encounter, at the window's current size
//     await hcSpriteFit.run({ party: 1 })     -- a solo party, which widens each sprite's share
//     await hcSpriteFit.run({ only: ["drayRoad"] })
//  3. hcSpriteFit.table()                     -- the last run, worst first
//
//READING THE RESULT. `topCut` is pixels of the drawing above the top of the window, and it is the one
//that reads as a bug to a player: a boss loses its head. `leftCut` and `rightCut` are pixels past the
//sides, which read instead as crowding. Anything over about 20px was visible to Noodle unprompted;
//below that it is usually a wing tip and worth leaving alone.
//
//A BIGGER WINDOW MAKES IT WORSE, not better (measured 2026-09-21). At 1878x804 the Head Gardener is
//453px over the top; at 1920x1080 she is 606px over. Sprite size follows the viewport while the stage
//it stands on does not, so testing at one window shape proves nothing about another -- run this at the
//shape being asked about.
//
//THE TWO GAUNTLET FIGHTS REPORT AN ERROR RATHER THAN A RESULT. They put their pieces on the board by
//summoning them, so the line-up on screen is never the line-up the encounter names and the wait below
//can never confirm the scene. That is the tool refusing to guess, not a fault in the fight.
//
//THE RUN IS DESTRUCTIVE TO THE CURRENT RUN STATE. It starts a fresh profile per encounter, so take
//hcSpriteFit.backup() first if a save in progress matters, and hcSpriteFit.restore() afterwards.
window.hcSpriteFit = {
	//The party a measurement fields. Three is what most of Act 1 is played with; a smaller party gives
	//each surviving sprite more room, so it is the kinder of the two tests rather than the harsher one.
	defaultPartyArray: ["severine", "brienne", "nettle"],
	//A FIXED WAIT IS NOT ENOUGH, and getting this wrong reads as a pass (2026-09-21). The first build of
	//this tool waited 260ms and then measured whatever was on screen. At that point the combat scene has
	//often not swapped yet, so it measured the PREVIOUS encounter's line-up and filed the result under
	//this encounter's name -- every row was a real measurement of a real sprite, attached to the wrong
	//fight. The measurement now waits until the sprites on screen are the ones this encounter fields,
	//and reports a row it could never confirm rather than guessing.
	pollMilliseconds: 60,
	settleMilliseconds: 240,
	timeoutMilliseconds: 4000,
	lastResultArray: [],

	backup: function () {
		window.__hcSpriteFitSave = JSON.stringify(honeycomb.state == null ? null : honeycomb.state);
		return "saved";
	},
	restore: function () {
		if (window.__hcSpriteFitSave == null) return "nothing saved";
		honeycomb.state = JSON.parse(window.__hcSpriteFitSave);
		return "restored";
	},

	partyArray: function (count) {
		var nameArray = hcSpriteFit.defaultPartyArray.slice(0, count == null ? hcSpriteFit.defaultPartyArray.length : count);
		return nameArray.map(function (characterIndex) {
			return { characterIndex: characterIndex, outfitIndex: "default" };
		});
	},

	//The enemy sprites on screen right now, as {enemyIndex: element}. Reading the enemy off the image
	//source rather than off the combat state is deliberate: it is what makes a stale scene detectable.
	onScreenArray: function () {
		var found = [];
		var artArray = document.querySelectorAll("img.hcFighterArt");
		for (var scanIndex = 0; scanIndex < artArray.length; scanIndex++) {
			var art = artArray[scanIndex];
			if (art.src.indexOf("/enemies/") < 0) continue;
			if (art.complete !== true || art.naturalWidth <= 0) continue;
			found.push({ enemyIndex: art.src.split("/enemies/")[1].split("/")[0], element: art });
		}
		return found;
	},

	//One encounter, measured. Returns a row per enemy sprite that leaves the window on any side.
	measure: async function (encounterIndex, partyArray) {
		var encounter = honeycomb.findDefinition(honeycomb.encounterArray, encounterIndex);
		honeycomb.state = honeycomb.newProfile();
		honeycomb.newRun(partyArray, 42);
		try {
			honeycomb.combat.begin(encounterIndex, {});
		} catch (error) {
			return [{ encounterIndex: encounterIndex, error: String(error).slice(0, 120) }];
		}
		honeycomb.scene.go("combat");

		//Wait for the scene to actually be THIS fight. Every enemy the encounter names must have a loaded
		//sprite on screen, and nothing may be on screen that the encounter does not name.
		var wanted = {};
		for (var wantIndex = 0; wantIndex < encounter.enemyIndexArray.length; wantIndex++) wanted[encounter.enemyIndexArray[wantIndex]] = true;
		var waited = 0;
		var found = [];
		while (waited < this.timeoutMilliseconds) {
			found = this.onScreenArray();
			var settled = found.length > 0;
			for (var checkIndex = 0; checkIndex < found.length; checkIndex++) if (wanted[found[checkIndex].enemyIndex] !== true) settled = false;
			for (var name in wanted) if (!found.some(function (one) { return one.enemyIndex === name; })) settled = false;
			if (settled) break;
			await new Promise(function (resolve) { setTimeout(resolve, hcSpriteFit.pollMilliseconds); });
			waited += this.pollMilliseconds;
		}
		if (waited >= this.timeoutMilliseconds) {
			return [{ encounterIndex: encounterIndex, error: "scene never showed this line-up (saw " +
				found.map(function (one) { return one.enemyIndex; }).join(",") + ")" }];
		}
		//Settled means the right sprites are up; they are still being placed for a frame or two after.
		await new Promise(function (resolve) { setTimeout(resolve, hcSpriteFit.settleMilliseconds); });

		var rowArray = [];
		found = this.onScreenArray();
		for (var rowIndex = 0; rowIndex < found.length; rowIndex++) {
			var rect = found[rowIndex].element.getBoundingClientRect();
			var topCut = Math.max(0, Math.round(-rect.top));
			var leftCut = Math.max(0, Math.round(-rect.left));
			var rightCut = Math.max(0, Math.round(rect.right - window.innerWidth));
			if (topCut === 0 && leftCut === 0 && rightCut === 0) continue;
			var definition = honeycomb.findDefinition(honeycomb.enemyArray, found[rowIndex].enemyIndex);
			rowArray.push({
				encounterIndex: encounterIndex,
				enemyIndex: found[rowIndex].enemyIndex,
				name: definition == null ? found[rowIndex].enemyIndex : definition.name,
				scale: definition != null && definition.presentation != null && definition.presentation.scale != null ? definition.presentation.scale : 1,
				topCut: topCut, leftCut: leftCut, rightCut: rightCut,
				width: Math.round(rect.width), height: Math.round(rect.height),
			});
		}
		return rowArray;
	},

	run: async function (options) {
		var settings = options == null ? {} : options;
		var partyArray = this.partyArray(settings.party);
		var wantedArray = settings.only == null ? null : settings.only;
		var resultArray = [];
		for (var scanIndex = 0; scanIndex < honeycomb.encounterArray.length; scanIndex++) {
			var encounter = honeycomb.encounterArray[scanIndex];
			if (wantedArray != null && wantedArray.indexOf(encounter.index) < 0) continue;
			var rowArray = await this.measure(encounter.index, partyArray);
			for (var rowIndex = 0; rowIndex < rowArray.length; rowIndex++) {
				rowArray[rowIndex].tier = encounter.tier;
				resultArray.push(rowArray[rowIndex]);
			}
		}
		resultArray.sort(function (left, right) {
			return hcSpriteFit.worst(right) - hcSpriteFit.worst(left);
		});
		this.lastResultArray = resultArray;
		return { viewport: window.innerWidth + "x" + window.innerHeight, party: partyArray.length,
			encountersMeasured: wantedArray == null ? honeycomb.encounterArray.length : wantedArray.length,
			clipping: resultArray.length };
	},

	worst: function (row) {
		//The top cut is weighted above the side cuts on purpose: a sprite past the side edge is crowded,
		//a sprite past the top edge has lost part of the drawing and reads as broken.
		return (row.topCut || 0) * 2 + (row.leftCut || 0) + (row.rightCut || 0);
	},

	table: function () {
		var lineArray = ["encounter              enemy                scale  top  left right   w    h"];
		for (var scanIndex = 0; scanIndex < this.lastResultArray.length; scanIndex++) {
			var row = this.lastResultArray[scanIndex];
			if (row.error != null) { lineArray.push(row.encounterIndex + "  ERROR " + row.error); continue; }
			lineArray.push(
				(row.encounterIndex + "                      ").slice(0, 23) +
				(row.name + "                     ").slice(0, 21) +
				(" " + row.scale + "    ").slice(0, 6) +
				String(row.topCut).padStart(5) + String(row.leftCut).padStart(5) +
				String(row.rightCut).padStart(6) + String(row.width).padStart(5) + String(row.height).padStart(5));
		}
		return lineArray.join("\n");
	},
};
