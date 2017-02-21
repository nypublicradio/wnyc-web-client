import Route from 'ember-route';
import service from 'ember-service/inject';
import config from 'wqxr-web-client/config/environment';

export default Route.extend({
  config,
  session: service(),
  setupController(controller) {
    controller.set('config', this.get('config'));
    controller.set('session', this.get('session'));
    return this._super(...arguments);
  },
  beforeModel(transition) {
    if ( !transition.queryParams.email || !transition.queryParams.confirmation ) {
      // if we got here with missing url parameters,
      // (i.e. typing url, bad copy/paste)
      // send the user to the 'forgot' page so they can request a reset email
      this.transitionTo('forgot');
    }
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
