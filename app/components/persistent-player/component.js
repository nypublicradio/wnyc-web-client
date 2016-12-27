import Component from 'ember-component';
import service from 'ember-service/inject';
import computed, { reads, equal, not } from 'ember-computed';
import get from 'ember-metal/get';
import set from 'ember-metal/set';


export default Component.extend({
  audio: service(),
  hifi: service(),
  store: service(),
  bumper: service('bumper-state'),
  classNames: ['persistent-player', 'l-flexcontent', 'l-highlight--blur'],
  classNameBindings: ['isAudiostream'],

  //input
  currentAudio: reads('audio.currentAudio'),

  isPlaying: equal('hifi.isPlaying'),

  audioType: computed('hifi.currentSound', function() {
    if (get('hifi.isStream')) {
      return 'stream';
    }
    else {
      return 'ondemand';
    }
  }),


  // input
  isAudiostream: equal('audioType', 'stream'),
  didDismiss: false,
  didNotDismiss: not('didDismiss'),

  //input
  continuousPlayEnabled: computed.and('didNotDismiss', 'bumper.revealNotificationBar'),

  // bubble up events

  // onEvent =

  // Passed down to subcomponents

  currentTitle: null,










  actions: {
    playOrPause() {
      if (get(this, 'isPlaying')) {
        this.sendAction('onPause')
        get(this, 'hifi').pause();
      } else {
        get(this, 'hifi').play();
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
      get(this, 'hifi').set('position', (p * get(this, 'hifi.currentSound.duration')));
    },
    rewind() {
      get(this, 'hifi').rewind(15000);
    },
    fastForward() {
      get(this, 'hifi').fastForward(15000);
    },
    setVolume(vol) {
      get(this, 'hifi').set('volume', vol);
    },
    toggleMute() {
      get(this, 'hifi').toggleMute();
    },
  }
});
