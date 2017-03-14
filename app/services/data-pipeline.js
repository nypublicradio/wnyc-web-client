import Service from 'ember-service';
import fetch from 'fetch';
import service from 'ember-service/inject';
import config from 'wnyc-web-client/config/environment';
import { next } from 'ember-runloop';

const LISTEN_ACTIONS = {
  START: 'start',
  PAUSE: 'pause',
  RESUME: 'resume',
  FORWARD_15: 'skip_15_forward',
  BACK_15: 'skip_15_back',
  CLOSE: 'window_close',
  FINISH: 'finish',
  POSITION: 'set_position',
  INTERRUPT: 'interrupt'
};

export default Service.extend({
  itemViewPath:     'v1/events/viewed',
  listenActionPath: 'v1/events/listened',
  currentReferrer:  null,

  session:      service(),
  poll:         service(),

  init() {
    this.set('_delta', 0);
  },

  reportItemView(incoming = {}) {
    next(() => {
      let data = this._generateData(incoming);
      this._send(data, this.itemViewPath);

      if (data.cms_id) {
        this._legacySend(`api/most/view/managed_item/${data.cms_id}/`);
      }
    });
  },

  reportListenAction(type, incoming = {}) {
    incoming.delta = this.updateDelta(type);
    let data = this._generateData(incoming, LISTEN_ACTIONS[type.toUpperCase()]);
    this._send(data, this.listenActionPath);

    if (/start|resume/.test(data.action) && data.cms_id) {
      this._legacySend(`api/most/listen/managed_item/${data.cms_id}/`);
      this._legacySend(`api/v1/listenaction/create/${data.cms_id}/play/`);
    } else if (data.action === 'finish' && data.cms_id) {
      this._legacySend(`api/v1/listenaction/create/${data.cms_id}/complete/`);
    }
  },

  updateDelta(type) {
    let delta;
    if (/start|resume/.test(type)) {
      this._lastMarker = Date.now();
      this._didPause = false;
      delta = 0;
    } else if (this._didPause) {
      delta = 0;
    } else {
      let oldMarker = this._lastMarker;
      this._lastMarker = Date.now();
      delta = Date.now() - oldMarker;
    }
    
    if (type === 'pause') {
      this._didPause = true;
    }
    return delta;
  },

  _send(data, path) {
    let fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    this.get('session').authorize('authorizer:nypr', (header, value) => {
      fetchOptions.headers[header] = value;
    });
    fetch(`${config.platformEventsAPI}/${path}`, fetchOptions);
  },

  _legacySend(path) {
    let browser_id = this.get('session.data.browserId');
    let fetchOptions = {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({browser_id})
    };
    this.get('session').authorize('authorizer:nypr', (header, value) => {
      fetchOptions.headers[header] = value;
    });
    fetch(`${config.wnycAPI}/${path}`, fetchOptions);
  },

  _generateData(incoming, action) {
    let data = Object.assign({
      action,
      browser_id: this.get('session.data.browserId'),
      client: config.clientSlug,
      referrer: this.get('currentReferrer'),
      external_referrer: document.referrer,
      url: location.toString(),
      site_id: config.siteId
    }, incoming);
    if (!action) {
      delete data.action;
    }
    return data;
  },
});
