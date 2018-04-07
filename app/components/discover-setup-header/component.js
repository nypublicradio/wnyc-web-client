import { equal } from '@ember/object/computed';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Component.extend({
  metrics: service(),
  classNames: ['discover-setup-header-container'],
  isLoadingBack: equal('loadingDirection', 'back'),
  isLoadingNext: equal('loadingDirection', 'next'),
  actions: {
    next() {
      this.sendAction('onNext'); // eslint-disable-line
    },
    back() {
      get(this, 'metrics').trackEvent('GoogleAnalytics', {
        category: 'Discover',
        action: 'Clicked Back in Discover'
      });

      this.sendAction('onBack'); // eslint-disable-line
    }
  }
});
