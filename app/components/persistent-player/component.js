import Component from 'ember-component';
import service from 'ember-service/inject';
import { reads, equal } from 'ember-computed';
import get from 'ember-metal/get';
import Ember from 'ember';


export default Component.extend({
  audio: service(),
  store: service(),
  classNames: ['persistent-player', 'l-flexcontent', 'l-highlight--blur'],
  classNameBindings: ['isAudiostream'],
  currentAudio: reads('audio.currentAudio'),
  isPlaying: equal('audio.playState', 'is-playing'),
  isAudiostream: equal('currentAudio.audioType', 'stream'),
  didDismiss: false,
  continuousPlayEnabled: Ember.computed('audio.currentContext', 'currentAudio.audioType', 'didDismiss', function() {
    let { audio, didDismiss } = this.getProperties('audio', 'didDismiss');
    let { currentContext, currentAudio } = audio.getProperties('currentContext', 'currentAudio');
    let audioType = currentAudio.get('audioType');
    if (didDismiss) {
      return false;
    }

    if (currentContext === 'continuous-player-bumper') {
      return true;
    }

    return audioType === 'stream' || currentContext === 'queue';
  }),

  actions: {
    playOrPause() {
      if (get(this, 'isPlaying')) {
        get(this, 'audio').pause();
      } else {
        get(this, 'audio').play();
      }
    },
    dismissNotification(cancelAutoplay) {
      if (cancelAutoplay) {
        get(this, 'audio').pause();
      }
      this.set('didDismiss', true);
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
