import Ember from 'ember';
import service from 'ember-service/inject';
import config from'wqxr-web-client/config/environment';

export default Ember.Route.extend({
  config,
  session: service(),
  titleToken: 'Log in',
  setupController(controller) {
    controller.set('config', this.get('config'));
    controller.set('session', this.get('session'));
    return this._super(...arguments);
  },
  actions: {
    didTransition() {
      this.send('disableChrome');
    },
    willTransition() {
      this.send('enableChrome');
    }
  }
});
