import Ember from 'ember';
import config from 'wqxr-web-client/config/environment';

export default Ember.Route.extend({
  discoverPrefs: Ember.inject.service(),
  titleToken: 'Discover Edit Topics',

  model() {
    return Ember.RSVP.hash({
      topics: this.store.query("discover.topics", {discover_station: config.discoverTopicsKey}),
      selectedTopicTags: this.get('discoverPrefs.selectedTopicTags')
    });
  },
  actions: {

  }
});
