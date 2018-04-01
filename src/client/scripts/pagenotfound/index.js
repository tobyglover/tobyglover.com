import '../../styles/pages/pagenotfound.scss';
import {getUrlParameter} from '../shared'
import $ from 'jquery';

let $gif = null;

$(document).ready(() => {
  init();
});

function init() {
  let path = getUrlParameter("p");
  if (path) {
    $("#message").text("Sorry, " + path + " is not a valid page");
  }
  $("#stay").click(stay)
}

function stay() {
  let main = $("#main");

  main.css({
    animation: "fadeOutUp .5s",
    opacity: 0
  });
  $("#back-to-home-container").css({
    opacity: 1
  });
  setTimeout(() => {
    main.empty();
    setUp(main);
    main.css({
      animation: "fadeInUp .5s",
      opacity: 1
    });
  }, 2000);
}

function setUp(parent) {
  $gif = $("<img>", {id: "gif"});
  getGif();
  let p = $("<p>", {id: "message", text: "Ok... here is a random GIF, courtesy of Giphy"});
  let anotherBtn = $("<span>", {class:"underline", text: "Get Another"}).click(getGif);

  parent.addClass("show-gifs");
  parent.append(p);
  parent.append($gif);
  parent.append(anotherBtn);
}

function getGif() {
  $.ajax({
    url: "/api/randomgif",
    dataType: "json",
    success: data => {
      $gif.attr("src", data.url);
    }
  });
}
