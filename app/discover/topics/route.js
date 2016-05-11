import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service(),


  model() {
    return this.store.query("discover.topics", {discover_station: "wnyc"});
  },
  actions: {
    next(selectedTopics) {
      let selectedTopicKeys = selectedTopics.map(s => s.get('url'));
      this.get('session').set('data.discover-topics', selectedTopicKeys);
      this.transitionTo('discover.shows');
    }
  }
});
