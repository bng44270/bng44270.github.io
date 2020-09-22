/* Terminal application for KaiOS
 * file: colorpicker.js
 * Copyright (C) 2020 Affe Null
 * See LICENSE.txt for more details.
 */

function openColorPicker(callback){
	var overlay = document.getElementById("colorpicker-overlay");
	var picker = document.getElementById("colorpicker");
	var currentActiveElement = document.activeElement;
	picker.style.display = "block";
	overlay.style.display = "block";
	var oldKeyDown = window.onkeydown;
	function closeColorPicker(){
		picker.style.display = "none";
		overlay.style.display = "none";
		window.onkeydown = oldKeyDown;
		currentActiveElement.focus();
	}
	var buttons = picker.getElementsByTagName("button");
	var index = 0;
	for(var childIndex = 0; childIndex < buttons.length; childIndex++){
		buttons[childIndex].onclick = function(){
			closeColorPicker();
			callback(this.style.backgroundColor);
		};
	}
	buttons[0].focus();
	window.onkeydown = function(e){
		switch(e.key){
			case "ArrowUp":
				index -= 5;
				if(index < 0) index = 0;
				break;
			case "ArrowDown":
				index += 5;
				if(index > 15) index = 15;
				break;
			case "ArrowLeft":
				index--;
				if(index < 0) index = 0;
				break;
			case "ArrowRight":
				index++;
				if(index > 15) index = 15;
				break;
			case "Backspace":
				e.preventDefault();
				closeColorPicker();
				break;
		}
		buttons[index].focus();
	};
}
