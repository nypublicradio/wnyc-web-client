import Ember from 'ember';
import config from 'wnyc-web-client/config/environment';

export default Ember.Route.extend({
  config,
  titleToken: 'Log in',
  setupController(controller) {
    controller.set('config', this.get('config'));
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
