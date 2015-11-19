import Ember from 'ember';
import isJavascript from '../lib/is-js';
const { $, RSVP } = Ember;
const { Promise } = RSVP;

export default Ember.Service.extend({
  htmlParser: Ember.inject.service(),
  scriptLoader: Ember.inject.service(),

  init() {
    this._super();
    this.queue = [];
  },

  install() {
    $(document).ready(() => {
      document.write = (string) => this.write(string);
    });
  },

  _nodesFrom(string) {
    let doc = this.get('htmlParser').parse(string);
    return ['head', 'body'].map(part => Array.from(doc.querySelector(part).childNodes)).reduce((a,b) => a.concat(b));
  },

  _extractScripts(nodes) {
    let scripts = [];
    let nonscripts = [];
    nodes.forEach(node => {
      if (node.tagName === 'SCRIPT' && isJavascript(node)) {
        scripts.push(node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.querySelectorAll('script')).forEach(script => {
          if (isJavascript(script)) {
            scripts.push(script);
            script.remove();
          }
        });
        nonscripts.push(node);
      }
    });
    return { scripts, nonscripts };
  },

  write(string) {
    this.queue.push({ string, cursor: this.cursor });
    if (this.queue.length === 1) {
      setTimeout(() => this.flush(), 0);
    }
  },

  flush() {
    let queue = this.queue;
    this.queue = [];

    let allScripts = [];
    queue.forEach(({string, cursor}) => {

      let { scripts, nonscripts } = this._extractScripts(this._nodesFrom(string));

      nonscripts.forEach(node => {
        let newNode = window.document.importNode(node, true);
        if (cursor) {
          cursor.parentElement.insertBefore(newNode, cursor);
        } else {
          document.body.appendChild(newNode);
        }
      });

      allScripts = allScripts.concat(scripts);
    });

    if (allScripts.length > 0) {
      this.get('scriptLoader').load(allScripts, document.body);
    }
  },

  cursorTo(node) {
    this.cursor = node;
  }
});
