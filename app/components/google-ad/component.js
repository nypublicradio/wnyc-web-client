import Ember from 'ember';
import service from 'ember-service/inject';
import config from 'overhaul-listings/config/environment';
const {
  get,
  set,
  run,
  Component
} = Ember;

export default Component.extend({
  router: service('-routing'),

  init() {
    this._super(...arguments);

    if (config.renderGoogleAds) {
      let router = get(this, 'router.router');
      router.on('didTransition', () => this.doRefresh());
      run.later(this, 'adSpaceCleanup', { hasMarquee: get(this, 'hasMarquee') }, 2000);
    }
  },

  adSpaceCleanup(arg) {
    if(arg.hasMarquee && Ember.$('#leaderboard').css('display') === 'none') {
        Ember.$(this.element).css({'margin-top': '-20px'});
    }
  },

  doRefresh() {
    // the leaderboard ad will be displayed if a model has a marquee image
    // this causes the leaderboard to refresh twice if going from a non-leaderbaord
    // page to a leaderboard page: once for didInsertElement and another from
    // the URL observer. so we cache the url changes and compare
    const currentUrl = get(this, 'router.router.url');
    const cachedUrl = get(this, 'cachedUrl');
    const { googletag } = window;

    if (currentUrl !== cachedUrl) {
      if (googletag && googletag.apiReady) {
        run.schedule('afterRender', this, () => {
          googletag.cmd.push(() => {
            const ad = get(this, 'ad');
            const adSlot = window.wnyc.ads[ad];
            googletag.pubads().refresh([adSlot]);
          });
          set(this, 'cachedUrl', currentUrl);
        });
      } else {
        run.later(this, 'doRefresh', 500);
      }
    }
  }
});
