/*global Okra, XDPlayer*/
import Ember from 'ember';
import config from 'overhaul/config/environment';
const {
  Mixin,
  set,
  get,
  observer
} = Ember;
const { Promise, all } = Ember.RSVP;
const { bind, throttle } = Ember.run;

// XDPlayer and Okra are globals provided by the underlying backbone source,
// but we need to wait until all the deps are loaded before booting it up.
// see services/legacy-loader for dependency list.
export function installBridge() {
  XDPlayer.on('initialize:after', function() {
    Okra.start();
  });
  XDPlayer.start();
}

// the audio service provides useful events for a soundObject's life cycle.
// instead of trying to smooth out all the rough edges now, we can use the existing
// architecture.
// from puppy/media/js/lib/marionette/xd_player/web_player_controller.js:
// A Web Player Controller emits the following events:
//     player:launchingRemoteFile     // Playback of a remote file is about to be attempted.
//     player:launchingStream         // Playback of a stream is about to be attempted.
//     player:loading                 // The Player Model has started to load a resource.
//     player:played                  // The Player Model has begun playback of a sound.
//     player:paused                  // The Player Model has paused playback of a sound.
//     player:progress                // A sound has progressed its playback position.
//     player:buffered                // Some portion of a sound has been buffered.
//     player:finished                // A sound has completed playback.
//     player:soundDestroyed          // A sound has been released from memory by the Player Model.
//     player:switched                // Playback has moved from one piece of audio to another.
//     player:error                   // The Player Model has published an error message.
//     player:error:<ERROR_CONSTANT>  // The Player Model has published an error with a specific constant name.
//
// The following events are emitted to match APIs with the mobile app's
// native bridge:
//     audioStatusChanged             // The playback state of The Player Model has changed in some way.
//     audioProgress                  // The audio being played by The Player Model has progressed its playback position.
//
// Note that Okra defines this internally as the `audioService`, but to avoid
// confusing naming overlaps we'll refer to it as the WEB_PLAYER_CONTROLLER or
// the playerController in our Ember context.
const WEB_PLAYER_CONTROLLER = new Promise(resolve => {
  if (config.featureFlags['persistent-player']) {
    let interval = setInterval(() => {
      if (typeof Okra !== 'undefined') {
        clearInterval(interval);
        Okra.on('initialize:after', function() {
          resolve(Okra.request('audioService'));
        });
      }
    }, 20);
  }
});

// a lower-level interface to the soundManger soundObject instance.
// from puppy/media/js/lib/backbone/models/sound_manager_player.js
//
// A Player Model that fronts a SoundManager backend to be used in//{//}
// a Marionette app. While this looks very similar to models/player.js,
// it is used in a totally different way, so certain affordances such as
// the loadingUpdate handler is not implemented in the same way.
//
// Plays one audio source at a time.
const PLAYER_MODEL = WEB_PLAYER_CONTROLLER.then(c => c.playerModel);

// the ServiceBridge is mixed into the audio-service to notify when the backbone
// dependencies are loaded.
export const ServiceBridge = Mixin.create({
  playerController: WEB_PLAYER_CONTROLLER.then(c => c),
  playerModel: PLAYER_MODEL.then(m => m),
  isReady: false,
  init() {
    this._super(...arguments);
    all([get(this, 'playerController'), get(this, 'playerModel')]).then(() => set(this, 'isReady', true));
  },
});

// the ModelBridge is mixed into the ondemand and stream models to provide a
// simplifed interface to the required listeners, methods, and properties.
// any interaction or data around the audio object itself should proxy to here
// from other parts of the app usually through the audio services `currentAudio`
// property, but also potentially via the queue property.
//
// certain properties need to be explicitly listened to via backbone KVOs. some
// are found on the playerModel directly and some are found on the playerController.
// the `setup` methods can init any listenrs required to update the ember-data model.
export const ModelBridge = Mixin.create({
  playerController: WEB_PLAYER_CONTROLLER,
  playerModel: PLAYER_MODEL,
  ready() {
    get(this, 'playerController').then(bind(this, this.setupPlayerController));
    get(this, 'playerModel').then(bind(this, this.setupPlayerModel));
  },
  setupPlayerController(playerController) {
    playerController.on('player:progress', m => throttle(this, () => set(this, 'position', m.progress), 1000));
  },
  setupPlayerModel(playerModel) {
    playerModel.on('change:isPlaying', (x, val) => set(this, 'isPlaying', val));
    playerModel.on('change:duration', (x, d) => set(this, 'duration', d));
  },
  addToPlaylist(pkOrUrl, title) {
    if (/^\d+/.test(pkOrUrl)) {
      Okra.execute('addToPlaylistFromPK', pkOrUrl);
    } else {
      Okra.execute('addToPlaylistFromFile', pkOrUrl, title);
    }
  },
  play() {
    PLAYER_MODEL.then(p => p.play());
  },
  pause() {
    PLAYER_MODEL.then(p => p.pause());
  },
  updateVolume: observer('volume', function() {
    PLAYER_MODEL.then(p => {
      let volume = get(this, 'volume');
      p.set('volume', volume);
    });
  }),
});

// the ApiBridge is imported into the ondemand and streaming adaptesr to provide
// direct access to some underlying Okra methods which just make fetching audio
// a smoother experience for now.
export const ApiBridge = {
  playerController: WEB_PLAYER_CONTROLLER.then(c => c),
  playerModel: PLAYER_MODEL.then(m => m),
  playOnDemand(pkOrUrl, title) {
    if (/^\d+/.test(pkOrUrl)) {
      Okra.execute('playOnDemand', pkOrUrl);
    } else {
      Okra.execute('playOnDemandFile', pkOrUrl, title);
    }
  },

  playStream(slug) {
    Okra.Streams.controller.playStream(slug);
  },


};
