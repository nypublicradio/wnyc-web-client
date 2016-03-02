import Ember from 'ember';
import DS from 'ember-data';
import { beforeAppend } from '../lib/compat-hooks';
import isJavascript from '../lib/is-js';
const { $ } = Ember;
const { allSettled, Promise } = Ember.RSVP;
import { embeddedComponentSetup } from '../lib/alien-dom';

let scriptCounter = 0;

export default DS.Model.extend({
  htmlParser: Ember.inject.service(),
  scriptLoader: Ember.inject.service(),
  inlineDocument: DS.attr(),
  text: DS.attr(),

  document: Ember.computed('inlineDocument', 'text', function(){
    let inlineDoc = this.get('inlineDocument');
    let text = this.get('text');
    if (inlineDoc) {
      return inlineDoc;
    } else {
      return this.get('htmlParser').parse(text);
    }
  }),

  title: Ember.computed('document', function() {
    let titleTag = this.get('document').querySelector('title');
    if (titleTag) {
      return titleTag.innerHTML;
    }
  }),

  wnycContent: Ember.computed('document', function() {
    let tag = this.get('document').querySelector('#wnyc-story-jsonapi');
    let json;
    if (tag) {
      try {
        json = JSON.parse(tag.textContent);
      } catch(err) {}
    }
    if (json) {
      return this.store.push(json);
    }
  }),


  wnycChannel: Ember.computed('document', function() {
    let channel = this.get('document').querySelector('#wnyc-channel-jsonapi');
    let channelSerializer = this.store.serializerFor('channel');
    let channelModel = this.store.modelFor('channel');
    let id = this.get('id');
    let json;

    if (channel) {
      try {
        json = JSON.parse(channel.textContent);
      } catch(err) {}
      if (json) {
        return this.store.push(channelSerializer.normalizeResponse(this.store, channelModel, json, id));
      }
    }
  }),

  embeddedEmberComponents: Ember.computed('document', function() {
    let doc = this.get('pieces.body');
    return Array.from(doc.querySelectorAll('[data-ember-component]')).map(el => {
      let id = el.id;
      return {
        id,
        componentName: el.getAttribute('data-ember-component'),
        args: JSON.parse(el.getAttribute('data-ember-args'))
      };
    });
  }),

  appendStyles($element, styles) {
    let stylesLoaded = styles.map(s => styleLoaded(s));
    $element.append(styles);
    return allSettled(stylesLoaded);
  },

  pieces: Ember.computed('document', function() {
    return this._separateScripts();
  }),

  _separateScripts() {
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
        body.appendChild(importNode(script));
      }
    });

    // Then handle <script> in <body>
    Array.from(body.querySelectorAll('script')).forEach(script => {
      if (isJavascript(script)) {
        // Pull out of body and save for evaluation, leaving a marker
        // in the original spot in case we need to direct any
        // document.writes back there.
        let marker = document.createElement('script');
        marker.type = 'text/x-original-location';
        let id = scriptCounter++;
        marker.setAttribute('data-script-id', id);
        script.parentElement.insertBefore(marker, script);
        script.parentNode.removeChild(script);
        script.setAttribute('data-script-id', id);
        scripts.push(script);
      }
    });

    embeddedComponentSetup(body);

    // Styles, both inline and external, with their relative order maintained.
    let styles = Array.from(doc.querySelectorAll('style, link[rel=stylesheet]')).map(element => importNode(element));

    // Remove the style tags from our imported body, because they will be handled separately.
    Array.from(body.querySelectorAll('style, link[rel=stylesheet]')).forEach(e => e.parentNode.removeChild(e));

    body = beforeAppend(body);

    return { body, scripts, styles };
  },

  appendTo($element) {
    let loader = this.get('scriptLoader');
    return this.appendStyles($element, this.get('pieces.styles')).finally(() => {
      Array.from(this.get('pieces.body').childNodes).forEach(child => {
        $element[0].appendChild(importNode(child));
      });
      loader.load(this.get('pieces.scripts'), $element[0]);
    });
  }
});

// <link> tags do not reliably produce load events, particularly if
// the CSS is already cached.
function styleLoaded(element) {
  if (element.tagName !== 'LINK') {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    $(element)
      .on('load', resolve)
      .on('error', reject);
    let started = Date.now();
    let interval = setInterval(() => {
      if (Date.now() - started > 1000) {
        clearInterval(interval);
        reject();
      } else if (Array.from(document.styleSheets).find(s => s.ownerNode === element)) {
        clearInterval(interval);
        resolve();
      }
    }, 20);

  });
}

function importNode(node) {
  const DEEP_COPY = true;
  return window.document.importNode(node, DEEP_COPY);
}
