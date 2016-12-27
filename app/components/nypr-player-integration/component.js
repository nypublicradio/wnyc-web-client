import Ember from 'ember';
import service from 'ember-service/inject';
import computed, { reads, equal, not, or } from 'ember-computed';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { songMetadata } from 'overhaul/helpers/song-metadata';

export default Ember.Component.extend({
  audio:    service(),
  session:  service(),
  store:    service(),
  bumper:   service('bumper-state'),

  currentAudio: reads('audio.currentAudio'),

  currentTitle: computed.or('currentAudio.title', '_currentTitleFromShow'),


  story:          or('currentAudio.currentStory', 'currentAudio'),
  show:           reads('currentAudio.headers.brand'),
  catalogEntry:   reads('currentAudio.currentPlaylistItem.catalogEntry'),

  showTitle:      or('show.title', 'currentAudio.currentShow.showTitle'),
  showUrl:        or('show.url', 'currentAudio.currentShow.showUrl'),
  storyTitle:     or('currentAudio.title', 'currentAudio.currentShow.episodeTitle'),
  storyUrl:       or('currentAudio.url', 'currentAudio.currentShow.episodeUrl'),
  songDetails:    computed('catalogEntry', function() {
    // return songMetadata(get(this, 'catalogEntry'));
  }),


  playingAudioType: 'ondemand', //bumper, stream, ondemand

  queueLength: 0,

  showQueue: false,

  _currentTitleFromShow: computed('currentAudio', function() {
    return `${this.get('currentAudio.currentShow.showTitle')} on ${this.get('currentAudio.name')}`;
  }),

  actions: {
    onDismissNotification() {
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
