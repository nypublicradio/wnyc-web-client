import Ember from 'ember';

export default Ember.Route.extend({
  titleToken: 'Sign In',
  actions: {
    didTransition() {
      this.send('disableChrome');
    },
    willTransition() {
      this.send('enableChrome');
    }
  }
});
