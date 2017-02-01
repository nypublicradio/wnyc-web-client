import Service from 'ember-service';
import Ember from 'ember';

export default Service.extend({
  install() {
    window.addEventListener('message', this._resizeLeaderboard);
    window.googletag.cmd.push(() => window.googletag.pubads().addEventListener('slotRenderEnded', this.adSpaceCleanup));
  },
  adSpaceCleanup(e) {
    if (/leaderboard/.test(e.slot.getAdUnitPath())) {
      if (e.isEmpty) {
        Ember.$('#leaderboard').addClass('is-collapsed');
      } else {
        Ember.$('#leaderboard').removeClass('is-collapsed');
      }
    }
  },
  _resizeLeaderboard(e) {
    let data;
    let shouldOpen;
    let $leaderboard = Ember.$('#leaderboard > div > iframe, #leaderboard > div');

    // lots of things on a page can send a postMessage, but not all of that
    // data is parsable as JSON. this prevents nasty console messages.
    try {
      data = JSON.parse(e.data);
    } catch(err) {
      return false;
    }

    // just a little sanity check that we're receiving a message from our ad
    if ( !data.wnyc ) {
      return false;
    }

    if ( data.msg === 'init' ) {
      Ember.$('#leaderboard').css('max-height', 'none');
      shouldOpen = false;
    } else {
      shouldOpen = data.msg === 'open';
    }

    if ( $leaderboard.length !== 1 ) {
      $leaderboard = Ember.$('#leaderboard > div > iframe, #leaderboard > div');
    }
    $leaderboard.css('max-height', shouldOpen ? 415 : 90);
  }
});
