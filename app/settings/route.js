import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('stream');
  },

  didTransition() {
    window.scrollTo(0, 0);
  }
});
