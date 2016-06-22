import Ember from 'ember';

export default Ember.Route.extend({
  session:       Ember.inject.service(),
  discoverQueue: Ember.inject.service('discover-queue'),
  discoverPrefs: Ember.inject.service(),

  beforeModel() {
    let prefs = this.get('discoverPrefs');
    if (window.Modernizr.touch) {
      this.replaceWith('discover.start');
    }
    // look at session data and redirect to start if there are no selected topics
    else if (prefs.get('selectedTopicTags').length === 0) {
      this.replaceWith('discover.start');
    }
  },
  actions: {
    resetPlaylist() {
      this.get('discoverQueue').updateQueue([]);
    }
  }
});
