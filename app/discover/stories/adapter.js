import ENV from '../../config/environment';
import Ember from 'ember';
import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  host: ENV.wnycURL,
  namespace: `api/v3/refresh_playlist/`,
  query: function(store, type, query /*, recordArray */ ) {
    let url = [this.host, this.namespace].join('/');

    // We have to format these query params to support the APIs non-standard
    // comma delimited, semicolon separated params.
    ///api/v3/refresh_playlist/?duration=10800&api_key=trident;discover_station=wnyc-v2;shows=;tags=a-l,a-mm,a-nn,a-oo;browser_id=5f8cd39b9632ee4f

    let showSlugs = (query.shows || []).join(",");
    let tagIds = (query.tags || []).join(",");

    delete query.shows;
    delete query.tags;

    // Put it in the URL so the ajax internals don't go escaping it
    url = url + `?shows=${showSlugs};tags=${tagIds}`;

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
