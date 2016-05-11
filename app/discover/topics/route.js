import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service(),
  model() {
    return this.store.query("discover.topics", {discover_station: "wnyc"}).then(topics => {
      var savedTopics = [];
      let savedTopicsKeys = this.get('session.data.discover-topics');
      if (savedTopicsKeys) {
        // Now we'll find the matching objects in the discover topics,
        // and add them to the selectedTopics list
        topics.forEach(function(topic) {
          if (savedTopicsKeys.contains(topic.get('url'))) {
            savedTopics.addObject(topic);
          }
        });
      }

      return Ember.RSVP.hash({
        topics: topics,
        savedTopics: savedTopics
      });
    });
  },
  actions: {
    next(selectedTopics) {
      let selectedTopicKeys = selectedTopics.map(s => s.get('url'));
      this.get('session').set('data.discover-topics', selectedTopicKeys);
      this.transitionTo('discover.shows');
    }
  }
});
