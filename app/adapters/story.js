import ENV from '../config/environment';
import DS from 'ember-data';
import fetch from 'fetch';

export default DS.JSONAPIAdapter.extend({
  host: ENV.wnycAPI,
  namespace: 'api/v2/related',
  query(store, type, query) {
    let url= [this.host, this.namespace, query.itemId, `?limit=${query.limit}`].join('/');
    return fetch(url).then(response => response.json());
  }
});
