import ENV from '../../config/environment';
import DS from 'ember-data';
import service from 'ember-service/inject';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

const { featureFlags } = ENV;
const host = featureFlags['other-discover'] ? ENV.wnycAPI : ENV.wnycURL;
const path = featureFlags['other-discover'] ? 'reco_proxy' : 'make_playlist';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:nypr',
  host,
  namespace: `api/v3/${path}/`,
  session: service(),

  buildURL() {
    return [this.host, this.namespace].join('/');
  },

  ajaxOptions(url, type, options) {
    options.data.discover_station = ENV.discoverStation;
    options.data.api_key = ENV.discoverAPIKey;
    options.data.browser_id = this.get('session.data.browserId');
    options.xhrFields = {
      withCredentials: true
    };
    return this._super(url, type, options);
  }
});
