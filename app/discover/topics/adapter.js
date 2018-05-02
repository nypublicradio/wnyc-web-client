import config from '../../config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  host: config.publisherAPI,
  namespace: `v1/discover/topics/`,
  buildURL() {
    return [this.host, this.namespace].join('/');
  },
  authorize(xhr) {
    let headers = this.get('session').authorize({});
    for (var h in headers) {
      xhr.setRequestHeader(h, headers[h]);
    }
  }
});
