import Ember from 'ember';
import get from 'ember-metal/get';
import service from 'ember-service/inject';

export default Ember.Component.extend({
  session:  service(),
  scroller: service(),
  audio:    service(),
  metrics:  service(),

  classNames:        ['discover-playlist-container'],
  classNameBindings: ['isDraggingItem:is-dragging-item'],

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

  currentTrackIsInPlaylist: Ember.computed('stories', 'currentAudioId', function() {
    return !!this.get('stories').findBy('id', this.get('currentAudioId'));
  }),

  currentPlaylistStoryPk:   Ember.computed('currentTrackIsInPlaylist', function() {
    if (this.get('currentTrackIsInPlaylist')) {
      return this.get('currentAudioId');
    }
  }),

  stillVisibleStories: Ember.computed.setDiff('stories', 'removedItems'),
  visibleCount: Ember.computed.alias('stillVisibleStories.length'),
  refreshAutomaticallyIfZero: Ember.observer('visibleCount', function() {
    if (this.get('itemCount') === 0) {
      this.findMore();
    }
  }),

  removedItemIds: Ember.computed.map('removedItems', (i) => i.id),

  // This is for the delete effects, and this might be a weird way to do it
  // but by not actually deleting the item from the list we can avoid having to
  // set magic number timeouts

  removedItems: [],
  actions: {
    removeItem(item) {
      get(this, 'metrics').trackEvent({
        category: 'Discover',
        action: 'Removed Story from Discover',
        value: Number(get(item, 'id'))
      });

      // This will trigger the CSS effect to remove it/hide it from the list
      this.get('removedItems').addObject(item);

      // this will fire the listen action and delete it from the queue
      this.sendAction('onRemoveItem', item);

      // we don't want to actually delete it from the stories object
      // that will work itself next time the list loads
    },

    dragStarted(/* item */) {
      this.set('isDraggingItem', true);
    },

    dragStopped(/* item */) {
      this.set('isDraggingItem', false);
    },

    reorderItems(itemModels, draggedModel) {
      get(this, 'metrics').trackEvent({
        category: 'Discover',
        action: 'Moved Story',
        value: Number(get(draggedModel, 'id'))
      });
      this.set('justDragged', draggedModel);

      // This is a good time to actually delete the hidden items
      var removedItemIds = this.get('removedItemIds');
      let presentAndOrderedItems = itemModels.reject((item) => {
        return removedItemIds.includes(item.id);
      });

      this.set('stories', presentAndOrderedItems);
      this.set('removedItems', []); // clear out removed/hidden items

      // this sends it up to get updated in the queue
      this.sendAction('onUpdateItems', presentAndOrderedItems);
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
        let story = this.get('stories').get('firstObject');
        this.send('playTrack', story.id);
        this.get('scroller').scrollVertical(Ember.$(`span[data-story-id="${story.id}"]`), {offset: -100, duration: 500});
      }
    },

    pauseTrack(/* storyId */) {
      this.get('audio').pause();
    },

    playTrack(pk) {
      this.get('audio').play(pk, 'discover');
    },
    
    findMore() {
      this.sendAction('findMore');
    }
  }
});
