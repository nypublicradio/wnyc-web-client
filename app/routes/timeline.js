import Route from '@ember/routing/route';
import config from '../config/environment';

export default Route.extend({
  setupController(controller) {
    controller.set('cssPath', `${config.rootURL}assets/css/timeline.css`)
  },
  actions: {
    didTransition() {
      window.scrollTo(0, 0);
    }
  }
});
