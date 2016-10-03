import Component from 'ember-component';
import service from 'ember-service/inject';
import { reads, equal } from 'ember-computed';
import get from 'ember-metal/get';
import Ember from 'ember';


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
  continuousPlayEnabled: Ember.computed('didDismiss', 'bumper.revealNotificationBar', function() {
    let { bumper, didDismiss } = this.getProperties('bumper', 'didDismiss');
    if (didDismiss) {
      return false;
    }

    return bumper.get('revealNotificationBar');
  }),

  actions: {
    playOrPause() {
      if (get(this, 'isPlaying')) {
        get(this, 'audio').pause();
      } else {
        get(this, 'audio').play();
      }
    },
    dismissNotification() {
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
