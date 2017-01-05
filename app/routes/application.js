import Route from 'ember-route';
import get from 'ember-metal/get';
import config from 'overhaul/config/environment';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import service from 'ember-service/inject';

export default Route.extend(ApplicationRouteMixin, {
  metrics: service(),
  asyncWriter: service(),
  legacyLoader: service(),
  leaderboard: service(),
  session: service(),
  poll: service(),
  store: service(),
  audio: service(),
  title(tokens) {
    if (tokens && tokens.length > 0) {
      let lastToken = tokens.slice(-1);
      return `${lastToken} | WNYC`;
    } else {
      return 'WNYC | New York Public Radio, Podcasts, Live Streaming Radio, News';
    }
  },

  beforeModel() {

    let metrics = get(this, 'metrics');

    this._syncBrowserId();

    metrics.identify('GoogleAnalytics', {isAuthenticated: false});

    get(this, 'asyncWriter').install();
    if (config.renderGoogleAds && window.googletag) {
      get(this, 'leaderboard').install();
    }

    window.WNYC_LEGACY_LOADER = get(this, 'legacyLoader');

    let store = get(this, 'store');
    let pollFunction = () => store.findAll('stream');
    get(this, 'poll').addPoll({interval: 60 * 1000, callback: pollFunction});
  },

  actions: {
    error(error/*, transition*/) {
      if (error) {
        this.controller.set('error', error);
      }
    },
    didTransition() {
      this.controller.set('error', null);
    },
    willTransition() {
      //close queue/history modal when we open a new page
      this.controller.send('closeModal');
      this.send('updateDonateChunk', null);
    },
    updateDonateChunk(donateChunk) {
      this.controller.set('headerDonateChunk', donateChunk);
    },
    disableChrome() {
      this.controller.set('chromeDisabled', true);
    },
    enableChrome() {
      this.controller.set('chromeDisabled', false);
    }
  },

  sessionAuthenticated() {
    this._super(...arguments);
    get(this, 'metrics').identify('GoogleAnalytics', {isAuthenticated: true});
  },

  _syncBrowserId() {
    return get(this, 'session').syncBrowserId();
  },
});
