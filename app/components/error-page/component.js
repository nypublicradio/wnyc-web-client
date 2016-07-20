import Ember from 'ember';

export default Ember.Component.extend({
  errorType: Ember.computed.readOnly('error.response.status'),
  pageNotFound: Ember.computed.equal('errorType', 404),
  serverError: Ember.computed.equal('errorType', 500)
});
