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

  //input
  currentAudio: reads('audio.currentAudio'),

  // get from hifi
  isPlaying: equal('audio.playState', 'is-playing'),


  // input
  isAudiostream: equal('currentAudio.audioType', 'stream'),
  didDismiss: false,
  didNotDismiss: not('didDismiss'),

  //input
  continuousPlayEnabled: computed.and('didNotDismiss', 'bumper.revealNotificationBar'),

  // bubble up events

  // onEvent =

  actions: {
    playOrPause() {
      if (get(this, 'isPlaying')) {
        this.sendAction('onPause')
        get(this, 'audio').pause();
      } else {
        get(this, 'audio').play();
      }
    },
    dismissNotification() {
      this.sendAction('trackPlayer')
      get(this, 'audio')._trackPlayerEvent({
        action: 'Continuous Play Notification',
        label: 'Click to Close Notification'
      });
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
