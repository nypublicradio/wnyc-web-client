import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['discover-setup-header-container'],
  actions: {
    next() {
      this.set('isLoadingNext', true);
      this.sendAction('onNext');
    },
    back() {
      this.set('isLoadingBack', true);
      this.sendAction('onBack');
    }
  }
});
