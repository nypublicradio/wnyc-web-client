import Ember from 'ember';

const {
  computed,
  get
} = Ember;

export default Ember.Component.extend({
  //make sure error type is one of expected variables
  errorType: computed('error', {
    get() {
      const statusCode = get(this, 'error.response.status');

      if (statusCode === 404) {
        return 404;
      } else {
        return 500;
      }
    }
  }),
  pageNotFound: Ember.computed('errorType', function(){
    console.log(this.get('errorType'));
    return (this.get('errorType') === 404);
  }),
  serverError:  Ember.computed('errorType', function(){
    return (this.get('errorType') === 500);
  }),
});
