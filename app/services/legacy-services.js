/*global wnyc*/
import Ember from 'ember';
import service from 'ember-service/inject';

const {
  Service,
  get,
} = Ember;

export default Service.extend({
  metrics: service(),
  store: service(),

  streamStation(streamSlug) {
    if (!streamSlug) {
      wnyc.xdPlayer.openToAllStreams();
    } else {
      wnyc.xdPlayer.playStream(streamSlug);
    }
  },
  listen(id, title) {
    const metrics = get(this, 'metrics');
    const store = get(this, 'store');
    const story = store.peekRecord('story', id);
    try {
      wnyc.xdPlayer.playOnDemand(id);
    } catch(e) {
      console.warn('Cross Domain Player does not exist');
    }

    if (story) {
      metrics.trackEvent({
        category: 'Cross-Domain Player',
        action: 'Click Through to Player',
        label: `${story.get('headers.brand.title')} - ${title}`,
        model: {cmsPK: id}  // conform to how the data-warehouse metrics adapter expects
      });
    }
  },
  queue(id) {
    try {
      wnyc.xdPlayer.addToPlaylist(id);
    } catch(e) {
      console.warn('Cross Domain Player does not exist');
    }
  },
});
