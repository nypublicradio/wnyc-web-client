import Ember from 'ember';
import ENV from 'overhaul/config/environment';
import {installBridge} from '../lib/okra-bridge';

export default Ember.Route.extend({
  metrics: Ember.inject.service(),
  asyncWriter: Ember.inject.service(),
  legacyLoader: Ember.inject.service(),
  leaderboard: Ember.inject.service(),

  beforeModel() {
    let metrics = this.get('metrics');
    let mailchimp = String(window.location).match(/utm_term=(\d+_\w+-\w+-\w+)/);

    if (mailchimp) {
      metrics.trackEvent('DataWarehouse', {
        eventName: 'trackMailChimpID',
        mailchimp: encodeURIComponent(mailchimp[1])
      });
    }

    this.get('asyncWriter').install();
    if (ENV.renderGoogleAds) {
      this.get('leaderboard').install();
    }

    window.WNYC_LEGACY_LOADER = this.get('legacyLoader');
    window.WNYC_LEGACY_LOADER.define('installBridge', installBridge);
  }
});
