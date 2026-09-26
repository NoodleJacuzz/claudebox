<#
Honeycomb: carry the cloud sessions' documents onto the desktop.

What it does, in order:
  1. Moves every path in migrate-delete-list.txt out of !designDocs\honeycomb\ into a quarantine
     folder under %TEMP% (never deletes; the same content exists at a new path in the cloud copy).
  2. Removes the old workstream folders that are empty afterwards, and reports any that are not.
  3. Copies designDocs\honeycomb\ from the cloud copy over !designDocs\honeycomb\ (additive: files
     that exist only on the desktop are left alone).
  4. Moves chessmaster\ to Archive\demo1\chessmaster\, where every live document already points.

What it never touches: scripts\, .claude\, CLAUDE.md, desk\data\ (the phone's live database),
tools\balance\results\, anything outside !designDocs\honeycomb\.

Dry run by default: prints every move and every copy and changes nothing. Add -Apply to do it.

  powershell -ExecutionPolicy Bypass -File migrate-to-desktop.ps1
  powershell -ExecutionPolicy Bypass -File migrate-to-desktop.ps1 -Apply
#>
param(
	[string]$SyrupTown = "C:\Users\Jeffrey\Documents\GitHub\noodlejacuzzi.github.io\syrup-town",
	[switch]$Apply,
	[switch]$IgnoreDesktopEdits
)

$ErrorActionPreference = "Stop"

$cloudCopy = Split-Path -Parent $PSScriptRoot
$src = Join-Path $cloudCopy "designDocs\honeycomb"
$dst = Join-Path $SyrupTown "!designDocs\honeycomb"
$list = Join-Path $PSScriptRoot "migrate-delete-list.txt"
$uploadDate = "2026-09-24"

function Say($text) { Write-Host $text }
function Mode() { if ($Apply) { "APPLY" } else { "DRY RUN" } }

# ---- Sanity: both trees are what they claim to be ---------------------------------------------
if (-not (Test-Path -LiteralPath (Join-Path $src "BASICS.md"))) { throw "Cloud copy not found at $src" }
if (-not (Test-Path -LiteralPath (Join-Path $src "enemies\COMMON-DRAFT-01.js"))) {
	throw "The cloud copy at $src is older than session 66. Download the current branch."
}
if (-not (Test-Path -LiteralPath (Join-Path $dst "BASICS.md"))) { throw "Desktop tree not found at $dst" }
if (-not (Test-Path -LiteralPath $list)) { throw "Missing $list" }

Say "[$(Mode)] cloud copy : $src"
Say "[$(Mode)] desktop    : $dst"

# ---- Step 0: has the desktop touched these docs since the upload? -----------------------------
Push-Location $SyrupTown
# Windows PowerShell 5.1 turns any stderr line from git into a terminating error under "Stop".
$ErrorActionPreference = "Continue"
try {
	$gitOk = $true
	try { git rev-parse --is-inside-work-tree 2>$null | Out-Null; if ($LASTEXITCODE -ne 0) { $gitOk = $false } } catch { $gitOk = $false }
	if ($gitOk) {
		$dirty = git status --porcelain -- "!designDocs" 2>$null
		$since = git log --since=$uploadDate --format="%h %ad %s" --date=short -- "!designDocs" 2>$null
		if ($dirty) {
			Say ""
			Say "Uncommitted desktop changes under !designDocs:"
			$dirty | ForEach-Object { Say "  $_" }
		}
		if ($since) {
			Say ""
			Say "Desktop commits touching !designDocs since the upload ($uploadDate):"
			$since | ForEach-Object { Say "  $_" }
		}
		if (($dirty -or $since) -and -not $IgnoreDesktopEdits) {
			throw "The desktop edited these docs after the upload. Read the lines above, merge by hand or re-run with -IgnoreDesktopEdits once each one is accounted for."
		}
		if (-not $dirty -and -not $since) { Say "Step 0: no desktop edits under !designDocs since $uploadDate." }
	} else {
		Write-Warning "git not available here; cannot check for desktop edits since $uploadDate. Check by hand."
	}
} finally { Pop-Location; $ErrorActionPreference = "Stop" }

# ---- Step 1: quarantine the stale paths ---------------------------------------------------------
$stamp = Get-Date -Format "yyyy-MM-dd-HHmm"
$quarantine = Join-Path ([IO.Path]::GetTempPath()) "honeycomb-migration-$stamp"
$moved = 0; $absent = 0
$touchedParents = New-Object System.Collections.Generic.HashSet[string]
Say ""
Say "Step 1: stale paths -> $quarantine"
foreach ($line in Get-Content -LiteralPath $list) {
	$rel = $line.Trim()
	if ($rel -eq "" -or $rel.StartsWith("#")) { continue }
	$relWin = $rel -replace "/", "\"
	$from = Join-Path $dst $relWin
	if (-not (Test-Path -LiteralPath $from)) { $absent++; continue }
	$to = Join-Path $quarantine $relWin
	Say "  move  $relWin"
	if ($Apply) {
		New-Item -ItemType Directory -Force -Path (Split-Path -Parent $to) | Out-Null
		Move-Item -LiteralPath $from -Destination $to
	}
	$moved++
	$parent = Split-Path -Parent $from
	while ($parent.Length -gt $dst.Length) { [void]$touchedParents.Add($parent); $parent = Split-Path -Parent $parent }
}
Say "  $moved to move, $absent already absent on the desktop."

# ---- Step 2: fold up folders the moves emptied --------------------------------------------------
Say ""
Say "Step 2: emptied folders"
$oldFolders = @("audio","balance_tests","card_redesign","enemy_overhaul","gallery","lust_events","map",
	"map_events","performance","playtest_55","rework","ui","vfx","tools\__pycache__")
$candidates = @($oldFolders | ForEach-Object { Join-Path $dst $_ }) + @($touchedParents)
$candidates = $candidates | Sort-Object { $_.Length } -Descending | Select-Object -Unique
foreach ($folder in $candidates) {
	if (-not (Test-Path -LiteralPath $folder -PathType Container)) { continue }
	$relFolder = $folder.Substring($dst.Length + 1)
	$left = @(Get-ChildItem -LiteralPath $folder -Recurse -File -Force)
	# In a dry run the listed files are still there; count only what the list does NOT cover.
	if (-not $Apply) {
		$listed = Get-Content -LiteralPath $list | Where-Object { $_ -ne "" -and -not $_.StartsWith("#") } | ForEach-Object { Join-Path $dst ($_ -replace "/", "\") }
		$left = @($left | Where-Object { $listed -notcontains $_.FullName })
	}
	if ($left.Count -eq 0) {
		Say "  remove empty  $relFolder\"
		if ($Apply) { Remove-Item -LiteralPath $folder -Recurse -Force }
	} else {
		Say "  KEEP $relFolder\ : $($left.Count) file(s) the cloud never had. Desktop Claude decides where they go:"
		$left | ForEach-Object { Say "      $($_.FullName.Substring($dst.Length + 1))" }
	}
}

# ---- Step 3: copy the cloud tree over, additively ----------------------------------------------
Say ""
Say "Step 3: copy $src -> $dst (robocopy /E, additive)"
$exclude = @(
	(Join-Path $src "desk\data"),
	(Join-Path $src "tools\balance\results"),
	(Join-Path $src "tools\__pycache__")
)
$roboArgs = @($src, $dst, "/E", "/XD") + $exclude + @("/NJH", "/NJS", "/NDL", "/NP")
if (-not $Apply) { $roboArgs += "/L" }
& robocopy @roboArgs
$rc = $LASTEXITCODE
if ($rc -ge 8) { throw "robocopy reported a failure (exit $rc)." }

# ---- Step 4: Anastasia's folder was frozen on paper only; the cloud copy never had it --------------
# Session 64 wrote every live pointer as ../Archive/demo1/chessmaster/ but could not move the folder.
Say ""
Say "Step 4: chessmaster\ -> Archive\demo1\chessmaster\"
$chessFrom = Join-Path $dst "chessmaster"
$chessTo = Join-Path $dst "Archive\demo1\chessmaster"
if ((Test-Path -LiteralPath $chessFrom) -and -not (Test-Path -LiteralPath $chessTo)) {
	Say "  move  chessmaster\  ($(@(Get-ChildItem -LiteralPath $chessFrom -Recurse -File).Count) files)"
	if ($Apply) {
		New-Item -ItemType Directory -Force -Path (Split-Path -Parent $chessTo) | Out-Null
		Move-Item -LiteralPath $chessFrom -Destination $chessTo
	}
} elseif (Test-Path -LiteralPath $chessTo) {
	Say "  already there."
} else {
	Say "  no chessmaster\ folder on the desktop; nothing to do."
}

Say ""
if ($Apply) {
	Say "Done. Quarantine: $quarantine (delete it once the checks below pass)."
} else {
	Say "Dry run only. Nothing changed. Re-run with -Apply."
}
Say "Checks to run next, from $SyrupTown :"
Say '  node "!designDocs/honeycomb/tools/feedback-audit.js"   -> OK, 142 items open'
Say '  node "!designDocs/honeycomb/tools/doc-links.js"        -> exit 0'
Say '  node "!designDocs/honeycomb/tools/test-honeycomb.js"   -> 2805 passed, 0 failed'
