import Ember from 'ember';

const {
  computed,
  get
} = Ember;

export default Ember.Component.extend({
  //make sure error type is one of expected variables
  errorType: computed('error', {
    get() {
      if (this.get('error.response.status') === 404) {
        return 404;
      } else if (this.get('error.response.status') === 500) {
        return 500;
      } 
    }
  }),
  pageNotFound: Ember.computed('errorType', function(){
    return (this.get('errorType') === 404);
  }),
  serverError:  Ember.computed('errorType', function(){
    return (this.get('errorType') === 500);
  })
});
