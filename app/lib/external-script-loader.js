/*
   The main goal here is parallel loading with sequential
   evaluation. We want to fetch all the scripts in parallel for the
   fastest experience, but we need to evaluate them in their original
   order in case they depend on each other. This has to work both for
   external and inline scripts.
*/

import fetch from 'fetch';
import Ember from 'ember';
const { Promise } = Ember.RSVP;

export default function loadScripts(scriptTags, containerElement) {
  let sources = Array.from(scriptTags).map(tag => {
    if (tag.attributes.src) {
      return fetch(scriptURL(tag)).then(response => response.text());
    } else {
      return Promise.resolve(tag.textContent);
    }
  });

  function evalNext() {
    if (sources.length === 0) {
      return Promise.resolve();
    }
    return sources.shift().then(src => {
      let script = document.createElement('script');
      script.textContent = src;
      script.type = 'text/javascript';
      containerElement.appendChild(script);
    }).finally(evalNext);
  }

  return evalNext();
}

// In order to fetch all the scripts via XHR without tripping CORs
// violations, we are proxying them through our own server.
function scriptURL(tag) {
  // We need to resolve protocol-relative URLs before passing them on to the server.
  let url = tag.attributes.src.value.replace(/^\/\//, location.protocol +"//");
  return '/dynamic-script-loader/' + encodeURIComponent(url);
}
