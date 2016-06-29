import GoogleAnalytics from 'ember-metrics/metrics-adapters/google-analytics';

export default GoogleAnalytics.extend({
  identify({isAuthenticated}) {
    window.ga('set', 'dimension1', String(isAuthenticated));
  },
  trackEvent({ category, action, label, value }) {
    this._super({ category, action, label, value });
  }
});
