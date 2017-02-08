import Ember from 'ember';

export default Ember.Component.extend({
  tagName       : '',

  showTitle     : null,
  showUrl       : null,

  storyTitle    : null,
  storyUrl      : null,

  audioId       : null,
  songDetails   : null,
  
  didReceiveAttrs({oldAttrs, newAttrs}) {
    this._super(...arguments);
    if (!this.get('isStream')) { return; }
    if (oldAttrs && oldAttrs.showTitle.value === newAttrs.showTitle.value) { return; }
    
    if (this.attrs.trackStreamData) {
      this.attrs.trackStreamData();
    }
  }
});
