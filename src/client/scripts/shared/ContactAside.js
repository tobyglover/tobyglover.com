import '../../styles/main.scss';
import $ from 'jquery';

const MEDIA_SCREEN_MAX_WIDTH = 1120;
const CONTACT_TOP_MARGIN = 200;
const DISTANCE_MIN_CONTRACT = 200;
let contact, container, contactInitialOffset, imgWidth = null;

function init() {
  contact = $("#contact");
  imgWidth = $("#contact img").width();
  container = contact.parent();
  contactInitialOffset = contact.offset().top;

  onScroll();
  onResize();
  $(window).resize(onResize);
}

function onScroll() {
  if (!contact.hasClass("fixed")) {
    contactInitialOffset = contact.offset().top;
  }
  if ($(window).scrollTop() + CONTACT_TOP_MARGIN >= contactInitialOffset) {
    contact.addClass("fixed");
    contact.css({
      top: CONTACT_TOP_MARGIN,
      left: container.offset().left + container.outerWidth()
    });
  } else {
    contact.removeClass("fixed");
    contact.removeAttr('style');
  }
}

function onResize() {
  let windowDependent = [
    {
      type: 'scroll',
      func: onScroll,
      class: 'fixed',
      bind: window,
    },
    {
      type: 'mousemove',
      func: onMouseMove,
      class: 'contract',
      bind: document,
    }
  ]
  if ($(window).width() <= MEDIA_SCREEN_MAX_WIDTH) {
    contact.removeAttr('style');
    windowDependent.forEach(val => {
      $(val.bind).off(val.type, val.func);
      contact.removeClass(val.class);
    });
  } else {
    windowDependent.forEach(val => {
      $(val.bind).on(val.type, val.func);
    });
  }
}

// It may seem weird that we are adding the contract class after load, but we
// want the "default" state to be the usable one incase the user has JS disabled
function onMouseMove(e) {
  let mX = e.pageX;
  let mY = e.pageY;
  let distance = Math.floor(Math.sqrt(Math.pow(mX - (contact.offset().left+(imgWidth/2)), 2) +
                 Math.pow(mY - (contact.offset().top+(contact.height()/2)), 2)));
  if (distance > DISTANCE_MIN_CONTRACT) {
    contact.addClass("contract");
  } else {
    contact.removeClass("contract");
  }
}

module.exports = {
  init
};
