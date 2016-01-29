import GoogleAnalytics from 'ember-metrics/metrics-adapters/google-analytics';

// TODO: still relying on wnyc's listening extension. should move to a session
// manager service
const {
  listen
} = wnyc.listening;

export default GoogleAnalytics.extend({
  init() {
    this._super(...arguments);

    // TODO: will there be analytics for overlays? overlays on listing pages?
    // if (window.overlay_iframe_obj && window.overlay_iframe_obj.opt
    // && !window.overlay_iframe_obj.opt.googletrackcode) {
    //   //see media/js/lib/wnyc/overlay/
    //   window.overlay_iframe_obj.opt.googletrackcode = trackCode;
    // }
    listen("wnyc.user.success", this.identify)
  },
  identify() {
    var userData = wnyc.user && wnyc.user.data,
      isLoggedIn = userData && !!userData.isAuthenticated;
    // TODO: need to figure out new GA equivalent of this:
    // _gaq.push(['_setCustomVar', 1, 'User.LoggedIn', isLoggedIn]);
    window.ga('set', 'dimension1', isLoggedIn); // maybe??
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
    var analyticsCode = data.label,
      m = String(analyticsCode).match(/(\$A\d)\$AD\d+(\$V\d).*(\$M\w).*(\$S[^$]+)/);
    if (m) {
      // TODO: figure out new analytics equivalent of this:
      //custom variables can only be up to 5.  #1 is for is_logged_in
      // var pageAction = 3;
      // _gaq.push(['_setCustomVar', 2, 'audiovideo', m[1] + m[2], pageAction]);
      // _gaq.push(['_setCustomVar', 3, 'model', m[3], pageAction]);
      // _gaq.push(['_setCustomVar', 4, 'channels', m[4], pageAction]);
    }

    // EXPERIMENTAL
    data.category = 'Experimental: ' + data.category;
    // EXPERIMENTAL

    this.trackEvent(data);
  }

});
