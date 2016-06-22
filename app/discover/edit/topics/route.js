import Ember from 'ember';

export default Ember.Route.extend({
  discoverPrefs: Ember.inject.service(),

  model() {
    return Ember.RSVP.hash({
      topics: this.store.query("discover.topics", {discover_station: "wnyc"}),
      selectedTopicTags: this.get('discoverPrefs.selectedTopicTags')
    });
  },
  actions: {

  }
});
