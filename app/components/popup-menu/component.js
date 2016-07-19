import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { next } from 'ember-runloop';
import { htmlSafe } from 'ember-string';

export default Component.extend({
  classNames: ['popupmenu'],
  classNameBindings: ['isOpen'],
  tagName: 'div',
  isOpen: false,
  popupStyle: htmlSafe(''),
  pointerStyle: htmlSafe(''),
  screenMargin: 5,
  clickOutside() {
    this.send('closePopup');
  },
  actions: {
    togglePopup: function() {
      if (get(this, 'isOpen')) {
        this.send('closePopup');
      } else {
        this.send('openPopup');
      }
    },
    openPopup() {
      set(this, 'isOpen', true);
      this._adjustPopupPosition();
    },
    closePopup() {
      set(this, 'isOpen', false);
    }
  },
  _adjustPopupPosition() {
    let popupElem = this.$('.popupmenu-popup')[0];

    // reset the style before calculations
    // default in css should be left: 0;
    // calculations assume popup starts left aligned with button
    set(this, 'popupStyle', htmlSafe(''));
    // wait for style change to propogate before calculating
    next(this, function() {
      let popupRect = popupElem.getBoundingClientRect();
      let buttonRect = this.$('.popupmenu-button')[0].getBoundingClientRect();

      // Align center of popup with center of button using popupOffset
      let popupOffset = this._calcMidpointOffset(buttonRect, popupRect);

      // get an additional offset to keep the popup onscreen;
      let offscreenOffset = this._calcOffscreenOffset(popupRect, popupOffset);

      // move the popup window.
      let popupStyle = htmlSafe(`left: ${popupOffset + offscreenOffset}px`);
      set(this, 'popupStyle', popupStyle);

      // If we pushed the popup back onscreen, we need to move the pointer the
      // other way to keep it centered;
      if (offscreenOffset) {
        // 50% of popup width (center) - offscreenOffset to point the pointer
        // at the center of the button
        let pointerStyle = htmlSafe(`left: ${this._calcWidth(popupRect)/2 - offscreenOffset}px`);
        set(this, 'pointerStyle', pointerStyle);
      }
    });
  },
  _calcMidpointOffset(rect1, rect2) {
    //get the difference between the x midpoint of two position rects.
    return this._calcXMidpoint(rect1) - this._calcXMidpoint(rect2);
  },
  _calcOffscreenOffset(rect, startingOffset) {
    // Taking a position rect and a startingOffset,
    // and accounting for screenMargin,
    // check if that rect is out of bounds of the viewportWidth,
    // and calculate an offscreenOffset to move rect back onscreen.
    let viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    let screenMargin = get(this, 'screenMargin');
    let offscreenOffset = 0;
    if (rect.left + startingOffset < screenMargin) {
      offscreenOffset = screenMargin - (rect.left + startingOffset);
    } else if (rect.right + startingOffset > viewportWidth - screenMargin) {
      offscreenOffset = viewportWidth - (rect.right + startingOffset + screenMargin);
    }
    return offscreenOffset;
  },
  _calcXMidpoint(boundingRect) {
    return (boundingRect.right + boundingRect.left) / 2;
  },
  _calcWidth(boundingRect) {
    return boundingRect.right - boundingRect.left;
  },
});
