import ApiResponseAdapter from 'nypr-publisher-lib/adapters/api-response';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default ApiResponseAdapter.extend(DataAdapterMixin, {
  authorize(xhr) {
    let headers = this.get('session').authorize({});
    for (var h in headers) {
      xhr.setRequestHeader(h, headers[h]);
    }
  }
});
