import ShowAdapter from 'nypr-publisher-lib/adapters/show';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default ShowAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:nypr'
});
