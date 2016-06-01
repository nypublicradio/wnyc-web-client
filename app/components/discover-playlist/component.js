import Ember from 'ember';

export default Ember.Component.extend({
  classNames:   ['discover-playlist-container'],
  orderedStories: Ember.computed.or('customSortedStories', 'stories'),

  audio:         Ember.inject.service(),
  region:        'UnknownRegion',

  // Computed properties from a service. These are a little hinky
  audioReady:    Ember.computed('audio', 'audio.isReady', function() {
    if (this.get('audio')) {
      return this.get('audio.isReady');
    }
  }),
  currentAudioId: Ember.computed('audio', 'audio.currentAudio', 'audio.currentAudio.id', function() {
    if (this.get('audio') && this.get('audio.currentAudio')) {
      return this.get('audio.currentAudio.id');
    }
  }),

  isPlaying:     Ember.computed.and('audioReady', 'currentTrackIsInPlaylist', 'audio.isPlaying'),

  currentTrackIsInPlaylist: Ember.computed('orderedStories', 'currentAudioId', function() {
    return this.get('orderedStories').findBy('id', this.get('currentAudioId'));
  }),

  currentPlaylistStoryId: Ember.computed('currentTrackIsInPlaylist', 'currentAudioId', function() {
    if (this.get('currentTrackIsInPlaylist')) {
      return this.get('currentAudioId');
    }
  }),

  actions: {
    reorderItems(itemModels, draggedModel) {
      this.set('customSortedStories', itemModels);
      this.set('justDragged', draggedModel);
    },
    toggle() {
      // todo: setup and play playlist
    },
    pauseTrack(/* storyId */) {
      this.get('audio').pause(this.get('region'));
    },
    playTrack(storyId) {
      // Why does this require a button id? Seems like it knows too much
      this.get('audio').playOnDemand(storyId, null, this.get('region'));
    }
  }
});
