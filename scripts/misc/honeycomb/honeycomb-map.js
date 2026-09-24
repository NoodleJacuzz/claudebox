//===================================================================================================
//HONEYCOMB CATACOMBS -- map generation and map scene
//===================================================================================================
//A region is a directed graph of nodes arranged in rows, walked from the bottom row to the boss. The
//player picks between the nodes their current position connects forward to, which is what makes a
//route a decision rather than a corridor.
//
//GENERATION IS DETERMINISTIC and draws only from the "map" stream, so the same run seed always lays
//out the same region -- and, because streams are separate, adding a random call to combat can never
//change the map that was generated before the fight started.
//
//The generator knows nothing about what a node DOES. It places types by weight and constraint; the
//node type's own onEnter decides the rest. See honeycomb-content-map.js.
window.honeycomb = window.honeycomb || {};

honeycomb.map = {};

//---------------------------------------------------------------------------------------------------
//Layout strategies
//---------------------------------------------------------------------------------------------------
//A plain grid of rows and columns cannot place nodes over a painting, because the painting decides
//where a node may sit. So layout is a REGISTRY, and it owns POSITION. A strategy returns rows of nodes each carrying an
//explicit `position` in a normalised 0..100 space over the stage, and the renderer just draws what it
//is given. Two strategies ship:
//
//  rows      procedural. The original generator, now emitting positions of its own.
//  anchored  hand-authored. A region supplies a pool of BACKDROPS, each a background image plus a set
//            of anchor points measured over that image. Generation fills the anchors rather than
//            computing a grid, so the map sits where the art says it should.
//
//A region names its strategy with `layoutIndex`. Adding a third -- a spiral, a hex field, a hand-drawn
//graph with authored edges -- is a table entry.
//
//WHAT A STRATEGY MUST RETURN
//  rowArray        rows of node objects, entrance row first, boss row last
//  backgroundPath  optional; overrides the region's own background
//  backdropIndex   optional; which backdrop was chosen, recorded so a reload redraws the same one
//
//Every node it returns must carry: id, row, column, rowWidth, position {x, y}, edgeArray (ids), and
//the empty typeIndex / encounterIndex / eventIndex / visited fields the rest of the map expects.
honeycomb.mapLayoutArray = [
	{
		index: "rows",
		name: "Procedural rows",
		build: function (definition, settings, stream) {
			var rowCount = definition.rowCount == null ? settings.rowCount : definition.rowCount;
			var rowArray = honeycomb.map.buildRowSkeleton(rowCount, settings, stream, definition);
			honeycomb.map.positionRows(rowArray, definition);
			honeycomb.map.connectRows(rowArray, settings, stream);
			return { rowArray: rowArray };
		},
	},
	{
		//A corridor: one node per row, in the order the region wrote them, with no choice anywhere. A
		//hand-authored sequence is a different thing from a generated map -- there is nothing to roll
		//and nothing to choose -- so it is its own layout rather than a procedural one squeezed to width 1.
		//
		//The region supplies `rowPlanArray`, one entry per row: {type, encounter}. `type` is a node type
		//index and `encounter` an encounter index, both forced, so a corridor's contents are exactly what
		//was written. `rowCount` is ignored; the plan's length is the length.
		index: "line",
		name: "Authored corridor",
		build: function (definition, settings, stream) {
			var planArray = definition.rowPlanArray;
			if (planArray == null || planArray.length === 0) {
				return honeycomb.findDefinition(honeycomb.mapLayoutArray, "rows").build(definition, settings, stream);
			}
			var rowArray = [];
			for (var rowIndex = 0; rowIndex < planArray.length; rowIndex++) {
				var node = honeycomb.map.newNode("node_" + rowIndex + "_0", rowIndex, 0, 1);
				if (planArray[rowIndex].type != null) node.forcedTypeIndex = planArray[rowIndex].type;
				if (planArray[rowIndex].encounter != null) node.forcedEncounterIndex = planArray[rowIndex].encounter;
				rowArray.push([node]);
			}
			honeycomb.map.positionRows(rowArray, definition);
			//Each step leads to the next and nowhere else, which is the whole point of a corridor.
			for (var edgeIndex = 0; edgeIndex < rowArray.length - 1; edgeIndex++) {
				rowArray[edgeIndex][0].edgeArray = [rowArray[edgeIndex + 1][0].id];
			}
			return { rowArray: rowArray };
		},
	},
	{
		index: "anchored",
		name: "Anchored to art",
		//Fills a hand-authored anchor set. Falls back to the procedural strategy when the region has
		//no backdrops yet, so a region can declare its intent before its art exists.
		build: function (definition, settings, stream, options) {
			var backdrop = honeycomb.map.pickBackdrop(definition, stream, options == null ? null : options.backdropIndex);
			if (backdrop == null) {
				return honeycomb.findDefinition(honeycomb.mapLayoutArray, "rows").build(definition, settings, stream);
			}
			var rowArray = honeycomb.map.buildAnchoredRows(backdrop);
			if (rowArray.length === 0) {
				return honeycomb.findDefinition(honeycomb.mapLayoutArray, "rows").build(definition, settings, stream);
			}
			//Authored edges win outright; without them the same proximity rule the grid uses is
			//applied between consecutive steps, so an anchor set need only place points.
			if (backdrop.edgeArray != null) honeycomb.map.applyAuthoredEdges(rowArray, backdrop.edgeArray);
			else honeycomb.map.connectRows(rowArray, settings, stream);

			return {
				rowArray: rowArray,
				backgroundPath: backdrop.imagePath,
				backdropIndex: backdrop.index,
			};
		},
	},
];

//>>> LANE E7 | route | routing >>>
//---------------------------------------------------------------------------------------------------
//Routing
//---------------------------------------------------------------------------------------------------
//Act1-1 splits into sub-acts, so which region follows the first one is a decision rather than the next
//position in honeycomb.regionArray. The whole decision lives in honeycomb.tuning.map.route; nothing
//here holds a region name of its own.

//The boss node's encounter on a generated map, or null if the map has no boss node. Read rather than
//re-rolled: the fight the player was shown is the fight that decides the route.
//The boss this run actually beat, not the first one on the map. A region's bosses all sit on the final
//row so the player picks their route, so returning the first boss node found would be wrong whenever a
//region has more than one.
//
//A VISITED boss node wins. Nothing else changes: a map with one boss node has only one to find, and a
//save written before the row held three still answers with its only boss whether or not it is marked
//visited, which is what keeps a run in progress alive.
honeycomb.map.mapBossEncounterIndex = function (map) {
	if (map == null || map.rowArray == null) return null;
	var firstFound = null;
	for (var rowIndex = 0; rowIndex < map.rowArray.length; rowIndex++) {
		var row = map.rowArray[rowIndex];
		for (var nodeIndex = 0; nodeIndex < row.length; nodeIndex++) {
			if (row[nodeIndex].typeIndex != "boss") continue;
			if (row[nodeIndex].visited == true) return row[nodeIndex].encounterIndex;
			if (firstFound == null) firstFound = row[nodeIndex].encounterIndex;
		}
	}
	return firstFound;
};

//Which region a run descends into, resolved once. Order is fixed by the route contract: a relic the
//run holds outranks everything, then the boss this run's map rolled, then the default.
honeycomb.map.resolveRouteRegionIndex = function (run) {
	var route = honeycomb.tuning.map.route;
	if (run == null) return route.defaultSecondRegion;

	var overrideArray = route.overrideArray == null ? [] : route.overrideArray;
	var heldArray = run.relicArray == null ? [] : run.relicArray;
	for (var overrideIndex = 0; overrideIndex < overrideArray.length; overrideIndex++) {
		for (var heldIndex = 0; heldIndex < heldArray.length; heldIndex++) {
			if (heldArray[heldIndex].index == overrideArray[overrideIndex].relicIndex) {
				return overrideArray[overrideIndex].regionIndex;
			}
		}
	}

	var bossEncounterIndex = honeycomb.map.mapBossEncounterIndex(run.map);
	var byBossArray = route.byBossArray == null ? [] : route.byBossArray;
	if (bossEncounterIndex != null) {
		for (var bossRowIndex = 0; bossRowIndex < byBossArray.length; bossRowIndex++) {
			if (byBossArray[bossRowIndex].bossEncounterIndex == bossEncounterIndex) {
				return byBossArray[bossRowIndex].regionIndex;
			}
		}
	}
	return route.defaultSecondRegion;
};

//Which region a given depth lands on. Depth 0 is always the first position; deeper than that the run
//follows the route it recorded on the way down. A run carrying none -- every save written before the
//route table existed -- reads as the default, which is what keeps a run in progress alive.
honeycomb.map.regionIndexForDepth = function (run, depth) {
	if (depth <= 0) return honeycomb.regionArray[0].index;
	var recorded = run == null ? null : run.routeRegionIndex;
	return recorded == null ? honeycomb.tuning.map.route.defaultSecondRegion : recorded;
};

//The regions a player is allowed to be told exist: the first, the default second, and everything a
//byBossArray row can lead to. A region reachable ONLY through an overrideArray row is secret and is
//left out, so no total ever promises a place there is no way of hearing about. Every screen or ledger
//that counts or lists regions asks this instead of honeycomb.regionArray.
honeycomb.map.countedRegionArray = function () {
	var route = honeycomb.tuning.map.route;
	var candidateArray = [];
	if (honeycomb.regionArray.length > 0) candidateArray.push(honeycomb.regionArray[0].index);
	candidateArray.push(route.defaultSecondRegion);
	var byBossArray = route.byBossArray == null ? [] : route.byBossArray;
	for (var bossRowIndex = 0; bossRowIndex < byBossArray.length; bossRowIndex++) {
		candidateArray.push(byBossArray[bossRowIndex].regionIndex);
	}

	var result = [];
	for (var candidateIndex = 0; candidateIndex < candidateArray.length; candidateIndex++) {
		var candidate = candidateArray[candidateIndex];
		if (candidate == null) continue;
		if (result.indexOf(candidate) >= 0) continue;
		//A row pointing at a region that does not exist is a content error, reported by the warning
		//report rather than counted here.
		if (honeycomb.findDefinition(honeycomb.regionArray, candidate) == null) continue;
		result.push(candidate);
	}
	return result;
};
//<<< LANE E7 | route | routing <<<

//---------------------------------------------------------------------------------------------------
//Generation
//---------------------------------------------------------------------------------------------------
//Builds the region the run is currently on and stores it at run.map.
//`options.backdropIndex` names one painting from an anchored region's pool instead of rolling for
//one -- how a test or a story beat can ask for a particular map.
honeycomb.map.generateRegion = function (regionIndex, options) {
	var run = honeycomb.state.run;
	if (run == null) return null;

	var chosenIndex = regionIndex;
	if (chosenIndex == null) {
		//>>> LANE E7 | route | generation >>>
		//THE RUN FOLLOWS ITS ROUTE, NOT THE TABLE'S ORDER. Reading regionArray by position used to
		//mean "the next act"; it now means "one of several alternatives", and taking position 1 would
		//send every run down the same one.
		var depth = run.regionsCleared == null ? 0 : run.regionsCleared;
		chosenIndex = honeycomb.map.regionIndexForDepth(run, depth);
		//<<< LANE E7 | route | generation <<<
	}
	var definition = honeycomb.requireDefinition(honeycomb.regionArray, chosenIndex, "honeycomb.regionArray");
	if (definition == null) return null;

	var settings = honeycomb.tuning.map;
	var stream = honeycomb.tuning.rng.streamArray.map;

	//--- Layout ---
	var layout = honeycomb.findDefinition(honeycomb.mapLayoutArray,
		definition.layoutIndex == null ? settings.defaultLayout : definition.layoutIndex);
	if (layout == null) layout = honeycomb.findDefinition(honeycomb.mapLayoutArray, "rows");
	var built = layout.build(definition, settings, stream, options == null ? {} : options);
	var rowArray = built.rowArray;
	var rowCount = rowArray.length;

	//--- Node types ---
	var bossRow = rowCount - 1 - settings.bossRowFromEnd;
	var restRow = rowCount - 1 - settings.restRowFromEnd;
	for (var typeRowIndex = 0; typeRowIndex < rowCount; typeRowIndex++) {
		for (var typeNodeIndex = 0; typeNodeIndex < rowArray[typeRowIndex].length; typeNodeIndex++) {
			var target = rowArray[typeRowIndex][typeNodeIndex];
			//An anchor may name the type it wants, which is how a hand-authored map puts the shop
			//exactly where the art shows a shop.
			if (target.forcedTypeIndex != null) {
				target.typeIndex = target.forcedTypeIndex;
				continue;
			}
			target.typeIndex = honeycomb.map.rollNodeType(target, typeRowIndex, rowCount, bossRow, restRow, rowArray);
		}
	}

	//--- Contents ---
	//Types are settled before contents so an encounter is rolled against a node that knows how deep
	//it is, and so an event node can be told which event without disturbing the type roll.
	for (var fillRowIndex = 0; fillRowIndex < rowCount; fillRowIndex++) {
		for (var fillNodeIndex = 0; fillNodeIndex < rowArray[fillRowIndex].length; fillNodeIndex++) {
			honeycomb.map.fillNodeContents(rowArray[fillRowIndex][fillNodeIndex], fillRowIndex, rowCount, definition);
		}
	}

	run.map = {
		regionIndex: definition.index,
		layoutIndex: layout.index,
		//Recorded rather than re-rolled, so reloading a save redraws the same painting under the same
		//nodes. Re-picking on load would move the map under a run in progress.
		backdropIndex: built.backdropIndex == null ? null : built.backdropIndex,
		backgroundPath: built.backgroundPath == null ? definition.backgroundPath : built.backgroundPath,
		rowArray: rowArray,
		//Null until the player takes their first step; the first row is then the choice set.
		currentNodeId: null,
		completedNodeIdArray: [],
	};
	if (run.regionsCleared == null) run.regionsCleared = 0;
	if (run.seenEventArray == null) run.seenEventArray = [];
	return run.map;
};

//---------------------------------------------------------------------------------------------------
//Shared layout pieces
//---------------------------------------------------------------------------------------------------
//Rows of blank nodes, before positions or edges.
//
//The boss row holds every boss the region has, each leading to a different route, so the player chooses
//their boss and next route rather than having it decided for them. A region naming one boss still ends
//in one node, so nothing but a multi-boss region changes. `tuning.map.bossRowHoldsEveryBoss` turns it
//back off.
honeycomb.map.buildRowSkeleton = function (rowCount, settings, stream, definition) {
	var bossRowIndex = rowCount - 1 - settings.bossRowFromEnd;
	var bossArray = definition == null ? null : definition.bossEncounterIndexArray;
	var bossWidth = settings.bossRowHoldsEveryBoss == true && bossArray != null && bossArray.length > 0
		? bossArray.length : 1;
	var rowArray = [];
	for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
		var width = honeycomb.rng.range(stream, settings.rowWidthMinimum, settings.rowWidthMaximum);
		if (rowIndex === bossRowIndex) width = bossWidth;
		var row = [];
		for (var columnIndex = 0; columnIndex < width; columnIndex++) {
			var node = honeycomb.map.newNode("node_" + rowIndex + "_" + columnIndex, rowIndex, columnIndex, width);
			//Each boss node is a DIFFERENT boss, in the order the region wrote them, so the row is a
			//choice rather than three doors onto the same fight.
			if (rowIndex === bossRowIndex && bossWidth > 1) node.forcedEncounterIndex = bossArray[columnIndex];
			row.push(node);
		}
		rowArray.push(row);
	}
	return rowArray;
};

honeycomb.map.newNode = function (id, rowIndex, columnIndex, rowWidth) {
	return {
		id: id,
		row: rowIndex,
		column: columnIndex,
		rowWidth: rowWidth,
		//Normalised 0..100 over the stage. Owned by the layout strategy; the renderer only reads it.
		position: { x: 50, y: 50 },
		typeIndex: null,
		forcedTypeIndex: null,
		//An authored corridor names its fight outright rather than rolling one (the `line` layout).
		forcedEncounterIndex: null,
		encounterIndex: null,
		eventIndex: null,
		edgeArray: [],
		visited: false,
	};
};

//Positions for the procedural strategy: rows left to right, nodes spread down each row, plus a
//deterministic wobble so the graph does not read as a spreadsheet.
honeycomb.map.positionRows = function (rowArray, definition) {
	var frame = honeycomb.tuning.map.frame;
	var rowCount = rowArray.length;
	for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
		var row = rowArray[rowIndex];
		var x = frame.marginX + ((100 - frame.marginX * 2) * (rowIndex / Math.max(1, rowCount - 1)));
		for (var nodeIndex = 0; nodeIndex < row.length; nodeIndex++) {
			var spread = 100 - frame.marginY * 2;
			var y = row.length <= 1
				? 50
				: frame.marginY + (spread * (nodeIndex / (row.length - 1)));
			//Derived from the node id rather than drawn from a stream, so it costs no RNG and never
			//shifts when an unrelated system adds a random call.
			var wobble = honeycomb.map.wobbleFor(row[nodeIndex].id, frame.wobbleX, frame.wobbleY);
			row[nodeIndex].position = { x: x + wobble.x, y: y + wobble.y };
		}
	}
};

//Forward edges by proximity. Each node connects to between edgeMinimum and edgeMaximum nodes in the
//next row, chosen near its own position, so paths read as paths rather than a mesh. Shared by both
//strategies: an anchor set that does not author its edges gets the same rule.
honeycomb.map.connectRows = function (rowArray, settings, stream) {
	var rowCount = rowArray.length;
	for (var edgeRowIndex = 0; edgeRowIndex < rowCount - 1; edgeRowIndex++) {
		var currentRow = rowArray[edgeRowIndex];
		var nextRow = rowArray[edgeRowIndex + 1];
		for (var nodeIndex = 0; nodeIndex < currentRow.length; nodeIndex++) {
			var node = currentRow[nodeIndex];
			var projected = currentRow.length <= 1
				? Math.floor(nextRow.length / 2)
				: Math.round((nodeIndex / (currentRow.length - 1)) * (nextRow.length - 1));
			var edgeCount = honeycomb.rng.range(stream, settings.edgeMinimum,
				Math.min(settings.edgeMaximum, nextRow.length));
			//Which side the fan opens on, rolled per node: an unrolled alternation (+1, -1, +2...) always
			//gives the second edge the same side, since `edgeMaximum` is 2, so the other side would never
			//be reached. A side rolled here makes the two directions equally likely without changing the
			//alternation itself.
			var fanSign = honeycomb.rng.range(stream, 0, 1) === 1 ? -1 : 1;
			for (var edgeIndex = 0; edgeIndex < edgeCount; edgeIndex++) {
				//Fan out from the projection, alternating sides.
				var offset = edgeIndex === 0 ? 0 : fanSign * (edgeIndex % 2 === 1 ? Math.ceil(edgeIndex / 2) : -Math.ceil(edgeIndex / 2));
				var targetIndex = Math.max(0, Math.min(nextRow.length - 1, projected + offset));
				var targetId = nextRow[targetIndex].id;
				if (node.edgeArray.indexOf(targetId) < 0) node.edgeArray.push(targetId);
			}
		}
		honeycomb.map.rescueOrphans(currentRow, nextRow);
	}

	//The row before the bosses sees all of them: with three bosses on the final row, an ordinary fan
	//would give each rest node only one or two, leaving the choice half-decided before the player gets
	//there. The last step is a full fan, and only the last step.
	if (rowCount >= 2) {
		var bossRow = rowArray[rowCount - 1];
		if (bossRow.length > 1) {
			var beforeRow = rowArray[rowCount - 2];
			for (var beforeIndex = 0; beforeIndex < beforeRow.length; beforeIndex++) {
				for (var bossIndex = 0; bossIndex < bossRow.length; bossIndex++) {
					if (beforeRow[beforeIndex].edgeArray.indexOf(bossRow[bossIndex].id) < 0) {
						beforeRow[beforeIndex].edgeArray.push(bossRow[bossIndex].id);
					}
				}
			}
		}
	}
};

//No node in the next row may be unreachable, or a path dead-ends into nothing. Attaches any orphan to
//whichever node in the previous row is closest.
honeycomb.map.rescueOrphans = function (currentRow, nextRow) {
	for (var orphanIndex = 0; orphanIndex < nextRow.length; orphanIndex++) {
		var reached = false;
		for (var checkIndex = 0; checkIndex < currentRow.length; checkIndex++) {
			if (currentRow[checkIndex].edgeArray.indexOf(nextRow[orphanIndex].id) >= 0) { reached = true; break; }
		}
		if (reached == true) continue;

		var bestIndex = 0;
		var bestDistance = Infinity;
		for (var scanIndex = 0; scanIndex < currentRow.length; scanIndex++) {
			//Measured against real positions rather than column indices, so it is correct for an
			//anchor set whose points are nowhere near a grid.
			var distance = Math.abs(currentRow[scanIndex].position.y - nextRow[orphanIndex].position.y);
			if (distance < bestDistance) { bestDistance = distance; bestIndex = scanIndex; }
		}
		currentRow[bestIndex].edgeArray.push(nextRow[orphanIndex].id);
	}
};

//---------------------------------------------------------------------------------------------------
//Anchored layout
//---------------------------------------------------------------------------------------------------
//A backdrop is one painting plus the points on it a node may occupy. Picked from the map stream, so
//the same seed always draws the same painting.
honeycomb.map.pickBackdrop = function (definition, stream, backdropIndex) {
	var backdropArray = definition.backdropArray;
	if (backdropArray == null || backdropArray.length === 0) return null;
	//A named painting is taken as asked, and draws nothing from the stream.
	if (backdropIndex != null) {
		var named = honeycomb.findDefinition(backdropArray, backdropIndex);
		if (named != null) return named;
		console.error("Honeycomb: region '" + definition.index + "' has no backdrop '" + backdropIndex + "'");
	}
	return honeycomb.rng.pick(stream, backdropArray);
};

//Turns an anchor set into rows. `step` groups anchors into progression tiers -- the analogue of a row
//-- so the rest of the map code, which thinks in rows, needs no changes at all.
honeycomb.map.buildAnchoredRows = function (backdrop) {
	var anchorArray = backdrop.anchorArray;
	if (anchorArray == null || anchorArray.length === 0) return [];

	//Group by step, in ascending order, without assuming the author listed them in order.
	var stepArray = [];
	for (var scanIndex = 0; scanIndex < anchorArray.length; scanIndex++) {
		var step = anchorArray[scanIndex].step;
		if (stepArray.indexOf(step) < 0) stepArray.push(step);
	}
	stepArray.sort(function (left, right) { return left - right; });

	var rowArray = [];
	for (var stepIndex = 0; stepIndex < stepArray.length; stepIndex++) {
		var row = [];
		for (var anchorIndex = 0; anchorIndex < anchorArray.length; anchorIndex++) {
			var anchor = anchorArray[anchorIndex];
			if (anchor.step !== stepArray[stepIndex]) continue;
			var node = honeycomb.map.newNode(anchor.id, stepIndex, row.length, 0);
			node.position = { x: anchor.x, y: anchor.y };
			//An anchor may demand a type, which is how a hand-authored map puts the shop where the
			//art shows a shop.
			node.forcedTypeIndex = anchor.typeIndex == null ? null : anchor.typeIndex;
			row.push(node);
		}
		for (var widthIndex = 0; widthIndex < row.length; widthIndex++) row[widthIndex].rowWidth = row.length;
		rowArray.push(row);
	}
	return rowArray;
};

//Hand-authored edges, as {from, to} anchor ids. Anything naming a node that is not in the set is
//reported rather than silently dropped: a typo in an anchor file is otherwise invisible.
honeycomb.map.applyAuthoredEdges = function (rowArray, edgeArray) {
	var nodeArray = {};
	for (var rowIndex = 0; rowIndex < rowArray.length; rowIndex++) {
		for (var nodeIndex = 0; nodeIndex < rowArray[rowIndex].length; nodeIndex++) {
			nodeArray[rowArray[rowIndex][nodeIndex].id] = rowArray[rowIndex][nodeIndex];
		}
	}
	for (var edgeIndex = 0; edgeIndex < edgeArray.length; edgeIndex++) {
		var edge = edgeArray[edgeIndex];
		var from = nodeArray[edge.from];
		if (from == null || nodeArray[edge.to] == null) {
			console.error("Honeycomb: map edge names an anchor that does not exist: " + edge.from + " -> " + edge.to);
			continue;
		}
		if (from.edgeArray.indexOf(edge.to) < 0) from.edgeArray.push(edge.to);
	}
};

//Whether a region already holds as many nodes of this type as `tuning.map.maximumPerRegionArray` allows.
//A type the table does not name has no limit. Counts nodes that have been given a type already, which
//during generation is every node above the one being rolled.
honeycomb.map.typeIsFull = function (typeIndex, rowArray) {
	var limitArray = honeycomb.tuning.map.maximumPerRegionArray;
	if (limitArray == null) return false;
	var limit = null;
	for (var limitIndex = 0; limitIndex < limitArray.length; limitIndex++) {
		if (limitArray[limitIndex].index == typeIndex) limit = limitArray[limitIndex].maximum;
	}
	if (limit == null) return false;
	var placed = 0;
	for (var rowIndex = 0; rowIndex < rowArray.length; rowIndex++) {
		for (var nodeIndex = 0; nodeIndex < rowArray[rowIndex].length; nodeIndex++) {
			if (rowArray[rowIndex][nodeIndex].typeIndex == typeIndex) placed += 1;
		}
	}
	return placed >= limit;
};

//Picks a node's type, honouring the forced rows and the no-repeat rule.
honeycomb.map.rollNodeType = function (node, rowIndex, rowCount, bossRow, restRow, rowArray) {
	var settings = honeycomb.tuning.map;
	if (rowIndex === bossRow) return "boss";
	if (rowIndex === restRow) return "rest";
	if (rowIndex === 0) return settings.firstRowNodeType;

	//Build the candidate list, dropping anything the constraints forbid here.
	var depthFraction = rowCount <= 1 ? 1 : rowIndex / (rowCount - 1);
	var candidateArray = [];
	for (var weightIndex = 0; weightIndex < settings.nodeWeightArray.length; weightIndex++) {
		var candidate = settings.nodeWeightArray[weightIndex];
		if (rowIndex < settings.specialNodeEarliestRow && candidate.index != "combat") continue;
		//An elite node is held back to the middle stretch, where the party has a deck to bring to it.
		if (candidate.index == "elite" && depthFraction < settings.eliteEarliestDepthFraction) continue;
		//No-repeat types may not appear directly above a node that leads into this one.
		if (settings.noRepeatTypeArray.indexOf(candidate.index) >= 0 &&
			honeycomb.map.anyParentHasType(node, rowIndex, rowArray, candidate.index) == true) continue;
		//A type may be capped for the whole region. Types are settled row by row into the same rowArray,
		//so counting what already carries a type counts what has been placed so far.
		if (honeycomb.map.typeIsFull(candidate.index, rowArray) == true) continue;
		candidateArray.push(candidate);
	}
	if (candidateArray.length === 0) return "combat";

	var picked = honeycomb.rng.pickWeighted(honeycomb.tuning.rng.streamArray.map, candidateArray);
	return picked == null ? "combat" : picked.index;
};

//The region's boss: one of `bossEncounterIndexArray`, weighted by each encounter's `weight`, from the
//encounter stream; a region naming only `bossEncounterIndex` always fields that one. Rolled when the
//map is generated, so the boss node's preview names the fight and a reload keeps it.
honeycomb.map.rollBossEncounter = function (region) {
	var indexArray = region.bossEncounterIndexArray == null ? [region.bossEncounterIndex] : region.bossEncounterIndexArray;
	var candidateArray = [];
	for (var scanIndex = 0; scanIndex < indexArray.length; scanIndex++) {
		var encounter = honeycomb.findDefinition(honeycomb.encounterArray, indexArray[scanIndex]);
		if (encounter != null) candidateArray.push(encounter);
	}
	if (candidateArray.length === 0) return region.bossEncounterIndex;
	var picked = honeycomb.rng.pickWeighted(honeycomb.tuning.rng.streamArray.encounter, candidateArray);
	return picked == null ? candidateArray[0].index : picked.index;
};

//True when any node in the previous row that connects to this one carries the given type.
honeycomb.map.anyParentHasType = function (node, rowIndex, rowArray, typeIndex) {
	if (rowIndex === 0) return false;
	var previousRow = rowArray[rowIndex - 1];
	for (var scanIndex = 0; scanIndex < previousRow.length; scanIndex++) {
		if (previousRow[scanIndex].edgeArray.indexOf(node.id) < 0) continue;
		if (previousRow[scanIndex].typeIndex == typeIndex) return true;
	}
	return false;
};

//Fills in whatever a node needs beyond its type.
honeycomb.map.fillNodeContents = function (node, rowIndex, rowCount, region) {
	switch (node.typeIndex) {
		case "combat":
		case "elite": {
			//An authored node names its own fight. Nothing is rolled for a corridor: the region wrote
			//which encounter stands at which step.
			if (node.forcedEncounterIndex != null) {
				node.encounterIndex = node.forcedEncounterIndex;
				break;
			}
			var tier = honeycomb.encounterTierForDepth(rowIndex, rowCount);
			//An elite node rolls the elite pool: the two node types would otherwise share one pool, so an
			//elite stop could field the gentlest fight on the map.
			//An encounter naming `regionIndexArray` is only rolled in those regions, so the second floor
			//fields its own line-ups rather than the first floor's again.
			var encounter = honeycomb.rollEncounter(tier, { elite: node.typeIndex == "elite", regionIndex: honeycomb.regionArray.indexOf(region) });
			node.encounterIndex = encounter == null ? "loneSporeling" : encounter.index;
			break;
		}
		case "boss": {
			node.encounterIndex = node.forcedEncounterIndex != null
				? node.forcedEncounterIndex : honeycomb.map.rollBossEncounter(region);
			break;
		}
		case "event": {
			//Chosen at generation time rather than on entry, so the map is fully determined by the
			//seed and a save taken before the node is entered cannot re-roll it.
			//Weighted on the CURRENT weight, which a broken party may have changed. The pool hands back
			//real event definitions, so each is copied with its live weight rather than edited in place.
			var eventArray = honeycomb.weightedEventPoolArray(honeycomb.eligibleEventArray());
			var event = honeycomb.rng.pickWeighted(honeycomb.tuning.rng.streamArray.mapEvent, eventArray);
			node.eventIndex = event == null ? null : event.index;
			break;
		}
		default: break;
	}
};

//---------------------------------------------------------------------------------------------------
//Navigation
//---------------------------------------------------------------------------------------------------
honeycomb.map.findNode = function (nodeId) {
	var run = honeycomb.state.run;
	if (run == null || run.map == null) return null;
	for (var rowIndex = 0; rowIndex < run.map.rowArray.length; rowIndex++) {
		for (var nodeIndex = 0; nodeIndex < run.map.rowArray[rowIndex].length; nodeIndex++) {
			if (run.map.rowArray[rowIndex][nodeIndex].id == nodeId) return run.map.rowArray[rowIndex][nodeIndex];
		}
	}
	return null;
};

//Which nodes the player may move to right now. Before the first step that is the whole opening row;
//afterwards it is whatever the current node connects forward to.
honeycomb.map.availableNodeIdArray = function () {
	var run = honeycomb.state.run;
	if (run == null || run.map == null) return [];
	if (run.map.currentNodeId == null) {
		var result = [];
		for (var nodeIndex = 0; nodeIndex < run.map.rowArray[0].length; nodeIndex++) {
			result.push(run.map.rowArray[0][nodeIndex].id);
		}
		return result;
	}
	var current = honeycomb.map.findNode(run.map.currentNodeId);
	//A node whose business is unfinished offers no onward moves, which is what stops the player
	//walking away from a fight.
	if (current == null || current.visited != true) return [];
	return current.edgeArray.slice();
};

honeycomb.map.canEnter = function (nodeId) {
	return honeycomb.map.availableNodeIdArray().indexOf(nodeId) >= 0;
};

//Moves onto a node and triggers whatever it is.
honeycomb.map.enterNode = function (nodeId) {
	if (honeycomb.map.canEnter(nodeId) == false) return false;
	var node = honeycomb.map.findNode(nodeId);
	if (node == null) return false;
	var type = honeycomb.requireDefinition(honeycomb.nodeTypeArray, node.typeIndex, "honeycomb.nodeTypeArray");
	if (type == null) return false;

	var run = honeycomb.state.run;
	run.map.currentNodeId = nodeId;
	run.day += honeycomb.tuning.run.daysPerNode;
	//Every day that passes is a day on the bench for whoever is not in the party.
	if (honeycomb.lust != null) honeycomb.lust.applyBenchDecay(run, honeycomb.tuning.run.daysPerNode);

	//Lust degrades a little with every map movement. Walking is the party's cheapest, slowest
	//treatment, and it is what keeps being far from a rest site from being a sentence. Run BEFORE the
	//node fires, so arriving somewhere already recovered is possible.
	honeycomb.map.bleedLust();

	honeycomb.platform.sound("nodeEnter");
	honeycomb.save.autosave("nodeEnter");
	type.onEnter(node);
	return true;
};

//The walk itself, as its own function so an event or a relic can grant an extra step of it. Returns
//the members who recovered, so the map scene can play their cut-in.
honeycomb.map.bleedLust = function (amount) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	var bled = amount == null ? honeycomb.tuning.lust.decayPerMapMove : amount;
	var recoveredArray = [];
	if (run == null || bled <= 0) return recoveredArray;
	var context = honeycomb.newEffectContext({});
	for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
		var member = run.partyArray[memberIndex];
		var wasBroken = member.broken == true;
		honeycomb.reduceLust(member, bled, context);
		if (wasBroken == true && member.broken != true) recoveredArray.push(member.instanceId);
	}
	//A recovery is seen even though there is no log replay on the map to hang a cut-in on: the log this
	//produced is walked for the entries that own one. Without this a member who un-broke between nodes
	//would do it in complete silence, which BROKEN-01 §4 says should not happen.
	if (honeycomb.playCutInsFromLog != null) honeycomb.playCutInsFromLog(context.log);
	return recoveredArray;
};

//Marks the node the player is standing on as finished, which unlocks its onward edges.
honeycomb.map.completeCurrentNode = function () {
	var run = honeycomb.state.run;
	if (run == null || run.map == null || run.map.currentNodeId == null) return;
	var node = honeycomb.map.findNode(run.map.currentNodeId);
	if (node == null) return;
	node.visited = true;
	if (run.map.completedNodeIdArray.indexOf(node.id) < 0) run.map.completedNodeIdArray.push(node.id);
	honeycomb.save.autosave("nodeComplete");
};

//True once the region's boss has been cleared.
honeycomb.map.regionComplete = function () {
	var run = honeycomb.state.run;
	if (run == null || run.map == null) return false;
	var lastRow = run.map.rowArray[run.map.rowArray.length - 1];
	for (var nodeIndex = 0; nodeIndex < lastRow.length; nodeIndex++) {
		if (lastRow[nodeIndex].typeIndex == "boss" && lastRow[nodeIndex].visited == true) return true;
	}
	return false;
};

//Pays for clearing a region, once. The flag lives on the MAP rather than the profile because the
//question is "has this region been paid for on this run", and the ledger separately answers "has this
//profile ever cleared it" -- which is what decides whether the first-time bonus applies.
honeycomb.map.awardRegionClear = function () {
	var run = honeycomb.state.run;
	if (run == null || run.map == null) return null;
	if (run.map.experienceAwarded == true) return null;
	if (honeycomb.map.regionComplete() == false) return null;
	run.map.experienceAwarded = true;
	return honeycomb.discovery.record("region", run.map.regionIndex, null);
};

//Winning the run pays personal experience ONCE, however often the closing screen is opened; the shares
//are kept on the run so a reopened screen shows the same ones.
honeycomb.map.awardRunVictory = function () {
	var run = honeycomb.state.run;
	if (run == null) return [];
	if (run.victoryShareArray == null) run.victoryShareArray = honeycomb.progression.payRunVictory();
	return run.victoryShareArray;
};

//---------------------------------------------------------------------------------------------------
//Map scene
//---------------------------------------------------------------------------------------------------
//The map is drawn as an SVG: nodes are circles and edges are curves, both of which want real vector
//geometry rather than positioned divs. The background and the node icons are separate images layered
//behind and inside it, so the art pass can replace either without touching the layout maths.
honeycomb.scene.register({
	index: "map",
	build: function (root) {
		honeycomb.applyTuningToCss();
		var run = honeycomb.state.run;
		if (run == null || run.map == null) {
			//Reaching the map with no run is a routing bug, not a player action; go somewhere safe.
			honeycomb.scene.go("teambuilding");
			return;
		}
		var region = honeycomb.findDefinition(honeycomb.regionArray, run.map.regionIndex);

		var view = honeycomb.map.viewBox();
		var anchored = run.map.backdropIndex != null;

		var markup = '<div class="hcScreen hcMapScene">';
		//No separate party button here: the faces already on the screen do that job instead.
		markup += honeycomb.ui.topBar({ showExit: true, subtitle: region == null ? "" : region.name });
		markup += '<div class="hcBody hcMapBody" style="--hcMapNear:' +
			(region == null ? "#2a1f3a" : region.colorNear) + ";--hcMapFar:" +
			(region == null ? "#161022" : region.colorFar) + '">';

		//A plain region background is FIXED and full-bleed: it has no anchors on it, so it does not need
		//to share the graph's rectangle. An ANCHORED painting is drawn INSIDE the canvas below instead --
		//the graph and the painting then occupy one rectangle, so an anchor cannot drift off its landmark.
		if (anchored == false) markup += honeycomb.map.buildRegionBackground(region);
		markup += honeycomb.map.buildPartyRail();
		markup += '<div class="hcMapViewport" id="honeycombMapViewport">';
		markup += '<div class="hcMapCanvas" id="honeycombMapCanvas" style="aspect-ratio:' +
			view.width + " / " + view.height + ';">';
		if (anchored == true) markup += honeycomb.map.buildBackdrop(region);
		markup += honeycomb.map.buildGraph();
		markup += "</div></div>";
		markup += honeycomb.map.buildLegend();
		markup += honeycomb.map.buildPreviewCard();
		markup += "</div></div>";

		root.innerHTML = markup;
		//Wheel and drag pan the map, on top of the scrollbar.
		honeycomb.map.installScrollInput();
		//The canvas may be wider than the viewport; put the node the party is standing on (or the
		//opening row) in the middle rather than at the far left.
		honeycomb.map.scrollCurrentIntoView();
	},
});

//The region's own backdrop, behind the whole body and fixed as the graph scrolls over it.
honeycomb.map.buildRegionBackground = function (region) {
	return '<div class="hcMapBackground">' +
		honeycomb.imageTag(region == null ? null : region.backgroundPath, {
			className: "hcMapBackgroundArt", alt: "", silentFallback: true,
		}) + "</div>";
};

//An anchored painting, INSIDE the canvas. `object-fit: fill` is deliberate: it stretches the image to
//the canvas exactly, so a percentage over the painting and a percentage over the graph are the same
//point. Letterboxing (contain) would preserve the image's aspect but would only line up when the canvas
//happened to share it.
honeycomb.map.buildBackdrop = function (region) {
	var map = honeycomb.state.run.map;
	return '<div class="hcMapBackground">' +
		honeycomb.imageTag(map.backgroundPath, {
			className: "hcMapBackgroundArt hcAnchoredBackdrop", alt: "", silentFallback: true,
		}) + "</div>";
};

//The rail is the way into the party window: pressing a face opens the window already reading that
//member, so inspecting somebody is one press instead of two.
//
//The Broken alert lives on the face it is about, rather than on a separate top-bar button: the map
//shows WHO is broken rather than only that somebody is.
honeycomb.map.buildPartyRail = function () {
	var run = honeycomb.state.run;
	var markup = '<div class="hcMapPartyRail">';
	for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
		var member = run.partyArray[memberIndex];
		markup += honeycomb.ui.portrait(member, {
			showHealth: true,
			alert: member.broken == true,
			attributes: member.broken == true ? honeycomb.tooltip.attributes("partyAlert", "broken") : null,
			onClick: "honeycomb.partyWindow.open('" + honeycomb.escapeAttribute(member.characterIndex) + "')",
		});
	}
	//Relics are NOT listed here any more: they live in the top bar, after the deck, on every screen. See
	//honeycomb.ui.topBarRelics.
	markup += "</div>";
	return markup;
};

//The map scrolls sideways: a floor may be longer than the window, so the canvas is centred on the
//party's place when the screen opens rather than always showing the entrance.
honeycomb.map.scrollCurrentIntoView = function () {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null || run.map == null) return;
	var targetId = run.map.currentNodeId;
	if (targetId == null) {
		//Before the first step, show the opening row; on a cleared map, the boss.
		var availableArray = honeycomb.map.availableNodeIdArray();
		var lastRow = run.map.rowArray[run.map.rowArray.length - 1];
		targetId = availableArray.length > 0
			? availableArray[Math.floor(availableArray.length / 2)]
			: (lastRow != null && lastRow.length > 0 ? lastRow[0].id : null);
	}
	if (targetId == null) return;
	//The canvas is laid out after this markup is inserted, so wait a frame before measuring it.
	setTimeout(function () { honeycomb.map.centerOnNode(targetId); }, 0);
};

//The map is panned by hand as well as by the scrollbar. A mouse wheel scrolls it sideways, because the
//map's only free axis is horizontal once a floor runs long, and a press-drag pans it the way a
//touchscreen would. A drag never counts as a click on the node it started on.
honeycomb.map.installScrollInput = function () {
	var viewport = document.getElementById("honeycombMapViewport");
	if (viewport == null || viewport.hcMapPanBound == true) return;
	viewport.hcMapPanBound = true;

	viewport.addEventListener("wheel", function (event) {
		//Plain wheel and shift-wheel both pan; the map has no vertical overflow worth scrolling.
		var delta = event.deltaY !== 0 ? event.deltaY : event.deltaX;
		if (delta === 0) return;
		viewport.scrollLeft += delta;
		event.preventDefault();
	}, { passive: false });

	//A DRAG IS ONLY A DRAG ONCE IT HAS MOVED, and the pointer is NEVER captured on press. Capturing
	//retargets the eventual click away from the node under it, which made every node unclickable -- the
	//bug this was rewritten for. A click always begins with a pointerdown, which clears `moved`, so a
	//drag's suppressed click cannot leak onto the next one.
	//
	//Touch is left alone: the viewport already scrolls natively, and driving scrollLeft by hand as well
	//would fight it.
	var pan = { active: false, moved: false, startX: 0, startScroll: 0 };
	viewport.addEventListener("pointerdown", function (event) {
		if (event.pointerType === "touch") return;
		if (event.pointerType === "mouse" && event.button !== 0) return;
		pan.active = true;
		pan.moved = false;
		pan.startX = event.clientX;
		pan.startScroll = viewport.scrollLeft;
	});
	viewport.addEventListener("pointermove", function (event) {
		if (pan.active != true) return;
		var delta = event.clientX - pan.startX;
		//A few pixels of slop, so a click is not read as a drag.
		if (pan.moved != true && Math.abs(delta) > 4) pan.moved = true;
		if (pan.moved == true) {
			viewport.scrollLeft = pan.startScroll - delta;
			event.preventDefault();
		}
	});
	function endPan() { pan.active = false; }
	viewport.addEventListener("pointerup", endPan);
	viewport.addEventListener("pointercancel", endPan);
	//Capture phase, so a genuine drag never also fires the node's onclick.
	viewport.addEventListener("click", function (event) {
		if (pan.moved != true) return;
		pan.moved = false;
		event.stopPropagation();
		event.preventDefault();
	}, true);
};

//Scrolls the viewport so the named node sits in the middle, clamped by the browser.
honeycomb.map.centerOnNode = function (nodeId) {
	var viewport = document.getElementById("honeycombMapViewport");
	var node = nodeId == null ? null : document.getElementById("honeycombMapNode-" + nodeId);
	if (viewport == null || node == null) return;
	var viewportBox = viewport.getBoundingClientRect();
	var nodeBox = node.getBoundingClientRect();
	var delta = (nodeBox.left + nodeBox.width / 2) - (viewportBox.left + viewportBox.width / 2);
	viewport.scrollLeft = Math.max(0, viewport.scrollLeft + delta);
};

//The node graph. Laid out in a 0..100 coordinate space and scaled by the SVG viewBox, so it fits any
//stage size without the JS knowing the pixel dimensions.
honeycomb.map.buildGraph = function () {
	var run = honeycomb.state.run;
	var map = run.map;
	var layout = honeycomb.map.layoutTuning;
	var rowCount = map.rowArray.length;
	var availableArray = honeycomb.map.availableNodeIdArray();

	//Positions come from the LAYOUT STRATEGY, which stored them on the nodes at generation time. The
	//renderer no longer computes a grid of its own: a map drawn over a painting has its positions
	//dictated by the painting, and only the strategy knows that.
	//
	//Node positions are normalised 0..100; the SVG's own space is wider than it is tall, so x is
	//scaled by the viewBox width and y by its height.
	var positionArray = {};
	for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
		var row = map.rowArray[rowIndex];
		for (var nodeIndex = 0; nodeIndex < row.length; nodeIndex++) {
			positionArray[row[nodeIndex].id] = honeycomb.map.stagePosition(row[nodeIndex]);
		}
	}

	//The viewBox takes the BACKDROP's shape when one is in play, so the graph and the painting
	//letterbox into the same rectangle and an anchor stays on the landmark it names.
	//
	//Deliberately NOT preserveAspectRatio="none". Stretching the SVG would keep the nodes on their
	//anchors, but it would also stretch the node circles into ellipses -- shapes inside an SVG are
	//scaled by the same transform the coordinates are. Matching the aspect instead keeps both right.
	var view = honeycomb.map.viewBox();
	var markup = '<svg class="hcMapSvg" viewBox="0 0 ' + view.width + " " + view.height +
		'" preserveAspectRatio="xMidYMid meet">';

	//Edges beneath nodes.
	markup += '<g class="hcMapEdges">';
	for (var edgeRowIndex = 0; edgeRowIndex < rowCount; edgeRowIndex++) {
		var edgeRow = map.rowArray[edgeRowIndex];
		for (var edgeNodeIndex = 0; edgeNodeIndex < edgeRow.length; edgeNodeIndex++) {
			var fromNode = edgeRow[edgeNodeIndex];
			var from = positionArray[fromNode.id];
			for (var targetIndex = 0; targetIndex < fromNode.edgeArray.length; targetIndex++) {
				var to = positionArray[fromNode.edgeArray[targetIndex]];
				if (to == null) continue;
				//An edge is "live" when it is one of the moves currently on offer.
				var live = map.currentNodeId == fromNode.id &&
					availableArray.indexOf(fromNode.edgeArray[targetIndex]) >= 0;
				var walked = fromNode.visited == true &&
					map.completedNodeIdArray.indexOf(fromNode.edgeArray[targetIndex]) >= 0;
				var edgeClass = "hcMapEdge" + (live ? " hcLive" : "") + (walked ? " hcWalked" : "");
				var midX = (from.x + to.x) / 2;
				markup += '<path class="' + edgeClass + '" d="M ' + from.x.toFixed(2) + " " + from.y.toFixed(2) +
					" C " + midX.toFixed(2) + " " + from.y.toFixed(2) + ", " +
					midX.toFixed(2) + " " + to.y.toFixed(2) + ", " +
					to.x.toFixed(2) + " " + to.y.toFixed(2) + '"/>';
			}
		}
	}
	markup += "</g>";

	//Nodes above edges.
	markup += '<g class="hcMapNodes">';
	for (var drawRowIndex = 0; drawRowIndex < rowCount; drawRowIndex++) {
		var drawRow = map.rowArray[drawRowIndex];
		for (var drawNodeIndex = 0; drawNodeIndex < drawRow.length; drawNodeIndex++) {
			markup += honeycomb.map.buildNode(drawRow[drawNodeIndex], positionArray[drawRow[drawNodeIndex].id], availableArray);
		}
	}
	markup += "</g></svg>";
	return markup;
};

//The SVG's own coordinate space. Node positions are stored normalised 0..100 and scaled into this,
//so an anchor measured as a percentage over a painting stays correct whatever size the stage is.
//
//HEIGHT IS FIXED; WIDTH FOLLOWS THE CONTENT. A longer floor is a WIDER map rather than a denser one, so
//node spacing is the same at nine rows and at eighteen. The map is drawn on a canvas sized to this
//aspect and the viewport scrolls sideways to show it.
honeycomb.map.layoutTuning = {
	baseHeight: 420,
	//The row count a procedural map is designed at: a map with N rows scales to N/reference times the
	//base width. A region's `rowCount` therefore lengthens the floor without crowding its nodes.
	referenceRowCount: 9,
	nodeRadius: 21,
};

//The viewBox for the current map. Height is fixed; width is the height times the content's aspect.
//  an ANCHORED map   the painting's own aspect, so an anchor percentage lands on the same point in both
//  a procedural map aspect times (rows / referenceRows), so a longer floor runs proportionally wider
honeycomb.map.viewBox = function () {
	var map = honeycomb.state == null || honeycomb.state.run == null ? null : honeycomb.state.run.map;
	var height = honeycomb.map.layoutTuning.baseHeight;
	if (map != null && map.backdropIndex != null) {
		return { width: height * honeycomb.map.currentAspect(), height: height };
	}
	var rowCount = map == null || map.rowArray == null
		? honeycomb.map.layoutTuning.referenceRowCount : map.rowArray.length;
	var scale = rowCount / honeycomb.map.layoutTuning.referenceRowCount;
	return { width: height * honeycomb.map.currentAspect() * scale, height: height };
};

//Width divided by height. A backdrop may declare its own; otherwise the tuning default, which is what
//the procedural layout was drawn for.
honeycomb.map.currentAspect = function () {
	var map = honeycomb.state == null || honeycomb.state.run == null ? null : honeycomb.state.run.map;
	var fallback = honeycomb.tuning.map.frame.stageAspect;
	if (map == null || map.backdropIndex == null) return fallback;
	var region = honeycomb.findDefinition(honeycomb.regionArray, map.regionIndex);
	var backdrop = region == null ? null : honeycomb.findDefinition(region.backdropArray, map.backdropIndex);
	if (backdrop == null || backdrop.aspect == null) return fallback;
	return backdrop.aspect;
};

//A node's normalised position, scaled into the SVG's coordinate space. Guards a node from before
//positions existed, so an older save renders rather than piling every node at the origin.
honeycomb.map.stagePosition = function (node) {
	var view = honeycomb.map.viewBox();
	var position = node.position == null ? { x: 50, y: 50 } : node.position;
	return {
		x: (position.x / 100) * view.width,
		y: (position.y / 100) * view.height,
	};
};

//A stable pseudo-random offset derived from a node id. Not drawn from an RNG stream: the map's shape
//is already determined by the seed, and this only needs to be consistent, not unpredictable.
//Takes separate amounts per axis: positions are percentages of a stage that is far wider than it is
//tall, so a single figure would scatter nodes much further horizontally than vertically.
honeycomb.map.wobbleFor = function (nodeId, amountX, amountY) {
	var hash = 0;
	for (var charIndex = 0; charIndex < nodeId.length; charIndex++) {
		hash = ((hash << 5) - hash + nodeId.charCodeAt(charIndex)) | 0;
	}
	var first = ((hash >>> 3) % 1000) / 1000;
	var second = ((hash >>> 13) % 1000) / 1000;
	return { x: (first - 0.5) * amountX, y: (second - 0.5) * amountY };
};

honeycomb.map.buildNode = function (node, position, availableArray) {
	if (position == null) return "";
	var type = honeycomb.findDefinition(honeycomb.nodeTypeArray, node.typeIndex);
	if (type == null) return "";

	var run = honeycomb.state.run;
	var available = availableArray.indexOf(node.id) >= 0;
	var isCurrent = run.map.currentNodeId == node.id;
	var completed = run.map.completedNodeIdArray.indexOf(node.id) >= 0;
	var radius = honeycomb.map.layoutTuning.nodeRadius;

	var classList = "hcMapNode";
	if (available) classList += " hcAvailable";
	if (isCurrent) classList += " hcCurrent";
	if (completed) classList += " hcCompleted";
	if (node.typeIndex == "boss") classList += " hcBossNode";
	if (honeycomb.map.tappedNodeId() == node.id) classList += " hcTapped";

	//Every node answers a tap, reachable or not: on a touchscreen the tap is the only way to see what a
	//node is (see onNodeClick).
	var markup = '<g class="' + classList + '" id="honeycombMapNode-' + honeycomb.escapeAttribute(node.id) + '"' +
		' style="--hcNodeColor:' + type.colorHint + '"' +
		' transform="translate(' + position.x.toFixed(2) + "," + position.y.toFixed(2) + ')"' +
		' onclick="honeycomb.map.onNodeClick(\'' + node.id + '\')"' +
		' onmouseenter="honeycomb.map.onNodeHover(\'' + node.id + '\')"' +
		' onmouseleave="honeycomb.map.onNodeHover(null)">';

	//The pad. A diamond for the boss, a circle for everything else, so the ending reads differently.
	if (node.typeIndex == "boss") {
		markup += '<rect class="hcMapNodePad" x="' + (-radius) + '" y="' + (-radius) +
			'" width="' + (radius * 2) + '" height="' + (radius * 2) + '" transform="rotate(45)" rx="4"/>';
	} else {
		markup += '<circle class="hcMapNodePad" r="' + radius + '"/>';
	}
	//A pulse ring on anything the player may step to right now.
	if (available) markup += '<circle class="hcMapNodeRing" r="' + (radius + 5) + '"/>';

	//The icon sits inside the pad. Real art first, generated glyph if it is missing.
	var iconSize = radius * 1.25;
	markup += '<image class="hcMapNodeIcon" x="' + (-iconSize / 2) + '" y="' + (-iconSize / 2) +
		'" width="' + iconSize + '" height="' + iconSize +
		'" href="' + honeycomb.svgToDataUri(honeycomb.ui.glyph(type.glyph, type.colorHint, true)) + '"/>';

	markup += "</g>";
	return markup;
};

honeycomb.map.buildLegend = function () {
	var markup = '<div class="hcMapLegend">';
	for (var typeIndex = 0; typeIndex < honeycomb.nodeTypeArray.length; typeIndex++) {
		var type = honeycomb.nodeTypeArray[typeIndex];
		markup += '<div class="hcMapLegendEntry" title="' + honeycomb.escapeAttribute(type.description) + '">' +
			honeycomb.ui.iconTag(type.iconPath, type.glyph, type.colorHint, { className: "hcInlineIcon" }) +
			"<span>" + honeycomb.escapeText(type.name) + "</span></div>";
	}
	markup += "</div>";
	return markup;
};

//The preview panel in the lower left. Populated on hover; shows the current node's own details when
//nothing is hovered, so it is never blank.
honeycomb.map.buildPreviewCard = function () {
	return '<div class="hcMapPreview" id="honeycombMapPreview">' + honeycomb.map.previewContents(null) + "</div>";
};

honeycomb.map.previewContents = function (nodeId) {
	var run = honeycomb.state.run;
	var node = nodeId == null ? null : honeycomb.map.findNode(nodeId);

	if (node == null) {
		var availableArray = honeycomb.map.availableNodeIdArray();
		if (availableArray.length === 0) {
			//NEVER A DEAD END. With no moves on offer there is always a button: back into whatever the
			//party is standing on, or on down once the region is cleared.
			var cleared = honeycomb.map.regionComplete();
			return '<div class="hcMapPreviewBody"><div class="hcMapPreviewTitle">' +
				(cleared ? "Region cleared" : "Unfinished business") +
				'</div><div class="hcTiny hcMuted">' +
				(cleared ? "The way down is open." : "Finish what is in front of you first.") + "</div>" +
				'<div class="hcButton hcPrimary hcSmall hcMapResumeButton" onclick="honeycomb.map.resumeUnfinishedNode()">' +
				(cleared ? "Go down" : "Pick up where you left off") + "</div></div>";
		}
		return '<div class="hcMapPreviewBody"><div class="hcMapPreviewTitle">Choose a path</div>' +
			'<div class="hcTiny hcMuted">' + availableArray.length +
			" route" + (availableArray.length === 1 ? "" : "s") + " ahead. Hover one to see what waits.</div></div>";
	}

	var type = honeycomb.findDefinition(honeycomb.nodeTypeArray, node.typeIndex);
	if (type == null) return "";

	var detail = type.description;
	//Combat nodes name the tier rather than the exact enemies: the map should inform, not spoil.
	if (node.encounterIndex != null) {
		var encounter = honeycomb.findDefinition(honeycomb.encounterArray, node.encounterIndex);
		if (encounter != null) {
			//The count the party will actually face, party-size scaling included.
			var foeCount = honeycomb.combat == null ? encounter.enemyIndexArray.length : honeycomb.combat.scaledEnemyCount(encounter);
			detail = foeCount + " foe" + (foeCount === 1 ? "" : "s") + ". " + type.description;
		}
	}

	//A boss the profile has already met names itself: the Act1-1 boss decides the route, so the node
	//says which boss it is and where beating it leads. Gated on honeycomb.discovery, so a first meeting
	//is still a surprise.
	var bossTitle = null;
	var bossLineArray = [];
	if (node.typeIndex == "boss" && node.encounterIndex != null) {
		var bossEncounter = honeycomb.findDefinition(honeycomb.encounterArray, node.encounterIndex);
		var bossIndex = bossEncounter == null || bossEncounter.enemyIndexArray == null ? null : bossEncounter.enemyIndexArray[0];
		var boss = bossIndex == null ? null : honeycomb.findDefinition(honeycomb.enemyArray, bossIndex);
		if (boss != null && honeycomb.discovery != null && honeycomb.discovery.isKnown("enemy", bossIndex) == true) {
			bossTitle = boss.name;
			if (boss.baseHealth != null) bossLineArray.push(boss.baseHealth + " HP");
			//WHERE BEATING IT LEADS. The route is decided by which Act1-1 boss the run beats
			//(tuning.map.route.byBossArray), so this is the one place a player can learn the rule.
			var routeTable = honeycomb.tuning.map.route;
			var routeEntry = routeTable == null || routeTable.byBossArray == null ? null
				: routeTable.byBossArray.filter(function (row) { return row.bossEncounterIndex == node.encounterIndex; })[0];
			var destination = routeEntry == null ? null : honeycomb.findDefinition(honeycomb.regionArray, routeEntry.regionIndex);
			if (destination != null) bossLineArray.push("Beating it leads to " + destination.name);
		}
	}

	var markup = '<div class="hcMapPreviewArt">' +
		honeycomb.imageTag(type.previewImagePath, { alt: type.name }) + "</div>";
	markup += '<div class="hcMapPreviewBody">';
	markup += '<div class="hcMapPreviewTitle" style="color:' + type.colorHint + '">' +
		honeycomb.escapeText(bossTitle == null ? type.name : bossTitle) + "</div>";
	markup += '<div class="hcTiny hcMuted">' + honeycomb.escapeText(detail) + "</div>";
	if (bossLineArray.length > 0) {
		markup += '<div class="hcTiny hcMuted">' + honeycomb.escapeText(bossLineArray.join(". ") + ".") + "</div>";
	}
	if (honeycomb.map.canEnter(node.id)) {
		markup += '<div class="hcButton hcPrimary hcSmall" onclick="honeycomb.map.onNodeClick(\'' +
			node.id + '\')">Proceed &rsaquo;</div>';
	}
	markup += "</div>";
	return markup;
};

//--- Interaction ------------------------------------------------------------------------------------
//Hover repaints only the preview panel, not the whole scene: rebuilding the map on every mouse move
//would throw away the SVG and retrigger its animations.
//Leaving a node puts back whichever node a first TAP chose, so a touch player's preview stays up.
honeycomb.map.onNodeHover = function (nodeId) {
	var panel = document.getElementById("honeycombMapPreview");
	if (panel == null) return;
	var shownId = nodeId == null ? honeycomb.map.tappedNodeId() : nodeId;
	panel.innerHTML = honeycomb.map.previewContents(shownId);
};

//The node a first tap readied, or null. See honeycomb.input.tapToAct.
honeycomb.map.tappedNodeId = function () {
	var key = honeycomb.input.armedKey;
	return key != null && String(key).indexOf("mapNode:") === 0 ? String(key).slice("mapNode:".length) : null;
};

//A click travels. A TAP previews first -- what hovering does with a mouse -- and a second tap on the
//same node travels. A node that cannot be entered only ever previews.
honeycomb.map.onNodeClick = function (nodeId) {
	var enterable = honeycomb.map.canEnter(nodeId);
	if (enterable == false || honeycomb.input.tapToAct("mapNode:" + nodeId) == false) {
		if (enterable == false && honeycomb.map.tappedNodeId() != null) honeycomb.input.disarm();
		honeycomb.map.onNodeHover(nodeId);
		honeycomb.map.markTappedNode(enterable ? nodeId : null);
		if (enterable) honeycomb.platform.sound("uiClick");
		return;
	}
	honeycomb.map.markTappedNode(null);
	honeycomb.platform.sound("uiClick");
	honeycomb.map.enterNode(nodeId);
};

//The readied node wears a ring, so a touch player can see which one the next tap would take them to.
honeycomb.map.markTappedNode = function (nodeId) {
	var nodeArray = document.querySelectorAll(".hcMapNode.hcTapped");
	for (var scanIndex = 0; scanIndex < nodeArray.length; scanIndex++) nodeArray[scanIndex].classList.remove("hcTapped");
	if (nodeId == null) return;
	var element = document.getElementById("honeycombMapNode-" + nodeId);
	if (element != null) element.classList.add("hcTapped");
};

//A node is entered -- and autosaved -- BEFORE its screen opens, so a reload can land on the map
//standing on a node whose event, shop or treasure is no longer showing. An unfinished node offers no
//onward moves, so without this the party would be stuck with no way out.
//
//Re-opening the node's screen is SAFE because nothing a node's screen does is saved until the node
//completes: the replay starts from exactly the state the first visit started from, RNG counters
//included, so a treasure rolls the same treasure and an event offers the same choice.
//
//Returns true when it re-opened something.
honeycomb.map.resumeUnfinishedNode = function () {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null || run.map == null) return false;
	//A fight resumes itself, through resumeScene.
	if (run.combat != null) return false;
	if (honeycomb.map.regionComplete() == true) {
		honeycomb.overlay.open("regionCleared", {});
		return true;
	}
	if (run.map.currentNodeId == null) return false;

	var node = honeycomb.map.findNode(run.map.currentNodeId);
	if (node == null) {
		//Standing on a node that is not on this map any more. Step back to the last one finished rather
		//than stranding the party; with nothing finished, the opening row is offered again.
		var completedArray = run.map.completedNodeIdArray == null ? [] : run.map.completedNodeIdArray;
		run.map.currentNodeId = completedArray.length > 0 ? completedArray[completedArray.length - 1] : null;
		honeycomb.scene.go("map");
		return true;
	}
	if (node.visited == true) return false;

	var type = honeycomb.findDefinition(honeycomb.nodeTypeArray, node.typeIndex);
	if (type == null) {
		//A node of a type that no longer exists cannot be finished, so it is let go.
		honeycomb.map.returnToMap();
		return true;
	}
	type.onEnter(node);
	return true;
};

//Called by whatever a node opened, once that business is done. Returns the player to the map with the
//node marked off, or moves the run on if the boss has fallen.
honeycomb.map.returnToMap = function () {
	honeycomb.map.completeCurrentNode();
	if (honeycomb.map.regionComplete() == true) {
		honeycomb.overlay.open("regionCleared", {});
		return;
	}
	honeycomb.scene.go("map");
};
