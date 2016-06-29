import Ember from 'ember';
import service from 'ember-service/inject';

export default Ember.Component.extend({
  session: service(),
  actions: {
    login() {
      let { username, password } = this.getProperties('username', 'password');
      this.get('session').authenticate('authenticator:nypr', username, password)
        .catch((errors) => this.set('errors', errors));
    }
  }
});
