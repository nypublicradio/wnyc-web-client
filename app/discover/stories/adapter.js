import ENV from '../../config/environment';
import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  host: ENV.wnycURL,
  namespace: `api/v3/make_playlist/`,

  buildURL() {
    return [this.host, this.namespace].join('/');
  },

  ajaxOptions(url, type, options) {
    options.data.discover_station = ENV.discoverStation;
    options.data.api_key = ENV.discoverAPIKey;
    options.xhrFields = {
      withCredentials: true
    };
    return this._super(url, type, options);
  }
});
