import CommentAdapter from 'nypr-publisher-lib/adapters/comment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default CommentAdapter.extend(DataAdapterMixin, {
  authorize(xhr) {
    let { access_token } = this.get('session.data.authenticated');
    xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
  },
});
