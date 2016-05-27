import BaseAdapter from 'ember-metrics/metrics-adapters/base';
import Ember from 'ember';
import service from 'ember-service/inject';

const {
  get,
  set,
  $,
  K
} = Ember;

const { ajax } = $;
const { hash: waitFor } = Ember.RSVP;

export default BaseAdapter.extend({
  sessionManager: service(),

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

  trackEvent(options) {
    const isDebug = get(this, 'isDebug');
    const { eventName } = options;
    const eventMethod = `_${eventName}`;

    if (!eventName) {
      this.defaultSend(options);
    } else if (this[eventMethod]) {
      this[eventMethod](options);
    } else if (isDebug) {
      console.warn(`No ${eventMethod} method defined on ${this.toString()}.`);
    }

  },

  defaultSend(options) {
    const {
      model,
      category,
      action,
      label,
    } = options;

    const cms_id = model ? get(model, 'cmsPK') || '' : '';
    const cms_type = model ? get(model, 'itemType') || '' : '';
    this.send({ category, action, label, cms_id, cms_type });
  },

  trackPage(details) {
    const {
      page,
      title,
    } = details;

    const data = {
      category: '_trackPageView',
      action: page, // document.location.href
      label: title, // document.title
      value: 0 // must be an integer, 0 is fine
    };

    this.send(data);
  },

  // TODO: refactor to follow $.ajax signature (String url, Object options)
  send(d) {
    const options = {
      type: 'POST', // type for jQuery < 1.9
      data: d.data || d,
      endpoint: d.endpoint
    };

    waitFor({
      browserId: get(this, 'sessionManager.browserId')
    }).then(({ user, browserId }) => this._sendNow(options, browserId));
  },

  willDestroy: K,

  _sendNow(options, browserId) {
    const isDebug = get(this, 'isDebug');
    const host = options.host || get(this, 'config.host');
    const endpoint = options.endpoint || get(this, 'config.endpoint');

    delete options.endpoint;
    delete options.host;

    options.xhrFields = { withCredentials: true };
    options.data.browser_id = get(browserId, 'identity');
    options.data.referrer_from_js = document.referrer;

    const url = this._serialize(`${host}/${endpoint}/`, options.data);

    if (isDebug) {
      console.log(`sending to ${host}/${endpoint}`, options.data);
      options.headers = { 'X-Ember': 'TRUE' };
    }
    return ajax(url, options);
  },

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
    });
  },

  _serialize(url, data) {
    const keys = Object.keys(data);
    const query = keys.map(key => `${key}=${data[key]}`);

    return `${url}?${query.join('&')}`;
  },

  _viewedStory(options) {
    let { model } = options;
    let pk = get(model, 'cmsPK');

    this.defaultSend(options);
    //TODO: are we calling trackManagedItemView for listing objects?
    if (pk) {
      this._trackManagedItemView(pk);
    }
  },

  _trackManagedItemView(pk) {
    // Given the PK of a Managed Item, track a view event against it.
    this.send({endpoint: `api/most/view/managed_item/${pk}`, data: {context: 'NYPR_Web'}});
  }
});
