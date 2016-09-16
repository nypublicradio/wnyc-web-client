import ENV from '../config/environment';
import DS from 'ember-data';
import Ember from 'ember';
import fetch from 'fetch';

export default DS.JSONAPIAdapter.extend({
  host: ENV.wnycAPI,
  namespace: 'api/v2',
  query(store, type, query) {
    let url = [this.host, this.namespace, 'related', query.itemId, `?limit=${query.limit}`].join('/');
    // Django isn't setup to honor XHR requests at the related stories endpoint,
    // so just use the jQuery JSONp for now
    // return fetch(url).then(response => response.json());
    if (ENV.environment === 'test' || ENV.environment === 'development') {
      // Pretender.js only intercepts XML requests, not JSONP or native Fetch
      return Ember.$.ajax(url);
    } else {
      return Ember.$.ajax(url, {dataType: 'jsonp', jsonpCallback: 'RELATED', cache: true});
    }
  },
  findRecord(store, type, id/*, snapshot*/) {
    var url = [this.host, 'api/v3', 'story', 'detail', id].join('/') + '/';
    return fetch(url).then(checkStatus).then(r => r.json());
  }
});

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}
