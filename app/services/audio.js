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

const ERRORS = {
  SOUNDMANAGER_FAILED_CREATE_SOUND: 'SoundManager failed when attempting to create a sound.',
  SOUNDMANAGER_TIMEOUT: 'SoundManager failed to initialize before timing out.',
  SOUND_NOT_LOADED: 'There is no sound currently loaded in the player.',
  SOUND_FAILED_TO_LOAD: 'The current sound failed to load.',
  DELEGATE_NOT_PROVIDED: 'A delegate to handle the current file format was not provided.',
  SUITABLE_DELEGATE_NOT_FOUND: 'A suitable delegate for the provided audio was not found.',
  FLASH_FAILURE: 'There was a failure issued from flash.'
};

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
  
  /* TODO: make the low-level interface available
  -----------------------------------------------------------*/
   
  /* TODO: low-level interface needs to expose these props
   
  isReady:
  position: needs a setter
  duration:
  percentLoaded:
  isMuted:
  volume: needs a setter
  isPlaying:
  isLoading: needs a setter
  ------------------------------------------------------------*/
  
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

    /* TODO: send a pause signal to the low-level interface
    --------------------------------------------------------------*/
    
    let context = get(this, 'currentContext') || '';

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

    let shouldTrack = true;
    let oldContext = get(this, 'currentContext');

    // Don't set to loading if already playing the item,
    // because we won't get a loaded event.
    if (get(this, 'currentId') !== id) {
      set(this, 'isLoading', true);
    } else {
      // if the passed in ID matches what's playing, don't fire another
      // event
      shouldTrack = false;
    }

    set(this, 'currentId', id);

    get(this, 'store').findRecord('story', id).then(story => {
      set(this, 'hasErrors', false);

    /* TODO: send a play signal to the low-level interface
        you'll probaby wantto do it in this promise call back since 
        the `audio` attr on the retrieved `story` instance is a URL
        to the audio file.
    --------------------------------------------------------------*/

    /* TODO: send a play signal to the low-level interface
        you'll probaby wantto do it in this promise call back since 
        the `audio` attr on the retrieved `story` instance is a URL
        to the audio file.
    --------------------------------------------------------------*/

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
          
          /* TODO: send a `restart` or `set position to 0` signal to the low-level interface
          --------------------------------------------------------------------*/
          
        }
      } else if (context ==='history') {
        if (get(this, 'isPlaying') && get(this, 'currentAudio.id') === id) {
          
          /* TODO: send a `restart` or `set position to 0` signal to the low-level interface
          --------------------------------------------------------------------*/
          
        }
      }

      set(this, 'currentAudio', story);
      set(this, 'currentContext', context);

      if (shouldTrack) {
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
    })
    .catch(() => this.set('hasErrors', true));
  },
  playStream(slug, context = '') {
    this._firstTimePlay();

    let shouldTrack = true;

    // Don't set to loading if already playing the item,
    // because we won't get a loaded event.
    if (get(this, 'currentId') !== slug) {
      set(this, 'isLoading', true);
    } else {
      // if the passed in ID matches what's playing, don't fire another
      // event
      shouldTrack = false;
    }

    // TODO: why setting currentId instead of relying on the computed?
    set(this, 'currentId', slug);

    get(this, 'store').findRecord('stream', slug).then(stream => {
      set(this, 'hasErrors', false);
      let wasStream = get(this, 'currentAudio.audioType') === 'stream';
      let oldStream = get(this, 'currentAudio.name');
      let newStream = get(stream, 'name');

      set(this, 'currentAudio', stream);
      set(this, 'currentContext', context);

    /* TODO: send a play signal to the low-level interface for the given stream
    --------------------------------------------------------------*/

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
    })
    .catch(() => this.set('hasErrors', true));
  },

  playBumper(url, bumperContext) {
    this.setProperties({
      currentContext: bumperContext,
      currentAudio: Ember.Object.create({
        audioType: 'bumper'
      })
    });
    this.okraBridge.playSoundFor(bumperContext, url);
  },

  setPosition(percentage) {
    let position = percentage * get(this, 'duration');
    
    /* TODO: send a `set position` signal to the low-level interface for the given position
    ------------------------------------------------------------------------*/
    
  },

  rewind() {
    let currentPosition = get(this, 'position');
    
    /* TODO: send a `set position` signal to the low-level interface for the CURRENT position MINUS FIFTEEN SECONDS
    ------------------------------------------------------------------------*/

    this._trackPlayerEvent({
      action: 'Skip Fifteen Seconds Back',
      withAnalytics: true
    });
  },

  fastForward() {
    let currentPosition = get(this, 'position');
    
    /* TODO: send a `set position` signal to the low-level interface for the CURRENT position PLUS FIFTEEN SECONDS
    ------------------------------------------------------------------------*/

    this._trackPlayerEvent({
      action: 'Skip Fifteen Seconds Ahead',
      withAnalytics: true
    });
  },

  toggleMute() {
    
    /* TODO: send a `toggleMute` signal to the low-level interface
    -------------------------------------------------------------------------*/
    
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
    } else {
      this._flushContext();
    }
  },

  /* EVENTS AND HELPERS -------------------------------------------------------*/

  /* TODO: register this callback to an `audioFinished` event on the low-level interface
  ----------------------------------------------------------------------*/
  finishedTrack() {
    let context = get(this, 'currentContext') || '';
    let bumper = get(this, 'bumperState');
    let discoverQueue = get(this, 'discoverQueue');
    let currentId = get(this, 'currentId');

    this._trackPlayerEvent({
      action: 'Finished Story',
      withRegion: true,
      region: upperCamelize(context),
      withAnalytics: true,
    });

    this.sendCompleteListenAction(currentId);

    if (context === 'queue') {
      this.playNextInQueue();
    } else if (context === 'discover') {
      this.playDiscoverQueue();
    } else if (context === 'home-page' || context === 'continuous-play-bumper') {
      this._flushContext();
    }

    if (context === 'discover' && discoverQueue.nextTrack(currentId)) {
      // Once discover becomes a selectable choice for audio preferences
      // then this can get moved into the bumper-state service.
      return;
    }

    if (get(bumper, 'isEnabled')) {
      set(this, 'bumperPlayed', true);
      let next = bumper.getNext(context);
      this.play(...next);
    }
  },

  _flushContext() {
    set(this, 'currentContext', null);
  },

  playDiscoverQueue() {
    let nextTrack = this.get('discoverQueue').nextItem(this.get('currentId'));
    if (nextTrack) {
      this.play(get(nextTrack, 'id'), 'discover');
    } else {
      this._flushContext();
    }
  },

  errorEvent(model, errorCode, errorName, errorMessage, ...rest) {
    let label;
    if (errorMessage === ERRORS.SOUNDMANAGER_TIMEOUT) {
      let status = rest[0];
      label = `timeout | success: ${status.success} | error: ${status.error.type}`;
    } else if (errorMessage === ERRORS.SOUNDMANAGER_FAILED_CREATE_SOUND) {
      let ops = rest[0];
      label = `failed to load ${ops.url || ops.serverURL}`;
    } else if (errorMessage === ERRORS.FLASH_FAILURE) {
      let [ message, level, code ] = rest;
      label = `flash failure | message: ${message} | level: ${level} | code: ${code}`;
    } else {
      let currentItem = rest[0];
      let piece = currentItem && currentItem.piece || {};
      let attributes = piece.attributes || {};
      let { audio, title } = attributes;
      let { id } = piece;
      label = `audio: ${audio} | pk: ${id} | title: ${title} | error: ${errorMessage}`;
    }
    this._trackPlayerEvent({
      action: 'Sound Error',
      label
    });
  },

  flashError(flashVersion) {
    this._trackPlayerEvent({
      action: 'Sound Error',
      label: `Flash error with version ${flashVersion}`
    });
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
