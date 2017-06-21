import Controller from 'ember-controller';

export default Controller.extend({
  queryParams: ['username', 'code', 'email'],
  username: null,
  code: null,
  email: null
});
