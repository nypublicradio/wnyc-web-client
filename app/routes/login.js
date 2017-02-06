import Ember from 'ember';

export default Ember.Route.extend({
  titleToken: 'Log in',
  actions: {
    didTransition() {
      this.send('disableChrome');
    },
    willTransition() {
      this.send('enableChrome');
    }
  }
});
