import Route from '@ember/routing/route';
import DeauthenticatedRouteMixin from 'wnyc-web-client/mixins/deauthenticated-route-mixin';

export default Route.extend(DeauthenticatedRouteMixin, {
  titleToken: 'Validate',
  
  actions: {
    didTransition() {
      this.send('disableChrome');
    },
    willTransition() {
      this.send('enableChrome');
    }
  }
});
