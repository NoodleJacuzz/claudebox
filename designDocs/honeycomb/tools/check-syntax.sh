#!/bin/sh
# Parses every Honeycomb JS file. A file that fails to parse loads as nothing, which surfaces far
# away from the cause -- as an "undefined is not an object" inside some unrelated screen. Run this
# after any edit batch, especially any scripted find-and-replace touching quoted strings.
cd "$(dirname "$0")/../../.." || exit 1
status=0
for f in scripts/misc/honeycomb.js scripts/misc/honeycomb/*.js; do
	if ! node --check "$f" 2>/dev/null; then
		echo "PARSE FAIL: $f"
		node --check "$f" 2>&1 | sed -n '2,4p'
		status=1
	fi
done
[ $status -eq 0 ] && echo "All Honeycomb JS files parse."
exit $status
