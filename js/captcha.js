/*

  This library contains two client-side Captcha libraries:  CounterCaptcha and MatchCaptcha

  MatchCaptcha - Creates a Captcha where the user must match a number with a random number from a list

  Functionality:

        The user long-presses on the Captcha until the numbers match and then releases.  If the numbers
        match when the user releases the Captcha passes.

  Usage:

        //MatchCaptcha
        //Instantiate the object with any DOM object
        var captcha = new MatchCaptcha(document.body);

        //Optionally instantiate with a color for the text and border (default is #000000) and the number of numbers (default is 15) and a callback
        //function to be executed upon sucessful captcha
        var captcha = new CounterCaptcha(document.body,"#ff0000",10,function() {
          alert("Yay!!!  Success!!!");
        });

*/

class BaseCaptcha {
    constructor(obj,color) {
        this.timeout = null;

        this.clickArea = document.createElement('div');

        this.clickArea.style.border = "10px solid " + color;
        this.clickArea.style.color = color;

        this.clickArea.style.width = "100px";
        this.clickArea.style.padding = "20px";
        this.clickArea.style.fontWeight = "bold";
        this.clickArea.style.textAlign = "center";
        this.clickArea.style.cursor = "pointer";
        this.clickArea.innerText = "Click and hold";
        this.clickArea.addEventListener('mousedown',this.startClick.bind(this),false);
        this.clickArea.addEventListener('mouseup',this.endClick.bind(this),false);
        this.clickArea.onselectstart = (e) => {e.preventDefault()};

        obj.appendChild(this.clickArea);
    }

    get success() {
      return false;
    }

    startClick() {
        return false;
    }

    endClick() {
        return false;
    }
}

class MatchCaptcha extends BaseCaptcha {
    constructor(id,color,count,successfunction) {
        var useColor = (color) ? color : "#000000";
        super(id,useColor);

        this.onSuccess = (successfunction) ? successfunction : function() { return true; };
        this.numberCount = (count) ? count : 15;
        this.generateNumbers();
        this.pointer = 0;
    }

    get success() {
        return this.numbers[this.pointer - 1] == (this.match);
    }

    resetNumbers() {
        this.shuffle();
        this.match = this.numbers[0];
        this.shuffle();
    }

    shuffle() {
        for (let i = this.numbers.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.numbers[i], this.numbers[j]] = [this.numbers[j], this.numbers[i]];
        }
    }

    generateNumbers() {
        this.numbers = [];

        for (var i = 0; i < this.numberCount; i++) {
            this.numbers.push(parseInt(Math.random() * 1000));
        }

        this.resetNumbers()
    }

    startClick() {
        if (!this.success) {
            var updateText = () => {
                var text = this.match.toString() + ' = ' + this.numbers[this.pointer].toString();
                this.clickArea.innerText = text;
                this.pointer = (this.pointer == this.numberCount) ? 0 : this.pointer + 1;
                this.timeout = setTimeout(updateText,1000);
            };

            updateText();
        }
        else {
            this.clickArea.innerText = "Success";
            this.clickArea.style.cursor = "default";
            this.onSuccess();
        }
    }

    endClick() {
        clearTimeout(this.timeout);
        if (this.success) {
            this.clickArea.innerText = "Success";
            this.clickArea.style.cursor = "default";
            this.onSuccess();
        }
        else {
            this.clickArea.innerText = "Try again";
            this.resetNumbers();
            this.pointer = 0;
        }
    }
}
