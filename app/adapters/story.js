import StoryAdapter from 'nypr-publisher-lib/adapters/story';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default StoryAdapter.extend(DataAdapterMixin, {
  authorize(xhr) {
    let { access_token } = this.get('session.data.authenticated');
    xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
  },
});
