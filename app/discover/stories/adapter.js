import ENV from '../../config/environment';
import Ember from 'ember';
import DS from 'ember-data';
// https://wnyc.demo2.wnyc.net/api/v1/make_radio/?browser_id=5cabe81784235eb8;api_key=trident;discover_station=wnyc_v2;duration=10800;tags=a-mm,a-nn,a-oo;

export default DS.JSONAPIAdapter.extend({
  host: ENV.wnycAPI,
  namespace: `api/v1/make_radio/`,
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
