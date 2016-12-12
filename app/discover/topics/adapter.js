import ENV from '../../config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:nypr',
  host: ENV.wnycAPI,
  namespace: `api/v1/discover/topics/`,
  buildURL() {
    return [this.host, this.namespace].join('/');
  }
});
