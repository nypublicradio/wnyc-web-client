/*global wnyc*/
import BaseAdapter from 'overhaul-listings/metrics-adapters/base';
import Ember from 'ember';
//import service from 'ember-service/inject';

const {
  get,
  set,
  //setProperties,
  $,
  K,
  copy
} = Ember;

const {
  listen
} = wnyc.listening;

const { ajax } = $;

export default BaseAdapter.extend({
  // TODO: still using wnyc listen module for legacy compat. upgrade to session manager eventually
  //sessionManager: service(),

  toStringExtension() {
    return 'data-warehouse';
  },

  init() {
    const config = get(this, 'config');
    const {
      debug:isDebug
    } = config;

    set(this, 'isDebug', isDebug);

    if (isDebug) {
      console.log(`init ${this.toString()}`, config);
    }
  },

  trackEvent(o) {
    const isDebug = get(this, 'isDebug');
    const options = copy(o);
    const { eventName } = options;
    const eventMethod = `_${eventName}`;

    delete options.eventName;

    if (!eventName) {
      this.send(options);
    } else if (this[eventMethod]) {
      this[eventMethod](options);
    } else if (isDebug) {
      console.warn(`No ${eventMethod} method defined on ${this.toString()}.`);
    }

    if (isDebug) {
      console.log('trackEvent', options);
    }

  },

  trackPage(details) {
    const {
      page,
      title
    } = details;

    const data = {
      category: '_trackPageView',
      action: page, // document.location.href
      label: title, // document.title
      value: 0 // must be an integer, 0 is fine
    }

    this.send(data);

    // TODO: are we calling trackManagedItemView for listing objects?
    // if (pk) {
    //   this.trackEvent({eventName: 'trackManagedItemView', pk });
    // }
  },

  // TODO: refactor to follow $.ajax signature (String url, Object options)
  send(d) {
    const browserId = get(this, 'browserId');
    const user = get(this, 'user');
    const options = {
      type: 'POST', // type for jQuery < 1.9
      data: d.data || d,
      endpoint: d.endpoint
    };

    if (browserId && user) {
      return this._sendNow(options, browserId, user);
    } else {
      // wait until browserId is set
      return this._sendLater(options);
    }
  },

  willDestroy: K,

  _sendNow(options, browserId, user) {
    const isDebug = get(this, 'isDebug');
    const host = options.host || get(this, 'config.host');
    const endpoint = options.endpoint || get(this, 'config.endpoint');

    delete options.endpoint;
    delete options.host;

    options.data.browser_id = browserId;
    options.data.email = user.email;
    options.data.referrer_from_js = document.referrer;

    const url = this._serialize(`${host}/${endpoint}/`, options.data);

    if (isDebug) {
      console.log(`sending to ${host}/${endpoint}`, options.data);
      options.headers = { 'X-Ember': 'TRUE' }
    }
    return ajax(url, options);
  },

  // TODO: still using wnyc listen module. upgrade to session mananger and
  // implement other _sendLater below instead of these 3 methods
  _sendLater(options) {
    listen(['wnyc.user.browserId', 'wnyc.user.success'], function(){
      const browserId = this._getBrowserId();
      const user = this._getUser();
      return this._sendNow(options, browserId, user);
    }.bind(this));
  },

  _getBrowserId() {
    // Return the user's browser_id if available.
    if (wnyc.user && wnyc.user.browserId) {
      return wnyc.user.browserId;
    } else {
      return '';
    }
  },

  _getUser() {
    if (wnyc.user && wnyc.user.data) {
      return wnyc.user.data
    } else {
      return '';
    }
  },

  // _sendLater(options) {
  //   const sessionManager = get(this, 'sessionManager');

  //   return sessionManager.findAll()
  //     .then(session => {
  //       const {
  //         browser,
  //         user
  //       } = session;
  //       const browserId = browser.id;

  //       // save it for future events
  //       setProperties(this, {
  //         browserId: browser.id,
  //         user
  //       });

  //       return this._sendNow(options, browserId, user);
  //     })
  //     .catch(K);
  // },

  _trackTransaction(pledge) {
    const transaction = this._transactionData(pledge);
    const item = this._itemData(pledge);

    this.send(transaction);
    this.send(item);
  },

  _trackMailChimpID(options) {
    this.send({
      endpoint: 'api/v1/user/info',
      data: {
        source: 'mailchimp',
        mailchimp: options.mailchimp
      }
    })
  },

  _serialize(url, data) {
    const keys = Object.keys(data);
    const query = keys.map(key => `${key}=${data[key]}`);

    return `${url}?${query.join('&')}`;
  },

  _trackManagedItemListen(options) {
    const { pk } = options;
    // Given the PK of a Managed Item, track a listen event against it.
    this.send({endpoint: `/api/most/listen/managed_item/${pk}/`});
    this.send({endpoint: `/api/v1/listenaction/create/${pk}/play/`, data: {context: 'NYPR_Web'}});
  },

  _trackManagedItemCompletion(data) {
    const { pk } = data;
    this.send({endpoint: `/api/v1/listenaction/create/${pk}/complete/`, data: {context: 'NYPR_Web'}});
  },

  _trackManagedItemView(data) {
    const { pk } = data;
    // Given the PK of a Managed Item, track a view event against it.
    this.send({endpoint: `/api/most/view/managed_item/${pk}/`, data: {context: 'NYPR_Web'}});
  }

});
