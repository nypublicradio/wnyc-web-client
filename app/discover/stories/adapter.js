import ENV from '../../config/environment';
import Ember from 'ember';
import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  host: ENV.wnycAPI,
  namespace: `api/v3/make_playlist/`,
  query: function(store, type, query /*, recordArray */ ) {
    let url = [this.host, this.namespace].join('/');

    // We have to format these query params to support the APIs non-standard
    // comma delimited, semicolon separated params.
    //http://wnyc.demo2.wnyc.net/api/v3/make_playlist/?show_stories=588656,587978,588011,587995;tag_stories=587885,588697,587966,588007,582980


    let storyIds = (query.show_stories || []).join(",");
    let tagIds = (query.tag_stories || []).join(",");

    delete query.show_stories;
    delete query.tag_stories;
    // query = {};
    // Put it in the URL so the ajax internals don't go escaping it
    url = url + `?show_stories=${storyIds};tag_stories=${tagIds}`;

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
