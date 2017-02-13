import Ember from 'ember';
import fetch from 'fetch';
import service from 'ember-service/inject';
import config from 'wnyc-web-client/config/environment';

const LISTEN_ACTIONS = {
  START: 'start',
  PAUSE: 'pause',
  RESUME: 'resume',
  FORWARD_15: 'skip_15_forward',
  BACK_15: 'skip_15_back',
  CLOSE: 'window_close',
  FINISH: 'finish',
  POSITION: 'set_position'
};

export default Ember.Service.extend({
  host:             config.wnycAPI,
  itemViewPath:     'analytics/v1/events/viewed',
  listenActionPath: 'analytics/v1/events/listened',
  currentReferrer:  null,
  
  session:      service(),
  poll:         service(),

  init() {
    this.set('_delta', 0);
  },
  
  reportItemView(incoming = {}) {
    let data = Object.assign({
      browser_id: this.get('session.data.browserId'),
      client: config.clientSlug,
      referrer: this.get('currentReferrer'),
      url: location.toString()
    }, incoming);
    
    this._send(data, this.itemViewPath);
  },
  
  reportListenAction(type, incoming = {}) {
    incoming.delta = this.updateDelta(type);
    let data = this._generateData(incoming, LISTEN_ACTIONS[type.toUpperCase()]);
    this._send(data, this.listenActionPath);
  },
  
  updateDelta(type) {
    if (/start|resume/.test(type)) {
      return this.set('_delta', 0);
    } else {
      let oldDelta = this.get('_delta');
      let newDelta = Date.now();
      return this.set('_delta', newDelta - oldDelta);
    }
  },
  
  _send(data, path) {
    fetch(`${config.wnycAPI}/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  },
  
  _generateData(incoming, action) {
    return Object.assign({
      action,
      browser_id: this.get('session.data.browserId'),
      client: config.clientSlug,
      referrer: this.get('currentReferrer'),
      url: location.toString(),
    }, incoming);
  },
});
