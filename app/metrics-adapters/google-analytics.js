import GoogleAnalytics from 'ember-metrics/metrics-adapters/google-analytics';
import {siteName} from 'overhaul/config/environment';

const DEFAULT_NPR_VALS = ['NYPR', ...Array(7), siteName, null, document.title, Array(3)];

export default GoogleAnalytics.extend({
  identify({isAuthenticated}) {
    window.ga('set', 'dimension1', String(isAuthenticated));
  },
  trackEvent({ category, action, label, value }) {
    this._super({ category, action, label, value });
  },
  nprDimensions({nprVals = DEFAULT_NPR_VALS}) {
    for (let i = 0; i < nprVals.length; i++) {
      // NPR Dimensions begin at slot 6
      window.ga('set', `dimension${i + 6}`, nprVals[i] || 'None');
    }
  }
});
