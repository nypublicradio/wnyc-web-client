import ENV from 'overhaul/config/environment';
import ApplicationAdapter from 'overhaul/adapters/application';

export default ApplicationAdapter.extend({
  buildURL() {
    let url = this._super(...arguments);
    return url.replace(/([^\/])$/, '$1/');
  },
  ajaxOptions(url, type, options) {
    options.data = { discover_station: ENV.showsDiscoverStation, api_key: ENV.showsAPIKey };
    return this._super(url, type, options);
  }
});
