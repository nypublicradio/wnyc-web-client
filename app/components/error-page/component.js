import Ember from 'ember';

export default Ember.Component.extend({
  errorType: Ember.computed('error', function(){ 
    return this.get('error.response.status');
  }),
  pageNotFound: Ember.computed('errorType', function(){
    return (this.get('errorType') === 404);
  }),
  serverError:  Ember.computed('errorType', function(){
    return (this.get('errorType') === 500);
  })
});
