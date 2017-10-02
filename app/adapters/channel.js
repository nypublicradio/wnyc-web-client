import ChannelAdapter from 'nypr-publisher-lib/adapters/channel';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default ChannelAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:nypr',
});
