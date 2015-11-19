import DS from 'ember-data';
import fetch from 'fetch';

export default DS.Adapter.extend({
  findRecord(store, type, id /*, snapshot */) {
    return fetch('/wnyc/' + id.replace(/^\//, ''), { headers: {'X-WNYC-EMBER':1}})
      .then(response => response.text());
  }
});
