/*

PlusCode : Generate Plus Codes for geolocation from lat/long

Usage:

  var loc = new PlusCode(40.710947,-74.836253);
  // loc.plus = "87G7P567+9F"
  
  loc.lat = 50.432
  // loc.plus = "9727C5J7+RF" <==== Automatically updates
  
  loc.lng = 60.123
  // loc.plus = "9J22C4JF+R6" <==== Automatically updates

*/

class PlusCode {
	constructor(lat,lng) {
		this._lat = lat;
		this._lng = lng;
		this.genCodes();
	}
	
	get lat() { return this._lat; }
	get lng() { return this._lng; }
	get plus() { return this._plus; }
	
	set lat(n) {
		this._lat = n;
		this.genCodes();
	}
	
	set lng(n) {
		this._lng = n;
		this.genCodes();
	}
	
	set plus(n) {
		throw new SyntaxError("Unable to manually set plus code");
	}
	
	genCodes() {
		var latB20 = this.genB20((this._lat+90)*8000);
		var lngB20 = this.genB20((this._lng+180)*8000);
		this._plus = this.genPlus(latB20,lngB20);
	}
	
	genB20(num) {
		var newNum = parseInt(num);
		var twentyNums = '23456789CFGHJMPQRVWX';
		var twentyVal = '';
		
		while (true) {
			if (Math.floor(newNum / 20) > 20) {
				twentyVal = twentyNums[newNum % 20] + twentyVal;
			}
			else {
				twentyVal = twentyNums[newNum % 20] + twentyVal;
				twentyVal = twentyNums[Math.floor(newNum / 20)] + twentyVal;
				break;
			}

			newNum = Math.floor(newNum / 20);
		}

		return twentyVal;
	}

	genPlus(one,two) {
		var plus = '';

		for (var i = 0; i < (one.length - 1); i++) {
			plus += one[i] + two[i];
		}

		plus += '+' + one[one.length-1] + two[one.length-1];

		return plus;
	}
}
