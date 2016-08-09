import Ember from 'ember';

export default Ember.Route.extend({
  classNames: ['home'],
  model() {
    return this.store.findRecord('django-page', '/');
  }
});
