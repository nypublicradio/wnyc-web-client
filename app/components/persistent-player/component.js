import { inject } from 'ember';
import Component from 'ember-component';
import service from 'ember-service/inject';
import { reads, equal, computed } from 'ember-computed';
import get from 'ember-metal/get';

export default Component.extend({
  audio: service(),
  session: inject(),
  currentAudio: reads('audio.currentAudio'),
  isPlaying: equal('audio.playState', 'is-playing'),
  classNames: ['persistent-player', 'l-flexcontent', 'l-highlight--blur'],
  classNameBindings: ['isAudiostream'],
  isAudiostream: equal('currentAudio.audioType', 'stream'),
  isPlayingAudioCue: equal('currentAudio.id', 1),
  sessionSettings: computed('session.data.userPrefs', function(){
    var prefs = this.get('session.data.userPrefs');
    return {
      disableAutoPlay: prefs.activePref === 'Do Not Autoplay',
    };
  }),
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
