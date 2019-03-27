import DraggableElement from './DraggableElement';

const tmpl = document.createElement("template");
tmpl.innerHTML = `
  <style>
    #content {
      width: 100%;
      height: 100%;
      background-color: white;
      position: relative;
    }
  </style>
  <div id="content">
`;


export default class DraggableCanvas extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: 'open'}).appendChild(tmpl.content.cloneNode(true));
    this.contentContainer = this.shadowRoot.querySelector("#content");
  }

  getRandomColorHex() {
    let hex = "#";
    for (let i = 0; i < 3; i++) {
      let color = Math.round(Math.random() * 255);
      hex += color.toString(16);
    }
    return hex;
  }

  addElement() {
    let element = new DraggableElement();
    element.setAttribute('color', this.getRandomColorHex());
    this.contentContainer.appendChild(element);
  }
}

window.customElements.define('draggable-canvas', DraggableCanvas);
