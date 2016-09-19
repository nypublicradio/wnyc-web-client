import GoogleAnalytics from 'ember-metrics/metrics-adapters/google-analytics';

export default GoogleAnalytics.extend({
  identify({isAuthenticated}) {
    window.ga('set', 'dimension1', String(isAuthenticated));
  },
});
