import Service from 'ember-service';
import Ember from 'ember';

export default Service.extend({
  install() {
    window.addEventListener('message', this._resizeLeaderboard);
    Ember.$('#leaderboard').css('max-height', '0');
  },
  _resizeLeaderboard(e) {
    let data;
    let shouldOpen;
    let $leaderboardIframe = Ember.$('#leaderboard > div > iframe');

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

    if ( $leaderboardIframe.length !== 1 ) {
      $leaderboardIframe = Ember.$('#leaderboard > div > iframe');
    }
    $leaderboardIframe.css('max-height', shouldOpen ? 415 : 90);
  }
});
