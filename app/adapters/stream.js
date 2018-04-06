import StreamAdapter from 'nypr-publisher-lib/adapters/stream';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default StreamAdapter.extend(DataAdapterMixin, {
  authorize(xhr) {
    let { access_token } = this.get('session.data.authenticated');
    xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
  },
});
