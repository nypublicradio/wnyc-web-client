import Ember from 'ember';

export default Ember.Component.extend({
  errorType: Ember.computed.readOnly('error.response.status'),
  pageNotFound: Ember.computed.equals('errorType', 404),
  serverError: Ember.computed.equals('errorType', 500)
});
