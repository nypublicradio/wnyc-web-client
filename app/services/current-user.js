import Service from 'ember-service';
import service from 'ember-service/inject';

export default Service.extend({
  session: service('session'),
  store: service(),

  load() {
    if (this.get('session.isAuthenticated')) {
      return this.get('store').find('user', 'me').then((user) => {
        this.set('user', user);
      });
    }
  }
});
