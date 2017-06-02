import Ember from 'ember';
import GoogleAnalytics from 'wqxr-web-client/metrics-adapters/google-analytics';

export default Ember.Test.onInjectHelpers(function() {
  GoogleAnalytics.reopen({
    init() {},
    trackPage() {},
    trackEvent() {},
    identify() {},
    nprDimensions () {}
  });
});
