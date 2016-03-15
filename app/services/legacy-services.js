/*global wnyc*/
import Ember from 'ember';
import service from 'ember-service/inject';

const {
  Service,
  $,
  get,
} = Ember;

export default Service.extend({
  metrics: service(),

  init() {
    this._setupStreamListener();
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
    const metrics = get(this, 'metrics');
    try {
      wnyc.xdPlayer.playOnDemand(id);
    } catch(e) {
      console.warn('Cross Domain Player does not exist');
    }

    metrics.trackEvent({
      category: 'Cross-Domain Player',
      action: `Played OnDemand Show "${show}"`,
      label: title
    });
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
    // TODO: not until we migrate to sessionManager
    //wnyc.listening.listen("wnyc.user.success", () => wnyc.user.staffLinks());
  },

  _setupStreamListener() {
    $(document).on('click', '.js-launch-stream', this.stream);
  },

});
