import Service from 'ember-service';
import service from 'ember-service/inject';

export default Service.extend({
  session: service('session'),
  store: service(),

  load() {
    if (this.get('session.isAuthenticated')) {
      let user = this.get('store').queryRecord('user', {me: true});
      this.set('user', user);
      return user
      .catch(() => {
        // this access token has since been revoked
        this.get('session').invalidate();
      });
    }
  }
});
