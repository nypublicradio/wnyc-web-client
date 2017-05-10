import DS from 'ember-data';
import ENV from '../config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  host: ENV.wnycMembershipAPI,
  namespace: 'v1',
  authorizer: 'authorizer:nypr',
  buildURL(...args) {
    let url = this._super(...args);
    return `${url}/`;
  },
});
