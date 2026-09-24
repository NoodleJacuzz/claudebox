//Save data functions
function saveSlot(slot) {
	console.log(slot)
	var saveName = "dataSyrup" + slot;
	// While creating a mod, strip mod-only references (custom characters/locations the test tools may
	// have left in `data`) before persisting, so a normal playthrough's save stays clean. We sanitize
	// a CLONE so the live debug session keeps its test state. Only runs when debug + a mod is active
	// and contamination is actually present, so normal play pays nothing.
	var dataToSave = data;
	if (typeof modContaminationPresent === "function" && modContaminationPresent(data)) {
		dataToSave = stripModContaminationFromData(JSON.parse(JSON.stringify(data)));
	}
	localStorage.setItem(saveName,JSON.stringify(dataToSave));
	var date = new Date();
	var finalDate = "";
	//date = date.toDateString() + " " + date.toLocaleTimeString();
	//YYYY-MM-DD HH:MM ampm
	formattedDate = String(date.getFullYear())
	formattedDate += '/'
	formattedDate += String(date.getMonth() + 1).padStart(2, '0') 
	formattedDate += '/'
	formattedDate += String(date.getDate()).padStart(2, '0')
	formattedDate += ' - '
	if (date.getHours() < 12) {
		formattedDate += String(date.getHours()) + ':'
		formattedDate += String(date.getMinutes()).padStart(2, '0') + 'am'
	}
	else {
		formattedDate += String((date.getHours() - 12)) + ':'
		formattedDate += String(date.getMinutes()).padStart(2, '0') + 'pm'
	}
	if (slot != 11 && slot != 10) {
		formattedDate += data.player.genitals;
		formattedDate += "<br>" + countAllScenes()[0] + " of " + countAllScenes()[1] + " scenes";
	}
	if (data.player.vegetarian == true) {
		formattedDate += " (V)";
	}
	if (data.player.carnivore == true) {
		formattedDate += " (C)";
	}
	saveName = "dateSyrup" + slot;
	localStorage.setItem(saveName,formattedDate);
	saveName = "charSyrup" + slot;
	localStorage.setItem(saveName,data.player.name);
	generateSave();
}

function deleteSlot(slot) {
	var saveName = "dataSyrup" + slot;
	localStorage.removeItem(saveName);
	console.log("Saved data");
	saveName = "dateSyrup" + slot;
	localStorage.removeItem(saveName);
	generateSave();
}

function loadSlot(slot) {
	saveName = "dataSyrup" + slot;
	console.log(localStorage.getItem(saveName));
	if (localStorage.getItem(saveName)) {
		newSave = localStorage.getItem(saveName);
		newSave = JSON.parse(newSave);
		console.log("loaded data:");
		console.log(newSave);
		data = [];
		data = newSave;
	}
	else {
		console.error("No save data found!");
	}
	data.player.currentCharacter = "system";
	updateSave();
	initializeArrays();
	//Convert pre Full Control clothing: drop the empty sentinel garments, place the genital
	//anchor where Bottomless used to sit, and apply any image path rewrites
	migrateSaveClothing();
	loadCoreCharacters();
	junkCleanup();
	writeScene('system', 'start');
	//sceneTransition(data.player.currentScene);
	//This is a function for catching repeats in the data.story variable.
	//Go through each character in the data variable
	for (layer1 = 0; layer1 < data.story.length; layer1++) {
		//
		var counter = 0;
		var index = data.story[layer1].index;
		//Go through each character in the data variable again to compare names of layer2 to layer1
		for (layer2 = 0; layer2 < data.story.length; layer2++) {
			if (index == data.story[layer2].index) {
				counter += 1;
				if (counter > 1) {
					console.log('duplicate character found in data variable, removing '+index);
					data.story.splice(layer2, 1);
					console.log(data);
				}
			}
		}
	}
	deleteWindow();
}

function saveFile(){
	deleteWindow();
	generateWindow("string");
}

function loadFile(){
	document.body.innerHTML += `
		<div id="loadFileContainer" style="
		position:absolute; z-index:2;
		border: 3px solid #f1f1f1; 
		border-top-left-radius: 4px; 
		border-top-right-radius: 4px;
		left:30vw;
		top:35vh;
		height:45vh;
		width:40vw;
		background-color: black;
		color: white;
		 text-align: center;
		">
			<p>Paste your data in this box:</p>
			<input type='text' id='loadFileEntry' value=''>
			<br><br>
			<button onclick="loadFileCont()"
			style="
				background-color: #4CAF50;
				border: none;
				color: white;
				padding: 15px 32px;
				text-align: center;
				text-decoration: none;
				display: inline-block;
				font-size:var(--fs-small, 16px);
				margin: 4px 2px;
				cursor: pointer;
			">Load Data</button>
			<button onclick="cancelLoad()"
			style="
				background-color: #4CAF50;
				border: none;
				color: white;
				padding: 15px 32px;
				text-align: center;
				text-decoration: none;
				display: inline-block;
				font-size:var(--fs-small, 16px);
				margin: 4px 2px;
				cursor: pointer;
			">Cancel</button>
		</div>
	`;
}

function loadFileCont() {
	//data = prompt("Please paste the data", "");
	if (document.getElementById('loadFileEntry').value == "" ||document.getElementById('loadFileEntry').value == null) {
		alert("The text box is empty?!")
	}
	else {
		var goof = document.getElementById('loadFileEntry').value;
		data = JSON.parse(goof);
		console.log(data);
		saveSlot(10);
		loadSlot(10);
		if (data.player.name == null) {
			alert("Invalid pasted data! If we tried to use this, the game would completely break!");
			loadSlot(11);
		}
		else {
			saveSlot(10);
			loadSlot(10);
		}
		updateSave();
	}
	cancelLoad()
}

function cancelLoad() {
	document.getElementById('loadFileContainer').remove();
}

function saveTXT() {
	// The Android app's WebView has no download manager, so a blob download link navigates away from the game.
	// Fall back to the copy-to-clipboard save there.
	addFlag("mom", "backup");
	checkForAchievements();
	if (/; wv\)/.test(navigator.userAgent)) {
		saveFile();
		return;
	}
	var date = new Date();
	//YYYY-MM-DD HH:MM ampm
	formattedDate = String(date.getFullYear())
	formattedDate += '-'
	formattedDate += String(date.getMonth() + 1).padStart(2, '0') 
	formattedDate += '-'
	formattedDate += String(date.getDate()).padStart(2, '0')
	formattedDate += ' - '
	if (date.getHours() < 12) {
		formattedDate += String(date.getHours()) + '' + 'am'
	}
	else {
		formattedDate += String((date.getHours() - 12)) + '' + 'pm'
	}
    // Same mod-contamination strip as saveSlot, so a .noodle backup taken mid-mod-test stays clean.
    var dataToExport = data;
    if (typeof modContaminationPresent === "function" && modContaminationPresent(data)) {
        dataToExport = stripModContaminationFromData(JSON.parse(JSON.stringify(data)));
    }
    var textFileAsBlob = new Blob([JSON.stringify(dataToExport)], {type:'text/plain'});
    var downloadLink = document.createElement("a");
    downloadLink.download = "Syrup "+formattedDate+".noodle";
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null)
    {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    }
    else
    {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
}

const fr = new FileReader();
fr.addEventListener("load", fileLoaded);

function loadSave(){
    files = document.getElementById('loadFile').files;
    if(files.length == 0)
        return;
    file = files[0];
    fr.readAsText(file);
}
function fileLoaded(){
    console.log(fr.result);
	var fakedata = fr.result;
	fakedata = JSON.parse(fakedata);
	if (fakedata.player.clothes == null) {
		alert("Whoa there! I don't think that's a Syrup Town save file! If it is, be sure to let me (Noodlejacuzzi) know and I'll help you out.");
	}
	else {
		data = fakedata;
		updateSave();
		//This loop tested against the array itself rather than its length, so it never ran and
		//imported saves kept whatever image format they were saved in
		for (var clothesIndex = 0; clothesIndex < data.player.clothes.length; clothesIndex++) {
			data.player.clothes[clothesIndex].image = cleanupImage(data.player.clothes[clothesIndex].image);
		}
		saveSlot(10);
		loadSlot(10);
		// Imported saves are the usual way mod-referencing data reaches an install without
		// its mods — tell the player immediately instead of letting images silently break.
		if (typeof warnAboutMissingMods === "function") warnAboutMissingMods();
	}
	document.getElementById('loadFile').value = '';
}

function generateSave() {
	if (activeWindow == "save") {
		for (i = 1; i < 9; i++) {
			var searchName = 'dataSyrup' + i;
			if(localStorage.getItem(searchName)) {
				var buttonName = 'load' + i + 'Button';
				document.getElementById(buttonName).innerHTML = "LOAD";
				document.getElementById(buttonName).style = "visibility: visible;";
				var buttonName = 'delete' + i + 'Button';
				document.getElementById(buttonName).innerHTML = "DELETE";
				document.getElementById(buttonName).style = "visibility: visible;";
				var buttonName = 'save' + i + 'Date';
				var charName = 'charSyrup' + i;
				document.getElementById(buttonName).innerHTML = "<b>"+localStorage.getItem(charName)+"</b> - ";
				var dateName = 'dateSyrup' + i;
				var datePrint = localStorage.getItem(dateName);
				if (datePrint.includes("penis")) {
					datePrint = datePrint.replace("penis", "");
					document.getElementById("save" + i + "Slot").style.backgroundColor = "rgba(0, 132, 255, 0.25)";
				}
				if (datePrint.includes("pussy")) {
					datePrint = datePrint.replace("pussy", "");
					document.getElementById("save" + i + "Slot").style.backgroundColor = "rgba(255, 0, 221, 0.25)";
				}
				document.getElementById(buttonName).innerHTML += datePrint;
				
			}
			else {
				var buttonName = 'load' + i + 'Button';
				document.getElementById(buttonName).innerHTML = "";
				document.getElementById(buttonName).style = "visibility: hidden;";
				var buttonName = 'delete' + i + 'Button';
				document.getElementById(buttonName).innerHTML = "";
				document.getElementById(buttonName).style = "visibility: hidden;";
				var buttonName = 'save' + i + 'Date';
				document.getElementById(buttonName).innerHTML = "";
			}
		}
	}
}

function updateSave() {
	//Outdated function used for save data updating before core character function
	console.log("checking for updates...");

	saveSlot(10);
}