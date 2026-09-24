//===================================================================================================
//HONEYCOMB CATACOMBS -- card fit audit (developer tool, never loaded by the game)
//===================================================================================================
//Round 06, item 7: "At small card size, only the card name is displayed [...] Unstandardized cases like
//these will DESTROY THE GAME." This draws EVERY card, at every upgrade level of every path, at each of
//the three card sizes, and reports any printed line that does not fit its box: the name (wider or taller
//than its band), the supertype row (wider than the card), the supertype icons of a small horizontal card
//(wider than the card or past its foot), the rules text (taller than its box).
//
//Card text is sized in card units, so a card is the same picture at any width; the audit is still run at
//real widths because rounding at a phone's scale is where a line that only just fits stops fitting.
//
//Use, in the Browser pane with the dev server running (any scene; nothing is saved or changed):
//  1. Load it into the page (it does not survive a reload):
//       await new Promise(r=>{var s=document.createElement('script');s.src='/!designDocs/honeycomb/tools/audit-card-fit.js?'+Date.now();s.onload=r;document.head.appendChild(s);})
//  2. hcCardFit.run()  -- returns {count, small: [...], medium: [...], large: [...]}; every list empty is a pass.
//  3. Repeat at a phone viewport (resize_window 812x375) before calling a change done.
//  4. hcCardFit.clear() removes the test sheet.
//A failure names the card and the part: "neutralHedge:text". Fix it in tuning.art.cardFrame (textFit,
//supertypeFit) or a size's nameFit (tuning.art.cardSize), not by editing the card.
window.hcCardFit = {
	//Widths each size is drawn at, in honeycomb pixels: the narrowest each is actually shown at in the game.
	widthArray: [
		{ size: "small", widthPixels: 60 },
		{ size: "medium", widthPixels: 127 },
		{ size: "large", widthPixels: 300 },
	],
	//A card with four supertypes and a long name, the worst case the warning report still allows.
	worstCaseCard: { index: "hcCardFitWorstCase", name: "Everything Everywhere", costArray: { energy: 3 },
		targetMode: "enemy", effectArray: [], typeArray: ["damage", "negative", "lewd", "support"] },

	sheet: function () {
		var host = document.getElementById("hcCardFitSheet");
		if (host != null) return host;
		host = document.createElement("div");
		host.id = "hcCardFitSheet";
		host.style.cssText = "position:fixed;inset:0;overflow:auto;z-index:99999;display:flex;flex-wrap:wrap;" +
			"align-content:flex-start;gap:8px;padding:8px;background:#222";
		document.getElementById("honeycombOverlayHost").appendChild(host);
		return host;
	},

	formArray: function () {
		var formArray = [];
		honeycomb.cardArray.forEach(function (card) {
			formArray.push({ cardIndex: card.index });
			var pathArray = honeycomb.cardUpgradePathArray(card);
			var ladderArray = pathArray.length > 0 ? pathArray.map(function (path) { return path.index; }) : [null];
			ladderArray.forEach(function (pathIndex) {
				for (var level = 1; level <= honeycomb.cardUpgradeArray(card, pathIndex).length; level++) {
					formArray.push({ cardIndex: card.index, upgradeLevel: level, upgradePath: pathIndex });
				}
			});
		});
		return formArray;
	},

	run: function () {
		var sheet = hcCardFit.sheet();
		honeycomb.cardArray.push(hcCardFit.worstCaseCard);
		var report = {};
		try {
			var formArray = hcCardFit.formArray();
			report.count = formArray.length;
			hcCardFit.widthArray.forEach(function (entry) {
				sheet.innerHTML = formArray.map(function (form) {
					return '<div style="width:calc(' + entry.widthPixels + ' * var(--hc-px))">' +
						honeycomb.ui.card(honeycomb.resolveCard(form), { size: entry.size, showTooltip: false }) + "</div>";
				}).join("");
				var failArray = [];
				sheet.querySelectorAll(".hcCard").forEach(function (card) {
					var id = card.dataset.hccardindex;
					var text = card.querySelector(".hcCardTextBody");
					if (text && text.scrollHeight > text.parentElement.clientHeight + 1) failArray.push(id + ":text");
					var name = card.querySelector(".hcCardNameText");
					if (name && (name.scrollWidth > name.parentElement.clientWidth + 1 ||
						name.scrollHeight > name.parentElement.clientHeight + 1)) failArray.push(id + ":name");
					var row = card.querySelector(".hcCardSupertypeRow");
					if (row && row.scrollWidth > row.clientWidth + 1) failArray.push(id + ":supertypes");
					var icons = card.querySelector(".hcCardSupertypeIcons");
					if (icons && (icons.scrollWidth > icons.clientWidth + 1 ||
						icons.getBoundingClientRect().bottom > card.getBoundingClientRect().bottom + 1)) failArray.push(id + ":supertypeIcons");
				});
				report[entry.size] = failArray;
			});
		} finally {
			honeycomb.cardArray.splice(honeycomb.cardArray.indexOf(hcCardFit.worstCaseCard), 1);
		}
		return report;
	},

	clear: function () {
		var sheet = document.getElementById("hcCardFitSheet");
		if (sheet != null) sheet.remove();
	},
};
