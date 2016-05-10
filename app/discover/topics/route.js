import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service(),
  afterModel(topics /*, transition */) {
    let savedTopics = this.get('session.data.discover-topics');
    let topicsController = this.controllerFor('discover.topics');
    let selectedTopics = [];
    if (savedTopics) {
      // Now we'll find the matching objects in the discover topics,
      // and add them to the selectedTopics list

      topics.forEach(function(topic) {
        if (savedTopics.contains(topic.get('url'))) {
          selectedTopics.addObject(topic);
        }
      });
      topicsController.set('selectedTopics', selectedTopics);
    }
  },
  model() {
    return this.store.query("discover.topics", {discover_station: "wnyc"});
  },
  actions: {
    next() {
      let topicsController = this.controllerFor('discover.topics');
      let selectedTopics = topicsController.get('selectedTopics');
      this.get('session').set('data.discover-topics', selectedTopics.map(s => s.get('url')));

      this.transitionTo('discover.shows');
    }
  }
});
