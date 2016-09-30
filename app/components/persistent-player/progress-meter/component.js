import Ember from 'ember';
const { Component, computed, get, set } = Ember;
const { htmlSafe } = Ember.String;

const findTouch = function(touchList, identifier) {
  for (let i = 0; i < touchList.length; i++) {
    let touch = touchList.item(i);
    if (touch.identifier === identifier) {
      return touch;
    }
  }
};

export default Component.extend({
  isLoaded: computed.bool('duration'),
  isHovering: false,
  isDragging: false,
  isTouching: false,
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
  playheadPosition: computed('mousePosition', 'isHovering', 'isDragging', 'position', 'duration', function() {
    let p;
    let {isHovering, isDragging, mousePosition, position, duration} =
      Ember.getProperties(this, 'isHovering', 'isDragging', 'mousePosition', 'position', 'duration');

    if (isHovering || isDragging || !window.Modernizr.touch) {
      p = mousePosition;
    } else {
      p = position/duration;
    }
    return htmlSafe(`left: ${p * 100}%;`);
  }),

  mousePosition: 0,

  mouseMove(e) {
    e.preventDefault();
    this._updateMousePosition(e);
  },

  mouseDown(e) {
    if (get(this, 'isLoaded') && e.which === 1 /* left click */) {
      this._updateAudioPosition(e);
      if (e.target.classList.contains('progress-playhead')) {
        this._startDragging();
      }
    }
  },
  mouseUp() {
    this._cancelDragging();
  },
  mouseLeave() {
    set(this, 'isHovering', false);
  },
  touchStart(e) {
    e.preventDefault();
    if (get(this, 'isLoaded')) {
        let touch = e.originalEvent.changedTouches[0];
        set(this, 'isTouching', true);
        this._updateAudioPosition(touch);
        this._startDragging(touch);
        e.stopPropagation();
    }
  },
  touchEnd(e) {
    let touch = e.originalEvent.changedTouches[0];
    set(this, 'isTouching', false);
    this._updateAudioPosition(touch);
    this._cancelDragging();
  },
  touchCancel() {
    set(this, 'isTouching', false);
    this._cancelDragging();
  },

  mouseEnter() {
    set(this, 'isHovering', true);
  },
  _startDragging(touch) {
    set(this, 'isDragging', true);
    if (touch) {
      this.$().on('touchmove', function(e) {
        e.preventDefault();
        let event = e.originalEvent;
        let movedTouch = findTouch(event.touches, touch.identifier);
        if (movedTouch) {
          this._updateAudioPosition(movedTouch);
        }
      }.bind(this));
    } else {
      this.$().on('mousemove', function(e) {
        e.preventDefault();
        this._updateAudioPosition(e);
      }.bind(this));
    }
  },
  _cancelDragging() {
    set(this, 'isDragging', false);
    this.$().off('touchmove');
    this.$().off('mousemove');
  },
  _updateMousePosition({pageX}) {
    if (pageX) {
      let offset = this.$('.progress-bg').offset();
      let p;
      if (pageX < offset.left) {
        p = 0;
      } else if (pageX > offset.left + this.$('.progress-bg').width()) {
        p = 1;
      } else {
        p = (pageX - offset.left) / this.$('.progress-bg').width();
      }
      set(this, 'mousePosition', p);
      return p;
    }
  },
  _updateAudioPosition(e) {
    let p = this._updateMousePosition(e);
    get(this, 'setPosition')(p);
  },
  actions: {
    setPosition() {
      this._updateAudioPosition();
    }
  }
});
