import Controller from 'ember-controller';
import service from 'ember-service/inject';
import config from 'wnyc-web-client/config/environment';

export default Controller.extend({
  session: service(),
  queryParams: ['confirmation', 'email'],
  confirmation: null,
  email: null,
  config,
});
