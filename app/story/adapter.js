import ENV from '../config/environment';
import DS from 'ember-data';
import Ember from 'ember';
//import fetch from 'fetch';

export default DS.JSONAPIAdapter.extend({
  host: ENV.wnycAPI,
  namespace: 'api/v2/related',
  query(store, type, query) {
    let url = [this.host, this.namespace, query.itemId, `?limit=${query.limit}`].join('/');
    // Django isn't setup to honor XHR requests at the related stories endpoint,
    // so just use the jQuery JSONp for now
    // return fetch(url).then(response => response.json());
    if (ENV.environment === 'test') {
      // Pretender.js only intercepts XML requests, not JSONP or native Fetch
      return Ember.$.ajax(url).then(d => d);
    } else {
      return Ember.$.ajax(url, {dataType: 'jsonp', jsonpCallback: 'RELATED', cache: true})
        .then(d => d);
    }
  }
});
