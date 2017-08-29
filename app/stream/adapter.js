import StreamAdapter from 'nypr-publisher-lib/adapters/stream';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default StreamAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:nypr'
});
