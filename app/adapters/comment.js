import ENV from '../config/environment';
import Ember from 'ember';
import DS from 'ember-data';
import fetch from 'fetch';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:nypr',
  host: ENV.wnycAPI,
  namespace: `api/v1/list/comments`,
  
  query(store, type, query) {
    let url = [this.host, this.namespace, query.itemTypeId, query.itemId, ''].join('/');
    let options = this.ajaxOptions(url, 'GET', {});
    if (!Ember.testing) {
      return fetch(options).then(response => response.json());
    } else {
      // Pretender.js only intercepts XML requests, not JSONP or native Fetch
      return Ember.$.ajax(options).then(d => d);
    }
  }
});
