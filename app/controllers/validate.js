import Controller from 'ember-controller';
import config from 'wnyc-web-client/config/environment';
import service from 'ember-service/inject';

export default Controller.extend({
  session: service(),
  queryParams: ['confirmation', 'username'],
  confirmation: null,
  username: null,
  config,
});
