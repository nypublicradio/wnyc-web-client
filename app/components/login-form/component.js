import Ember from 'ember';
import service from 'ember-service/inject';
import ENV from 'overhaul/config/environment';

export default Ember.Component.extend({
  session: service(),
  ENV: ENV,
  actions: {
    login() {
      let { username, password } = this.getProperties('username', 'password');
      this.get('session').authenticate('authenticator:nypr', username, password)
        .catch((errors) => this.set('errors', errors));
    }
  }
});
