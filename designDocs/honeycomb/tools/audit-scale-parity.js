//===================================================================================================
//HONEYCOMB CATACOMBS -- scale parity audit (developer tool, never loaded by the game)
//===================================================================================================
//Proves that a phone in landscape shows a faithful scaled copy of the desktop. Every element under the
//root and the overlay host is measured -- box and font size -- DIVIDED BY THE VIEWPORT HEIGHT, and two
//snapshots taken at different sizes of the same aspect ratio are compared. A true scale-down reports 0.
//
//Use, in the Browser pane with the dev server running and devPreviewTarget = "honeycomb":
//  1. Load it into the page (it does not survive a reload, so load it again after each one):
//       await new Promise(r=>{var s=document.createElement('script');s.src='/!designDocs/honeycomb/tools/audit-scale-parity.js?'+Date.now();s.onload=r;document.head.appendChild(s);})
//  2. hcAudit.backup() once, so every run starts from the same save; hcAudit.restore() before each reload.
//  3. At 1920x902: reload, then `await hcAudit.go("menu")` (see `scenarios`). Snapshot is "menu-D".
//  4. At 858x403 (the same 2.13 aspect): reload, `await hcAudit.go("menu")`. Snapshot is "menu-M".
//  5. hcAudit.compare("menu-D", "menu-M").
//
//READING THE RESULT. At 1x pixel density (the emulator) a phone-sized copy still shows small differences
//that are not layout: a 0.45px hairline border rounds up to a whole pixel, and 6px text measures a
//little wide. To tell those apart from a real mismatch, compare the desktop against EXACTLY 2x instead
//(3840x1804), where nothing rounds -- session 6 got 0 mismatches in every scene that way. Elements whose
//text changed between the two runs are counted as `textDiff` and skipped, since a different number in
//the top bar is state, not layout.
window.hcAudit = {
	path: function (el) {
		var parts = [];
		while (el && el.id !== "honeycombRoot" && el.id !== "honeycombOverlayHost" && el.parentElement) {
			var cls = (typeof el.className === "string" ? el.className : (el.className && el.className.baseVal) || "").trim().split(/\s+/)[0] || "";
			var i = 0, s = el;
			while ((s = s.previousElementSibling)) i++;
			parts.unshift(el.tagName.toLowerCase() + (cls ? "." + cls : "") + ":" + i);
			el = el.parentElement;
		}
		return (el ? el.id : "?") + ">" + parts.join(">");
	},
	snap: function (label) {
		var H = innerHeight, out = {};
		["honeycombRoot", "honeycombOverlayHost"].forEach(function (id) {
			var host = document.getElementById(id);
			if (!host) return;
			host.querySelectorAll("*").forEach(function (el) {
				var r = el.getBoundingClientRect();
				if (r.width === 0 && r.height === 0) return;
				var cs = getComputedStyle(el);
				if (cs.display === "none" || cs.visibility === "hidden") return;
				out[hcAudit.path(el)] = [r.left / H, r.top / H, r.width / H, r.height / H, parseFloat(cs.fontSize) / H, el.scrollHeight > el.clientHeight + 1 && /auto|scroll/.test(cs.overflowY) ? 1 : 0, (el.textContent || "").length];
			});
		});
		localStorage.setItem("hcAudit:" + label, JSON.stringify({ W: innerWidth, H: H, out: out }));
		return { label: label, W: innerWidth, H: H, count: Object.keys(out).length };
	},
	backup: function () {
		var keep = {};
		for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (/^honeycomb/.test(k)) keep[k] = localStorage.getItem(k); }
		localStorage.setItem("hcAuditBackup", JSON.stringify(keep));
		return Object.keys(keep);
	},
	restore: function () {
		var keep = JSON.parse(localStorage.getItem("hcAuditBackup"));
		for (var k in keep) localStorage.setItem(k, keep[k]);
		return Object.keys(keep).length;
	},
	scenarios: {
		combat: function () {},
		menu: function () { honeycomb.overlay.open("systemMenu"); },
		deck: function () { honeycomb.overlay.open("deck", {}); },
		log: function () { honeycomb.overlay.open("battleLog", {}); },
		victory: function () { honeycomb.overlay.open("victory", {}); },
		debug: function () { honeycomb.overlay.open("debug", {}); },
		compendium: function () { honeycomb.overlay.open("compendium", {}); },
		map: function () { honeycomb.scene.go("map"); },
		event: function () { honeycomb.scene.go("map"); honeycomb.overlay.open("event", { eventIndex: honeycomb.debug.testEventIndex }); },
		shop: function () {
			honeycomb.scene.go("map");
			var rows = honeycomb.state.run.map.rowArray, id = null;
			rows.forEach(function (row) { (row.nodeArray || row).forEach(function (n) { if (id == null && n.type == "shop") id = n.id; }); });
			honeycomb.overlay.open("shop", { nodeId: id });
		},
		team: function () { honeycomb.scene.go("teambuilding"); },
		tree: function () { honeycomb.scene.go("teambuilding"); var p = [].slice.call(document.querySelectorAll(".hcTab")).filter(function (t) { return /Progression/.test(t.textContent); })[0]; if (p) p.click(); },
		title: function () { honeycomb.scene.go("title"); },
	},
	go: async function (name, extraMs) {
		await hcAudit.wait(3500);
		hcAudit.scenarios[name]();
		await hcAudit.wait(extraMs || 1200);
		return hcAudit.snap(name + "-" + (innerWidth > 1000 ? "D" : "M"));
	},
	wait: function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); },
	compare: function (a, b, limit) {
		var A = JSON.parse(localStorage.getItem("hcAudit:" + a)), B = JSON.parse(localStorage.getItem("hcAudit:" + b));
		var tol = 2 / Math.min(A.H, B.H), bad = [], missingA = 0, missingB = 0, textDiff = 0, names = ["x", "y", "w", "h", "fs"];
		for (var k in A.out) {
			if (!B.out[k]) { missingB++; continue; }
			if (A.out[k][6] !== B.out[k][6]) { textDiff++; continue; }
			var diffs = [];
			for (var n = 0; n < 5; n++) {
				var d = Math.abs(A.out[k][n] - B.out[k][n]);
				if (d > tol + 0.01 * Math.abs(A.out[k][n])) diffs.push(names[n] + " " + Math.round(A.out[k][n] * A.H) + "→" + Math.round(B.out[k][n] * A.H));
			}
			if (diffs.length) bad.push(k.slice(-90) + "  " + diffs.join(", "));
		}
		for (var j in B.out) if (!A.out[j]) missingA++;
		return { total: Object.keys(A.out).length, textDiff: textDiff, mismatched: bad.length, onlyInA: missingB, onlyInB: missingA, sample: bad.slice(0, limit || 25) };
	},
};
"audit loaded";
