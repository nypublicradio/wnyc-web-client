import Ember from 'ember';
import { findTouchById, isSimulatedMouseEvent } from 'overhaul/lib/touch-utils';
const { Component, computed, get, set } = Ember;
const { htmlSafe } = Ember.String;

const isLegitClick = function(event) {
  // We only want left clicks
  let isLeftClick = event.which === 1;
  // Sometimes touch events which aren't defaultPrevented send
  // fake MouseEvents.  We handle TouchEvents separately so
  // we don't want these
  let isRealMouse = !isSimulatedMouseEvent(event.originalEvent);

  return isLeftClick && isRealMouse;
};

export default Component.extend({
  isLoaded: computed.bool('duration'),
  isHovering: false,
  isDragging: false,
  isTouching: false,
  lastInteraction: '',
  classNames: ['progress'],
  classNameBindings: ['isHovering', 'isDragging', 'isTouching', 'isLoaded'],
  downloadedPercentage: computed('downloaded', function() {
    let downloaded = get(this, 'downloaded');
    return htmlSafe(`width: ${(downloaded) * 100}%;`);
  }),
  playedPercentage: computed('position', function() {
    let position = get(this, 'position');
    let duration = get(this, 'duration');
    return htmlSafe(`width: ${(position/duration) * 100}%;`);
  }),
  playheadPosition: computed('handlePosition', 'isHovering', 'isDragging', 'position', 'duration', function() {
    let p;
    let {isHovering, isDragging, isTouching, lastInteraction, handlePosition, position, duration} =
      Ember.getProperties(this, 'isHovering', 'isDragging', 'isTouching', 'lastInteraction', 'handlePosition', 'position', 'duration');

    // If you are using a touchscreen we want the handle to track with current position when you aren't touching it.
    // Same goes for mouse hover on a hybrid device with mouse and touchscreen.
    // But if you just hovered with a mouse on a non-touchscreen, we don't want the slider to jump to current position
    // because it's animating to hidden.

    // future proofing. We can remove the .touch check once we upgrade Modernizr
    let noTouch = !(window.Modernizr.touch || window.Modernizr.touchevents);
    if (isHovering || isDragging || isTouching || (lastInteraction === 'mouse' && noTouch)) {
      p = handlePosition;
    } else {
      p = position/duration;
    }
    return htmlSafe(`left: ${p * 100}%;`);
  }),

  handlePosition: 0,

  mouseDown(e) {
    if (get(this, 'isLoaded') && isLegitClick(e)) {
      this._updateAudioPosition(e);
      if (e.target.classList.contains('progress-playhead')) {
        this._startDragging();
      }
    }
  },
  mouseUp() {
    set(this, 'lastInteraction', 'mouse');
    this._cancelDragging();
  },
  mouseEnter() {
    set(this, 'isHovering', true);
  },
  mouseMove(e) {
    if (isLegitClick(e)) {
      // prevent dragging and selecting
      e.preventDefault();
      this._updateHandlePosition(e);
    }
  },
  mouseLeave() {
    set(this, 'lastInteraction', 'mouse');
    set(this, 'isHovering', false);
    this._cancelDragging();
  },
  touchStart(e) {
    // prevent emulated mouse events
    e.preventDefault();
    if (get(this, 'isLoaded') && e.target.classList.contains('progress-playhead')) {
      let touch = e.originalEvent.changedTouches[0];
      this._updateAudioPosition(touch);
      set(this, 'isTouching', true);
      this._startDragging(touch);
    }
  },
  touchEnd(e) {
    // prevent emulated mouse events
    e.preventDefault();
    if (get(this, 'isLoaded') && e.target.classList.contains('progress-playhead')) {
      set(this, 'lastInteraction', 'touch');
      let touch = e.originalEvent.changedTouches[0];
      this._updateAudioPosition(touch);
      set(this, 'isTouching', false);
      this._cancelDragging();
    }
  },
  touchCancel(e) {
    // prevent emulated mouse events
    e.preventDefault();
    set(this, 'lastInteraction', 'touch');
    set(this, 'isTouching', false);
    this._cancelDragging();
  },
  _startDragging(touch) {
    set(this, 'isDragging', true);
    if (touch) {
      this.$().on('touchmove', Ember.run.bind(this, (e) => {
        // prevent touch scrolling
        e.preventDefault();
        let event = e.originalEvent;
        let movedTouch = findTouchById(event.touches, touch.identifier);
        if (movedTouch) {
          this._updateAudioPosition(movedTouch);
        }
      }));
    } else {
      this.$().on('mousemove', Ember.run.bind(this, (e) => {
        // prevent dragging and selecting
        e.preventDefault();
        this._updateAudioPosition(e);
      }));
    }
  },
  _cancelDragging() {
    set(this, 'isDragging', false);
    this.$().off('touchmove');
    this.$().off('mousemove');
  },
  _updateHandlePosition(event) {
    if (event.pageX) {
      let offset = this.$('.progress-bg').offset();
      let p;
      if (event.pageX < offset.left) {
        p = 0;
      } else if (event.pageX > offset.left + this.$('.progress-bg').width()) {
        p = 1;
      } else {
        p = (event.pageX - offset.left) / this.$('.progress-bg').width();
      }
      set(this, 'handlePosition', p);
      return p;
    }
  },
  _updateAudioPosition(event) {
    let p = this._updateHandlePosition(event);
    get(this, 'setPosition')(p);
  }
});
