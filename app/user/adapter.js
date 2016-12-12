import ENV from '../config/environment';
import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  host: ENV.wnycAuthAPI,
  // pathForType: () => 'user',
  buildURL() {
    return `${this.host}/session`;
  }
});
