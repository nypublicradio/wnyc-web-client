import DS from 'ember-data';
import ENV from '../config/environment';

export default DS.JSONAPIAdapter.extend({
  host: ENV.wnycAPI,
  namespace: 'membership/v1',
  authorizer: 'authorizer:nypr',
  buildURL(...args) {
    let url = this._super(...args);
    return `${url}/`;
  },
});
