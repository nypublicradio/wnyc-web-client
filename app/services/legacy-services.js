/*global wnyc*/
import Ember from 'ember';
import service from 'ember-service/inject';

const {
  Service,
  $,
  get,
  run
} = Ember;

export default Service.extend({
  metrics: service(),

  init() {
    this._setupStreamListener()
    this._setupMenuTracking()
  },
  stream(e) {
    const streamSlug = $(this).attr('data-stream-slug');
    if (!wnyc || !wnyc.xdPlayer) {
      console.log('error: wnyc or wnyc.xdPlayer is missing');
      return;
    }
    if (streamSlug) {
      wnyc.xdPlayer.playStream(streamSlug);
    } else {
      // If no streamSlug, just open player to streams menu.
      wnyc.xdPlayer.openToAllStreams();
    }
    e.preventDefault();
  },
  streamStation(streamSlug) {
    if (!streamSlug) {
      wnyc.xdPlayer.openToAllStreams();
    } else {
      wnyc.xdPlayer.playStream(streamSlug);
    }
  },
  listen(id, title, show) {
    const metrics = get(this, 'metrics')
    try {
      wnyc.xdPlayer.playOnDemand(id);
    } catch(e) {
      console.warn('Cross Domain Player does not exist');
    }

    metrics.trackEvent({
      category: 'Cross-Domain Player',
      action: `Played OnDemand Show "${show}"`,
      label: title
    })
  },
  queue(id) {
    try {
      wnyc.xdPlayer.addToPlaylist(id);
    } catch(e) {
      console.warn('Cross Domain Player does not exist');
    }
  },
  processEditLinks() {
    // should be abstracted for emberification
    // something like:
    //  session-service for auth
    //  updates bound prop which reveals editlinks
    wnyc.listening.listen("wnyc.user.success", () => wnyc.user.staffLinks());
  },

  trackShowFromMenu(e) {
    const openMenu = $('#navigation-menu .active-nav-item')
    const $target = $(e.currentTarget)
    const showTitle = $target.text().trim()
    const destinationUrl = $target.attr('href')
    const metrics = get(this, 'metrics')

    if (openMenu.text().trim() !== 'Shows') {
      return
    } else {
      e.preventDefault()
    }

    metrics.trackEvent({
      category: 'WNYC Menu',
      action: `Clicked "${showTitle}"`,
      label: `"${showTitle}" with URL "${destinationUrl || 'no URL'}"`
    })

    if (destinationUrl) {
      run.later(this, () => window.location = destinationUrl, 100);
    }
  },

  _setupStreamListener() {
    $(document).on('click', '.js-launch-stream', this.stream)
  },

  _setupMenuTracking() {
    $(document).on('click', '#navigation-menu a', this.trackShowFromMenu.bind(this))
  }
});
