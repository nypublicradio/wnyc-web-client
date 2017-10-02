import ChunkAdapter from 'nypr-publisher-lib/adapters/chunk';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default ChunkAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:nypr'
});
