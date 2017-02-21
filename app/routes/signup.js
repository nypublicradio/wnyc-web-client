import Ember from 'ember';
import Route from 'ember-route';

export default Route.extend({
  session: Ember.inject.service(),
  store: Ember.inject.service(),

  actions: {
    didTransition() {
      this.send('disableChrome');
    },
    willTransition() {
      this.send('enableChrome');
    }
  }
});
