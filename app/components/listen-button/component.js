import Ember from 'ember';
import service from 'ember-service/inject';
const {
  Component,
  computed,
  get,
} = Ember;

function wnycEmbeddedAttr() {
  return computed('embeddedAttrs', {
    get(k) {
      return get(this, `embeddedAttrs.${k}`);
    },
    set(k, v) {
      return v;
    }
  });
}

export default Component.extend({
  audio: service(),
  waitingForAudio: computed.not('audio.isReady'),
  myAudio: computed('audio.currentAudio', {
    get() {
      let currentAudio = get(this, 'audio.currentAudio.id');
      return currentAudio === get(this, 'itemPK') ? get(this, 'audio.currentAudio') : undefined;
    }
  }),
  isPlaying: computed.equal('myAudio.isPlaying', true),

  tagName: '',
  itemPK: wnycEmbeddedAttr(),
  itemTitle: wnycEmbeddedAttr(),
  duration: wnycEmbeddedAttr(),
  actions: {
    listenOnDemand() {
      get(this, 'audio').playOnDemand(get(this, 'itemPK'));
    },
    pause() {
      get(this, 'audio').pause();
    }
  }
});
