import ENV from '../../config/environment';
import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  host: ENV.wnycAPI,
  namespace: `api/v1/discover/topics/`,
  buildURL() {
    return [this.host, this.namespace].join('/');
  }
});
