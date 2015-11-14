import Ember from 'ember';

export default Ember.Route.extend({
  asyncWriter: Ember.inject.service(),
  beforeModel() {
    this.get('asyncWriter').install();
  }
});
