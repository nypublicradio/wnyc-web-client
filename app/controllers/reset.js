import Controller from 'ember-controller';
import config from 'wnyc-web-client/config/environment';

export default Controller.extend({
  queryParams: ['confirmation', 'email'],
  confirmation: null,
  email: null,
  config,
});
