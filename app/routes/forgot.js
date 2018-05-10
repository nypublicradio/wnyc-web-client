import Route from '@ember/routing/route';
import config from 'wqxr-web-client/config/environment';

export default Route.extend({
  setupController(controller) {
    controller.set('config', config);
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
