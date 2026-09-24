/**
 * Compares a deployed copy of the game (the Public Test Release by default) against the local files.
 * Not part of the game.
 *
 * A page that is out of date loses whatever it no longer loads, and the game carries on without it.
 *
 * What it checks:
 *   1. index.html and mobile.html: every script and stylesheet tag the local page has, the deployed page
 *      also has, and the reverse.
 *   2. every script and stylesheet those pages load: the deployed file has the same byte length as the
 *      local one. A different length means the upload is behind (or ahead). Equal length is not proof of
 *      equal content, but a stale upload almost never matches to the byte.
 *
 *   node "!designDocs/honeycomb/tools/ptr-check.js"                  checks the PTR
 *   node "!designDocs/honeycomb/tools/ptr-check.js" <base url>       checks another copy
 *
 * scripts/index.js is expected to differ by nothing; a devPreviewTarget left set shows up as a size
 * difference on that file.
 */
const fs = require("fs"), path = require("path");

const ROOT = path.resolve(__dirname, "..", "..", "..");
const BASE = (process.argv[2] || "https://noodlejacuzzi.neocities.org/syrup-town-ptr/").replace(/\/?$/, "/");
const PAGE_ARRAY = ["index.html", "mobile.html"];

function assetList(html) {
	const found = [];
	const pattern = /<(?:script[^>]*\ssrc|link[^>]*\shref)\s*=\s*"([^"]+)"/g;
	let match;
	while ((match = pattern.exec(html)) != null) {
		const asset = match[1];
		if (/^https?:|^\/\//.test(asset) || /\.ico$/.test(asset)) continue;
		found.push(asset);
	}
	return found;
}

async function fetchText(relative) {
	const response = await fetch(BASE + relative, { headers: { "User-Agent": "Mozilla/5.0", "Cache-Control": "no-cache" } });
	if (response.ok == false) return { status: response.status, text: null };
	return { status: response.status, text: Buffer.from(await response.arrayBuffer()) };
}

(async () => {
	let problemCount = 0;
	const problem = (line) => { problemCount++; console.log("  PROBLEM  " + line); };
	const assetSet = new Set();

	console.log("Comparing " + BASE + " against " + ROOT + "\n");
	for (const page of PAGE_ARRAY) {
		console.log(page);
		const localHtml = fs.readFileSync(path.join(ROOT, page), "utf8");
		const remote = await fetchText(page);
		if (remote.text == null) { problem(page + " could not be fetched (HTTP " + remote.status + ")"); continue; }
		const localArray = assetList(localHtml), remoteArray = assetList(remote.text.toString("utf8"));
		for (const asset of localArray) {
			assetSet.add(asset.split("?")[0].split("'")[0]);
			if (remoteArray.indexOf(asset) < 0) problem("deployed " + page + " does not load " + asset);
		}
		for (const asset of remoteArray) {
			if (localArray.indexOf(asset) < 0) problem("deployed " + page + " loads " + asset + ", which the local page does not");
		}
		if (localArray.every((asset) => remoteArray.indexOf(asset) >= 0) && remoteArray.every((asset) => localArray.indexOf(asset) >= 0)) {
			console.log("  ok       all " + localArray.length + " tags match");
		}
	}

	//honeycomb-loader.js, run in a fake document, names every Honeycomb script and stylesheet the pages load.
	const loaderPath = path.join(ROOT, "scripts", "misc", "honeycomb", "honeycomb-loader.js");
	if (fs.existsSync(loaderPath)) {
		const sandbox = { Date, Math, String };
		require("vm").createContext(sandbox);
		require("vm").runInContext(fs.readFileSync(loaderPath, "utf8") + "\nthis.honeycombLoader = honeycombLoader;", sandbox);
		for (const file of sandbox.honeycombLoader.scriptArray.concat(sandbox.honeycombLoader.styleArray)) assetSet.add(file);
		console.log("\nhoneycomb-loader.js lists " + (sandbox.honeycombLoader.scriptArray.length + sandbox.honeycombLoader.styleArray.length) + " files");
	}

	console.log("\nfiles those pages load");
	let sameCount = 0;
	for (const asset of assetSet) {
		const localPath = path.join(ROOT, asset);
		if (fs.existsSync(localPath) == false) { problem(asset + " is loaded by a local page but does not exist locally"); continue; }
		const remote = await fetchText(asset);
		if (remote.text == null) { problem(asset + " is missing from the deployed copy (HTTP " + remote.status + ")"); continue; }
		const localSize = fs.statSync(localPath).size;
		if (remote.text.length != localSize) problem(asset + " differs: local " + localSize + " bytes, deployed " + remote.text.length);
		else sameCount++;
	}
	console.log("  ok       " + sameCount + " of " + assetSet.size + " files match in size");

	console.log("\n" + (problemCount === 0 ? "The deployed copy matches." : problemCount + " problem(s)."));
	process.exitCode = problemCount === 0 ? 0 : 1;
})();
