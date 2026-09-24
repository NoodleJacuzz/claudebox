# The desk: answered and finished items

Items from `FEEDBACK.md` that are closed, moved here with their quotes and annotations unchanged.

---

## Answered 2026-09-23, needing no building

### Where the desk's start file is

> First and easiest, where is the activator for it so I can pin that to my start menu? I'll probably
> append it to one of the .bat files I try to remember to click every startup.

The desk starts from this file:

```
C:\Users\Jeffrey\Documents\GitHub\noodlejacuzzi.github.io\syrup-town\!designDocs\honeycomb\tools\desk\start-desk.bat
```

To start it from one of your startup .bat files, add this line to that file:

```bat
start "" "C:\Users\Jeffrey\Documents\GitHub\noodlejacuzzi.github.io\syrup-town\!designDocs\honeycomb\tools\desk\start-desk.bat"
```

The `start ""` at the front opens the desk in a window of its own. Without it, your startup file would
stop at the desk line and wait there until you closed the desk, because the desk keeps running.

Windows 10 does not offer Pin to Start on a .bat file. To get round that, right-click the desktop and
choose New, then Shortcut. For the location, type `cmd /c "`, then the path above, then a closing `"`.
Name it Honeycomb Desk. Right-click the new shortcut and Pin to Start will be in the menu.

If the desk is started twice, the second window fails with a Node error about the port being in use.
Item 1c makes it say "The desk is already running" instead.

### How a button's words connect to what it does

> There's no way to actually push events to the game with just the app, right? Because I don't
> understand how `> Sleep | Every member of the party heals 30% of their maximum health.` actually
> translates to code. I presume what you've given me is letting me rename the button that triggers the
> sleeping, and that if I changed it to 25% the in-game effect would be unchanged. Especially since rest
> healing can change, so that should be displaying a variable instead of a static number. But if I'm
> wrong then there'd be a way to directly push events I write into the game, which would be pleasant yet
> very shocking.

You guessed right. In `> Sleep | Every member of the party heals 30% of their maximum health.`, the
word `Sleep` is the label on the button, and the part after `|` is the sentence shown with it. What the
button does is a separate list of effects in the game file, and the desk never shows or writes that
list. Changing 30% to 25% would change the sentence and nothing else.

The campfire has a second surprise in it. Those three campfire buttons never appear in the game at
all. When the party reaches a campfire, the game builds the menu from a separate table of rest
options: Sleep, Sharpen and Leave a card behind, plus any option a girl's skill tree unlocks. That
table's Sleep works out its own sentence from the tuning number. It says 30% today, it says 45% once
Rest-B is taken, and in a run it shows how many HP that is for your party. So the variable you asked
for already exists, in the table the game really uses. The three buttons in the campfire event were
left behind when that table was built, and nothing reads them. The old Sleep button even heals a third
of maximum health (33%) while its sentence says 30%.

On most other events, many buttons have no sentence after `|` at all. For those, the game writes the
sentence itself from the effects. The Weeping Bloom's first button says "Gain 2 Reroll. Nettle's Venom
weakness rises 1 rank." without anybody having typed it. A sentence the game writes always matches the
real numbers. A sentence you type replaces the game's sentence, and it stays the same if the numbers
change later.

So here is what the desk can put into the game today. It can change the words of an event that
already exists: the name, the lines, the narration, the body text, the picture paths, the button
labels and their sentences, and a Lust Event's weakness and rank. It cannot add a new event, a new
beat, a new button or a requirement, and it cannot change what a button does. Those are saved as a
request for me instead.

Phase 4 makes all of this visible on the phone. Every button will show what it does in the game's own
words, next to the sentence you typed.

