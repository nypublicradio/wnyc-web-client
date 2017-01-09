import Route from 'ember-route';
import service from 'ember-service/inject';
import config from'wqxr-web-client/config/environment';

export default Route.extend({
  config,
  session: service(),
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
