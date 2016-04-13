/*
  This module gathers into one place any tweaks that are needed to
  make the pre-existing Javascript play nicely in a persistent-app
  world.

  The goal is that this set can keep shrinking as features are ported
  out of the old JS.
*/
import Ember from 'ember';
import { clearAlienDom } from 'overhaul/lib/alien-dom';
import { runOnce } from 'overhaul/services/legacy-loader';
const { $ } = Ember;

export function homepageCleanup(element = document.body) {
  Array.from(element.querySelectorAll('#twitterbox, #technical-message'))
    .forEach(n => n.hasChildNodes() && n.parentElement.removeChild(n));
  element.querySelector('#header').classList.add('home');
  return element;
}

// This gets run by the django-page component right before tearing
// down the content.
export function beforeTeardown(/* element, page */) {
  clearAlienDom();

  // we must destroy any presently loaded google ad slots so the next page can
  // reliably render theirs
  if (window.googletag && window.googletag.destroySlots) {
    window.googletag.destroySlots();
  }

  // toggle_menu_v2.js sets classes way up on <html>, so we may need to clear them.
  $('html')
    .removeClass('navigation-open')
    .removeClass('subnavigation-open');

  // player.js listens for a storage event with a handler defined on the wnyc object,
  // which is triggered by logic outside of Ember; unbind to avoid throwing errors
  $(window).off('unload storage');
  if (window.wnyc && window.wnyc.xdPlayer) {
    window.wnyc.xdPlayer.teardown();
  }

  // The mailchimp popup signup form is badly behaved -- it insists on
  // being the only AMD loader on the page. So here we clear it away
  // to make room for the next copy. (Ember's AMD loader is hiding
  // under WNYC_EMBER_LOADER, see lib/unobstrusive-loader.js.)
  window.define = undefined;

  // Most pages don't actually overwrite this if it exists, so it can
  // end up accumulating unexpected cruft.
  window.wnyc = undefined;

  // some legacy CSS needs help to work properly. see legacy/_screen.scss
  document.body.classList.remove('home');

  // bootstraps story adds a bunch of click handlers at run time that need to be
  // removed otherwise they will pile up
  $(document)
    .off('click',  '.js-accordionButton')
    .off('click',  '.js-dropdownClickable')
    .off('click',  '.js-captionBtn')
    .off('click',  '.js-listen')
    .off('click',  '.js-queue')
    .off('click',  '.js-share')
    .off('submit', '#morningBriefSignup')
    .off('keyup',  '#morningBriefEmailInput')
    .off('click', '.js-toggleButton');

  $('.js-embedText').off('click');
}

// This gets run by the django-page model when it's figuring out how
// to append itself to the DOM. It receives an Element (representing
// the content that's about to be appended) and the page model. The
// Element is not yet inserted into any document, and you can modify
// it here as needed.
export function beforeAppend(element, page) {

  if (page.get('id') === '/') {
    element = homepageCleanup(element);
    Array.from(element.querySelectorAll('.media_buttons'))
    .forEach(n => {
      while(n.hasChildNodes()) { n.removeChild(n.firstChild); }
    });
  }

  return element;
}

// All the dynamically discovered Javascript that comes along with the
// pages is run through this before executing. You can return non-true
// to cancel the entire script.
export function mangleJavascript(scriptTag, sourceCode) {
  if (Object.keys(runOnce).any(k => scriptTag.src.match(k))) {
    return false;
  }
  return sourceCode;
}
