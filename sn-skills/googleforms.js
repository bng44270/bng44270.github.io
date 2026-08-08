  class GoogleForm {
    constructor(viewformurl) {
      this.respUrl = viewformurl.replace(/^(.*)\/viewform.*$/,'$1') + "/formResponse";
      this.onsubmit = null;
      this.fieldList = [];
    }

    addTextField(l,n,r=false,c=[]) {
      this.fieldList.push({"name":n,"label":l,"type":"text","required":r,"choices":c});
    }
  
    addParagraphField(l,n,r=false) {
      this.fieldList.push({"name":n,"label":l,"type":"paragraph","required":r});
    }

    addSubmitAction(f) {
      this.onsubmit = f;
    }

    render(domparent) {
      var ifr = document.createElement('iframe');
      ifr.id = "formtarget";
      ifr.name = "formtarget";
      ifr.style.display = "none";

      domparent.appendChild(ifr);
 
      var formdiv = document.createElement('div');
      formdiv.id = "formarea";

      var form = document.createElement('form');
      form.id = "googleform";
      form.target = "formtarget";
      form.method = "POST";
      form.action = this.respUrl;

      this.fieldList.forEach(e => {
        var lbl = document.createElement('label');
        lbl.innerText = e.label;
        lbl.style.marginRight = "10px";
        lbl.style.marginBottom = "5px";
        form.appendChild(lbl);
  
        var inp = null
        if (e.type == 'text') {
          if (e.choices.length == 0) {
            inp = document.createElement('input');
            inp.type = "text";
            inp.name = e.name;
            inp.required = e.required;
          }
          else {
            inp = document.createElement('select');
            inp.name = e.name;
            inp.required = e.required;
  
            e.choices.forEach(c => {
              var opt = document.createElement('option');
              opt.value = c;
              opt.innerText = c;
              inp.appendChild(opt);
            });
          }
        }
        else if (e.type == "paragraph") {
	  form.appendChild(document.createElement('br'));
          inp = document.createElement('textarea');
          inp.cols = 30;
          inp.rows = 10;
          inp.name = e.name;
          inp.required = e.required;
        }
        else {
          throw new TypeError("Invalid form element type (" + e.type + ")");
        }

	inp.style.marginBottom = "5px";
        form.appendChild(inp);
	form.appendChild(document.createElement('br'));
      });

      var submit = document.createElement('input');
      submit.id = "formbutton";
      submit.type = 'submit';
      submit.onclick = function() { this.style.display = "none"; };
      form.appendChild(submit);
      formdiv.appendChild(form);
    
      domparent.appendChild(formdiv);


      ifr.onload = () => {
	    if (this.onsubmit) {
	      this.onsubmit();
	    }
      };
    }
  }
