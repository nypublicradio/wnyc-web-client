import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['discover-setup-header-container'],
  actions: {
    next() {
      this.sendAction('onNext');
    },
    back() {
      this.sendAction('onBack');
    }
  }
});
