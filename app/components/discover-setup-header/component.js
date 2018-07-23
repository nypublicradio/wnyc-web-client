import { equal } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['discover-setup-header-container'],
  isLoadingBack: equal('loadingDirection', 'back'),
  isLoadingNext: equal('loadingDirection', 'next'),
  actions: {
    next() {
      this.sendAction('onNext'); // eslint-disable-line
    },
    back() {
      this.sendAction('onBack'); // eslint-disable-line
    }
  }
});
