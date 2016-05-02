import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    // use sessiondata to construct query to make radio API, which returns a list
    // of Story models
  },
  actions: {
    edit() {
      this.transitionTo('discover.edit');
    }
  }
});
