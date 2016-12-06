import Component from 'ember-component';

export default Component.extend({
  isPopupOpen: false,
  classNameBindings: ['isPopupOpen'],
  actions: {
    closePopup() {
      if ( !(this.get('isDestroyed') || this.get('isDestroying')) ) {
        this.set('isPopupOpen', false);
      }
    },
    togglePopup() {
      this.toggleProperty('isPopupOpen');
    },
  }
});
