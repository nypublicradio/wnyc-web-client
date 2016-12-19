import Controller from 'ember-controller';

export default Controller.extend({
  queryParams: ['code', 'email'],
  code: null,
  email: null
});
