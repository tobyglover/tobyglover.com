const width = 100;
const height = 100;

export default class DraggableElement extends HTMLElement {
  constructor() {
    super();
    this.style.width = width + "px";
    this.style.height = height + "px";
    this.style.position = "absolute";
    this.dragging = false;
    this.movedRandom = false;
    this.updateStyle();
  }

  static get observedAttributes() {
    return ['color'];
  }

  connectedCallback() {
    if (!this.movedRandom) {
      this.movedRandom = true;
      // move to a random initial position
      let parentRec = this.parentNode.getBoundingClientRect();
      this.updatePosition(Math.random() * (parentRec.width - width), Math.random() * (parentRec.height - height));
    }

    this.onmousedown = this.onDragStart.bind(this);
    document.addEventListener('mouseup', this.onDragEnd.bind(this));
    document.addEventListener('mousemove', this.onDrag.bind(this));
  }

  disconnectedCallback() {
    this.onmousedown = null;
    document.removeEventListener('mouseup', this.onDragEnd.bind(this));
    document.removeEventListener('mousemove', this.onDrag.bind(this));
  }

  attributeChangedCallback() {
    this.updateStyle();
  }

  updateStyle() {
    this.style.backgroundColor = this.getAttribute('color') || "red";
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
    this.parentNode.insertBefore(this, null);
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
