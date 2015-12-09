import Ember from 'ember';
import service from 'ember-service/inject';
import { ServiceBridge } from '../lib/okra-bridge';
const {
  A:emberArray,
  Service,
  get,
  set
} = Ember;

// the ServiceBridge provides:
// playerController <- will be refactored out
// playerModel <- well be refactored out
// isReady <- will need to be replaced by an ember observer
export default Service.extend(ServiceBridge, {
  store: service('store'),
  queue: emberArray([]),
  playOnDemand(pk) {
    let currentAudio = get(this, 'currentAudio.id');
    if (currentAudio === pk) {
      this.play();
      return;
    }

    get(this, 'store').find('ondemand', pk).then(o => { 
      set(this, 'currentAudio', o);
      // TODO: the ModelBridge starts playing
      // o.play();
    });
  },

  playStream(slug) {
    let currentStream = get(this, 'currentAudio.id');
    if (currentStream === slug) {
      this.play();
      return;
    }

    get(this, 'store').find('stream', slug).then(s => {
      set(this, 'currentAudio', s);
      // TODO: the ModelBridge handles playig for now
      // s.play();
    });
  },
  pause() {
    get(this, 'currentAudio').pause();
  },
  play() {
    get(this, 'currentAudio').play();
  }
});
