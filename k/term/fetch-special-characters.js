/* Terminal application for KaiOS
 * file: fetch-special-characters.js
 * Copyright (C) 2020 Affe Null
 * See LICENSE.txt for more details.
 */

/* Fetch the special characters for the line-drawing character set. */
var specialCharacters;
!function(){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "special-characters.json", true);
	xhr.send();
	xhr.onload = function(){
		specialCharacters = JSON.parse(xhr.responseText);
	}
}();
