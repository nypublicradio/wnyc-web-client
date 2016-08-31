import Ember from 'ember';
import config from 'overhaul/config/environment';

export default Ember.Route.extend({
  discoverPrefs: Ember.inject.service(),

  model() {
    return Ember.RSVP.hash({
      topics: this.store.query("discover.topics", {discover_station: config.discoverTopicsKey}),
      selectedTopicTags: this.get('discoverPrefs.selectedTopicTags')
    });
  },
  actions: {

  }
});
