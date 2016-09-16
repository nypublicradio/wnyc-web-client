import Ember from 'ember';
import GoogleAnalytics from 'overhaul/metrics-adapters/google-analytics';

export default Ember.Test.onInjectHelpers(function() {
  GoogleAnalytics.reopen({
    init: Ember.K,
    trackPage: Ember.K,
    trackEvent: Ember.K,
    identify: Ember.K,
    nprDimensions: Ember.K,
  });
});
