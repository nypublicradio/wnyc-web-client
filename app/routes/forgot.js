import Route from 'ember-route';
import config from 'wnyc-web-client/config/environment';

export default Route.extend({
  config,
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
