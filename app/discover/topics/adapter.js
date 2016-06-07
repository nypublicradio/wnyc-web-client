import ENV from '../../config/environment';
import Ember from 'ember';
import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  host: ENV.wnycAPI,
  namespace: `api/v1/discover/topics/`,
  query: function(store, type, query /*, recordArray */ ) {
    let url = [this.host, this.namespace].join('/');
    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.getJSON(url, query).then(function(data) {
        Ember.run(null, resolve, data);
      }, function(jqXHR) {
        jqXHR.then = null;
        Ember.run(null, reject, jqXHR);
      });
    });
  }
});
