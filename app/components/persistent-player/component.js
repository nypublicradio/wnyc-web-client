import Component from 'ember-component';
import service from 'ember-service/inject';
import { reads, equal } from 'ember-computed';
import get from 'ember-metal/get';

export default Component.extend({
  audio: service(),
  currentAudio: reads('audio.currentAudio'),
  isPlaying: equal('audio.playState', 'is-playing'),
  classNames: ['persistent-player', 'l-flexcontent', 'l-highlight--blur'],
  classNameBindings: ['isAudiostream'],
  isAudiostream: equal('currentAudio.audioType', 'stream'),
  actions: {
    playOrPause() {
      if (get(this, 'isPlaying')) {
        get(this, 'audio').pause();
      } else {
        get(this, 'audio').play();
      }
    },
    setPosition(p) {
      get(this, 'audio').setPosition(p);
    },
    rewind() {
      get(this, 'audio').rewind();
    },
    fastForward() {
      get(this, 'audio').fastForward();
    },
    setVolume(vol) {
      get(this, 'audio').set('volume', vol);
    },
    toggleMute() {
      get(this, 'audio').toggleMute();
    },
  }
});
