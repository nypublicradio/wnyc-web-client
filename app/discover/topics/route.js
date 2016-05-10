import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.query("discover.topics", {discover_station: "wnyc"});
  },
  actions: {
    next() {
      this.transitionTo('discover.shows');
    }
  }
});
