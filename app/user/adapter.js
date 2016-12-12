import ENV from '../config/environment';
import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DS.RESTAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:nypr',
  host: ENV.wnycAuthAPI,
  // pathForType: () => 'user',
  buildURL() {
    return `${this.host}/session`;
  }
});
