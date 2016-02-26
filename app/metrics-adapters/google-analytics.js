/* globals wnyc */
import GoogleAnalytics from 'ember-metrics/metrics-adapters/google-analytics';

// TODO: still relying on wnyc's listening extension. should move to a session
// manager service
const {
  listen
} = wnyc.listening;

export default GoogleAnalytics.extend({
  init() {
    this._super(...arguments);
    listen("wnyc.user.success", this.identify);
  },
  identify() {
    var userData = wnyc.user && wnyc.user.data,
      isLoggedIn = userData && !!userData.isAuthenticated;
    // TODO: need to figure out new GA equivalent of this:
    // _gaq.push(['_setCustomVar', 1, 'User.LoggedIn', isLoggedIn]);
    window.ga('set', 'dimension1', String(isLoggedIn)); // maybe??
  },

  trackEvent(data) {
    const { eventName } = data;

    if (eventName === 'experimentalSend') {
      return this._experimentalSend(data);
    } else {
      return this._super(...arguments);
    }

  },

  // TODO: start sending through anatlyics bytestrings to listing objects
  _experimentalSend(data) {
    // EXPERIMENTAL
    data.category = 'Experimental: ' + data.category;
    // EXPERIMENTAL

    this.trackEvent(data);
  }

});
