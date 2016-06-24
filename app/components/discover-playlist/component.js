import Ember from 'ember';
const {
  get,
} = Ember;


export default Ember.Component.extend({
  session:        Ember.inject.service(),
  queue:          Ember.inject.service('discover-queue'),
  scroller:       Ember.inject.service(),
  audio:          Ember.inject.service(),

  classNames:   ['discover-playlist-container'],
  classNameBindings: ['collapsedHeader:mod-collapsed-header'],
  orderedStories: Ember.computed.or('customSortedStories', 'stories'),

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


  // This is for the delete effects, and this might be a weird way to do it
  // but by not actually deleting the item from the list we can avoid having to
  // set magic number timeouts

  removedItems: [],
  removedItemsHash: Ember.computed('removedItems.length', function() {
    // converting the array of ids to a hash so we can use the get
    // helper in the template to set an .is-deleted class on the item
    var hash = {};
    this.get('removedItems').forEach(i => {
      hash[i] = true;
    });

    return hash;
  }),

  actions: {
    removeItem(item) {
      // delete it from the queue
      this.get('queue').removeItem(item);

      // this will fire the listen action
      this.sendAction('onRemoveItem', item);

      // This will trigger the CSS effect to remove it/hide it from the list
      this.get('removedItems').addObject(get(item, 'cmsPK'));

      // we don't want to actually delete it from this ordered stories
      // that will work itself next time the list loads

      // this.get('orderedStories').removeObject(item);
    },

    scrollPointReached(direction) {
      this.set('collapsedHeader', direction === 'down');
    },

    reorderItems(itemModels, draggedModel) {
      this.set('customSortedStories', itemModels);
      this.set('justDragged', draggedModel);

      this.get('queue').updateQueue(itemModels);
      this.sendAction('onUpdateItems', itemModels);
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
