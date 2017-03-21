import DS from 'ember-data';
import ENV from '../config/environment';

export default DS.JSONAPIAdapter.extend({
  host: ENV.wnycMembershipAPI,
  namespace: 'v1',
  buildURL(...args) {
    let url = this._super(...args);
    return `${url}/`;
  },
});
