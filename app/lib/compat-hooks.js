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
}

// This gets run by the django-page model when it's figuring out how
// to append itself to the DOM. It receives an Element (representing
// the content that's about to be appended) and the page model. The
// Element is not yet inserted into any document, and you can modify
// it here as needed.
export function beforeAppend(element /*, page */) {
  // wnyc.basic_analytics.js doesn't respect preventDefault on link
  // clicks, which causes users to accidentally escape the ember
  // app. It tracks anything with this class name, so I'm just
  // disabling it here by removing the class. We will want to fix and
  // re-enable.
  Array.from(element.querySelectorAll('.js-track-links')).forEach(elt => {
    elt.className = elt.className.replace('js-track-links', '');
  });
  return element;
}

// All the dynamically discovered Javascript that comes along with the
// pages is run through this before executing. You can return non-true
// to cancel the entire script.
export function mangleJavascript(scriptTag, sourceCode) {
  // TODO: I see in the mako templates that this is already disabled
  // in overhaul mode. Need to discuss with Brian.
  return sourceCode.replace('.pubads().enableSyncRendering()', '');
}
