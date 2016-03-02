import ENV from '../config/environment';
import Ember from 'ember';
import DS from 'ember-data';
import fetch from 'fetch';

export default DS.JSONAPIAdapter.extend({
  host: ENV.wnycAPI,
  namespace: `api/v1/list/comments`,
  query(store, type, query) {
    let url = [this.host, this.namespace, query.itemTypeId, query.itemId, ''].join('/');
    if (ENV.environment === 'test') {
      // Pretender.js only intercepts XML requests, not JSONP or native Fetch
      return Ember.$.ajax(url).then(d => d);
    } else {
      return fetch(url).then(response => response.json());
    }
  }
});
