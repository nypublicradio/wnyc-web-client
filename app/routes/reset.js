import Route from '@ember/routing/route';
import DeauthenticatedRouteMixin from 'wnyc-web-client/mixins/deauthenticated-route-mixin';

export default Route.extend(DeauthenticatedRouteMixin, {
  titleToken: 'Reset Password',
  
  beforeModel(transition) {
    if ( !transition.queryParams.email || !transition.queryParams.confirmation ) {
      // if we got here with missing url parameters,
      // (i.e. typing url, bad copy/paste)
      // send the user to the 'forgot' page so they can request a reset email
      this.transitionTo('forgot');
    } else {
      this._super(...arguments);
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
