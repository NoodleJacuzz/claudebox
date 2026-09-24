//===================================================================================================
//HONEYCOMB CATACOMBS -- the file list and the loader
//===================================================================================================
//The pages load this file. Every Honeycomb script and stylesheet is listed here, so adding or renaming
//one never touches index.html or mobile.html.
//
//Each file is requested with ?v= and a number that changes every refreshMinutes. Neocities sends no
//Cache-Control header, so without it browsers keep stale files until a hard refresh. No ?v= from file://.
//Scripts are appended with async off, so they run in list order. The list is the load order.
var honeycombLoader = {
	//How often, in minutes, every player's browser fetches the files again. Lower means an upload is seen
	//sooner and players download the ~0.9 MB of compressed code more often.
	refreshMinutes: 60,

	scriptArray: [
		"scripts/misc/honeycomb.js",
		"scripts/misc/honeycomb/honeycomb-tuning.js",
		"scripts/misc/honeycomb/honeycomb-state.js",
		"scripts/misc/honeycomb/honeycomb-effects.js",
		"scripts/misc/honeycomb/honeycomb-entities.js",
		"scripts/misc/honeycomb/honeycomb-tags.js",
		"scripts/misc/honeycomb/honeycomb-content-statuses.js",
		"scripts/misc/honeycomb/honeycomb-content-cards.js",
		"scripts/misc/honeycomb/honeycomb-content-characters.js",
		"scripts/misc/honeycomb/honeycomb-content-abilities.js",
		"scripts/misc/honeycomb/honeycomb-abilities.js",
		"scripts/misc/honeycomb/honeycomb-content-enemies.js",
		"scripts/misc/honeycomb/honeycomb-content-map.js",
		"scripts/misc/honeycomb/honeycomb-content-lust-events.js",
		"scripts/misc/honeycomb/honeycomb-progression.js",
		"scripts/misc/honeycomb/honeycomb-combat.js",
		"scripts/misc/honeycomb/honeycomb-map.js",
		"scripts/misc/honeycomb/honeycomb-art.js",
		"scripts/misc/honeycomb/honeycomb-ui.js",
		"scripts/misc/honeycomb/honeycomb-text-tooltips.js",
		"scripts/misc/honeycomb/honeycomb-tooltip.js",
		"scripts/misc/honeycomb/honeycomb-choices.js",
		"scripts/misc/honeycomb/honeycomb-forecast.js",
		"scripts/misc/honeycomb/honeycomb-overlays-map.js",
		"scripts/misc/honeycomb/honeycomb-scene-title.js",
		"scripts/misc/honeycomb/honeycomb-overlays-deck.js",
		"scripts/misc/honeycomb/honeycomb-overlays-progression.js",
		"scripts/misc/honeycomb/honeycomb-scene-teambuilding.js",
		"scripts/misc/honeycomb/honeycomb-scene-combat.js",
		"scripts/misc/honeycomb/honeycomb-overlays-combat.js",
		"scripts/misc/honeycomb/honeycomb-lust-events.js",
		"scripts/misc/honeycomb/honeycomb-gallery.js",
		"scripts/misc/honeycomb/honeycomb-music.js",
		"scripts/misc/honeycomb/honeycomb-overlays-broken.js",
		"scripts/misc/honeycomb/honeycomb-overlays-lab.js",
		"scripts/misc/honeycomb/honeycomb-font-metrics.js",
		"scripts/misc/honeycomb/honeycomb-sprite-metrics.js",
		"scripts/misc/honeycomb/honeycomb-warnings.js",
	],

	styleArray: [
		"scripts/css/honeycomb.css",
	],

	version: function () {
		return String(Math.floor(Date.now() / (honeycombLoader.refreshMinutes * 60000)));
	},

	//"?v=<number>" on a server, nothing from a file.
	query: function () {
		if (typeof location !== "undefined" && location.protocol === "file:") return "";
		return "?v=" + honeycombLoader.version();
	},

	//Stylesheets go at the end of the head, after style.css, so Honeycomb's rules win as before.
	load: function () {
		var head = document.getElementsByTagName("head")[0];
		var query = honeycombLoader.query();
		for (var styleIndex = 0; styleIndex < honeycombLoader.styleArray.length; styleIndex++) {
			var link = document.createElement("link");
			link.rel = "stylesheet";
			link.type = "text/css";
			link.href = honeycombLoader.styleArray[styleIndex] + query;
			head.appendChild(link);
		}
		for (var scriptIndex = 0; scriptIndex < honeycombLoader.scriptArray.length; scriptIndex++) {
			var script = document.createElement("script");
			script.src = honeycombLoader.scriptArray[scriptIndex] + query;
			script.async = false;
			head.appendChild(script);
		}
	},
};

//Tools read the list without a page, so loading waits for a real document.
if (typeof document !== "undefined" && typeof document.createElement === "function") honeycombLoader.load();
