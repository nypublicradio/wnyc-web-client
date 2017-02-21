import Component from 'ember-component';
import service from 'ember-service/inject';
import config from 'wqxr-web-client/config/environment';

export default Component.extend({
  session: service(),
  tagName: 'section',
  adminURL: `${config.wnycAdminRoot}/admin`
});
