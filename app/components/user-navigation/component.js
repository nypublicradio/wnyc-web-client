import Component from 'ember-component';
import set from 'ember-metal/set';

export default Component.extend({
  isPopupOpen: false,
  classNameBindings: ['isPopupOpen'],
  actions: {
    closePopup() {
      set(this, 'isPopupOpen', false);
    },
    togglePopup() {
      this.toggleProperty('isPopupOpen');
    },
  }
});
