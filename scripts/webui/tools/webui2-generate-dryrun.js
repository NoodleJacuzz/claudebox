// RETIRED, session 49. This was the in-page half of the browser-driven webui2-generate.js, which
// stalled after one image with Forge idle. That tool no longer opens a browser, so nothing calls
// this file. Kept because it is the only record of how to exercise the real generation scene from
// the outside, which is still the right shape for a test OF THE PAGE — it is the wrong shape for
// generating images.
//
// Dry run: build the generation scene, feed it the combo block, and capture every prompt that
// WOULD be sent — without sending. `testing = true` stops sendPrompt before the POST.
(async function () {
	const report = { ok: false, steps: [] };
	try {
		generatetxt2img();
		report.steps.push("scene built");

		const block = window.__BLOCK__;
		document.getElementById("promptInput").value = block;
		document.getElementById("negativeInput").value = "";
		document.getElementById("modeInput").value = "combo";
		document.getElementById("sizeInput").value = window.__SIZE__ || "Semi-Wide";
		document.getElementById("batchInput").value = "1";
		document.getElementById("engineInput").value = "v2";
		document.getElementById("styleInput").value = window.__STYLE__ || "Oreteki18kin";
		if (typeof saveSelectors === "function") saveSelectors();
		report.steps.push("controls set");

		// Capture instead of send.
		testing = true;
		const captured = [];
		const realSendPrompt = window.sendPrompt;
		window.sendPrompt = async function (prompt, negative, size, batch, style) {
			const before = { finalWidth: window.finalWidth, finalHeight: window.finalHeight };
			await realSendPrompt(prompt, negative, size, batch, style);
			captured.push({
				size: size,
				style: style,
				width: window.finalWidth,
				height: window.finalHeight,
				input: String(prompt).slice(0, 220),
			});
		};

		await sendPromptArray(
			document.getElementById("promptInput").value,
			document.getElementById("negativeInput").value,
			document.getElementById("sizeInput").value,
			document.getElementById("batchInput").value,
			document.getElementById("styleInput").value
		);

		window.sendPrompt = realSendPrompt;
		testing = false;

		report.count = captured.length;
		report.sizes = captured.map(function (c) { return c.width + "x" + c.height; });
		report.styles = Array.from(new Set(captured.map(function (c) { return c.style; })));
		report.first = captured.length ? captured[0].input : null;
		report.last = captured.length ? captured[captured.length - 1].input : null;
		report.ok = true;
	} catch (error) {
		report.error = String(error && error.message ? error.message : error);
		report.stack = String(error && error.stack ? error.stack : "").slice(0, 400);
	}
	return report;
})()
