import service from 'ember-service/inject';
import GoogleAnalytics from 'ember-metrics/metrics-adapters/google-analytics';
import Ember from 'ember';
const { get } = Ember;

export default GoogleAnalytics.extend({
  sessionManager: service(),
  init() {
    this._super(...arguments);
    get(this, 'sessionManager.user').then(this.identify);
  },
  identify(user) {
    window.ga('set', 'dimension1', String(get(user, 'isAuthenticated')));
  },
  trackEvent({ category, action, label, value }) {
    this._super({ category, action, label, value });
  }
});
