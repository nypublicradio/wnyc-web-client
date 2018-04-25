import Route from '@ember/routing/route';
import { get } from '@ember/object';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import { inject as service } from '@ember/service';
import { schedule } from '@ember/runloop';

export default Route.extend(ApplicationRouteMixin, {
  metrics: service(),
  asyncWriter: service(),
  legacyLoader: service(),
  leaderboard: service(),
  currentUser: service(),
  session: service(),
  poll: service(),
  store: service(),
  dj: service(),

  title(tokens = []) {
    let siteName = 'WNYC';
    let tagline = 'New York Public Radio, Podcasts, Live Streaming Radio, News';

    // combine the first two items if the second item stats with `:`
    if (tokens[1] && tokens[1].startsWith(':'))  {
      tokens.splice(0, 2, `${tokens[0]}${tokens[1]}`);
    }

    tokens.push(siteName);
    if (tokens.length < 3) {
      tokens.push(tagline);
    }
    let title = tokens.join(' | ');
    get(this, 'dataLayer').setPageTitle(title);

    schedule('afterRender', () => {
      get(this, 'dataLayer').sendPageView();
    });

    return title;
  },

  beforeModel() {
    let metrics = get(this, 'metrics');

    get(this, 'session').syncBrowserId()
      .then(id => get(this, 'dj').addBrowserId(id));
    get(this, 'session').staffAuth();
    get(this, 'currentUser').load();

    metrics.identify('GoogleAnalytics', {isAuthenticated: false});

    get(this, 'asyncWriter').install();
    get(this, 'leaderboard').install();

    window.WNYC_LEGACY_LOADER = get(this, 'legacyLoader');

    let pollFunction = () => get(this, 'store').findAll('stream');
    get(this, 'poll').addPoll({interval: 60 * 1000, callback: pollFunction});
  },

  actions: {
    error(error/*, transition*/) {
      if (error && error.response) {
        if (error.response.status === 404) {
          this.transitionTo('missing');
        }
      } else {
        /* eslint-disable */
        console.error(error);
        /* eslint-enable */
      }
    },
    didTransition() {
      this.controllerFor('application').set('error', null);
      return true;
    },
    willTransition() {
      //close queue/history modal when we open a new page
      this.controllerFor('application').send('closeModal');
      this.send('updateDonateChunk', null);
    },
    updateDonateChunk(donateChunk) {
      this.controllerFor('application').set('headerDonateChunk', donateChunk);
    },
    setMiniChrome(val) {
      this.controllerFor('application').set('miniChrome', val);
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

  sessionInvalidated() {
    if (this.get('session.noRefresh') === true) {
      this.set('session.noRefresh', false);
    } else {
      this._super(...arguments);
    }
  }
});
