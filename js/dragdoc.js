/*

Make image content within a DOM container dragable

Usage:

  <div id="content"></div>
  
  new DragDoc('content','/path/to/image',{
    //Style attributes for parent container (optional)
  }, {
    //Style attributes for image container (optional)
  });

*/

class DragDoc {
  constructor(id,imgUrl,containerStyle={},imgStyle={}) {
    this.DOCID = id;
    
    this.initView(imgUrl);
			
    var container = document.getElementById(this.DOCID + '_container');
    Object.keys(containerStyle).forEach(s => {
      container.style[s] = containerStyle[s];
    });
    
    var content = document.getElementById(this.DOCID + '_content');
    Object.keys(imgStyle).forEach(s => {
      content.style[s] = imgStyle[s];
    });
    
    if (content.style.transform.length  == 0) {
      content.style.transform = 'scale(1)';
    }
    
    var zoomVal = content.style.transform.replace(/scale\(([0-9\.]+)\)/,'$1');
      
      var zoomControl = document.getElementById(this.DOCID + '_zoomcontrol');
      var zoomDisplay = document.getElementById(this.DOCID + '_zoomdisplay');

      zoomControl.value = zoomVal;

      zoomDisplay.textContent = parseInt(parseFloat(zoomVal)*100).toString() + '%';
    

    this.mouseDown = false;
    this.pos = { top: 0, left: 0, x: 0, y: 0 };
  }

  initView(imgUrl) {
    const containerStyle = {
      position : 'relative',
      overflow : 'hidden',
      clear : 'both'
    };

    const contentStyle = {
      cursor : 'grab',
      overflow : 'hidden',
      position : 'absolute',
      'top' : '0px',
      left : '0px'

    };

    var image = document.createElement('img');
    image.id = this.DOCID + '_image';
    image.setAttribute('draggable','false');
    image.src = imgUrl;
    image.style.userSelect = 'none';

    var content = document.createElement('div');
    content.id = this.DOCID + '_content';
    Object.keys(contentStyle).forEach(s => {
      content.style[s] = contentStyle[s];
    });
    content.addEventListener('mousedown',this.mouseDownHandler.bind(this),false);
    content.addEventListener('mousemove', this.mouseMoveHandler.bind(this),false);
    content.addEventListener('mouseup', this.mouseUpHandler.bind(this),false);
    content.appendChild(image);

    var container = document.createElement('div');
    container.id = this.DOCID + '_container';
    Object.keys(containerStyle).forEach(s => {
      container.style[s] = containerStyle[s];
    });
    container.appendChild(content);
    
    var rootContainer = document.getElementById(this.DOCID);
    rootContainer.appendChild(container);
    
    var zoomDisplay = document.createElement('span');
    zoomDisplay.id = this.DOCID + '_zoomdisplay';
    rootContainer.append(zoomDisplay);

    var zoomControl = document.createElement('input');
    zoomControl.id = this.DOCID + '_zoomcontrol';
    zoomControl.type = 'range';
    zoomControl.min = '0.1';
    zoomControl.max = '4';
    zoomControl.step = '0.1';
    zoomControl.addEventListener('input',this.zoomHandler.bind(this),false);
    rootContainer.append(zoomControl);
  }

  mouseDownHandler(e) {
    if (!this.mouseDown) {
      var content = document.getElementById(this.DOCID + '_content');

      var left = parseInt(content.style.left.replace(/px$/,''));
      var top = parseInt(content.style.top.replace(/px$/,''));
      
      this.pos = {
          // The current scroll
          left: left,
          top: top,
          // Get the current mouse position
          x: e.clientX,
          y: e.clientY,
      };

      content.style.cursor = 'grabbing';
    
      this.mouseDown = true;
    }
  }
  
  mouseMoveHandler(e) {
    if (this.mouseDown) {
      const dx = e.clientX - this.pos.x;
      const dy = e.clientY - this.pos.y;
  
      var content = document.getElementById(this.DOCID + '_content');

      // Scroll the element
      content.style.top = (this.pos.top + dy).toString() + "px";
      content.style.left = (this.pos.left + dx).toString() + "px";
    }
  }
  
  mouseUpHandler(e) {
    if (this.mouseDown) {
      var content = document.getElementById(this.DOCID + '_content');

      content.style.cursor = 'grab';
      
      this.mouseDown = false;
    }
  }

  zoomHandler(e) {
    var zoomDisplay = document.getElementById(this.DOCID + '_zoomdisplay');
    var content = document.getElementById(this.DOCID + '_content');

    var zoomValue = e.target.value;

    content.style.transform = 'scale(' + zoomValue + ')';

    zoomDisplay.textContent = parseInt(parseFloat(zoomValue)*100).toString() + '%';
  }
}
