import Route from 'ember-route';
import DeauthenticatedRouteMixin from 'wnyc-web-client/mixins/deauthenticated-route-mixin';

export default Route.extend(DeauthenticatedRouteMixin, {
  actions: {
    didTransition() {
      this.send('disableChrome');
    },
    willTransition() {
      this.send('enableChrome');
    }
  }
});
