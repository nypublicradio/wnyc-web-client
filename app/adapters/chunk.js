import ChunkAdapter from 'nypr-publisher-lib/adapters/chunk';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default ChunkAdapter.extend(DataAdapterMixin, {
  authorize(xhr) {
    let headers = this.get('session').authorize({});
    for (var h in headers) {
      xhr.setRequestHeader(h, headers[h]);
    }
  },
});
