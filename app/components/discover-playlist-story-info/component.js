import Ember from 'ember';

export default Ember.Component.extend({
  moment: Ember.inject.service(),
  classNames: ['discover-playlist-story-info'],
  showSummary: false,

  actions: {
    toggleSummary() {
      this.toggleProperty('showSummary');
    }
  }
});
