import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import Component from 'ember-component';
import computed, { equal } from 'ember-computed';

export default Component.extend({
  audio:              service(),

  isSortingEnabled:   true,
  playingFromQueue:   equal('audio.currentContext', 'queue'),

  classNames:         ['player-queue'],

  sortHandle: computed('isSortingEnabled', function() {
    if (get(this, 'isSortingEnabled')) {
      return '.queueitem';
    }
    return '.dontdrag';
  }),

  didReceiveAttrs() {
    // if this is a touchscreen, disable dragging until we
    // implement hold-to-drag, because dragging blocks
    // scrolling on touch screens.

    /*globals DocumentTouch*/
    let isTouchScreen = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
    if (isTouchScreen) {
      set(this, 'isSortingEnabled', false);
    }
  },

  actions: {
    removeFromQueue(id) {
      let audio = get(this, 'audio');
      audio.removeFromQueue(id);
    },
    reorderItems(reorderedItems/*, droppedItem*/) {
      let audio = get(this, 'audio');
      audio.resetQueue(reorderedItems);
    },
  },
});
