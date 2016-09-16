// XDPlayer is the toplevel global Backbone app that boots Okra.
// Okra is the main Marionette module which provides access to everything
//
// Generally, the idea is to use Okra as our single source of truth for things
// like playlists, sound position, volume, duration, etc.
import Ember from 'ember';
import set from 'ember-metal/set';
import get from 'ember-metal/get';
import computed from 'ember-computed';
import { bind, throttle } from 'ember-runloop';
import rsvp from 'rsvp';
const { Promise, all } = rsvp;

let XDPlayer;

function resolveOkra(resolve) {
  let interval = setInterval(() => {
    if (typeof window.Okra !== 'undefined') {
      clearInterval(interval);
      resolve(window.Okra);
    }
  }, 20);
}

export const Okra = new Promise(resolveOkra);

// XDPlayer and Okra are globals provided by the underlying backbone source,
// but we need to wait until all the deps are loaded before booting it up.
// see services/legacy-loader for dependency list.
export function installBridge() {
  XDPlayer = window.XDPlayer;
  XDPlayer.on('initialize:after', function() {
    Okra.then(o => o.start());
  });
  XDPlayer.start();
}

// Okra.request('audioService') aka WebPlayerController provides useful events
// for a soundObject's life cycle. instead of trying to smooth out all the rough
// edges now, we can use the existing architecture.
//
// From puppy/media/js/lib/marionette/xd_player/web_player_controller.js:
//    A Web Player Controller emits the following events:
//        player:launchingRemoteFile     // Playback of a remote file is about to be attempted.
//        player:launchingStream         // Playback of a stream is about to be attempted.
//        player:loading                 // The Player Model has started to load a resource.
//        player:played                  // The Player Model has begun playback of a sound.
//        player:paused                  // The Player Model has paused playback of a sound.
//        player:progress                // A sound has progressed its playback position.
//        player:buffered                // Some portion of a sound has been buffered.
//        player:finished                // A sound has completed playback.
//        player:soundDestroyed          // A sound has been released from memory by the Player Model.
//        player:switched                // Playback has moved from one piece of audio to another.
//        player:error                   // The Player Model has published an error message.
//        player:error:<ERROR_CONSTANT>  // The Player Model has published an error with a specific constant name.
//
//    The following events are emitted to match APIs with the mobile app's
//    native bridge:
//        audioStatusChanged             // The playback state of The Player Model has changed in some way.
//        audioProgress                  // The audio being played by The Player Model has progressed its playback position.
//
// Note that Okra defines this internally as the `audioService`, but to avoid
// confusing name overlaps we'll refer to it as the WEB_PLAYER_CONTROLLER or
// the playerController in our Ember context.
const WEB_PLAYER_CONTROLLER = new Promise(resolve => {
  Okra.then(o => {
     o.on('initialize:after', function() {
      resolve(o.request('audioService'));
    });
  }).catch((err) => {console.warn(err);});
});

// a lower-level interface to soundManger and the single soundObject instance.
//
// from puppy/media/js/lib/backbone/models/sound_manager_player.js:
//
//    A Player Model that fronts a SoundManager backend to be used in
//    a Marionette app. While this looks very similar to models/player.js,
//    it is used in a totally different way, so certain affordances such as
//    the loadingUpdate handler is not implemented in the same way.
//
//    Plays one audio source at a time.
const PLAYER_MODEL = WEB_PLAYER_CONTROLLER.then(c => c.playerModel);

// the ServiceBridge is mixed into the Ember audio-service to act as a proxy to
// the underlaying Okra functions. Remember the idea is that Okra is our SSOT,
// so we're listening to and setting values on Okra as much as possible
export const OkraBridge = Ember.Object.extend(Ember.Evented, {
  isReady: false,
  isPlaying: false,
  isLoading: false,
  init() {
    all([WEB_PLAYER_CONTROLLER, PLAYER_MODEL]).then(([playerController, playerModel]) => {
      set(this, 'isReady', true);
      this.trigger('ready');

      // web_player_controller wraps the playerModel's backbone `change` events
      // and does some data massaging before publishing to the rest of the app
      playerController.on({
        // progress includes the duration and a normalized time
        'player:progress': m => throttle(this, () => set(this, 'position', m.progress), 1000),
        'audioStatusChanged': bind(this, '_updateIsPlaying'),
        'player:buffered':    bind(this, '_updateBuffered'),
        'player:finished':    get(this, 'onFinished'),
        'player:error':       get(this, 'onError'),
        'flashVersionError':  get(this, 'onFlashError')
      });

      playerModel.on({
        'change:duration':  bind(this, '_updateDuration'),
        'change:sound':     bind(this, '_changeSound')
      });

    });
  },
  teardown() {
    WEB_PLAYER_CONTROLLER.then(playerController => {
      playerController.off({
        'player:finished':    get(this, 'onFinished'),
        'player:error':       get(this, 'onError'),
        'flashVersionError':  get(this, 'flashError')
      });
    });
  },
  playSoundFor(type, pkOrModel) {
    if (type === 'ondemand') {
      Okra.then(o => o.execute('playOnDemand', pkOrModel));
    } else if (type === 'stream') {
      let model = Ember.Object.create(pkOrModel);
      WEB_PLAYER_CONTROLLER.then(player => player.playStream(model));
    } else if (type === 'continuous-player-bumper') {
      let model = Ember.Object.create({
        url: pkOrModel,
        audio: pkOrModel,
        pk: pkOrModel,
        isRemoteFile: true
      });
      WEB_PLAYER_CONTROLLER.then(player => {
        player.playRemoteFile(model);
      });
    }
  },
  pauseSound() {
    PLAYER_MODEL.then(p => p.pause());
  },
  // when the user sets the position, set it directly on the soundObject to trigger
  // the proper listeners
  setPosition(positionMs) {
    let soundObject = get(this, 'soundObject');
    if (soundObject) {
      if (soundObject.isHTML5) {
        // handle this manually on the HTML5 audio element due to issues with soundManager on iOS
        let audio = soundObject._a;
        // See note about max seek position at:
        // https://developer.mozilla.org/en-US/Apps/Fundamentals/Audio_and_video_delivery/buffering_seeking_time_ranges#Creating_our_own_Buffering_Feedback
        let minSeekable = audio.seekable.start(0);
        let maxSeekable = audio.seekable.end(audio.seekable.length - 1);

        // HTMLAudioElement time is in seconds
        let seekPositionSec = positionMs / 1000;
        // clamp position to allowed range
        seekPositionSec = Math.max(seekPositionSec, minSeekable);
        seekPositionSec = Math.min(seekPositionSec, maxSeekable);
        audio.currentTime = seekPositionSec;

        set(this, 'position', audio.currentTime * 1000);
      } else {
        // soundManager handles range overruns (i.e. < 0 or > duration);
        soundObject.setPosition(positionMs);
        // but also update ember immediately so the throttled callback doesn't cause a lag
        set(this, 'position', soundObject.position);
      }
    }
  },
  volume: computed({
    get() {
      return PLAYER_MODEL.then(playerModel => playerModel.get('volume'));
    },
    set(k, v) {
      PLAYER_MODEL.then(playerModel => playerModel.set('volume', v));
      return v;
    }
  }),
  toggleMute() {
    let soundObject = get(this, 'soundObject');
    if (soundObject && soundObject.muted) {
      soundObject.unmute();
      set(this, 'isMuted', false);
    } else {
      soundObject.mute();
      set(this, 'isMuted', true);
    }
  },
  _changeSound(backbone, soundObject) {
    if (soundObject) {
      if (get(this, 'isMuted')) {
        soundObject.mute();
      }
      set(this, 'soundObject', soundObject);
      let html5AudioElement = soundObject._a;
      if (html5AudioElement) {
        // we're in an HTML5 context
        html5AudioElement.onsuspend = function() {
          if (this.paused && this.duration === Infinity) {
            // network is idling, so teardown the sound to reset
            backbone.teardown();
          }
        };
      }
    }
  },
  _updateIsPlaying(code, STATUS_CODES) {
    set(this, 'isLoading', STATUS_CODES[code] === 'MEDIA_LOADING');
    set(this, 'isPlaying', STATUS_CODES[code] === 'MEDIA_RUNNING');

    this.notifyPropertyChange('isPlaying');
    this.notifyPropertyChange('isLoading');
  },
  _updateBuffered(percentBuffered) {
    this._percentLoaded = percentBuffered;
    throttle(this, () => set(this, 'percentLoaded', this._percentLoaded), 100, false);
  },
  _updateDuration(x, duration) {
    this._duration = duration;
    throttle(this, () => set(this, 'duration', this._duration), 500, false);
  }
});
