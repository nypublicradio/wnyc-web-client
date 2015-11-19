import Ember from 'ember';
import rewriter from 'ember-cli-proxy/rewriter';
const { $ } = Ember;

export default Ember.Service.extend({
  htmlParser: Ember.inject.service(),

  install() {
    $(document).ready(() => {
      document.write = (string) => this.write(string);
    });
  },

  _nodesFrom(string) {
    let doc = this.get('htmlParser').parse(string);
    return ['head', 'body'].map(part => Array.from(doc.querySelector(part).childNodes)).reduce((a,b) => a.concat(b));
  },

  write(string) {
    this._nodesFrom(string).forEach(node => {
      let newNode = window.document.importNode(node, true);
      if (newNode.nodeType === Node.ELEMENT_NODE) {
        let scripts = Array.from(newNode.querySelectorAll('script'));
        if (newNode.tagName === 'SCRIPT') {
          scripts.push(newNode);
        }
        scripts.forEach(script => {
          if (script.attributes.src) {
            script.src = rewriter.rewriteURL(script.attributes.src.value);
          }
        });
      }
      if (this.cursor) {
        this.cursor.parentElement.insertBefore(newNode, this.cursor);
      } else {
        document.body.appendChild(newNode);
      }
    });
  },

  cursorTo(node) {
    this.cursor = node;
  }
});
