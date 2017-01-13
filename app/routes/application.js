import Route from 'ember-route';
import get from 'ember-metal/get';
import config from 'wnyc-web-client/config/environment';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import service from 'ember-service/inject';

export default Route.extend(ApplicationRouteMixin, {
  metrics: service(),
  asyncWriter: service(),
  legacyLoader: service(),
  leaderboard: service(),
  currentUser: service(),
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

    get(this, 'session').syncBrowserId();
    get(this, 'currentUser').load();

    metrics.identify('GoogleAnalytics', {isAuthenticated: false});

    get(this, 'asyncWriter').install();
    if (config.renderGoogleAds && window.googletag) {
      get(this, 'leaderboard').install();
    }

    window.WNYC_LEGACY_LOADER = get(this, 'legacyLoader');

    let pollFunction = () => get(this, 'store').findAll('stream');
    get(this, 'poll').addPoll({interval: 60 * 1000, callback: pollFunction});
  },

  actions: {
    error(error/*, transition*/) {
      if (error) {
        this.controllerFor('application').set('error', error);
      }
    },
    didTransition() {
      this.controllerFor('application').set('error', null);
    },
    willTransition() {
      //close queue/history modal when we open a new page
      this.controllerFor('application').send('closeModal');
      this.send('updateDonateChunk', null);
    },
    updateDonateChunk(donateChunk) {
      this.controllerFor('application').set('headerDonateChunk', donateChunk);
    },
    disableChrome() {
      this.controllerFor('application').set('chromeDisabled', true);
    },
    enableChrome() {
      this.controllerFor('application').set('chromeDisabled', false);
    }
  },

  sessionAuthenticated() {
    this._super(...arguments);
    get(this, 'metrics').identify('GoogleAnalytics', {isAuthenticated: true});
    get(this, 'currentUser').load();
  },
});
