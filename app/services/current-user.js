import Service from 'ember-service';
import service from 'ember-service/inject';
import RSVP from 'rsvp';

export default Service.extend({
  session: service('session'),
  store: service(),

  load() {
    if (this.get('session.isAuthenticated')) {
      let user;
      if (this.get('session.data.isSigningUpWithThirdParty') === true) {
        this.get('session').set('data.isSigningUpWithThirdParty', false);
        user = this.get('session').createUserForAuthenticatedProvider();
      } else {
        user = this.get('store').queryRecord('user', {me: true});
      }

      this.set('user', user);
      return user.then((user) => {
        this.set('user', user);
      })
      .catch(() => {
        // this access token has since been revoked
        this.get('session').invalidate();
      });
    } else {
      return RSVP.resolve();
    }
  }
});
