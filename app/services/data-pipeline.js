import Ember from 'ember';
import fetch from 'fetch';
import service from 'ember-service/inject';
import config from 'overhaul/config/environment';

export default Ember.Service.extend({
  host: config.wnycAPI,
  itemViewPath: 'api/v1/itemview/',
  session: service(),
  
  currentReferrer: null,
  
  reportItemView(incoming) {
    let data = Object.assign({
      browser_id: this.get('session.data.browserId'),
      client: 'wnyc_web',
      referrer: this.get('currentReferrer'),
      url: location.toString()
    }, incoming);
    
    this.send(data, this.itemViewPath);
  },
  
  send(data, path) {
    fetch(`${config.wnycAPI}/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  }
});
