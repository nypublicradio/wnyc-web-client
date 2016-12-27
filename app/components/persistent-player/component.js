import Component from 'ember-component';
import service from 'ember-service/inject';
import computed, { reads, equal, not } from 'ember-computed';
import get from 'ember-metal/get';
import set from 'ember-metal/set';


export default Component.extend({
  hifi                 : service(),
  bumper               : service('bumper-state'),
  classNames           : ['persistent-player', 'l-flexcontent', 'l-highlight--blur'],
  classNameBindings    : ['isAudiostream'],

  isPlaying            : reads('hifi.isPlaying'),
  isAudiostream        : reads('hifi.isStream'),

  // Notification
  didDismiss           : false,
  didNotDismiss        : not('didDismiss'),
  continuousPlayEnabled: computed.and('didNotDismiss', 'bumper.revealNotificationBar'),

  audio                : service(),
  currentAudio         : reads('audio.currentAudio'),
  currentTitle         : null,

  actions: {
    playOrPause() {
      if (get(this, 'isPlaying')) {
        this.sendAction('onPause');
        get(this, 'hifi.currentSound').pause();
      } else {
        // TODO: Update this hifi gotcha. Audio play without arguments should resume sound
        this.sendAction('onPlay');
        get(this, 'hifi.currentSound').play();
      }
    },
    dismissNotification() {
      this.sendAction('onDismissNotification');
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
