import Ember from 'ember';

export default Ember.Component.extend({
  session:  Ember.inject.service(),
  queue:    Ember.inject.service('discover-queue'),
  scroller: Ember.inject.service(),

  classNames:   ['discover-playlist-container'],
  classNameBindings: ['collapsedHeader:mod-collapsed-header'],
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
    return !!this.get('orderedStories').findBy('cmsPK', this.get('currentAudioId'));
  }),

  currentPlaylistStoryPk:   Ember.computed('currentTrackIsInPlaylist', function() {
    if (this.get('currentTrackIsInPlaylist')) {
      return this.get('currentAudioId');
    }
  }),

  actions: {
    scrollPointReached(direction) {
      this.set('collapsedHeader', direction === 'down');
    },
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

    findMore() {
      this.sendAction('onFindMore');
    },

    toggle() {
      let storyPk = this.get('currentPlaylistStoryPk');

      if (this.get('isPlaying')) {
        this.send('pauseTrack');
      }
      else if (storyPk) {
        this.send('playTrack', storyPk);
      }
      else {
        let story = this.get('orderedStories').get('firstObject');
        this.send('playTrack', story.cmsPK);
        this.get('scroller').scrollVertical(Ember.$(`#story-${story.cmsPK}`), {offset: -100, duration: 500});
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
