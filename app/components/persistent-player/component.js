import Component from 'ember-component';
import service from 'ember-service/inject';
import { reads, equal } from 'ember-computed';
import get from 'ember-metal/get';
import Ember from 'ember';


export default Component.extend({
  audio: service(),
  session: service(),
  store: service(),
  classNames: ['persistent-player', 'l-flexcontent', 'l-highlight--blur'],
  classNameBindings: ['isAudiostream'],
  currentAudio: reads('audio.currentAudio'),
  isPlaying: equal('audio.playState', 'is-playing'),
  isAudiostream: equal('currentAudio.audioType', 'stream'),
  bumperDuration: 0,
  preferredStream: Ember.computed('session.data.user-prefs-active-stream', function(){
    let session = this.get('session');
    let slug = session.get('data.user-prefs-active-stream') || 'wnyc-fm939';
    let stream = this.get('store').peekRecord('stream', slug);
    // juuuuuust in case....
    if (stream) {
      return stream.get('name');
    }

    return slug;
  }),
  revealNotification: Ember.computed('audio.duration', 'audio.currentContext', function() {
    // this is really, really ugly. Is there an easier way to hook into the audio
    // player's current content?
    let session = get(this, 'session');
    let ctxt = get(this, 'audio.currentContext');
    let duration = get(this, 'audio.duration') / 1000;
    let autoplay = session.getWithDefault('data.user-prefs-active-autoplay', 'default_stream');
    if (autoplay !== 'default_stream') {
      return false;
    }

    if (duration < 11 && (ctxt === 'continuous-player-bumper' || !ctxt)) {
      this.set('bumperDuration', Math.floor(duration));
      return this.get('isPlaying');
    }

    return false;
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
