import Controller from 'ember-controller';

export default Controller.extend({
  queryParams: ['confirmation', 'username'],
  confirmation: null,
  username: null
});
