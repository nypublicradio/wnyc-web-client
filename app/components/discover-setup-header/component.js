import Ember from 'ember';
import { equal } from 'ember-computed';

export default Ember.Component.extend({
  classNames: ['discover-setup-header-container'],
  
  isLoadingBack: equal('loadingDirection', 'back'),
  isLoadingNext: equal('loadingDirection', 'next'),
  
  actions: {
    next() {
      this.sendAction('onNext');
    },
    back() {
      this.sendAction('onBack');
    }
  }
});
