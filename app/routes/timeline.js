import Route from '@ember/routing/route';
import config from 'wnyc-web-client/config/environment';

export default Route.extend({
  setupController(controller) {
    controller.set('cssPath', `${config.staticAssetPath}css/timeline.css`)
    return this._super(...arguments);
  },
  actions: {
    didTransition() {
      window.scrollTo(0, 0);
    }
  }
});
