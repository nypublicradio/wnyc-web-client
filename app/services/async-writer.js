import Ember from 'ember';
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
      document.body.appendChild(window.document.importNode(node, true));
    });
  }
});
