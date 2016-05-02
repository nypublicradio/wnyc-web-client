import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    next() {
      this.transitionTo('discover.topics');
    }
  }
});
