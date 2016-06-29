import Route from 'ember-route';
import get from 'ember-metal/get';
import config from 'overhaul/config/environment';
import {installBridge} from '../lib/okra-bridge';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import service from 'ember-service/inject';
import { getUserData } from 'overhaul/authenticators/nypr';

export default Route.extend(ApplicationRouteMixin, {
  metrics: service(),
  asyncWriter: service(),
  legacyLoader: service(),
  leaderboard: service(),
  session: service(),
  poll: service(),
  store: service(),

  beforeModel() {
    let metrics = get(this, 'metrics');
    let mailchimp = String(window.location).match(/utm_term=(\d+_\w+-\w+-\w+)/);

    this._syncBrowserId();

    // TODO: once login is handled via ESA, this won't be necessary
    this._checkLoggedIn();

    if (config.environment !== 'test') {
      metrics.identify('GoogleAnalytics', {isAuthenticated: false});
    }

    if (mailchimp) {
      metrics.trackEvent('DataWarehouse', {
        eventName: 'trackMailChimpID',
        mailchimp: encodeURIComponent(mailchimp[1])
      });
    }

    get(this, 'asyncWriter').install();
    if (config.renderGoogleAds && window.googletag) {
      get(this, 'leaderboard').install();
    }

    window.WNYC_LEGACY_LOADER = get(this, 'legacyLoader');

    if (config.environment !== 'test') {
      installBridge();
    }

    let poll = get(this, 'poll');
    let interval = 60 * 1000;
    let store = get(this, 'store');
    let pollFunction = () => {store.findAll('stream');};
    poll.setup(pollFunction, interval);
    // Don't run poll service in test environment
    // because tests will wait forever for polling to finish.
    if (config.environment !== 'test') {
      poll.start();
    }
  },
  actions: {
    willTransition() {
      //close queue/history modal when we open a new page
      this.controller.send('closeModal');
    }
  },
  sessionAuthenticated() {
    this._super(...arguments);
    get(this, 'metrics').identify('GoogleAnalytics', {isAuthenticated: true});
  },

  _syncBrowserId() {
    return get(this, 'session').syncBrowserId();
  },
  _checkLoggedIn() {
    return getUserData().then(json => {
      if (json.isAuthenticated) {
        this.get('session').set('data.user', json);
      } else {
        this.get('session').set('data.user', null);
      }
    });
  }
});
