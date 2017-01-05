import Controller from 'ember-controller';

export default Controller.extend({
  queryParams: ['confirmation', 'email'],
  code: null,
  email: null
});
