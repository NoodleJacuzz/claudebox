# Performance -- finished feedback

Closed items, quote first. The open queue is `../FEEDBACK.md`.

### S60-6 and S60-8. One loader, and no hard refresh — DONE (session 60) ☑

> Why does it require a hard (shift) refresh to see changes on neocities? Can we get around that?

> I am really not a fan of including all those .js honeycomb scripts in the .html, I don't want to risk
> forgetting to update the html again, and I don't distribute mobile.html. [...] So I'd like to move to a
> solution where we don't need to change the index.html at all

**Why the hard refresh.** Neocities sends `Last-Modified` and `ETag` but no `Cache-Control`. A browser then
guesses how long a file stays fresh, about a tenth of the time since it last changed, and does not ask
again until then.

**The fix is `scripts/misc/honeycomb/honeycomb-loader.js`.** It holds the ordered list of Honeycomb scripts
and stylesheets and writes their tags with `?v=` and a number that changes every hour (`refreshMinutes`).
An upload reaches every player within the hour without a hard refresh. Inside the hour a reload still
reads from the cache: the code is about 0.9 MB compressed, which is too much to re-download on every load
on a phone. The pages load the loader itself on a ten-minute number. From `file://` no `?v=` is added.

Both pages lost their 38 Honeycomb tags and the stylesheet link, and carry two generic lines instead (see
`REQUIREMENTS.md` §2). **mobile.html now loads the Battle Lab too**, because the loader has one list for
both pages. It did not before.

Checked in the browser on both pages: 39 scripts in order, the stylesheet after `style.css`, the title
button present, no errors. `ptr-check.js` reads the loader's list. Suite block [142].

> I've tried a number of solutions to no avail [...] Are index.html lines 6-8 actually doing good, and if
> not, are they a risk of dragging down the system?

They are the `cache-control`, `pragma` and `expires` meta tags. Modern browsers ignore all three for
caching (only old Internet Explorer read them), so they do nothing. They also cost nothing: three lines of
text, read once. Safe to keep and safe to delete. They were left alone.
