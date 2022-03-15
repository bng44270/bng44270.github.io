class DragDoc {
  constructor(id) {
    this.DOC = document.getElementById(id);
    this.initDocument();
  }
  
  initDocument() {
    this.mouseDown = false;
    this.pos = { top: 0, left: 0, x: 0, y: 0 };
    document.addEventListener('mousedown',this.mouseDownHandler.bind(this),false);
    document.addEventListener('mousemove', this.mouseMoveHandler.bind(this),false);
    document.addEventListener('mouseup', this.mouseUpHandler.bind(this),false);
  }

  mouseDownHandler(e) {
    if (!this.mouseDown) {
      this.pos = {
          // The current scroll
          left: this.DOC.scrollLeft,
          top: this.DOC.scrollTop,
          // Get the current mouse position
          x: e.clientX,
          y: e.clientY,
      };
    
      this.DOC.style.cursor = 'grabbing';
      this.DOC.style.userSelect = 'none';
    
      this.mouseDown = true;
    }
  }
  
  mouseMoveHandler(e) {
    if (this.mouseDown) {
      const dx = e.clientX - this.pos.x;
      const dy = e.clientY - this.pos.y;
  
      // Scroll the element
      this.DOC.scrollTop = this.pos.top - dy;
      this.DOC.scrollLeft = this.pos.left - dx;
    }
  }
  
  mouseUpHandler(e) {
    if (this.mouseDown) {
      this.DOC.style.cursor = 'grab';
      this.DOC.style.removeProperty('user-select');
      
      this.mouseDown = false;
    }
  }
}
