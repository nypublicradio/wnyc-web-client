/*
   The main goal here is parallel loading with sequential
   evaluation. We want to fetch all the scripts in parallel for the
   fastest experience, but we need to evaluate them in their original
   order in case they depend on each other. This has to work both for
   external and inline scripts.
*/

import fetch from 'fetch';
import Ember from 'ember';
import rewriter from 'ember-cli-proxy/rewriter';
import URL from 'ember-cli-proxy/url';
import { mangleJavascript } from '../lib/compat-hooks';
const { Promise } = Ember.RSVP;

export default Ember.Service.extend({
  asyncWriter: Ember.inject.service(),

  init() {
    this.stack = [];
  },

  load(scriptTags, containerElement) {
    debugger;
    let sources = Array.from(scriptTags).map(
      tag => loadSource(tag).then(src => ({
        src,
        tag
      }))
    );

    this.stack.unshift({ sources,containerElement });
    if (this.stack.length === 1) {
      this._evalNext();
    }
  },

  _evalNext() {
    if (this.stack.length === 0) {
      return Promise.resolve();
    }

    let { sources, containerElement } = this.stack[0];

    if (sources.length === 0) {
      this.stack.shift();
      return this._evalNext();
    }

    let asyncWriter = this.get('asyncWriter');

    return sources.shift().then(({src, tag}) => {
      let postMangled = mangleJavascript(tag, src);
      if (postMangled) {
        let script = document.createElement('script');
        script.textContent = postMangled;
        script.type = 'text/javascript';
        asyncWriter.cursorTo(placeholderFor(tag));

        // Since we have already preloaded and inlined the source,
        // this will run it synchronously.
        containerElement.appendChild(script);

        // Make sure any document.writes get their place at the head
        // of the stack before we move on
        asyncWriter.flush();
      }
    }).finally(() => this._evalNext());
  }

});

// In order to fetch all the scripts via XHR without tripping CORs
// violations, we are proxying them through our own server.
function scriptURL(tag) {
  let origin = location.protocol + '//' + location.host;
  let url = rewriter.rewriteURL(tag.attributes.src.value);
  if (url.indexOf(origin) === '0') {
    return url;
  } else {
    return '/dynamic-script-loader/' + encodeURIComponent(new URL(url, location.href).toString());
  }
}

function loadSource(scriptTag) {
  if (scriptTag.hasAttribute('src')) {
    return fetch(scriptURL(scriptTag)).then(response => response.text());
  } else {
    return Promise.resolve(scriptTag.textContent);
  }
}

function placeholderFor(tag) {
  if (!tag.hasAttribute('data-script-id')) {
    return null;
  }
  let id = tag.getAttribute('data-script-id');
  return document.querySelector(`[data-script-id="${id}"]`);
}
