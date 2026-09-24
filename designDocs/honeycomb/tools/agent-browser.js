// Dev-only browser driver for the agent. NOT part of the game and not loaded by it.
//
// The desktop app's MCP plumbing was not connecting, so this uses the Playwright bundled with
// @playwright/mcp and the SYSTEM Chrome channel directly -- no browser download, no MCP.
//
// Usage:
//   node "!designDocs/honeycomb/tools/agent-browser.js" --out shot.png
//     [--url http://localhost:8000/index.html] [--viewport 1280x720] [--wait 4000]
//     [--eval "<js run in the page>"] [--console] [--full] [--scale 1]
//
// The game exposes `window.honeycomb`, so --eval can drive it, e.g.:
//   --eval "honeycomb.scene.go('teambuilding')"
// Screenshots land where --out says; read them back with the Read tool.
const path = require("path");
const fs = require("fs");

function loadPlaywright() {
	var candidates = [];
	if (process.env.PLAYWRIGHT_MODULE) candidates.push(process.env.PLAYWRIGHT_MODULE);
	if (process.env.APPDATA) {
		candidates.push(path.join(process.env.APPDATA, "npm", "node_modules", "@playwright", "mcp", "node_modules", "playwright"));
		candidates.push(path.join(process.env.APPDATA, "npm", "node_modules", "playwright"));
	}
	for (var candidateIndex = 0; candidateIndex < candidates.length; candidateIndex++) {
		try { return require(candidates[candidateIndex]); } catch (error) { /* try the next */ }
	}
	return require("playwright");
}

function argument(name, fallback) {
	var index = process.argv.indexOf("--" + name);
	if (index < 0) return fallback;
	var value = process.argv[index + 1];
	return value == null || value.indexOf("--") === 0 ? true : value;
}

(async function () {
	var playwright = loadPlaywright();
	var url = argument("url", "http://localhost:8000/index.html");
	var out = argument("out", path.join(process.env.TEMP, "hc-shot.png"));
	var size = String(argument("viewport", "1280x720")).split("x").map(Number);
	var wait = Number(argument("wait", 4000));
	var evalScript = argument("eval", null);
	var evalFile = argument("eval-file", null);
	if (evalFile != null) evalScript = fs.readFileSync(String(evalFile), "utf8");
	var showConsole = argument("console", false);
	var fullPage = argument("full", false);
	var scale = Number(argument("scale", 1));

	var browser = await playwright.chromium.launch({ channel: "chrome", headless: true });
	var context = await browser.newContext({
		viewport: { width: size[0], height: size[1] },
		deviceScaleFactor: scale,
	});
	var page = await context.newPage();
	var logArray = [];
	page.on("console", function (message) { logArray.push("[" + message.type() + "] " + message.text()); });
	page.on("pageerror", function (error) { logArray.push("[pageerror] " + error.message); });

	await page.goto(url, { waitUntil: "load", timeout: 30000 });
	await page.waitForTimeout(wait);
	if (evalScript != null) {
		var result = await page.evaluate(String(evalScript));
		if (result !== undefined) logArray.push("[eval] " + JSON.stringify(result));
		await page.waitForTimeout(Number(argument("after", 1200)));
	}
	//A real pointer hover, so inline mouseenter handlers (tooltips) fire the way they do for a player.
	var hoverSelector = argument("hover", null);
	if (hoverSelector != null) {
		await page.hover(String(hoverSelector), { timeout: 5000 }).catch(function () { logArray.push("[hover] not found: " + hoverSelector); });
		await page.waitForTimeout(700);
	}
	await page.screenshot({ path: out, fullPage: fullPage });
	if (showConsole) console.log(logArray.join("\n"));
	console.log("saved " + out + " (" + fs.statSync(out).size + " bytes)");
	await browser.close();
})().catch(function (error) {
	console.error(error);
	process.exit(1);
});
