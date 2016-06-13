import Ember from 'ember';

const {
  computed,
  get
} = Ember;

export default Ember.Component.extend({
  //make sure error type is one of expected variables
  errorType: computed('error', {
    get() {
      const errorType = get(this, 'error.response.status');

      if (errorType === 404) {
        console.log("404");
        return 'not-found';
      } else if (errorType === 500) {
        return 'server-error';
      } else {
        return 'other';
      }
    }
  })
});
