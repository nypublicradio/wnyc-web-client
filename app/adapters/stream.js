import StreamAdapter from 'nypr-publisher-lib/adapters/stream';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default StreamAdapter.extend(DataAdapterMixin, {
  authorize(xhr) {
    let headers = this.get('session').authorize({});
    for (var h in headers) {
      xhr.setRequestHeader(h, headers[h]);
    }
  }
});
