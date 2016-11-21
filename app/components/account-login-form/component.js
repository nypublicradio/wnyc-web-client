import Ember from 'ember';

export default Ember.Component.extend({
  isProcessing: false,
  errors: {},

  validate() {

  },
  loginSuccess(/* data */) {
    //do session stuff
    transitionTo('/');
  },
  loginFailure(/* errors */) {
    //handle server errors
  },
  actions: {
    login() {
    }
  }
});
