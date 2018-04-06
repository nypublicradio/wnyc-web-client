import ChunkAdapter from 'nypr-publisher-lib/adapters/chunk';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default ChunkAdapter.extend(DataAdapterMixin, {
  authorize(xhr) {
    let { access_token } = this.get('session.data.authenticated');
    xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
  },
});
