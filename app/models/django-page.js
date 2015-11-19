import Ember from 'ember';
import DS from 'ember-data';
import loadScripts from '../lib/external-script-loader';
import { beforeAppend } from '../lib/compat-hooks';
const { $ } = Ember;
const { allSettled, Promise } = Ember.RSVP;

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

  appendStyles($element, styles) {
    let stylesLoaded = styles.map(s => styleLoaded(s));
    $element.append(styles);
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

    // Styles, both inline and external, with their relative order maintained.
    let styles = Array.from(doc.querySelectorAll('style, link[rel=stylesheet]')).map(element => importNode(element));

    // Remove the style tags from our imported body, because they will be handled separately.
    Array.from(body.querySelectorAll('style, link[rel=stylesheet]')).forEach(element => element.remove());

    body = beforeAppend(body);

    return { body, scripts, styles };
  },

  appendTo($element) {
    let { body, scripts, styles } = this.separateScripts();
    return this.appendStyles($element, styles).finally(() => {
      Array.from(body.childNodes).forEach(child => {
        $element[0].appendChild(importNode(child));
      });
      loadScripts(scripts, $element[0]);
    });
  }
});

function styleLoaded(element) {
  if (element.tagName !== 'LINK') {
    return Promise.resolve();
  }
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
