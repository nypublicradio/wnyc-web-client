/*
  This module gathers into one place any tweaks that are needed to
  make the pre-existing Javascript play nicely in a persistent-app
  world.

  The goal is that this set can keep shrinking as features are ported
  out of the old JS.
*/
import Ember from 'ember';
const { $ } = Ember;

// This gets run by the django-page component right before tearing
// down the content.
export function beforeTeardown(/* element, page */) {
  // toggle_menu_v2.js sets classes way up on <html>, so we may need to clear them.
  $('html')
    .removeClass('navigation-open')
    .removeClass('subnavigation-open');

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
  if (/localstorage/.test(scriptTag.getAttribute('src')) || 
      /web_player_controller/.test(scriptTag.getAttribute('src'))) {
    return sourceCode.replace(/typeof define/, 'typeof foo');
  }
  // TODO: I see in the mako templates that this is already disabled
  // in overhaul mode. Need to discuss with Brian.
  let source = sourceCode.replace('.pubads().enableSyncRendering()', '');
  source = source.replace(/Okra\.execute\('displayPlayer'\);/, '');
  return source;
}
