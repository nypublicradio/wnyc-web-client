import DS from 'ember-data';
import ENV from '../config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  host: ENV.membershipAPI,
  namespace: 'v1',
  authorize(xhr) {
    let headers = this.get('session').authorize({});
    for (var h in headers) {
      xhr.setRequestHeader(h, headers[h]);
    }
  },
  buildURL(...args) {
    let url = this._super(...args);
    return `${url}/`;
  },
});
