import Ember from 'ember';
import DS from 'ember-data';
import loadScripts from '../lib/external-script-loader';
import { beforeAppend } from '../lib/compat-hooks';
const $ = Ember.$;
const { allSettled } = Ember.RSVP;
const Promise = Ember.RSVP.Promise;

export default DS.Model.extend({
  htmlParser: Ember.inject.service(),
  text: DS.attr(),

  document: Ember.computed('text', function() {
    return this.get('htmlParser').parse(this.get('text'));
  }),

  title: Ember.computed('document', function() {
    let titleTag = this.get('document').querySelector('title');
    if (titleTag) {
      return titleTag.innerHTML;
    }
  }),

  appendHeaderStyles($element) {
    let doc = this.get('document');
    let internalStyles = Array.from(doc.querySelectorAll('head style')).map(importNode);
    let externalStyles = Array.from(doc.querySelectorAll('head link[rel=stylesheet]')).map(importNode);
    let stylesLoaded = externalStyles.map(s => styleLoaded(s));
    $element.append(internalStyles).append(externalStyles);
    return allSettled(stylesLoaded);
  },

  separateScripts() {
    let doc = this.get('document');
    let body = importNode(doc.querySelector('body'));
    let scripts = [];

    // First handle <script> in the <head>
    Array.from(doc.querySelectorAll('head script')).forEach(script => {
      if (isJavascript(script)) {
        // Save for later evaluation
        scripts.push(script);
      } else {
        // Non-javascript script tags (templates, for example) get
        // moved from head to body so they will get added to our
        // rendered output (we only output the contents of body, since
        // it doesn't make sense to add a new head to the existing
        // page).
        body.appendChild(script);
      }
    });

    // Then handle <script> in <body>
    Array.from(body.querySelectorAll('script')).forEach(script => {
      if (isJavascript(script)) {
        // Pull out of body and save for evaluation
        script.remove();
        scripts.push(script);
      }
    });

    body = beforeAppend(body);

    return { body, scripts };
  },

  appendTo($element) {
    return this.appendHeaderStyles($element).finally(() => {
      let { body, scripts } = this.separateScripts();
      Array.from(body.childNodes).forEach(child => {
        $element[0].appendChild(importNode(child));
      });
      loadScripts(scripts, $element[0]);
    });
  }
});

function styleLoaded(element) {
  return new Promise((resolve, reject) => {
    $(element)
      .on('load', resolve)
      .on('error', reject);
  });
}

function importNode(node) {
  const DEEP_COPY = true;
  return window.document.importNode(node, DEEP_COPY);
}

function isJavascript(scriptTag) {
  let type = scriptTag.attributes.type ? scriptTag.attributes.type.value : 'text/javascript';
  return /(?:application)|(?:text)\/javascript/i.test(type);
}
