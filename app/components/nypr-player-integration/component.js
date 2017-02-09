import Ember from 'ember';
import service from 'ember-service/inject';
import computed, { reads, or, and, not, equal } from 'ember-computed';
import get from 'ember-metal/get';
import { songMetadata } from 'wnyc-web-client/helpers/song-metadata';

/* A conglomeration of logic that was baked into the persistent player,
isolated and removed to this component. This component basically translates
our audio logic into dumb arguments for the player to display */

export default Ember.Component.extend({
  audio                : service(),
  session              : service(),

  /* To determine whether or not to reveal the notification bar. The messaging
    is handled by the autoplay-message component */
  bumper               : service('bumper-state'),
  revealNotificationBar: and('didNotDismiss', 'bumper.revealNotificationBar'),
  didDimiss            : false,
  didNotDismiss        : not('didDismiss'),

  currentAudio         : reads('audio.currentAudio'),
  currentTitle         : or('currentAudio.title', '_currentTitleFromShow'),
  _currentTitleFromShow: computed('currentAudio', function() {
    return `${this.get('currentAudio.currentShow.showTitle')} on ${this.get('currentAudio.name')}`;
  }),

  story                : or('currentAudio.currentStory', 'currentAudio'),
  storyTitle           : or('currentAudio.title', 'currentAudio.currentShow.episodeTitle'),
  storyUrl             : or('currentAudio.url', 'currentAudio.currentShow.episodeUrl'),

  show                 : reads('currentAudio.headers.brand'),
  showTitle            : or('show.title', 'currentAudio.currentShow.showTitle'),
  showUrl              : or('show.url', 'currentAudio.currentShow.showUrl'),

  catalogEntry         : reads('currentAudio.currentPlaylistItem.catalogEntry'),
  songDetails          : computed('catalogEntry', function() {
    if (this.get('catalogEntry')) {
      return songMetadata([get(this, 'catalogEntry')]);
    }
  }),

  isStream             : equal('currentAudio.audioType', 'stream'),
  streamName           : reads('currentAudio.name'),
  streamScheduleUrl    : reads('currentAudio.scheduleUrl'),
  streamPlaylistUrl    : computed('currentAudio.playlistUrl', function() {
    if (get(this,'currentAudio.playlistUrl')) {
      return `/streams/${get(this, 'currentAudio.id')}`;
    }
  }),

  image                : reads('currentAudio.imageMain.url'),
  fallbackImage        : reads('currentAudio.headers.brand.logoImage.url'),
  defaultImageUrl      : '/assets/img/bg/player-background.png',
  backdropImageUrl     : or('image', 'fallbackImage', 'defaultImageUrl'),

  playingAudioType     : 'ondemand', //bumper, stream, ondemand

  queueLength          : 0,
  showQueue            : false,

  actions: {
    onDismissNotification() {
      this.set('didDismiss', true);
      get(this, 'audio')._trackPlayerEvent({
        action: 'Continuous Play Notification',
        label: 'Click to Close Notification'
      });
    },
    onPlay() {

    },
    onPause() {

    }
  }
});
