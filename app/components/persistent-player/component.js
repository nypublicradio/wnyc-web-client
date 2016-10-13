import Component from 'ember-component';
import service from 'ember-service/inject';
import computed, { reads, equal, not } from 'ember-computed';
import get from 'ember-metal/get';
import set from 'ember-metal/set';


export default Component.extend({
  audio: service(),
  store: service(),
  bumper: service('bumper-state'),
  classNames: ['persistent-player', 'l-flexcontent', 'l-highlight--blur'],
  classNameBindings: ['isAudiostream'],
  currentAudio: reads('audio.currentAudio'),
  isPlaying: equal('audio.playState', 'is-playing'),
  isAudiostream: equal('currentAudio.audioType', 'stream'),
  didDismiss: false,
  didNotDismiss: not('didDismiss'),
  continuousPlayEnabled: computed.and('didNotDismiss', 'bumper.revealNotificationBar'),

  actions: {
    playOrPause() {
      if (get(this, 'isPlaying')) {
        get(this, 'audio').pause();
      } else {
        get(this, 'audio').play();
      }
    },
    dismissNotification() {
      set(this, 'didDismiss', true);
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
