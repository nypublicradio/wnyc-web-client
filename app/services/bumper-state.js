import Ember from 'ember';
import service from 'ember-service/inject';
import computed, { readOnly } from 'ember-computed';
const QUEUE_BUMPER = 'http://audio.wnyc.org/news/news20090427_swine_flu_aviles.mp3';

export default Ember.Service.extend({
  init() {
    // get the streams pre-loaded. not always guaranteed that the stream models
    // will be loaded by the time the page loads / audiop
    if (this.get('autoplayPref') === 'default_stream') {
      this.get('store').findAll('stream');
    }
    this._super(...arguments);
  },
  queue: service('listen-queue'),
  session: service(),
  store: service(),
  audio: service(),
  autoplayPref: readOnly('session.data.user-prefs-active-autoplay'),
  autoplayStream: readOnly('session.data.user-prefs-active-stream'),
  isPlaying: computed('audio.isPlaying', 'audio.currentAudio', function() {
    let audio = this.get('audio');
    if (audio.get('isPlaying') && audio.get('currentAudio.audioType') === 'bumper') {
      this.set('revealNotificationBar', true);
    }
  }),
  revealNotificationBar: false,
  isEnabled: computed('autoplayPref', 'queue.items.length', function() {
    let { autoplayPref, queue } = this.getProperties('autoplayPref', 'queue');
    // if there is nothing left in the queue, then it is redundant/unecessary to
    // play the bumper file. The `play` function will still be called on the audio,
    // but will not play anything, anyway, because it won't recognize the `id`
    // parameter
    if (autoplayPref === 'queue' && queue.get('items.length') === 0) {
      return false;
    } else {
      return autoplayPref !== 'no_autoplay';
    }
  }),

  getNext(prevContext) {
    // determine which stage the continuous-play is in
    let autoplayStream = this.getWithDefault('autoplayStream', 'wnyc-fm939');
    let autoplayPref = this.getWithDefault('autoplayPref', 'default_stream');

    if (prevContext === 'continuous-play-bumper') {
      // the bumper had played, so setup the default content from the user settings
      return this.setupContent(autoplayPref, autoplayStream);
    } else {
      // the active selection the user was listening to use has ended, so now
      // the bumper gets setup.
      return this.setupBumper(autoplayPref, autoplayStream);
    }
  },

  setupContent(autoplayPref, autoplayStream) {
    this.set('didBumperPlay', true);
    if (autoplayPref === 'default_stream') {
      return [autoplayStream, 'stream'];
    } else {
      // I'm completely leaving out discover - I'm not 100% sure if it's any diff
      // from a regular queue.
      let queue = this.get('queue');
      let nextUp = queue.nextItem();
      return [nextUp.get('id'), 'queue'];
    }
  },

  setupBumper(autoplayPref, autoplayStream) {
    let nextItem;
    this.set('revealNotificationBar', true);
    if (autoplayPref === 'default_stream') {
      let stream = this.get('store').peekRecord('stream', autoplayStream);
      if (stream) {
        nextItem = stream.get('audioBumper');
      } else {
        nextItem = QUEUE_BUMPER;
      }
    } else {
      nextItem = QUEUE_BUMPER;
    }

    return [nextItem, 'continuous-play-bumper'];
  }
});
