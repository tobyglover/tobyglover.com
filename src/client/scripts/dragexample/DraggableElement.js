const width = 100;
const height = 100;

export default class DraggableElement extends HTMLElement {
  constructor() {
    super();
    this.style.width = width + "px";
    this.style.height = height + "px";
    this.style.backgroundColor = "red";
    this.style.position = "absolute";
    this.dragging = false;
  }

  connectedCallback() {
    this.onmousedown = this.onDragStart.bind(this);
    document.addEventListener('mouseup', this.onDragEnd.bind(this));
    document.addEventListener('mousemove', this.onDrag.bind(this));
  }

  disconnectedCallback() {
    this.onmousedown = null;
    document.removeEventListener('mouseup', this.onDragEnd.bind(this));
    document.removeEventListener('mousemove', this.onDrag.bind(this));
  }

  updatePosition(x, y) {
    let parentRec = this.parentNode.getBoundingClientRect();
    if (x < 0) {
      x = 0;
    } else if (x + width > parentRec.width) {
      x = parentRec.width - width;
    }

    if (y < 0) {
      y = 0;
    } else if (y + height > parentRec.height) {
      y = parentRec.height - height;
    }

    this.style.left = x + "px";
    this.style.top = y + "px";
  }

  onDragStart(e) {
    e.preventDefault()
    this.dragging = true;
    let rect = this.getBoundingClientRect();
    this.mouseOffsetX = e.clientX - rect.left;
    this.mouseOffsetY = e.clientY - rect.top;
  }

  onDrag(e) {
    if (this.dragging) {
      let parentRec = this.parentNode.getBoundingClientRect();
      let x = e.clientX - parentRec.left - this.mouseOffsetX;
      let y = e.clientY - parentRec.top - this.mouseOffsetY;
      this.updatePosition(x, y);
    }
  }

  onDragEnd(e) {
    this.dragging = false;
  }
}

window.customElements.define('draggable-element', DraggableElement);
