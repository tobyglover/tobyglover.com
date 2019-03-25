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

  addElement() {
    let element = new DraggableElement();
    this.contentContainer.appendChild(element);
  }
}

window.customElements.define('draggable-canvas', DraggableCanvas);
