import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    // ajax call to TBD endpoint to get a list of topic key/topic name pairs
  },
  actions: {
    next() {
      this.transitionTo('discover.shows');
    }
  }
});
