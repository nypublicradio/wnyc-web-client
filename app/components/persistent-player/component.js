import Component from 'ember-component';
import service from 'ember-service/inject';
import { reads, equal } from 'ember-computed';
import get from 'ember-metal/get';
import Ember from 'ember';


export default Component.extend({
  audio: service(),
  session: service(),
  currentAudio: reads('audio.currentAudio'),
  isPlaying: equal('audio.playState', 'is-playing'),
  classNames: ['persistent-player', 'l-flexcontent', 'l-highlight--blur'],
  classNameBindings: ['isAudiostream'],
  isAudiostream: equal('currentAudio.audioType', 'stream'),
  revealNotification: Ember.computed('session.data.userPrefs', function(){
    // this needs to change
    let session = get(this, 'session');
    let pref = get(session, 'data.userPrefs.activeStream');
    let currentContext = get(this, 'audio.currentContext');
    if (pref === 'default_stream') {
      return currentContext === 'continuous-player-bumper' || currentContext === null;
    } else {
      return false;
    }
  }),
  showNotification: Ember.observer('audio.currentContext', function() {
    // this needs to change
    var ctxt = get(this, 'audio.currentContext');
    var session = get(this, 'session');

    this.set(
      'revealNotification',
      ctxt === 'continuous-player-bumper' || !ctxt
    );
    this.set('preferredStream', session.get('data.userPrefs.activeStream'));
  }),
  actions: {
    playOrPause() {
      if (get(this, 'isPlaying')) {
        get(this, 'audio').pause();
      } else {
        get(this, 'audio').play();
      }
    },
    dismissNotification(cancelAutoplay = false) {
      if (cancelAutoplay) {
        get(this, 'audio').pause();
      }
      this.set('revealNotification', false);
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
