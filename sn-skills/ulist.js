  class DomUnorderedList {
    constructor(container) {
      this.l = document.createElement('ul');
      this.l.style.display = 'block';
      container.appendChild(this.l);
    }

    getList() {
      return this.l;
    }

    addItem(s,c) {
      var i = document.createElement('li');
      var t = document.createElement('span');
      t.innerText = s;
      i.style.marginBottom = "5px";
      i.style.listStyleType = "none";
      i.appendChild(t);
      this.l.appendChild(i);
      i.className = c;

      return t;
    }

    showHideList() {
      var disp = this.l.style.display;

      if (disp == 'none') {
        this.l.style.display = 'block';
      }
      else {
        this.l.style.display = 'none';
      }
    }
  }
