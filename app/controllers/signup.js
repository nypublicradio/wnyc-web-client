import Controller from 'ember-controller';

export default Controller.extend({
  queryParams: ['email', 'first', 'last'],
  email: null,
  first: null,
  last: null
});
