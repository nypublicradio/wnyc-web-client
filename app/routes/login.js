import Ember from 'ember';
import service from 'ember-service/inject';
import config from 'wnyc-web-client/config/environment';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend(UnauthenticatedRouteMixin, {
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
