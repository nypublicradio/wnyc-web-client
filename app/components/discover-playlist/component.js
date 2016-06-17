import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service(),
  queue:   Ember.inject.service('discover-queue'),

  classNames:   ['discover-playlist-container'],
  orderedStories: Ember.computed.or('customSortedStories', 'stories'),

  audio:          Ember.inject.service(),

  // Computed properties from a service. These are a little hinky
  audioReady:     Ember.computed.alias('audio.isReady'),
  currentAudioId: Ember.computed.alias('audio.currentAudio.id'),

  isPlaying:      Ember.computed.and('audioReady', 'currentTrackIsInPlaylist', 'audio.isPlaying'),

  isPaused:      Ember.computed('currentTrackIsInPlaylist', 'isPlaying', function() {
    return this.get('currentTrackIsInPlaylist') && !this.get('isPlaying');
  }),

  isNotStarted:  Ember.computed('isPlaying', 'isPaused', function() {
    return !this.get('isPlaying') && !this.get('isPaused');
  }),

  currentTrackIsInPlaylist: Ember.computed('orderedStories', 'currentAudioId', function() {
    return !!this.get('orderedStories').findBy('id', this.get('currentAudioId'));
  }),

  currentPlaylistStoryId:   Ember.computed('currentTrackIsInPlaylist', 'currentAudioId', function() {
    if (this.get('currentTrackIsInPlaylist')) {
      return this.get('currentAudioId');
    }
  }),

  actions: {
    reorderItems(itemModels, draggedModel) {
      this.set('customSortedStories', itemModels);
      this.set('justDragged', draggedModel);

      this.get('queue').updateQueue(itemModels);
      this.sendAction('onUpdateItems', itemModels);
    },

    removeItem(item) {
      this.get('queue').removeItem(item);
      this.get('orderedStories').removeObject(item);
      this.sendAction('onRemoveItem', item);
    },

    toggle() {
      let storyId = this.get('currentPlaylistStoryId');

      if (this.get('isPlaying')) {
        this.send('pauseTrack');
      }
      else if (storyId) {
        this.send('playTrack', storyId);
      }
      else {
        let story = this.get('orderedStories').get('firstObject');
        this.send('playTrack', story.id);
      }
    },

    pauseTrack(/* storyId */) {
      this.get('audio').pause();
    },

    playTrack(pk) {
      this.get('audio').play(pk, 'discover');
    }
  }
});
