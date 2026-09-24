# Lust events — three small engine changes

**ALL THREE ARE CLOSED, session 49.** Two were built and the third turned out not to be needed. The
spec below is kept as the record of what was done and why.

| | |
|---|---|
| **1. Italics and bold** | **BUILT.** `honeycomb.escapeRichText` is in `scripts/misc/honeycomb.js` beside `escapeText`, and four prose sites in `honeycomb-overlays-map.js` use it: the page body, a spoken line, the result text and the lead-in text a page-turning choice leaves. The speaker name stays on `escapeText`. Allowlist is `i`, `b`, `br` and nothing else; an `<img onerror=…>` still comes out as visible text. |
| **2. Per-page art** | **BUILT.** `render` resolves `backgroundPath`, `imagePath` and `speakerPath` off the page with the event as the fallback, hoisted above the backdrop block as this file warned. A single-page event renders exactly as before. |
| **3. The "Later..." button** | **BUILT, session 50, and I got this wrong first time.** The button label needed no engine support — a page-turn is an authored choice, so a scene writes `text: "Later..."` — and I stopped there. But the button was only half of it: the DIVIDER ITSELF was never drawn, and that is the part the reader sees. Noodle: "the ... horzontal divider doesn't appear, at all". It is now a line in `lineArray` (`{ divider: true }`), matching his bare `t ...`, drawn as a rule across the panel by `renderDialogue`. A line rather than a page flag, because his format puts it inside the beat, sometimes in the middle of one. |

**Written session 48, for whichever session has the game files.** All three were small, all three
blocked scene work, and none had been applied because another agent was live in
`honeycomb-overlays-map.js` at the time. Nothing here touches the lust event queue itself.

---

## 1. Italics and bold in event text

**Why.** Noodle writes `<i>` in scene text — his own Nettle venom 2 has *"It's changing, `<i>`and`</i>`
it's changing me!"* Event prose goes through `honeycomb.escapeText`, which turns `<` and `>` into
entities, so those tags print literally on screen. He asked for italics and bold *"without too much
change to my workflow"*, so the answer is to keep the tags he already writes and make them render.

**The change.** A rich-text escaper beside the plain one in `scripts/misc/honeycomb.js`, which escapes
everything and then restores a fixed allowlist. No arbitrary HTML gets through.

```js
//Event prose may carry <i> and <b>, which Noodle writes by hand. Everything is escaped first and only
//these four tags are put back, so a content typo can still never inject markup.
honeycomb.escapeRichText = function (value) {
	return honeycomb.escapeText(value)
		.replace(/&lt;(\/?)(i|b)&gt;/g, "<$1$2>");
};
```

**Where to use it** — `honeycomb-overlays-map.js`, and only for author-written prose:

| Line | Currently | Becomes |
|---|---|---|
| `renderDialogue` | `escapeText(say(line.text))` | `escapeRichText(say(line.text))` |
| the body text | `escapeText(say(page.text))` | `escapeRichText(say(page.text))` |
| the result text | `escapeText(say(resultText))` | `escapeRichText(say(resultText))` |

**Leave the speaker name on `escapeText`** — it is a label, not prose, and there is no reason for it to
carry markup.

**`<br>` is included, confirmed by Noodle.** Its absence is the clearest tell of another writer in the
Syrup Town corpus, and chained beats inside one spoken line are a real part of the voice. The allowlist
is therefore `i`, `b` and `br`, and the regex above already covers the self-closing spellings people
type by habit:

```js
honeycomb.escapeRichText = function (value) {
	return honeycomb.escapeText(value)
		.replace(/&lt;(\/?)(i|b)&gt;/g, "<$1$2>")
		.replace(/&lt;br\s*\/?&gt;/g, "<br>");
};
```

Once this lands, `scene-metrics.py check` stops producing a false `<br> ABSENT` on Honeycomb drafts,
and the note about that in the scenes skill should be removed.

---

## 2. Per-page art

**Why.** Every scene Noodle has planned is two to four images, one per beat. Beats are pages. But
`page.text` and `renderDialogue(page)` read from the page while `backgroundPath`, `imagePath` and
`speakerPath` are read off the base event, so every page of one event shows the same picture.

**The change.** In `renderScene`, resolve the three art fields from the page with the event as
fallback, before they are used:

```js
var page = honeycomb.eventOverlay.pageFor(event, honeycomb.eventOverlay.pageIndex);
var backgroundPath = page.backgroundPath == null ? event.backgroundPath : page.backgroundPath;
var imagePath = page.imagePath == null ? event.imagePath : page.imagePath;
var speakerPath = page.speakerPath == null ? event.speakerPath : page.speakerPath;
```

`pageFor` already returns the event itself when there is no page, so a single-page event is unchanged.
**Note the ordering problem:** `page` is currently resolved *after* the art is drawn, so it has to be
hoisted above the backdrop block.

**Chaining separate events would also work and needs no engine change** — but it splits one scene
across several `eventArray` entries, which breaks the queue's one-row-one-scene model and its
completion key. Per-page art is the better fix.

---

## 3. The "Later..." continue button

**Why.** Noodle's convention, from his own scene: a horizontal divider at the end of a beat means time
has passed. He writes it as a bare `t ...` line.

**The change.** A page may carry `later: true`. The continue button then reads **"Later..."** instead
of **"Continue"**. The label belongs in `honeycomb-text-tooltips.js` or the event host's `finishLabel`
neighbourhood rather than inline, so it is one string to change.

Whether the divider is also *drawn* as a rule across the panel is a visual call for Noodle. The button
label is the part the scenes already depend on.

---

## Not in scope here

The Gallery, the teambuilding heart button and the map's party icons were assigned to another session
and are deliberately absent from this file.
