/* Terminal application for KaiOS
 * file: options.js
 * Copyright (C) 2020 Affe Null
 * See LICENSE.txt for more details.
 */

function showOptions(inputCallback, recolorTerminal){
	const keyPages = [
		[
			".", ",", "@",
			"!", "?", "-",
			":", "&", "'",
			"(", ")", "#"
		],
		[
			"+", "=", "/",
			"¡", "¿", "*",
			";", "$", '"',
			"<", ">", "%"
		],
		[
			"^", "_", "\\",
			"~", "`", "|",
			"[", "]", "©",
			"{", "}", "#"
		],
		[
			"£", "¥", "",
			"", "", "",
			"", "", "",
			"", "", ""
		]
	]
	var pageIndex = 0;
	var activeChar = 0;
	var optContainer = document.getElementById("options");
	var fgPicker = document.getElementById("fgpick");
	fgPicker.lastChild.style.backgroundColor = localStorage.fgColor;
	fgPicker.onclick = function(){
		openColorPicker(function(c){
			localStorage.fgColor = c;
			recolorTerminal();
			fgPicker.lastChild.style.backgroundColor =
				localStorage.fgColor;
		});
	}
	var bgPicker = document.getElementById("bgpick");
	bgPicker.lastChild.style.backgroundColor = localStorage.bgColor;
	bgPicker.onclick = function(){
		openColorPicker(function(c){
			localStorage.bgColor = c;
			recolorTerminal();
			bgPicker.lastChild.style.backgroundColor =
				localStorage.bgColor;
		});
	}
	optContainer.style.display = "block";
	var specialKeys = document.createElement("div");
	specialKeys.className = "special-keys";
	optContainer.appendChild(specialKeys);
	var oldKeyDown = window.onkeydown;
	function hideOptions(){
		optContainer.removeChild(specialKeys);
		optContainer.style.display = "none";
		window.onkeydown = oldKeyDown;
	}
	var specialCharacterContainers = [];
	for(var i = 0; i < 12; i++){
		var charContainer = document.createElement("button");
		charContainer.className = "key-char-container";
		charContainer.onclick = function(){
			inputCallback(this.textContent);
			hideOptions();
		}
		specialCharacterContainers.push(charContainer);
		specialKeys.appendChild(charContainer);
		if(i % 3 == 2) specialKeys.appendChild(document.createElement(
			"br"));
	}
	specialCharacterContainers[0].focus();
	function updateSpecialKeys(){
		for(var i = 0; i < 12; i++){
			specialCharacterContainers[i].textContent =
				keyPages[pageIndex][i];
		}
	}
	updateSpecialKeys();
	window.onkeydown = function(e){
		if(!isNaN(e.key) && e.key != "0"){
			inputCallback(keyPages[pageIndex][Number(e.key) - 1]);
			hideOptions();
		}
		else if(e.key == "Backspace"){
			hideOptions();
			e.preventDefault();
		}
		else if(e.key == "*"){
			inputCallback(keyPages[pageIndex][9]);
			hideOptions();
		}
		else if(e.key == "#"){
			inputCallback(keyPages[pageIndex][11]);
			hideOptions();
		}
		else if(e.key == "0"){
			inputCallback(keyPages[pageIndex][10]);
			hideOptions();
		}
		else if(/Arrow.*/.test(e.key)){
			switch(e.key){
				case "ArrowUp":
					if(activeChar >= -3) activeChar -= 3;
					break;
				case "ArrowDown":
					if(activeChar < 9 && activeChar >= -6)
						activeChar += 3;
					break;
				case "ArrowLeft":
					if(activeChar > 0) activeChar--;
					break;
				case "ArrowRight":
					if(activeChar < 11 && activeChar >= 0)
						activeChar++;
					break;
			}
			e.preventDefault();
			if(activeChar >= 0) specialCharacterContainers[
				activeChar].focus();
			else {
				if(activeChar < -3)
					bgPicker.focus();
				else
					fgPicker.focus();
			}
		}
		else if(e.key == "SoftLeft" || e.key == "g"){
			pageIndex = (pageIndex + 3) % 4;
			updateSpecialKeys();
		}
		else if(e.key == "SoftRight" || e.key == "h"){
			pageIndex = (pageIndex + 1) % 4;
			updateSpecialKeys();
		}
	}
}
