import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findRecord('django-page', '/');
  },

  actions: {
    //TODO: for legacy compat, remove for new homepage
    didTransition() {
      document.body.classList.add('home');
    },
    willTransition() {
      document.body.classList.remove('home');
    }
  }
});
