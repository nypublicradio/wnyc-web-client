import ShowAdapter from 'nypr-publisher-lib/adapters/show';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default ShowAdapter.extend(DataAdapterMixin, {
  authorize(xhr) {
    let { access_token } = this.get('session.data.authenticated');
    xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
  },
});
