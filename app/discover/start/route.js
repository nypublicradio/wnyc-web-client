import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('discover');
  },
  actions: {
    next() {
      this.transitionTo('discover.topics');
    }
  }
});
