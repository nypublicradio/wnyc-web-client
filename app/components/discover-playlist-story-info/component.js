import Component from 'ember-component';
import service from 'ember-service/inject';
import computed from 'ember-computed';
import get from 'ember-metal/get';

export default Component.extend({
  moment: service(),
  metrics: service(),
  classNames: ['discover-playlist-story-info'],
  showSummary: false,

  actions: {
    toggleSummary() {
      if (get(this, 'showSummary') === false) {
        get(this, 'metrics').trackEvent({
          category: 'Discover',
          action: 'Expanded Sumary',
          value: get(this, 'story.pk');
        });
      };
      this.toggleProperty('showSummary');
    }
  }
});
