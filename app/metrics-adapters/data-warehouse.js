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

export default BaseAdapter.extend({
  session: service(),

  toStringExtension() {
    return 'data-warehouse';
  },

  init() {
    const config = get(this, 'config') || {};
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
      category,
      action,
      label,
      id:cms_id,
      type:cms_type
    } = options;

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
      method: 'POST',
      data: d.data || d,
      endpoint: d.endpoint
    };

    this._sendNow(options, get(this, 'session.data.browserId'));
  },

  willDestroy: K,

  _sendNow(options, browserId) {
    const isDebug = get(this, 'isDebug');
    const host = options.host || get(this, 'config.host');
    const endpoint = options.endpoint || get(this, 'config.endpoint');

    delete options.endpoint;
    delete options.host;

    options.xhrFields = { withCredentials: true };
    options.data.browser_id = browserId;
    options.data.referrer_from_js = document.referrer;

    const url = this._serialize(`${host}/${endpoint}/`, options.data);

    if (isDebug) {
      console.log(`sending to ${host}/${endpoint}`, options.data);
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
    this.defaultSend(options);
    //TODO: are we calling trackManagedItemView for listing objects?
    if (options.id) {
      this._trackManagedItemView(options.id);
    }
  },

  _trackManagedItemView(pk) {
    // Given the PK of a Managed Item, track a view event against it.
    this.send({endpoint: `api/most/view/managed_item/${pk}`, data: {context: 'NYPR_Web'}});
  }
});
