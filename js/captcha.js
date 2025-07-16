/*
  
  This library contains two client-side Captcha libraries:  CounterCaptcha and MatchCaptcha
  
  CounterCaptcha - Creates a Captcha where the user must match a number from a sequential list
  MatchCaptcha - Creates a Captcha where the user must match a number with a random number from a list
  
  Functionality:
  
        The user long-presses on the Captcha until the numbers match and then releases.  If the numbers
        match when the user releases the Captcha passes.
        
  Usage:
  
        //CounterCaptcha
        //Instantiate the object with any DOM object
        var captcha = new CounterCaptcha(document.body);
        
        //Optionally instantiate with a color for the text and border (default is #000000)
        var captcha = new CounterCaptcha(document.body,"#ff0000");
        
        //MatchCaptcha
        //Instantiate the object with any DOM object
        var captcha = new MatchCaptcha(document.body);
        
        //Optionally instantiate with a color for the text and border (default is #000000) and the number of numbers (default is 15)
        var captcha = new CounterCaptcha(document.body,"#ff0000",10);
 
*/

class BaseCaptcha {
    constructor(obj,color) {
        this.timeout = null;
        this.success = false;
        
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
	this.clickArea.addEventListener('touchstart',this.startClick.bind(this),false);
        this.clickArea.addEventListener('mouseup',this.endClick.bind(this),false);
	this.clickArea.addEventListener('touchend',this.endClick.bind(this),false);
        this.clickArea.onselectstart = (e) => {e.preventDefault()};
        
        obj.appendChild(this.clickArea);
    }
    
    startClick() {
        return false;
    }
    
    endClick() {
        return false;
    }
}

class CounterCaptcha extends BaseCaptcha {
    constructor(id,color) {
        var useColor = (color) ? color : "#000000";
        super(id,useColor);
        
        this.maxCount = parseInt(Math.random() * 10 + 2);
        this.currentCount = 0;
    }
    
    startClick() {
        if (!this.success) {
            var updateText = () => {
                var text = this.maxCount.toString() + ' = ' + this.currentCount.toString();
                this.clickArea.innerText = text;
                this.currentCount++;
                this.timeout = setTimeout(updateText,1000);
            };
            
            updateText();
        }
    }
    
    endClick() {
        if (!this.success) {
            clearTimeout(this.timeout);
            if (this.maxCount == (this.currentCount - 1)) {
                this.clickArea.innerText = "Success";
                this.clickArea.style.cursor = "default";
                this.success = true;
            }
            else {
                this.clickArea.innerText = "Try again";
                this.maxCount = parseInt(Math.random() * 10 + 1);
                this.currentCount = 0;
            }
        }
    }
}

class MatchCaptcha extends BaseCaptcha {
    constructor(id,color,count) {
        var useColor = (color) ? color : "#000000";
        super(id,useColor);
        
        this.numberCount = (count) ? count : 15;
        this.generateNumbers();
        this.pointer = 0;
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
    }
    
    endClick() {
        if (!this.success) {
            clearTimeout(this.timeout);
            if (this.numbers[this.pointer - 1] == (this.match)) {
                this.clickArea.innerText = "Success";
                this.clickArea.style.cursor = "default";
                this.success = true;
            }
            else {
                this.clickArea.innerText = "Try again";
                this.resetNumbers();
                this.pointer = 0;
            }
        }
    }
}
