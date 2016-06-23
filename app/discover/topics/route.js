import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service(),
  discoverPrefs: Ember.inject.service(),

  model() {
    return Ember.RSVP.hash({
      topics: this.store.query("discover.topics", {discover_station: "wnyc"}),
      selectedTopicTags: this.get('discoverPrefs.selectedTopicTags')
    });
  },
  actions: {
    back() {
      let prefs = this.get('discoverPrefs');
      prefs.set('currentSetupStep', 'start');
      this.transitionTo('discover.start');
    },
    next(selectedTopicTags) {
      let prefs = this.get('discoverPrefs');
      if (selectedTopicTags.length === 0) {
        this.controllerFor('discover.topics').set('showError', true);
      }
      else {
        this.controllerFor('discover.topics').set('showError', false);
        prefs.set('selectedTopicTags', selectedTopicTags);
        prefs.set('currentSetupStep', 'shows');
        prefs.save();

        this.transitionTo('discover.shows');
      }
    }
  }
});
