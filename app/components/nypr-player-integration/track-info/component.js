import Ember from 'ember';

export default Ember.Component.extend({
  tagName       : '',

  showTitle     : null,
  showUrl       : null,

  storyTitle    : null,
  storyUrl      : null,

  audioId       : null,
  songDetails   : null,
  
  didReceiveAttrs() {
    this._super(...arguments);
    if (!this.get('isStream')) { return; }
    
    let oldShowTitle = this.get('_showTitle');
    let showTitle = this.get('showTitle');
    if (oldShowTitle === showTitle) { return; }
    this.set('_showTitle', showTitle);
    
    if (this.attrs.trackStreamData) {
      this.attrs.trackStreamData();
    }
  }
});
