import ApiResponseAdapter from 'nypr-publisher-lib/adapters/api-response';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default ApiResponseAdapter.extend(DataAdapterMixin, {
  authorize(xhr) {
    let { access_token } = this.get('session.data.authenticated');
    xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
  }
});
