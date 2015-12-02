import DS from 'ember-data';
import fetch from 'fetch';
import ENV from '../config/environment';

export default DS.Adapter.extend({
  findRecord(store, type, id /*, snapshot */) {
    return fetch(ENV.wnycURL + '/' + id.replace(/^\//, ''), { headers: {'X-WNYC-EMBER':1}})
      .then(response => response.text());
  }
});
