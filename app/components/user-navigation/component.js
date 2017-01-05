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
    logout() {
      this.get('metrics').trackEvent({
        category: 'WNYC Menu',
        label: 'Clicked Logout',
      });
      this.get('session').invalidate();
    }
  }
});
