import BaseAdapter from 'ember-metrics/metrics-adapters/base';
import { siteName } from 'wnyc-web-client/config/environment';
import $ from 'jquery';

const DEFAULT_NPR_VALS = ['NYPR', ...Array(7), siteName, null, document.title, ...Array(3)];

export default BaseAdapter.extend({
  toStringExtension() {
    return 'npr-analytics';
  },

  init() {
    let { id } = this.get('config');
    // depend (loosely) on our google-analytics adapter
    if (window.ga) {
      window.ga('create', id, 'auto', 'npr');
    }
  },
  
  trackPage({ page, title, nprVals = DEFAULT_NPR_VALS }) {
    if (window.ga) {
      for (let i = 0; i < nprVals.length; i++) {
        // NPR Dimensions begin at slot 6
        window.ga('npr.set', `dimension${i + 6}`, nprVals[i] || 'none');
      }
      window.ga('npr.send', {hitType: 'pageview', page, title});
      
      // for testing
      return true;
    }
  },

  trackEvent({ category, action, label }) {
    if (window.ga) {
      window.ga('npr.send', 'event', category, action, label);
      
      // for testing
      return true;
    }
  },

  willDestroy() {
    $('script[src*="google-analytics"]').remove();
    delete window.ga;
  }
});
