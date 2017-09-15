import ApiResponseAdapter from 'nypr-publisher-lib/adapters/api-response';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default ApiResponseAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:nypr',
});
