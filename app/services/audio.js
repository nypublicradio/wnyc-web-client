import Service from 'ember-service';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import computed, { readOnly, alias, or } from 'ember-computed';
import { bind } from 'ember-runloop';
import { assign } from 'ember-platform';
import RSVP from 'rsvp';
import { classify as upperCamelize } from 'ember-string';
import Ember from 'ember';

const FIFTEEN_SECONDS = 1000 * 15;
const TWO_MINUTES     = 1000 * 60 * 2;
const PLATFORM        = 'NYPR_Web';

export default Service.extend({
  poll:             service(),
  metrics:          service(),
  store:            service(),
  session:          service(),
  discoverQueue:    service(),
  bumperState:      service(),
  listens:          service('listen-history'),
  queue:            service('listen-queue'),
  listenActions:    service(),

  hifi:             service(),
  isReady:          readOnly('hifi.isReady'),
  isPlaying:        readOnly('hifi.isPlaying'),
  isLoading:        readOnly('hifi.isLoading'),
  isMuted:          readOnly('hifi.isMuted'),
  duration:         readOnly('hifi.duration'),
  percentLoaded:    readOnly('hifi.percentLoaded'),
  position:         alias('hifi.position'),
  volume:           alias('hifi.volume'),

  // TODO: fix up currentStory/currentAudio interfaces for streams and on demands
  currentStory:     or('currentAudio.story', 'currentAudio'),

  bumperPlayed:     false,
  currentAudio:     null,
  currentContext:   null,
  sessionPing:      TWO_MINUTES,

  currentId: computed('currentAudio.id', {
    get() {
      return get(this, 'currentAudio.id');
    },
    set(k, v) { return v; }
  }),
  playState: computed('isPlaying', 'isLoading', function() {
    if (get(this, 'isLoading')) {
      return 'is-loading';
    } else if (get(this, 'isPlaying')) {
      return 'is-playing';
    } else {
      return 'is-paused';
    }
  }),

  /* TRACK LOGIC --------------------------------------------------------------*/

  init() {
    this.get('hifi').on('audio-ended', () => this.finishedTrack());
    this._super(...arguments);
  },

  play(pk, playContext) {
    // TODO: might be better to switch the arg order for better api design
    // i.e. there will always be a context, but there might not always be a pk
    let id = pk || get(this, 'currentAudio.id');
    let context = playContext || get(this, 'currentContext') || '';

    if (!id) {
      return;
    }

    if (/^\d*$/.test(id)) {
      return this.playFromPk(id, context);
    } else if (/^http|^https/.test(id)) {
      return this.playBumper(id, context);
    } else {
      return this.playStream(id, context);
    }
  },

  pause() {
    let context = get(this, 'currentContext') || '';
    this.get('hifi').pause();

    this._trackPlayerEvent({
      action: 'Pause',
      withRegion: true,
      region: upperCamelize(context),
      withAnalytics: true
    });

    if (get(this, 'currentAudio.audioType') === 'stream') {
      this._trackPlayerEventForNpr({
        category: 'Engagement',
        action: 'Stream_Pause',
        label: `Streaming_${get(this, 'currentAudio.name')}`
      });
    } else {
      this._trackPlayerEventForNpr({
        category: 'Engagement',
        action: 'On_demand_audio_pause',
        label: get(this, 'currentAudio.audio')
      });
    }

    if (get(this, 'currentAudio.audioType') !== 'stream') {
      // we're not set up to handle pause listen actions from streams atm
      this.sendPauseListenAction(this.get('currentId'));
    }
  },

  playFromPk(id, context) {
    this._firstTimePlay();

    let newStoryPlaying = true;
    let oldContext = get(this, 'currentContext');

    // if the id is the same, this could be a "resume" or it could the next 
    // segment in a piece of segmented audio
    if (get(this, 'currentId') === id) {
      newStoryPlaying = false;
    }

    set(this, 'currentId', id);

    let story;
    let urlPromise = get(this, 'store').findRecord('story', id).then(s => {
      story = s;
      // resetSegments & getCurrentSegment return the audio value if the 
      // audio is not segmented
      return newStoryPlaying ? s.resetSegments() : s.getCurrentSegment();
    });

    return this.get('hifi').play(urlPromise).then(({sound, failures}) => {
      set(this, 'hasErrors', false);
      // independent of context, if this item is already the first item in your
      // listening history, don't bother adding it again
      if (get(this, 'listens').indexByStoryPk(id) !== 0) {
        this.addToHistory(story);
      }

      if (context === 'queue') {
        this.removeFromQueue(id);
        // if starting the queue with an item already playing from another context,
        // replay from the start
        if (oldContext !== 'queue' && get(this, 'currentAudio.id') === id) {
          this.setPosition(0);
        }
      } else if (context ==='history') {
        if (get(this, 'isPlaying') && get(this, 'currentAudio.id') === id) {
          this.setPosition(0);
        }
      } else if (this._isCurrentSegment(sound)) {
        // the played audio is the same as the currently playing audio, so just
        // start it over. this is likely a segment played directly which was
        // playing as part of a concatenated episode
        this.setPosition(0);
      }

      set(this, 'currentAudio', story);
      set(this, 'currentContext', context);

      if (newStoryPlaying) {
        this._trackPlayerEvent({
          action: `Played Story "${story.get('title')}"`,
          withRegion: true,
          region: upperCamelize(context),
          withAnalytics: true,
          story
        });
        this._trackPlayerEventForNpr({
          category: 'Engagement',
          action: 'On_demand_audio_play',
          label: get(story, 'audio')
        });
        this.sendPlayListenAction(id);

        if (context === 'queue' || context === 'history') {
          this._trackPlayerEvent({
            action: 'Played Story from Queue',
            label: story.get('title'),
            story
          });
        }
      }
      if (failures && failures.length) {
        failures.forEach(failed => this._trackCodecFailure(failed, sound));
      }
      return {sound, failures};
    })
    .catch(e => this._trackSoundFailure(e));
  },

  playStream(slug, context = '') {
    this._firstTimePlay();

    let shouldTrack = true;

    // if the passed in ID matches what's playing, don't fire another
    // event
    if (get(this, 'currentId') === slug) {
      shouldTrack = false;
    }

    // TODO: why setting currentId instead of relying on the computed?
    set(this, 'currentId', slug);

    let stream;
    let urlPromise = get(this, 'store').findRecord('stream', slug).then(s => {
      stream = s;
      return s.get('urls');
    });

    return this.get('hifi').play(urlPromise).then(({sound, failures}) => {
      set(this, 'hasErrors', false);
      let wasStream = get(this, 'currentAudio.audioType') === 'stream';
      let oldStream = get(this, 'currentAudio.name');
      let newStream = get(stream, 'name');

      set(this, 'currentAudio', stream);
      set(this, 'currentContext', context);

      if (shouldTrack) {
        let label = newStream;
        if (context === 'nav') {
          label += '|Navigation';
        }
        this._trackPlayerEvent({
          action: 'Launched Stream',
          label,
        });

        this._trackPlayerEventForNpr({
          category: 'Engagement',
          action: 'Stream_Play',
          label: `Streaming_${newStream}`
        });

        RSVP.Promise.resolve(get(stream, 'story')).then(story => {
          if (story) {
            this._trackPlayerEvent({
              action: `Streamed Story "${get(story, 'title')}" on "${get(stream, 'name')}"`,
              withAnalytics: true,
              story
            });
          }
        });

        if (wasStream) {
          this._trackPlayerEvent({
            action: 'Switched Stream to Stream',
            label: `from ${oldStream} to ${newStream}`
          });

          this._trackPlayerEventForNpr({
            category: 'Engagement',
            action: 'Stream_Change',
            label: `Streaming_${newStream}`
          });
        }
      }
      if (failures && failures.length) {
        failures.forEach(failed => this._trackCodecFailure(failed, sound));
      }
      return {sound, failures};
    })
    .catch(e => this._trackSoundFailure(e));
  },

  playBumper(url, bumperContext) {
    this.setProperties({
      currentContext: bumperContext,
      currentAudio: Ember.Object.create({
        audioType: 'bumper'
      })
    });
    return this.get('hifi').play(url);
  },

  setPosition(percentage) {
    let position = (percentage * get(this, 'duration')) || 0;

    set(this, 'position', position);
  },

  rewind() {
    let currentPosition = get(this, 'position');
    set(this, 'position', currentPosition - FIFTEEN_SECONDS);

    this._trackPlayerEvent({
      action: 'Skip Fifteen Seconds Back',
      withAnalytics: true
    });
  },

  fastForward() {
    let currentPosition = get(this, 'position');
    set(this, 'position', currentPosition + FIFTEEN_SECONDS);

    this._trackPlayerEvent({
      action: 'Skip Fifteen Seconds Ahead',
      withAnalytics: true
    });
  },

  toggleMute() {
    get(this, 'hifi').toggleMute();
  },


  /* QUEUEING LOGIC -----------------------------------------------------------*/

  addToQueue(id, region) {
    get(this, 'queue').addToQueueById(id)
    .then(story => {
      this._trackPlayerEvent({
        action: 'Add Story to Queue',
        withRegion: true,
        region,
        withAnalytics: true,
        story
      });
    });
  },

  removeFromQueue(id) {
    get(this, 'queue').removeFromQueueById(id);
  },

  resetQueue(newQueue) {
    get(this, 'queue').reset(newQueue);
  },

  playNextInQueue() {
    let queue = get(this, 'queue');
    let nextUp = queue.nextItem();

    if (nextUp) {
      this.play(nextUp.get('id'), 'queue');
      return true;
    } else {
      return this._flushContext();
    }
  },

  /* EVENTS AND HELPERS -------------------------------------------------------*/

  finishedTrack() {
    let context = get(this, 'currentContext') || '';
    let bumper = get(this, 'bumperState');
    let currentId = get(this, 'currentId');
    let currentStory = get(this, 'currentStory');

    // finishedTrack fires when continuous play bumper ends
    if (currentStory && currentStory.hasNextSegment()) {
      return this.playNextSegment();
    } else if (currentStory) {
      // only track if this is the last segment or a valid story
      this._trackPlayerEvent({
        action: 'Finished Story',
        withRegion: true,
        region: upperCamelize(context),
        withAnalytics: true,
      });

      this.sendCompleteListenAction(currentId);
    }
    
    let willContinuePlaying = true;
    if (context === 'queue') {
      willContinuePlaying = this.playNextInQueue();
    } else if (context === 'discover') {
      willContinuePlaying = this.playDiscoverQueue();
    } else {
      willContinuePlaying = this._flushContext();
    }

    if (get(bumper, 'isEnabled') && !willContinuePlaying) {
      set(this, 'bumperPlayed', true);
      let next = bumper.getNext(context);
      this.play(...next);
    }
  },

  _flushContext() {
    return set(this, 'currentContext', null);
  },

  playDiscoverQueue() {
    let nextTrack = this.get('discoverQueue').nextItem(this.get('currentId'));
    if (nextTrack) {
      this.play(get(nextTrack, 'id'), 'discover');
      return true;
    } else {
      return this._flushContext();
    }
  },
  
  playNextSegment() {
    let story = get(this, 'currentStory');
    let nextSegment = story.getNextSegment();
    if (nextSegment) {
      return this.get('hifi').play(nextSegment, {position: 0})
      .then(({sound, failures}) => {
        if (failures && failures.length) {
          failures.forEach(failed => this._trackCodecFailure(failed, sound));
        }
        return {sound, failures};
      })
      .catch(e => this._trackSoundFailure(e));
    } else {
      return false;
    }
  },

  addToHistory(story) {
    this.get('listens').addListen(story);
  },

  sendCompleteListenAction(pk) {
    this.get('listenActions').sendComplete(pk, PLATFORM);
  },

  sendPlayListenAction(pk) {
    this.get('listenActions').sendPlay(pk, PLATFORM);
  },

  sendPauseListenAction(pk) {
    this.get('listenActions').sendPause(pk, PLATFORM, get(this, 'position'));
  },

  _trackPlayerEvent(options) {
    let metrics        = get(this, 'metrics');
    let {action, label, withRegion, region, withAnalytics} = options;
    let analyticsCode  = '';
    let story          = options.story || get(this, 'currentAudio');
    let category       = options.category || 'Persistent Player';

    // Ignore event if it's missing a region but should have one.
    // Assume it was fired from player internals and shouldn't be logged.
    if (withRegion && !region) { return; }
    region = withRegion ? region + ':' : '';
    if (withAnalytics) {
      analyticsCode = get(story, 'analyticsCode');
    }
    if (withRegion || withAnalytics) {
      label = `${region}${analyticsCode}`;
    }
    metrics.trackEvent({category, action, label, model: story});
  },

  _trackPlayerEventForNpr(options) {
    let metrics = get(this, 'metrics');
    metrics.trackEvent('NprAnalytics', assign(options, {isNpr: true}));
  },

  _trackCodecFailure({connectionName, error, url}, sound) {
    this._trackPlayerEvent({
      action: `Codec Failure | ${connectionName}`,
      label: `reason: ${error} | bad url: ${url} | ${sound ? `good url: ${get(sound, 'url')}` : 'no successful url'}`
    });
  },

  _trackSoundFailure({message, failures}) {
    this.set('hasErrors', true);
    this._trackPlayerEvent({
      action: 'Sound Error',
      label: message
    });
    if (failures && failures.length) {
      failures.forEach(failed => this._trackCodecFailure(failed));
    }
  },

  _isCurrentSegment(sound) {
    let oldStory = get(this, 'currentAudio');
    if (!oldStory) {
      return false;
    }
    let isOnDemand = oldStory.get('audioType') !== 'stream';
    let isSegmented = get(oldStory, 'segmentedAudio');
    // put `getCurrentSegment` behind the and gates b/c sometimes oldStory is a stream model, which doesn't have `getCurrentSegment`
    if (isOnDemand && isSegmented && oldStory.getCurrentSegment() === sound.get('url')) {
      return true;
    } else {
      return false;
    }
  },

  _firstTimePlay() {
    if (get(this, 'playedOnce')) {
      // already setup
      return;
    }

    set(this, 'playedOnce', true); // opens the player
    get(this, 'poll').addPoll({
      interval: get(this, 'sessionPing'),
      callback: bind(this, this._trackPing),
      label: 'playerPing'
    });
  },

  _trackPing() {
    get(this, 'metrics').trackEvent('GoogleAnalytics', {
      category: 'Persistent Player',
      action: '2 Minute Ping',
      value: get(this, 'isPlaying') ? 1 : 0
    });
  }
});
