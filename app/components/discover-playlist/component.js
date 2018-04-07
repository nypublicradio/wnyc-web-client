import { computed, observer } from '@ember/object';
import {
  reads,
  and,
  mapBy,
  setDiff,
  alias,
  map
} from '@ember/object/computed';
import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  session:  service(),
  scroller: service(),
  dj:       service(),
  metrics:  service(),

  classNames:        ['discover-playlist-container'],
  classNameBindings: ['isDraggingItem:is-dragging-item'],

  audioReady: reads('dj.isReady'),
  currentAudioId: reads('dj.currentContentId'),
  currentlyLoadingIds: reads('dj.currentlyLoadingIds'),

  isPlaying:      and('audioReady', 'currentTrackIsInPlaylist', 'dj.isPlaying'),

  isPaused:      computed('currentTrackIsInPlaylist', 'isPlaying', function() {
    return this.get('currentTrackIsInPlaylist') && !this.get('isPlaying');
  }),

  isNotStarted:  computed('isPlaying', 'isPaused', function() {
    return !this.get('isPlaying') && !this.get('isPaused');
  }),

  storyIds: mapBy('stories', 'id'),

  currentTrackIsInPlaylist: computed('stories', 'currentAudioId', function() {
    return !!this.get('stories').findBy('id', this.get('currentAudioId'));
  }),

  currentPlaylistStoryPk:   computed('currentTrackIsInPlaylist', function() {
    if (this.get('currentTrackIsInPlaylist')) {
      return this.get('currentAudioId');
    }
  }),

  stillVisibleStories: setDiff('stories', 'removedItems'),
  visibleCount: alias('stillVisibleStories.length'),
  refreshAutomaticallyIfZero: observer('visibleCount', function() {
    if (this.get('itemCount') === 0) {
      this.findMore();
    }
  }),

  removedItemIds: map('removedItems', (i) => i.id),

  init() {
    this._super(...arguments);

    // but by not actually deleting the item from the list we can avoid having to
    // set magic number timeouts
    this.set('removedItems', []);
  },
  // This is for the delete effects, and this might be a weird way to do it
  actions: {
    removeItem(item) {
      get(this, 'metrics').trackEvent('GoogleAnalytics', {
        category: 'Discover',
        action: 'Removed Story from Discover',
        value: Number(get(item, 'id'))
      });

      // This will trigger the CSS effect to remove it/hide it from the list
      this.get('removedItems').addObject(item);

      // this will fire the listen action and delete it from the queue
      // we don't want to actually delete it from the stories object
      // that will work itself next time the list loads
      this.sendAction('onRemoveItem', item); // eslint-disable-line

    },

    dragStarted(/* item */) {
      this.set('isDraggingItem', true);
    },

    dragStopped(/* item */) {
      this.set('isDraggingItem', false);
    },

    reorderItems(itemModels, draggedModel) {
      get(this, 'metrics').trackEvent('GoogleAnalytics', {
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
      this.sendAction('onUpdateItems', presentAndOrderedItems); // eslint-disable-line
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
        this.get('scroller').scrollVertical(document.querySelector(`span[data-story-id="${story.id}"]`), {offset: -100, duration: 500});
      }
    },

    pauseTrack(/* storyId */) {
      this.get('dj').pause();
    },

    playTrack(pk) {
      this.get('dj').play(pk, {playContext: 'discover'});
    },

    findMore() {
      this.sendAction('findMore'); // eslint-disable-line
    }
  }
});
