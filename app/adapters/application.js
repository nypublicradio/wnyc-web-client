import DS from 'ember-data';
import config from '../config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:nypr',
  host: config.publisherAPI,
  namespace: 'v3',
  // ember 2.0 deprecation
  shouldBackgroundReloadRecord() {
    return false;
  }
});
