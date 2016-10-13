import Ember from 'ember';
import service from 'ember-service/inject';
import computed, { readOnly } from 'ember-computed';
import get, { getProperties } from 'ember-metal/get';
import ENV from 'overhaul/config/environment';



export default Ember.Service.extend({
  init() {
    this._super(...arguments);
    get(this, 'store').findAll('stream');
  },
  queue: service('listen-queue'),
  session: service(),
  store: service(),
  audio: service(),
  features: service(),
  autoplayPref: readOnly('session.data.user-prefs-active-autoplay'),
  autoplayStream: readOnly('session.data.user-prefs-active-stream'),
  durationLoaded: computed.gt('audio.duration', 0),
  bumperLoaded: computed.and('durationLoaded', 'audio.isPlaying'),
  bumperPlaying: computed.and('bumperLoaded', 'bumperStarted'),
  bumperDidPlay: false,
  bumperStarted: false,
  revealNotificationBar: computed('bumperPlaying', 'bumperDidPlay', function() {
    if (!this.get('features').isEnabled('autoplay-prefs')) {
      return false;
    }
    
    return this.get('bumperPlaying') || this.get('bumperDidPlay');
  }),
  isEnabled: computed('autoplayPref', 'queue.items.length', function() {
    if (!this.get('features').isEnabled('autoplay-prefs')){
      return false;
    }
    
    const { autoplayPref, queue } = getProperties(this, 'autoplayPref', 'queue');
    // if there is nothing left in the queue, then it is redundant/unecessary to
    // play the bumper file. The `play` function will still be called on the audio,
    // but will not play anything, anyway, because it won't recognize the `id`
    // parameter
    if (autoplayPref === 'queue' && get(queue, 'items.length') === 0) {
      return false;
    } else {
      return autoplayPref !== 'no_autoplay';
    }
  }),

  getNext(prevContext) {
    // determine which stage the continuous-play is in
    const autoplayStream = get(this, 'autoplayStream') || 'wnyc-fm939';
    const autoplayPref = get(this, 'autoplayPref') || 'default_stream';

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
    this.set('bumperDidPlay', true);
    if (autoplayPref === 'default_stream') {
      return [autoplayStream, 'stream'];
    } else {
      const queue = get(this, 'queue');
      const nextUp = queue.nextItem();
      return [get(nextUp, 'id'), 'queue'];
    }
  },

  setupBumper(autoplayPref, autoplayStream) {
    this.set('bumperStarted', true);
    let nextItem;
    if (autoplayPref === 'default_stream') {
      let stream = get(this, 'store').peekRecord('stream', autoplayStream);
      if (stream) {
        nextItem = get(stream, 'audioBumper');
      } else {
        nextItem = ENV.queueAudioBumperURL;
      }
    } else {
      nextItem = ENV.queueAudioBumperURL;
    }

    return [nextItem, 'continuous-play-bumper'];
  }
});
