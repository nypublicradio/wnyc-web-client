import Service from 'ember-service';
import service from 'ember-service/inject';
import computed from 'ember-computed';

export default Service.extend({
  store: service(),
  user: computed(function() {
    return this.get('store').find('current_user', 'current');
  }),
  browserId: computed(function() {
    return this.get('store').find('browser_id', 'current');
  })
});
