//===================================================================================================
//HONEYCOMB CATACOMBS -- the progression tree, drawn inside the teambuilding Progression tab
//===================================================================================================
//A character's tree, DESCENDING: the root at the top, each step further down, drawn inside the tab
//where the column is narrow and tall, so the authored coordinates are turned on their side. A node's
//`x` (how far along the tree) becomes its height and its `y` (how far across) its place between the
//column's margins. `y` is spread across the tree's own extent; `x` keeps a FIXED vertical step, so depth
//is where a node was authored and the canvas grows taller rather than packing denser.
//(The file keeps its old name so the page's script tags need not change.)
//
//INPUT, now that a node can hold several ranks:
//  click / tap              buy the next rank; on a node that cannot be bought yet, light the way to it
//  right-click / long press give ONE rank back (refunded to the pool that paid for it)
//A long press is a timer on pointerdown, cancelled by pointerup, leaving, or the browser taking the
//touch over for a scroll. Every handler is an inline attribute on the node: no document listener.
//
//HOVER lights the shortest route(s) to a node whose prerequisites are missing and shows its tooltip.
//On touch, a tap on such a node does the same, since a tap there can buy nothing.
//
//Every change rebuilds the whole teambuilding scene -- health, cards and tags on it may all move --
//and the kernel keeps each `data-hcScrollKey` panel's scroll position across the rebuild.
window.honeycomb = window.honeycomb || {};

honeycomb.progressionScreen = {
	//Whose tree is on show. Set on every render.
	characterIndex: null,
	//A one-line message about the last change: a refund, a refusal, a rank given back.
	noticeText: null,
	//The node whose route is lit because it was TAPPED, so it stays lit after the finger lifts.
	pinnedPathIndex: null,
	//The press in progress: {nodeIndex, timer, fired}.
	press: null,
};

//The selection this tree is editing: the party slot if the character is fielded, otherwise their
//remembered loadout. Editing must work before a run exists.
honeycomb.progressionScreen.selection = function () {
	var characterIndex = honeycomb.progressionScreen.characterIndex;
	if (honeycomb.teambuilding != null && honeycomb.teambuilding.loadoutFor != null) {
		return honeycomb.teambuilding.loadoutFor(characterIndex);
	}
	var definition = honeycomb.findDefinition(honeycomb.characterArray, characterIndex);
	return {
		characterIndex: characterIndex,
		outfitIndex: definition == null ? null : definition.defaultOutfit,
		equipmentArray: [],
	};
};

//---------------------------------------------------------------------------------------------------
//The tab
//---------------------------------------------------------------------------------------------------
honeycomb.progressionScreen.renderTab = function (characterIndex) {
	if (honeycomb.progressionScreen.characterIndex != characterIndex) {
		honeycomb.progressionScreen.noticeText = null;
		honeycomb.progressionScreen.pinnedPathIndex = null;
	}
	honeycomb.progressionScreen.characterIndex = characterIndex;
	var selection = honeycomb.progressionScreen.selection();
	var definition = honeycomb.findDefinition(honeycomb.characterArray, characterIndex);
	var tree = honeycomb.progression.treeFor(selection);
	if (definition == null || tree == null) return '<div class="hcTabNote">No progression yet.</div>';

	var viewArray = honeycomb.progression.viewArray(selection);
	var takenCount = 0;
	var openCount = 0;
	for (var scanIndex = 0; scanIndex < viewArray.length; scanIndex++) {
		if (viewArray[scanIndex].selected) takenCount += 1;
		if (viewArray[scanIndex].available) openCount += 1;
	}

	var markup = '<div class="hcTreeTab" style="--hcAccent:' + definition.colorHint + '">';

	//THE TWO POOLS, side by side and never summed: this character's own, then the global one. The
	//order is the order a node spends them in.
	markup += '<div class="hcTreePools">' +
		honeycomb.ui.personalExperienceChip(characterIndex, selection.outfitIndex) +
		honeycomb.ui.globalExperienceChip() + "</div>";
	markup += '<div class="hcTreeSummaryLine hcTiny hcMuted">' + takenCount + " taken &middot; " +
		openCount + " open &middot; " + honeycomb.progression.spentOn(characterIndex) + " invested</div>";

	if (honeycomb.progressionScreen.noticeText != null) {
		markup += '<div class="hcTreeNotice">' + honeycomb.escapeText(honeycomb.progressionScreen.noticeText) + "</div>";
	}

	//The stage scrolls sideways when the column is narrower than the narrowest tree (see fitToStage); the
	//canvas inside it is what scrolls, so the mood art travels with the nodes rather than staying put.
	markup += '<div class="hcTreeTabStage" data-hcScrollKey="tree-' + honeycomb.escapeAttribute(characterIndex) + '">';
	markup += '<div class="hcTreeCanvas">';
	markup += '<div class="hcTreeBackground">' +
		honeycomb.imageTag(tree.backgroundPath,
			{ className: "hcTreeBackgroundArt", alt: "", silentFallback: true }) + "</div>";
	markup += honeycomb.progressionScreen.renderGraph(selection, viewArray, honeycomb.tuning.progression.treeView.width);
	markup += "</div></div>";

	markup += '<div class="hcTreeHint hcTiny hcDim">Tap to take &middot; right-click or hold to give back</div>';
	markup += '<div class="hcButton hcTreeResetButton" onclick="honeycomb.progressionScreen.reset()">Reset choices</div>';
	markup += "</div>";
	return markup;
};

//THE TREE IS LAID OUT FOR THE COLUMN IT IS IN. One SVG unit is always one honeycomb pixel, so nodes and
//names are the same size as the rest of the interface everywhere, and the nodes are spread across
//however wide the column really is. Below tuning's treeView.width the tree stops narrowing and the
//stage scrolls sideways instead.
//
//The column's width is only known once the scene is on the page, so the tab is first drawn at the
//narrowest width and this redraws the graph at the real one. Called after every teambuilding build.
honeycomb.progressionScreen.fitToStage = function () {
	var root = honeycomb.rootElement();
	var stage = root == null ? null : root.querySelector(".hcTreeTabStage");
	var svg = stage == null ? null : stage.querySelector(".hcTreeSvg");
	if (svg == null) return;
	var layout = honeycomb.tuning.progression.treeView;
	var width = Math.max(layout.width, Math.floor(stage.clientWidth / honeycomb.pixelScale()));
	if (Number(svg.getAttribute("data-hcwidth")) == width) return;
	var selection = honeycomb.progressionScreen.selection();
	svg.outerHTML = honeycomb.progressionScreen.renderGraph(selection, honeycomb.progression.viewArray(selection), width);
	if (honeycomb.progressionScreen.pinnedPathIndex != null) {
		honeycomb.progressionScreen.showPath(honeycomb.progressionScreen.pinnedPathIndex);
	}
};

//How tall a tree draws: the deepest `x` times the fixed vertical step. Because the step is fixed rather
//than stretched to a box, adding nodes further down makes the canvas taller instead of packing them
//tighter, so there is always room to scroll and place more.
honeycomb.progressionScreen.treeHeight = function (viewArray) {
	var layout = honeycomb.tuning.progression.treeView;
	var minimumAlong = Infinity, maximumAlong = -Infinity;
	for (var scanIndex = 0; scanIndex < viewArray.length; scanIndex++) {
		var node = viewArray[scanIndex].node;
		minimumAlong = Math.min(minimumAlong, node.x);
		maximumAlong = Math.max(maximumAlong, node.x);
	}
	if (minimumAlong === Infinity) return layout.minimumHeight;
	var height = layout.topMargin + (maximumAlong - minimumAlong) * layout.depthStep + layout.bottomMargin;
	return Math.max(layout.minimumHeight, height);
};

//Where each node sits in the column, in the SVG's own units, for a tree `width` units wide. See the
//header on the turn. `y` is spread across the column; `x` keeps a FIXED vertical step, so a node's
//authored depth is where it lands and the tree's height is whatever the deepest node needs.
honeycomb.progressionScreen.positionArray = function (viewArray, width) {
	var layout = honeycomb.tuning.progression.treeView;
	var minimumAlong = Infinity, maximumAlong = -Infinity, minimumAcross = Infinity, maximumAcross = -Infinity;
	for (var scanIndex = 0; scanIndex < viewArray.length; scanIndex++) {
		var node = viewArray[scanIndex].node;
		minimumAlong = Math.min(minimumAlong, node.x);
		maximumAlong = Math.max(maximumAlong, node.x);
		minimumAcross = Math.min(minimumAcross, node.y);
		maximumAcross = Math.max(maximumAcross, node.y);
	}
	var usableWidth = width - layout.sideMargin * 2;
	var result = {};
	for (var placeIndex = 0; placeIndex < viewArray.length; placeIndex++) {
		var placed = viewArray[placeIndex].node;
		//A tree with every node on one lane centres that lane rather than dividing by 0.
		var across = maximumAcross > minimumAcross ? (placed.y - minimumAcross) / (maximumAcross - minimumAcross) : 0.5;
		result[placed.index] = {
			x: layout.sideMargin + across * usableWidth,
			y: layout.topMargin + (placed.x - minimumAlong) * layout.depthStep,
		};
	}
	return result;
};

//The graph. Edges first, so nodes sit on top of them; each edge is drawn from a prerequisite DOWN into
//the node that names it, and carries both ends as data so a lit route can find it.
//`width` is in SVG units, which are drawn one to a honeycomb pixel.
honeycomb.progressionScreen.renderGraph = function (selection, viewArray, width) {
	var positionArray = honeycomb.progressionScreen.positionArray(viewArray, width);
	var height = honeycomb.progressionScreen.treeHeight(viewArray);

	var markup = '<svg class="hcTreeSvg" id="honeycombTreeSvg" data-hcwidth="' + width + '" viewBox="0 0 ' + width + " " + height +
		'" preserveAspectRatio="xMidYMin meet" style="width:' + honeycomb.cssPixels(width) +
		";height:" + honeycomb.cssPixels(height) + '">';

	markup += '<g class="hcTreeEdges">';
	for (var edgeIndex = 0; edgeIndex < viewArray.length; edgeIndex++) {
		var target = viewArray[edgeIndex];
		var requiresArray = target.node.requiresArray == null ? [] : target.node.requiresArray;
		for (var fromIndex = 0; fromIndex < requiresArray.length; fromIndex++) {
			var fromNodeIndex = honeycomb.progression.requirementIndex(requiresArray[fromIndex]);
			var from = positionArray[fromNodeIndex];
			var to = positionArray[target.node.index];
			if (from == null || to == null) continue;
			//"Walked" once both ends are held; "open" when it is a step the player could take next.
			var fromMet = honeycomb.progression.requirementMet(selection.characterIndex, requiresArray[fromIndex]);
			var walked = target.selected == true && fromMet;
			var open = target.available == true && fromMet;
			var shut = target.reason == "excluded" || target.sealed == true;
			var edgeClass = "hcTreeEdge" + (walked ? " hcWalked" : "") + (open ? " hcOpen" : "") + (shut ? " hcShut" : "");
			var midY = (from.y + to.y) / 2;
			markup += '<path class="' + edgeClass + '" data-hcFrom="' + honeycomb.escapeAttribute(fromNodeIndex) + '"' +
				' data-hcTo="' + honeycomb.escapeAttribute(target.node.index) + '"' +
				' d="M ' + from.x.toFixed(1) + " " + from.y.toFixed(1) +
				" C " + from.x.toFixed(1) + " " + midY.toFixed(1) + ", " +
				to.x.toFixed(1) + " " + midY.toFixed(1) + ", " +
				to.x.toFixed(1) + " " + to.y.toFixed(1) + '"/>';
		}
	}
	markup += "</g>";

	markup += '<g class="hcTreeNodes">';
	for (var nodeIndex = 0; nodeIndex < viewArray.length; nodeIndex++) {
		markup += honeycomb.progressionScreen.renderNode(viewArray[nodeIndex], positionArray[viewArray[nodeIndex].node.index]);
	}
	markup += "</g></svg>";
	return markup;
};

//A node's name over at most two lines, split at the space nearest the middle, so four nodes can sit
//side by side in a narrow column without their names running into each other.
honeycomb.progressionScreen.labelLineArray = function (name) {
	var text = String(name);
	var middle = text.length / 2;
	var best = -1;
	for (var scanIndex = 0; scanIndex < text.length; scanIndex++) {
		if (text.charAt(scanIndex) != " ") continue;
		if (best < 0 || Math.abs(scanIndex - middle) < Math.abs(best - middle)) best = scanIndex;
	}
	return best < 0 ? [text] : [text.slice(0, best), text.slice(best + 1)];
};

honeycomb.progressionScreen.renderNode = function (view, position) {
	if (position == null) return "";
	var layout = honeycomb.tuning.progression.treeView;
	var node = view.node;
	var radius = layout.nodeRadius;

	var classList = "hcTreeNode";
	if (view.selected) classList += " hcSelected";
	if (view.available) classList += " hcAvailable";
	else if (view.reason == "maxed" || view.reason == "taken") classList += " hcMaxed";
	else if (view.reason == "excluded") classList += " hcExcluded";
	else if (view.sealed == true) classList += " hcSealed";
	else classList += " hcLocked";

	var quoted = "'" + node.index + "'";
	var markup = '<g class="' + classList + '" data-hcNode="' + honeycomb.escapeAttribute(node.index) + '"' +
		' transform="translate(' + position.x.toFixed(1) + "," + position.y.toFixed(1) + ')"' +
		' onmouseenter="honeycomb.progressionScreen.onNodeEnter(this,' + quoted + ')"' +
		' onmouseleave="honeycomb.progressionScreen.onNodeLeave()"' +
		' onpointerdown="honeycomb.progressionScreen.onNodePointerDown(event,' + quoted + ')"' +
		' onpointerup="honeycomb.progressionScreen.onNodePointerUp(event,' + quoted + ')"' +
		' onpointerleave="honeycomb.progressionScreen.cancelPress()"' +
		' onpointercancel="honeycomb.progressionScreen.cancelPress()"' +
		' oncontextmenu="return honeycomb.progressionScreen.onNodeContextMenu(event,' + quoted + ')">';

	markup += '<circle class="hcTreeNodePad" r="' + radius + '"/>';
	if (view.available) markup += '<circle class="hcTreeNodeRing" r="' + (radius + 4) + '"/>';

	//HC-PLACEHOLDER: a generated glyph until each node has drawn art. An excluded node shows a lock.
	var iconSize = radius * 1.15;
	var glyph = view.reason == "excluded" ? "key" : (node.glyph == null ? "star" : node.glyph);
	markup += '<image class="hcTreeNodeIcon" x="' + (-iconSize / 2).toFixed(1) + '" y="' + (-iconSize / 2).toFixed(1) +
		'" width="' + iconSize.toFixed(1) + '" height="' + iconSize.toFixed(1) +
		'" href="' + honeycomb.svgToDataUri(honeycomb.ui.glyph(glyph, view.selected ? "#f0d89a" : "#9c8fae", true)) + '"/>';

	//A PATH ABOUT TO BE SHUT wears a red X. It is drawn on EVERY node and hidden by CSS; it shows only
	//while a rival is hovered, as a warning BEFORE the click (see
	//honeycomb.progressionScreen.showExclusionPreview). Committed exclusions and sealed nodes are
	//already legible from their dimmed, dashed pads, so they do not carry the X.
	var cross = radius * 0.92;
	markup += '<path class="hcTreeNodeCross" d="M ' + (-cross).toFixed(1) + " " + (-cross).toFixed(1) +
		" L " + cross.toFixed(1) + " " + cross.toFixed(1) +
		" M " + (-cross).toFixed(1) + " " + cross.toFixed(1) +
		" L " + cross.toFixed(1) + " " + (-cross).toFixed(1) + '"/>';

	//Ranks as pips above the node: filled for each rank held.
	if (view.rankMaximum > 1) {
		var span = (view.rankMaximum - 1) * layout.rankPipGap;
		for (var pipIndex = 0; pipIndex < view.rankMaximum; pipIndex++) {
			markup += '<circle class="hcTreeRankPip' + (pipIndex < view.rank ? " hcHeld" : "") + '"' +
				' cx="' + (-span / 2 + pipIndex * layout.rankPipGap).toFixed(1) + '"' +
				' cy="' + (-radius - layout.rankPipGap).toFixed(1) + '" r="' + layout.rankPipRadius + '"/>';
		}
	}

	var lineArray = honeycomb.progressionScreen.labelLineArray(node.name);
	var labelTop = radius + layout.labelOffset;
	markup += '<text class="hcTreeNodeName" y="' + labelTop + '">';
	for (var lineIndex = 0; lineIndex < lineArray.length; lineIndex++) {
		markup += '<tspan x="0" dy="' + (lineIndex === 0 ? 0 : layout.labelLineHeight) + '">' +
			honeycomb.escapeText(lineArray[lineIndex]) + "</tspan>";
	}
	markup += "</text>";
	//The price of the next rank, under the name, while there is a next rank to buy.
	if (view.rank < view.rankMaximum && view.reason != "excluded" && view.sealed != true) {
		markup += '<text class="hcTreeNodeCost" y="' + (labelTop + lineArray.length * layout.labelLineHeight) + '">' +
			honeycomb.progressionScreen.priceLabel(view.cost) + "</text>";
	}

	markup += "</g>";
	return markup;
};

//---------------------------------------------------------------------------------------------------
//The node tooltip
//---------------------------------------------------------------------------------------------------
honeycomb.tooltipKindArray.push({
	index: "treeNode",
	//The tree reads downward and the lit route to a node comes from above it, so this panel hangs BELOW
	//its node by preference and only flips above when there is no room.
	preferBelow: true,
	render: function (key) {
		var selection = honeycomb.progressionScreen.selection();
		var view = honeycomb.progressionScreen.viewFor(selection, key);
		if (view == null) return "";
		var node = view.node;
		var aside = view.rankMaximum > 1 ? "Rank " + view.rank + " / " + view.rankMaximum : (view.selected ? "Taken" : "");
		var markup = honeycomb.tooltip.heading(node.name, view.selected ? "#f0d89a" : "#efe4cf", aside);
		if (node.description != null) {
			markup += '<div class="hcTooltipBody">' + honeycomb.progressionScreen.nodeDescriptionMarkup(node) + "</div>";
		}
		if (view.rank < view.rankMaximum) {
			markup += '<div class="hcTooltipNote">' + honeycomb.escapeText(
				honeycomb.progressionScreen.costSentence(selection.characterIndex, view.cost)) + "</div>";
		}
		var refusal = view.available ? "" : honeycomb.progression.describeRefusal(view);
		if (refusal !== "") markup += '<div class="hcTooltipNote hcTooltipWarning">' + honeycomb.escapeText(refusal) + "</div>";
		//The cost of the choice, in WORDS. The X only shows if the tooltip is not sitting over the
		//branch it marks; this sentence is always visible whenever the tooltip is.
		var shutArray = honeycomb.progressionScreen.shutBranch(selection, key);
		if (shutArray.length > 0) {
			var shutNameArray = [];
			for (var shutIndex = 0; shutIndex < shutArray.length; shutIndex++) {
				var shut = honeycomb.progression.findNode(selection, shutArray[shutIndex]);
				if (shut != null) shutNameArray.push(shut.name);
			}
			if (shutNameArray.length > 0) {
				markup += '<div class="hcTooltipNote hcTooltipWarning">Taking this locks off: ' +
					honeycomb.escapeText(shutNameArray.join(", ")) + "</div>";
			}
		}
		if (view.reason == "unreachable" && view.sealed != true) {
			var route = honeycomb.progression.pathTo(selection, node.index);
			if (route != null) {
				markup += '<div class="hcTooltipNote">' + route.stepCount + " step" + (route.stepCount === 1 ? "" : "s") +
					" away &mdash; the way is lit.</div>";
			}
		}
		//The granted card is NOT drawn here: a small card prints only its name, so it read as a blank
		//stub. It is shown at LARGE size in its own panel BELOW the tooltip instead -- see
		//honeycomb.progressionScreen.showCardPreview.
		markup += honeycomb.progressionScreen.nodeKeywordSidecar(node);
		return markup;
	},
});

//Every card a node shows in the preview panel: the cards it hands over or swaps in (additions and the
//`to` half of a replacement; a `null` replacement removes a card) plus the card an ATT/DEF node IMPROVES
//via `previewCardArray`, so an exclusive upgrade can be read beside its node.
honeycomb.progressionScreen.nodeCardIndexArray = function (node) {
	var result = [];
	function push(cardIndex) {
		if (cardIndex != null && result.indexOf(cardIndex) < 0) result.push(cardIndex);
	}
	var addArray = node.cardAdditionArray == null ? [] : node.cardAdditionArray;
	for (var addIndex = 0; addIndex < addArray.length; addIndex++) push(addArray[addIndex].index);
	var replaceArray = node.cardReplacementArray == null ? [] : node.cardReplacementArray;
	for (var replaceIndex = 0; replaceIndex < replaceArray.length; replaceIndex++) push(replaceArray[replaceIndex].to);
	var upgradeArray = node.cardUpgradeArray == null ? [] : node.cardUpgradeArray;
	for (var upgradeIndex = 0; upgradeIndex < upgradeArray.length; upgradeIndex++) push(upgradeArray[upgradeIndex].index);
	var previewArray = node.previewCardArray == null ? [] : node.previewCardArray;
	for (var previewIndex = 0; previewIndex < previewArray.length; previewIndex++) push(previewArray[previewIndex]);
	return result;
};

//Where a price would come from, in words: the character's own experience first, then the global pool.
//A node that costs nothing says "Free".
honeycomb.progressionScreen.priceLabel = function (cost) {
	return cost <= 0 ? "Free" : cost + " XP";
};

honeycomb.progressionScreen.costSentence = function (characterIndex, cost) {
	if (cost <= 0) return "Free.";
	var definition = honeycomb.findDefinition(honeycomb.characterArray, characterIndex);
	var own = Math.min(cost, honeycomb.progression.personalExperience(characterIndex));
	var name = definition == null ? "their own" : definition.name + "'s own";
	if (own >= cost) return "Costs " + cost + " XP, all from " + name + ".";
	if (own <= 0) return "Costs " + cost + " XP, from the global pool.";
	return "Costs " + cost + " XP: " + own + " from " + name + ", " + (cost - own) + " from the global pool.";
};

//The same description with every mechanic word it names picked out, so the sidecar's explanations are
//visibly the words on the node. Escaped first, highlighted second.
honeycomb.progressionScreen.nodeDescriptionMarkup = function (node) {
	var markup = honeycomb.escapeText(node.description == null ? "" : node.description);
	var keywordIndexArray = honeycomb.nodeKeywordArray(node);
	for (var scanIndex = 0; scanIndex < keywordIndexArray.length; scanIndex++) {
		var keyword = honeycomb.keywordDefinition(keywordIndexArray[scanIndex]);
		if (keyword == null || keyword.name == null) continue;
		var pattern = new RegExp("(" + honeycomb.keywordWordPattern(keyword.name) + ")", "gi");
		markup = markup.replace(pattern, '<span class="hcKeyword" style="--hcKeywordColor:' +
			(keyword.color == null ? "inherit" : keyword.color) + '">$1</span>');
	}
	return markup;
};

//One small panel per mechanic word the node's description names: a status, an engine keyword, or a
//character mechanic. The node stays short because the explanation lives here.
honeycomb.progressionScreen.nodeKeywordSidecar = function (node) {
	var keywordIndexArray = honeycomb.nodeKeywordArray(node);
	if (keywordIndexArray.length === 0) return "";
	var markup = '<div class="hcKeywordSidecar">';
	for (var scanIndex = 0; scanIndex < keywordIndexArray.length; scanIndex++) {
		var keyword = honeycomb.keywordDefinition(keywordIndexArray[scanIndex]);
		if (keyword == null) continue;
		markup += honeycomb.tooltip.keywordPanel(keyword);
	}
	markup += "</div>";
	return markup;
};

honeycomb.progressionScreen.viewFor = function (selection, nodeIndex) {
	var viewArray = honeycomb.progression.viewArray(selection);
	for (var scanIndex = 0; scanIndex < viewArray.length; scanIndex++) {
		if (viewArray[scanIndex].node.index == nodeIndex) return viewArray[scanIndex];
	}
	return null;
};

//---------------------------------------------------------------------------------------------------
//Lighting the way
//---------------------------------------------------------------------------------------------------
//Marks every node and edge on the shortest route(s) to a node, or clears the marks when given null.
//Only a node that cannot be reached yet has a route worth showing.
honeycomb.progressionScreen.showPath = function (nodeIndex) {
	var svg = document.getElementById("honeycombTreeSvg");
	if (svg == null) return;
	var route = null;
	if (nodeIndex != null) {
		var selection = honeycomb.progressionScreen.selection();
		var view = honeycomb.progressionScreen.viewFor(selection, nodeIndex);
		if (view != null && view.reason == "unreachable") route = honeycomb.progression.pathTo(selection, nodeIndex);
	}
	var nodeArray = honeycomb.progressionScreen.renderedNodeArray(svg);
	for (var nodeScan = 0; nodeScan < nodeArray.length; nodeScan++) {
		nodeArray[nodeScan].classList.toggle("hcOnPath",
			route != null && route.nodeIndexArray.indexOf(honeycomb.progressionScreen.treeNodeId(nodeArray[nodeScan])) >= 0);
	}
	var edgeArray = honeycomb.progressionScreen.renderedEdgeArray(svg);
	for (var edgeScan = 0; edgeScan < edgeArray.length; edgeScan++) {
		var ends = honeycomb.progressionScreen.treeEdgeEnds(edgeArray[edgeScan]);
		var onRoute = false;
		for (var routeScan = 0; route != null && routeScan < route.edgeArray.length; routeScan++) {
			if (route.edgeArray[routeScan].from == ends.from && route.edgeArray[routeScan].to == ends.to) { onRoute = true; break; }
		}
		edgeArray[edgeScan].classList.toggle("hcOnPath", onRoute);
	}
};

honeycomb.progressionScreen.onNodeEnter = function (element, nodeIndex) {
	honeycomb.tooltip.show(element, "treeNode", nodeIndex);
	honeycomb.progressionScreen.showPath(nodeIndex);
	honeycomb.progressionScreen.showExclusionPreview(nodeIndex);
	honeycomb.progressionScreen.showCardPreview(nodeIndex);
};

//Leaving puts back whichever route was pinned by a tap, or nothing.
honeycomb.progressionScreen.onNodeLeave = function () {
	honeycomb.tooltip.hide();
	honeycomb.progressionScreen.showPath(honeycomb.progressionScreen.pinnedPathIndex);
	honeycomb.progressionScreen.showExclusionPreview(null);
	honeycomb.progressionScreen.showCardPreview(null);
};

//THE GRANTED CARD, AT A READABLE SIZE, BESIDE THE TOOLTIP. A small card prints only its name,
//so the card a node hands over is drawn LARGE in its own panel under the node tooltip. It follows the
//tooltip's own rectangle, so the two move together; a node naming no card shows no panel.
honeycomb.progressionScreen.cardPreviewElement = function () {
	var existing = document.getElementById(honeycomb.tuning.dom.treeCardPreviewId);
	if (existing != null) return existing;
	var host = honeycomb.overlayHostElement();
	if (host == null) return null;
	var element = document.createElement("div");
	element.id = honeycomb.tuning.dom.treeCardPreviewId;
	element.className = "hcTreeCardPreview";
	element.hidden = true;
	host.appendChild(element);
	return element;
};

honeycomb.progressionScreen.showCardPreview = function (nodeIndex) {
	var element = honeycomb.progressionScreen.cardPreviewElement();
	if (element == null) return;
	var selection = honeycomb.progressionScreen.selection();
	var view = nodeIndex == null ? null : honeycomb.progressionScreen.viewFor(selection, nodeIndex);
	var cardIndexArray = view == null ? [] : honeycomb.progressionScreen.nodeCardIndexArray(view.node);
	if (cardIndexArray.length === 0) {
		element.hidden = true;
		element.innerHTML = "";
		return;
	}
	var markup = "";
	for (var cardScan = 0; cardScan < cardIndexArray.length; cardScan++) {
		var cardDefinition = honeycomb.findDefinition(honeycomb.cardArray, cardIndexArray[cardScan]);
		if (cardDefinition == null) continue;
		var resolved = honeycomb.resolveCard({
			instanceId: null, cardIndex: cardDefinition.index, ownerInstanceId: null, upgradeLevel: 0,
		});
		//AN IMPROVEMENT NODE SHOWS THE IMPROVED CARD: a node that names a card in
		//`previewCardArray` (an Exclusive A/D node) is drawn with its OWN `starterUpgradeArray` laid on,
		//and the loadout-derived upgrade is suppressed so the two cannot stack.
		var isPreviewCard = view != null && view.node.previewCardArray != null &&
			view.node.previewCardArray.indexOf(cardDefinition.index) >= 0;
		if (isPreviewCard == true) {
			resolved.starterUpgraded = true;
			if (view.node.starterUpgradeArray != null) {
				resolved.effectArray = honeycomb.applyStarterUpgradeArray(resolved.effectArray, view.node.starterUpgradeArray);
				honeycomb.applyStarterUpgradeFields(resolved, view.node.starterUpgradeArray);
			}
		}
		markup += honeycomb.ui.card(resolved, { size: "large", showAffinity: false, previewCharacterIndex: selection.characterIndex });
	}
	element.innerHTML = '<div class="hcTreeCardPreviewRow">' + markup + "</div>";
	element.hidden = false;
	honeycomb.progressionScreen.positionCardPreview(element);
};

honeycomb.progressionScreen.positionCardPreview = function (element) {
	var gap = honeycomb.pixels(honeycomb.tuning.ui.tooltipGapPixels);
	var tooltip = document.getElementById(honeycomb.tuning.dom.tooltipId);
	var panelBox = tooltip == null || tooltip.hidden == true ? null : tooltip.getBoundingClientRect();
	var rect = element.getBoundingClientRect();
	if (panelBox == null) {
		element.style.left = gap + "px";
		element.style.top = gap + "px";
		return;
	}
	//The card hangs below the tooltip by preference, but must overlap NEITHER the tooltip nor the node
	//being hovered -- the same rule as the tooltip itself (honeycomb.tooltip.placementFor). It moves to
	//a side rather than being clamped on top of either.
	var tooltipRect = { left: panelBox.left, top: panelBox.top, width: panelBox.width, height: panelBox.height };
	var avoidArray = [tooltipRect];
	var anchorElement = honeycomb.tooltip.anchor;
	var anchorBox = anchorElement == null || anchorElement.isConnected == false ? null : anchorElement.getBoundingClientRect();
	if (anchorBox != null && anchorBox.width > 0 && anchorBox.height > 0) {
		avoidArray.push({ left: anchorBox.left, top: anchorBox.top, width: anchorBox.width, height: anchorBox.height });
	}
	var placement = honeycomb.tooltip.placementFor(tooltipRect, { width: rect.width, height: rect.height },
		{ width: window.innerWidth, height: window.innerHeight }, true, gap, avoidArray);
	element.style.left = Math.round(placement.left) + "px";
	element.style.top = Math.round(placement.top) + "px";
};

//The branch that taking `nodeIndex` would shut, as node indices in tree order: the rivals in its
//exclusive group, plus everything that then has no other route. Seeded with the rivals, then propagated
//down the prerequisite graph the way honeycomb.progression.isReachable reads it -- an any-one node with
//one live parent survives, a `requiresAll` convergence dies when any one parent is cut. Empty when the
//node names no group, or when it is already taken (that choice is made).
//
//This is the single source for BOTH the X/edge preview and the tooltip warning, so the two can never
//disagree.
honeycomb.progressionScreen.shutBranch = function (selection, nodeIndex) {
	var viewArray = honeycomb.progression.viewArray(selection);
	var viewByIndex = {};
	for (var mapIndex = 0; mapIndex < viewArray.length; mapIndex++) viewByIndex[viewArray[mapIndex].node.index] = viewArray[mapIndex];
	var hovered = nodeIndex == null ? null : viewByIndex[nodeIndex];
	var group = hovered == null ? null : hovered.node.exclusiveGroup;
	var cut = {};
	if (group != null && hovered.selected != true) {
		for (var rivalIndex = 0; rivalIndex < viewArray.length; rivalIndex++) {
			var rival = viewArray[rivalIndex];
			if (rival.node.index == nodeIndex || rival.node.exclusiveGroup != group) continue;
			if (rival.selected == true || rival.reason == "excluded") continue;
			cut[rival.node.index] = true;
		}
		var changed = true;
		while (changed) {
			changed = false;
			for (var nodeIndexScan = 0; nodeIndexScan < viewArray.length; nodeIndexScan++) {
				var node = viewArray[nodeIndexScan].node;
				if (cut[node.index] == true) continue;
				var requiresArray = node.requiresArray == null ? [] : node.requiresArray;
				if (requiresArray.length === 0) continue;
				var anyCut = false, allCut = true;
				for (var reqIndex = 0; reqIndex < requiresArray.length; reqIndex++) {
					if (cut[honeycomb.progression.requirementIndex(requiresArray[reqIndex])] == true) anyCut = true;
					else allCut = false;
				}
				var isCut = node.requiresAll == true ? anyCut : allCut;
				if (isCut == false) continue;
				cut[node.index] = true;
				changed = true;
			}
		}
	}
	var result = [];
	for (var scanIndex = 0; scanIndex < viewArray.length; scanIndex++) {
		if (cut[viewArray[scanIndex].node.index] == true) result.push(viewArray[scanIndex].node.index);
	}
	return result;
};

//The node id off a rendered tree element, read tolerantly. The attribute is authored `data-hcNode`;
//different parsers may keep that case or lower it, so reading `element.dataset.hcnode` alone can
//silently match nothing on a browser that preserves the case, toggling the class onto no element and
//showing no X. Trying the dataset key and every spelling avoids that.
honeycomb.progressionScreen.treeNodeId = function (element) {
	if (element == null) return "";
	if (element.dataset != null) {
		if (element.dataset.hcnode != null) return element.dataset.hcnode;
		if (element.dataset.hcNode != null) return element.dataset.hcNode;
	}
	if (element.getAttribute == null) return "";
	return element.getAttribute("data-hc-node") || element.getAttribute("data-hcnode") ||
		element.getAttribute("data-hcNode") || "";
};

//Node and edge elements are found by CLASS, never by an attribute selector. A rendered SVG `<g>` is a
//foreign element, and `[data-hcNode]` is matched CASE-SENSITIVELY on foreign elements -- the parser
//lowercases the authored name to `data-hcnode`, so an attribute selector here would silently find
//nothing on a spec-strict browser while still appearing to work in Chrome's forgiving match, breaking
//both the lit route and the X. Class names are matched exactly and carry no parser case-folding.
honeycomb.progressionScreen.renderedNodeArray = function (svg) {
	return svg.querySelectorAll("g.hcTreeNode");
};
honeycomb.progressionScreen.renderedEdgeArray = function (svg) {
	return svg.querySelectorAll("path.hcTreeEdge");
};
honeycomb.progressionScreen.findRenderedNode = function (nodeIndex) {
	var svg = document.getElementById("honeycombTreeSvg");
	if (svg == null) return null;
	var nodeArray = honeycomb.progressionScreen.renderedNodeArray(svg);
	for (var scanIndex = 0; scanIndex < nodeArray.length; scanIndex++) {
		if (honeycomb.progressionScreen.treeNodeId(nodeArray[scanIndex]) == nodeIndex) return nodeArray[scanIndex];
	}
	return null;
};
honeycomb.progressionScreen.treeEdgeEnds = function (element) {
	var from = null, to = null;
	if (element.dataset != null) { from = element.dataset.hcfrom; to = element.dataset.hcto; }
	if (from == null) from = element.getAttribute("data-hcfrom") || element.getAttribute("data-hcFrom") || "";
	if (to == null) to = element.getAttribute("data-hcto") || element.getAttribute("data-hcTo") || "";
	return { from: from, to: to };
};

//The visual half: the X over the shut branch and the dimmed edges into it. Applied from `shutBranch`,
//so hovering a rival lights the whole branch the click would cost.
//
//The X and the edge dim are set INLINE, not left to stylesheet rules: an inline `display` cannot lose
//a specificity fight and cannot be missing from a cached stylesheet, so if this function runs the
//warning is visible. Clearing sets the inline value back to "" so the stylesheet takes over again.
honeycomb.progressionScreen.showExclusionPreview = function (nodeIndex) {
	var svg = document.getElementById("honeycombTreeSvg");
	if (svg == null) return;
	var selection = honeycomb.progressionScreen.selection();
	var branch = honeycomb.progressionScreen.shutBranch(selection, nodeIndex);
	var cut = {};
	for (var branchIndex = 0; branchIndex < branch.length; branchIndex++) cut[branch[branchIndex]] = true;
	var nodeArray = honeycomb.progressionScreen.renderedNodeArray(svg);
	for (var scanIndex = 0; scanIndex < nodeArray.length; scanIndex++) {
		var element = nodeArray[scanIndex];
		var isCut = cut[honeycomb.progressionScreen.treeNodeId(element)] == true;
		element.classList.toggle("hcExcludePreview", isCut);
		var cross = element.querySelector(".hcTreeNodeCross");
		if (cross != null) cross.style.display = isCut ? "inline" : "";
	}
	var edgeArray = honeycomb.progressionScreen.renderedEdgeArray(svg);
	for (var edgeScan = 0; edgeScan < edgeArray.length; edgeScan++) {
		var edgeElement = edgeArray[edgeScan];
		var isShut = cut[honeycomb.progressionScreen.treeEdgeEnds(edgeElement).to] == true;
		edgeElement.classList.toggle("hcShutPreview", isShut);
		//RED, not dimmed: the tooltip can cover the blocked node, but a red line into it still reads.
		//Inline, so a cached stylesheet cannot lose the warning.
		edgeElement.style.opacity = isShut ? "1" : "";
		edgeElement.style.stroke = isShut ? "#d23b3b" : "";
		edgeElement.style.strokeWidth = isShut ? "2.5" : "";
	}
};

//---------------------------------------------------------------------------------------------------
//Input
//---------------------------------------------------------------------------------------------------
honeycomb.progressionScreen.onNodePointerDown = function (event, nodeIndex) {
	if (event.button != null && event.button !== 0) return;
	honeycomb.progressionScreen.cancelPress();
	var press = { nodeIndex: nodeIndex, fired: false, timer: null };
	press.timer = setTimeout(function () {
		press.fired = true;
		press.timer = null;
		honeycomb.progressionScreen.giveBack(nodeIndex);
	}, honeycomb.tuning.progression.longPressMs);
	honeycomb.progressionScreen.press = press;
};

honeycomb.progressionScreen.onNodePointerUp = function (event, nodeIndex) {
	var press = honeycomb.progressionScreen.press;
	if (press == null || press.nodeIndex != nodeIndex) return;
	var fired = press.fired;
	honeycomb.progressionScreen.cancelPress();
	if (fired == false) honeycomb.progressionScreen.activate(nodeIndex);
};

honeycomb.progressionScreen.cancelPress = function () {
	var press = honeycomb.progressionScreen.press;
	if (press != null && press.timer != null) clearTimeout(press.timer);
	honeycomb.progressionScreen.press = null;
};

//Right-click. Some touch browsers also raise this at the end of a long press, which has already given
//a rank back; the press record says so, and the second one is swallowed.
honeycomb.progressionScreen.onNodeContextMenu = function (event, nodeIndex) {
	if (event != null && event.preventDefault != null) event.preventDefault();
	var press = honeycomb.progressionScreen.press;
	if (press != null && press.fired == true) return false;
	honeycomb.progressionScreen.cancelPress();
	honeycomb.progressionScreen.giveBack(nodeIndex);
	return false;
};

//A click or tap. Buys the next rank when it can; otherwise it explains, and on a node that is merely
//out of reach it pins the lit route so a touch player sees it after lifting their finger.
honeycomb.progressionScreen.activate = function (nodeIndex) {
	var selection = honeycomb.progressionScreen.selection();
	var view = honeycomb.progressionScreen.viewFor(selection, nodeIndex);
	if (view == null) return;

	//TOUCH: the first tap on a node shows what hovering it would -- its tooltip, and the way to it
	//when it is out of reach -- and the second tap acts. See honeycomb.input.tapToAct.
	if (honeycomb.input.tapToAct("treeNode:" + nodeIndex) == false) {
		var element = honeycomb.progressionScreen.findRenderedNode(nodeIndex);
		if (element != null) honeycomb.tooltip.show(element, "treeNode", nodeIndex);
		honeycomb.progressionScreen.pinnedPathIndex = view.reason == "unreachable" && view.sealed != true ? nodeIndex : null;
		honeycomb.progressionScreen.showPath(honeycomb.progressionScreen.pinnedPathIndex);
		return;
	}

	if (view.available) {
		var taken = honeycomb.progression.select(selection, nodeIndex);
		honeycomb.progressionScreen.pinnedPathIndex = null;
		honeycomb.progressionScreen.noticeText = taken.changed ? null : honeycomb.progression.refusalText(taken.reason);
		honeycomb.platform.sound("uiClick");
		honeycomb.progressionScreen.repaint();
		return;
	}

	honeycomb.platform.sound("uiBack");
	honeycomb.progressionScreen.noticeText = honeycomb.progression.describeRefusal(view);
	honeycomb.progressionScreen.pinnedPathIndex = view.reason == "unreachable" && view.sealed != true ? nodeIndex : null;
	honeycomb.progressionScreen.repaint();
};

//Gives one rank back, refunded to whichever pool paid for it.
honeycomb.progressionScreen.giveBack = function (nodeIndex) {
	var selection = honeycomb.progressionScreen.selection();
	if (honeycomb.progression.rankOf(selection.characterIndex, nodeIndex) <= 0) return;
	var node = honeycomb.progression.findNode(selection, nodeIndex);
	var undone = honeycomb.progression.unselect(selection, nodeIndex);
	if (undone.changed != true) return;
	honeycomb.progressionScreen.noticeText = (node == null ? "A rank" : node.name) + " given back. Refunded " +
		undone.refunded + " XP.";
	honeycomb.progressionScreen.pinnedPathIndex = null;
	honeycomb.platform.sound("uiBack");
	honeycomb.progressionScreen.repaint();
};

honeycomb.progressionScreen.reset = function () {
	var selection = honeycomb.progressionScreen.selection();
	var refunded = honeycomb.progression.reset(selection);
	honeycomb.progressionScreen.noticeText = refunded > 0
		? "Every choice unmade. " + refunded + " XP returned."
		: "Nothing to reset.";
	honeycomb.progressionScreen.pinnedPathIndex = null;
	honeycomb.platform.sound("uiBack");
	honeycomb.progressionScreen.repaint();
};

//The teambuilding screen shows health, cards and tags that a tree change may have moved, so the whole
//scene rebuilds; the tab keeps its scroll position through the kernel's data-hcScrollKey memory. A
//pinned route is re-lit on the fresh drawing.
honeycomb.progressionScreen.repaint = function () {
	honeycomb.tooltip.hide();
	if (honeycomb.teambuilding != null && honeycomb.teambuilding.repaint != null) honeycomb.teambuilding.repaint();
	honeycomb.progressionScreen.showPath(honeycomb.progressionScreen.pinnedPathIndex);
};
