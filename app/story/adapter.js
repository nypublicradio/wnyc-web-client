import StoryAdapter from 'nypr-publisher-lib/adapters/story';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default StoryAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:nypr'
});
