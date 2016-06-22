import Ember from 'ember';

export default Ember.Route.extend({
  session:       Ember.inject.service(),
  discoverQueue: Ember.inject.service('discover-queue'),
  discoverPrefs: Ember.inject.service(),

  beforeModel() {
    if (window.Modernizr.touch) {
      // Show download links
      this.replaceWith('discover.start');
    }
  },
  actions: {
    resetPlaylist() {
      this.get('discoverQueue').updateQueue([]);
    }
  }
});
