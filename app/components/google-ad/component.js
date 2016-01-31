import Ember from 'ember';
import service from 'ember-service/inject';
const {
  observer,
  get,
  set,
  run,
  computed,
  Component
} = Ember

export default Component.extend({
  router: service('-routing'),
  didInsertElement() {
    // this isn't crazy. we need to get the computed url property in order to prime
    // the observer below.
    get(this, 'router.router.url')
    this._doRefresh()
  
    run.later(this, 'adSpaceCleanup',{ hasMarquee: get(this, 'hasMarquee') }, 2000)
  },
  refresh: observer('router.router.url', function() {
    // observers fire early and often within a run loop. this will make sure
    // multiple calls to this ovserver coalesce into a single call to _doRefresh
    run.once(this, '_doRefresh')
  }),
  adSpaceCleanup(arg) {
    if(arg.hasMarquee && Ember.$('#leaderboard').css('display') === 'none') {
        Ember.$(this.element).css({'margin-top': '-20px'});
    }
  },
  _doRefresh() {
    // the leaderboard ad will be displayed if a model has a marquee image
    // this causes the leaderboard to refresh twice if going from a non-leaderbaord
    // page to a leaderboard page: once for didInsertElement and another from
    // the URL observer. so we cache the url changes and compare
    const currentUrl = get(this, 'router.router.url')
    const cachedUrl = get(this, 'cachedUrl')
    const { googletag } = window;

    if (currentUrl !== cachedUrl) {
      if (googletag && googletag.apiReady) {
        run.schedule('afterRender', this, () => {
          googletag.cmd.push(() => {
            const ad = get(this, 'ad')
            const adSlot = window.wnyc.ads[ad]
            googletag.pubads().refresh([adSlot])
          })
          set(this, 'cachedUrl', currentUrl)
        })
      } else {
        run.later(this, '_doRefresh', 500)
      }
    }
  }
});
