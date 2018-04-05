import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Component.extend({
  moment: service(),
  metrics: service(),
  classNames: ['discover-playlist-story-info'],
  showSummary: false,

  actions: {
    toggleSummary() {
      if (get(this, 'showSummary') === false) {
        get(this, 'metrics').trackEvent('GoogleAnalytics', {
          category: 'Discover',
          action: 'Expanded Summary',
          value: Number(get(this, 'story.id'))
        });
      }
      this.toggleProperty('showSummary');
    }
  }
});
