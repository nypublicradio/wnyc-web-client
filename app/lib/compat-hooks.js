/*
  This module gathers into one place any tweaks that are needed to
  make the pre-existing Javascript play nicely in a persistent-app
  world.

  The goal is that this set can keep shrinking as features are ported
  out of the old JS.
*/
import Ember from 'ember';
import config from 'overhaul/config/environment';
import { removeAlienListeners, assign } from 'overhaul/lib/alien-dom';
import { runOnce } from 'overhaul/services/legacy-loader';
import { canonicalize } from 'overhaul/services/script-loader';
const { $, get } = Ember;

export function homepageCleanup(element = document.body) {
  // remove these if they're empty, otherwise they cause layout issues
  Array.from(element.querySelectorAll('#twitterbox, #technical-message'))
    .forEach(n => !n.children.length && n.parentElement.removeChild(n));

  // these media buttons are added to the DOM by legacy JS, so we don't want
  // to save them to the ember data model
  Array.from(element.querySelectorAll('.media_buttons'))
    .forEach(n => {
      while(n.hasChildNodes()) { n.removeChild(n.firstChild); }
    });

  return element;
}

// This gets run by the django-page component right before tearing
// down the content.
export function beforeTeardown(/* element, page */) {
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

  // The mailchimp popup signup form is badly behaved -- it insists on
  // being the only AMD loader on the page. So here we clear it away
  // to make room for the next copy. (Ember's AMD loader is hiding
  // under WNYC_EMBER_LOADER, see lib/unobstrusive-loader.js.)
  window.define = undefined;

  // Most pages don't actually overwrite this if it exists, so it can
  // end up accumulating unexpected cruft.
  let apis = window.wnyc.apis;
  let Decoder = window.wnyc.Decoder;
  let url = window.wnyc.url;
  window.wnyc = undefined;

  window.wnyc = { apis, Decoder, url };

  // unknown scripts are setting overflow inline on the homepage
  if (location.pathname === '/') {
    $('body').css('overflow', '');
  }

  // story bootstraps adds a bunch of click handlers at run time that need to be
  // removed otherwise they will pile up
  removeAlienListeners();
}

// This gets run by the django-page model when it's figuring out how
// to append itself to the DOM. It receives an Element (representing
// the content that's about to be appended) and the page model. The
// Element is not yet inserted into any document, and you can modify
// it here as needed.
export function beforeAppend(element, page) {
  let sm2 = element.querySelector('#sm2-container');
  if (sm2) {
    sm2.parentElement.removeChild(sm2);
  }
  if (page.get('id') === '/') {
    element = homepageCleanup(element);
  }

  let container = document.createElement('div');
  if (get(page, 'wnycContent')) {
    Array.from(element.querySelectorAll('.l-full, .l-full + .l-constrained'))
      .forEach(n => container.appendChild(n));
  } else if (get(page, 'wnycChannel')) {
    container.appendChild(element.querySelector('#js-listings'));
  } else if ( page.get('id') && page.get('id').match(/^streams\//i) ) {
    // TODO: is there a better way to detect this?
    return container;
  } else {
    let legacyContent = element.querySelector('#site') || element.querySelector('#flatpage');
    if (!legacyContent) {
      // maybe it's a flat page
      legacyContent = element;
    }
    let newContent = document.createElement('div');
    if (!$(legacyContent).hasClass('graphic-responsive')){
      newContent.classList.add('l-constrained');
    }
    if (page.get('id') === 'search/') {
      newContent.classList.add('search');
    }
    while (legacyContent.firstChild) {
      newContent.appendChild(legacyContent.firstChild);
    }
    container.appendChild(newContent);
  }
  // container's childNodes are appended to the DOM; container is discarded
  return container;
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

// on first-loads, ember will consume the document with which it was booted, so
// we have to do some clean up regarding present ember asset scripts, ember views
// and server-side DOM scripts
export function serializeInlineDoc(inlineDoc) {
  let toClean = [];

  // By this point, ember has already booted a view into the Document, so
  // we need to clean it from the version we save as our data model, otherwise
  // we get problems from recursive ember views and ember trying to boot again
  Array.from(inlineDoc.querySelectorAll('.ember-view')).forEach(n => toClean.push(n));
  toClean.push(inlineDoc.querySelector('script[src*="assets/vendor"]'));
  toClean.push(inlineDoc.querySelector('script[src*="assets/overhaul"]'));
  toClean.push(inlineDoc.querySelector('link[href*="assets/vendor"]'));
  toClean.push(inlineDoc.querySelector('link[href*="assets/overhaul"]'));
  // any included google ad scripts have also already run, so clean them out so
  // see errors from intializing ads in occupied divs
  Array.from(inlineDoc.querySelectorAll('.google-ads')).forEach(n => toClean.push(n));

  toClean.forEach(n => n && n.parentNode.removeChild(n));

  return inlineDoc;
}

// retrieving this destinationPath failed, possibly because the server
// redirected the request to a new destination which does not respect
// our CORS request. reassign the url to the location and let's see
// what happens
// if it's a 404 or 500, throw it so status code handlers at a higher
// level can respond
export function retryFromServer(error, destinationPath) {
  let { response } = error;
  if (response && (response.status === 404 || response.status === 500)) {
    throw error;
  }
  assign(`${canonicalize(config.wnycURL)}/${destinationPath}`);
}
