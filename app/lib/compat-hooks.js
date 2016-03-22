/*
  This module gathers into one place any tweaks that are needed to
  make the pre-existing Javascript play nicely in a persistent-app
  world.

  The goal is that this set can keep shrinking as features are ported
  out of the old JS.
*/
import Ember from 'ember';
import { runOnce } from 'overhaul/services/legacy-loader';
const { $ } = Ember;

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

  // player.js listens for a story event with a handler defined on the wnyc object,
  // which is triggered randomly; unbind here to avoid throwing undefined errors
  $(window).off('unload storage');

  // The mailchimp popup signup form is badly behaved -- it insists on
  // being the only AMD loader on the page. So here we clear it away
  // to make room for the next copy. (Ember's AMD loader is hiding
  // under WNYC_EMBER_LOADER, see lib/unobstrusive-loader.js.)
  window.define = undefined;

  // Most pages don't actually overwrite this if it exists, so it can
  // end up accumulating unexpected cruft.
  window.wnyc = undefined;

}

// This gets run by the django-page model when it's figuring out how
// to append itself to the DOM. It receives an Element (representing
// the content that's about to be appended) and the page model. The
// Element is not yet inserted into any document, and you can modify
// it here as needed.
export function beforeAppend(element /*, page */) {

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
