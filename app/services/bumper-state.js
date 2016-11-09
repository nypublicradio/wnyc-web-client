import Ember from 'ember';
import service from 'ember-service/inject';
import computed, { readOnly, not } from 'ember-computed';
import get, { getProperties } from 'ember-metal/get';
import ENV from 'overhaul/config/environment';
import { inExperimentalGroup } from 'overhaul/helpers/in-experimental-group';

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
  autoplaySlug: readOnly('session.data.user-prefs-active-stream.slug'),
  durationLoaded: computed.gt('audio.duration', 0),
  audioLoaded: not('audio.isLoading'),
  bumperLoaded: computed.and('durationLoaded', 'audioLoaded'),
  bumperPlaying: computed.and('bumperLoaded', 'bumperStarted'),
  bumperDidPlay: false,
  bumperStarted: false,
  revealNotificationBar: computed('bumperPlaying', 'bumperDidPlay', function() {
    // Google Experiment Continuous Play - START
    if (!( this.get('features').isEnabled('autoplay-prefs') && inExperimentalGroup([1]) )) {
      return false;
    }
    // Google Experiment Continuous Play - END

    return this.get('bumperPlaying') || this.get('bumperDidPlay');
  }),
  autoplayEnabled: computed('autoplayPref', 'queue.items.length', function() {
    // Google Experiment Continuous Play - START
    if (!( this.get('features').isEnabled('autoplay-prefs') && inExperimentalGroup([1]) )){
      return false;
    }
    // Google Experiment Continuous Play - END

    const { autoplayPref, queue } = getProperties(this, 'autoplayPref', 'queue');
    const items = get(queue, 'items') || [];
    // if there is nothing left in the queue, then it is redundant/unecessary to
    // play the bumper file. The `play` function will still be called on the audio,
    // but will not play anything, anyway, because it won't recognize the `id`
    // parameter
    if (autoplayPref === 'queue' && items.length === 0) {
      return false;
    } else {
      return autoplayPref !== 'no_autoplay';
    }
  }),
  autoplayChoice: computed('autoplayPref', 'autoplaySlug', function() {
    const autoplaySlug = get(this, 'autoplaySlug') || 'wnyc-fm939';
    const autoplayPref = get(this, 'autoplayPref') || 'default_stream';
    if (autoplayPref === 'default_stream') {
      let stream = get(this, 'store').peekRecord('stream', autoplaySlug);
      return get(stream, 'name');
    } else {
      return 'Queue';
    }
  }),

  getAutoplayAudioId() {
    const autoplaySlug = get(this, 'autoplaySlug') || 'wnyc-fm939';
    const autoplayPref = get(this, 'autoplayPref') || 'default_stream';

    if (autoplayPref === 'default_stream') {
      return autoplaySlug;
    } else {
      const queue = get(this, 'queue');
      const nextUp = queue.nextItem();
      return get(nextUp, 'id');
    }
  },

  getBumperUrl() {
    const autoplaySlug = get(this, 'autoplaySlug') || 'wnyc-fm939';
    const autoplayPref = get(this, 'autoplayPref') || 'default_stream';

    let nextItem;
    if (autoplayPref === 'default_stream') {
      let stream = get(this, 'store').peekRecord('stream', autoplaySlug);
      if (stream) {
        nextItem = get(stream, 'audioBumper');
      } else {
        nextItem = ENV.queueAudioBumperURL;
      }
    } else {
      nextItem = ENV.queueAudioBumperURL;
    }
    return nextItem;
  },
});
