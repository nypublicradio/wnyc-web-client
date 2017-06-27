import Controller from 'ember-controller';

export default Controller.extend({
  queryParams: ['username', 'code', 'email', 'verification_token', 'email_id'],
  username: null,
  code: null,
  email: null,
  verification_token: null,
  email_id: null
});
