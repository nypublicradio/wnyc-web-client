import Controller from '@ember/controller';
import config from 'wnyc-web-client/config/environment';

export default Controller.extend({
  queryParams: ['confirmation', 'username'],
  confirmation: null,
  username: null,
  config,
});
