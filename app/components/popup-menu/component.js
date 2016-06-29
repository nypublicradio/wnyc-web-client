import Ember from 'ember';

const {
  Component,
  set,
  get,
  $
} = Ember;

const {htmlSafe} = Ember.String;

export default Component.extend({
  links: [],
  classNames: ['popupmenu'],
  classNameBindings: ['isOpen'],
  tagName: 'div',
  isOpen: false,
  didInsertElement() {
    $(window).on(`click.${this.elementId}`, (e) => {
        let target = e.target;
        let popup = this.$('.popupmenu-popup')[0];
        let button = this.$('.popupmenu-button')[0];
        // Close popup when clicking outside popup or button, or when clicking a link
        if ((!(target === popup  || $.contains(popup, target)) &&
             !(target === button || $.contains(button, target))) ||
             target.tagName === 'A'
          ) {
          Ember.run(() => {
            this.send('closePopup');
          });
        }
    });
  },
  willDestroyElement() {
    $(window).off(`click.${this.elementId}`);
  },
  adjustPopupPosition () {
    let popupElem = this.$('.popupmenu-popup').get(0);
    let pointerElem = this.$('.popupmenu-popup-pointer').get(0);

    // reset the style before calculations
    // default in css should be left: 0;
    // calculations assume popup starts left aligned with button
    popupElem.removeAttribute('style');

    let popupRect = popupElem.getBoundingClientRect();
    let buttonRect = this.$('.popupmenu-button').get(0).getBoundingClientRect();
    let viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

    // Align center popup with center of button using popupOffset
    let popupOffset = this._calcXMidpoint(buttonRect) - this._calcXMidpoint(popupRect);

    // How close to the edge of the screen is popup allowed to get?
    const screenMargin = 5;

    // Accounting for popUpOffset and screenMargin,
    // check if popup is out of bounds,
    // and calculate offscreenOffset to move popup back onscreen.
    let offscreenOffset = 0;
    if (popupRect.left + popupOffset < screenMargin) {
      offscreenOffset = screenMargin - (popupRect.left + popupOffset);
    } else if (popupRect.right + popupOffset > viewportWidth - screenMargin) {
      offscreenOffset = viewportWidth - (popupRect.right + popupOffset + screenMargin);
    }

    // move the popup window.
    let styleString = htmlSafe(`left: ${popupOffset + offscreenOffset}px`);
    popupElem.setAttribute('style', styleString);

    // If we pushed the popup back onscreen, we need to move the pointer the
    // other way to keep it centered;
    // 50% of popup width (center) - offscreenOffset to point the pointer
    // at the center of the button
    styleString = htmlSafe(`left: ${this._calcWidth(popupRect)/2 - offscreenOffset}px`);
    pointerElem.setAttribute('style', styleString);
  },
  actions: {
    togglePopup: function() {
      this.toggleProperty('isOpen');
      if (get(this, 'isOpen')) {
        this.adjustPopupPosition();
      }
    },
    closePopup: function() {
      set(this, 'isOpen', false);
    }
  },
  _calcXMidpoint(boundingRect) {
    return (boundingRect.right + boundingRect.left) / 2;
  },
  _calcWidth(boundingRect) {
    return boundingRect.right - boundingRect.left;
  }
});
