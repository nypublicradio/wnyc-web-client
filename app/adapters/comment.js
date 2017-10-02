import CommentAdapter from 'nypr-publisher-lib/adapters/comment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default CommentAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:nypr'
});
