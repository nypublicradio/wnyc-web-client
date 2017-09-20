import config from '../../config/environment';
import DS from 'ember-data';
import service from 'ember-service/inject';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

const { featureFlags } = config;
const path = featureFlags['other-discover'] ? 'reco_proxy' : 'make_playlist';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:nypr',
  host: config.publisherAPI,
  namespace: `v3/${path}/`,
  pathForType: () => '',
  session: service(),

  ajaxOptions(url, type, options) {
    options.data.discover_station = config.discoverStation;
    options.data.api_key = config.discoverAPIKey;
    options.data.browser_id = this.get('session.data.browserId');
    options.xhrFields = {
      withCredentials: true
    };
    return this._super(url, type, options);
  }
});
