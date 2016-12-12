import ENV from '../config/environment';
import DS from 'ember-data';
import Ember from 'ember';
import fetch from 'fetch';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:nypr',
  host: ENV.wnycAPI,
  namespace: 'api/v2',
  query(store, type, query) {
    let url = [this.host, this.namespace, 'related', query.itemId, `?limit=${query.limit}`].join('/');
    let options = this.ajaxOptions(url, 'GET', {});
    // Django isn't setup to honor XHR requests at the related stories endpoint,
    // so just use the jQuery JSONp for now
    // return fetch(url).then(response => response.json());
    if (ENV.environment === 'test' || ENV.environment === 'development') {
      // Pretender.js only intercepts XML requests, not JSONP or native Fetch
      return Ember.$.ajax(options);
    } else {
      options.dataType = 'jsonp';
      options.jsonpCallback = 'RELATED';
      options.cache = true;
      return Ember.$.ajax(options);
    }
  },
  findRecord(store, type, id/*, snapshot*/) {
    var url = [this.host, 'api/v3', 'story', 'detail', id].join('/') + '/';
    let options = this.ajaxOptions(url, 'GET', {});
    return fetch(options).then(checkStatus).then(r => r.json());
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
