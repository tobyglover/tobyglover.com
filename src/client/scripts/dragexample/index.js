import '../../styles/pages/dragexample.scss';
import {ContactAside} from '../shared';
import DraggableCanvas from './DraggableCanvas';
import $ from 'jquery';

$(document).ready(() => {
  ContactAside.init();
  init();
});

let canvas = null;

function init() {
  canvas = document.getElementById("canvas");
  document.getElementById("addElementButton").onclick = addElement;
}

function addElement() {
  canvas.addElement();
}
