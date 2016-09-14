import Component from 'ember-component';
import service from 'ember-service/inject';
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
          action: 'Expanded Summary',
          value: Number(get(this, 'story.id'))
        });
      }
      this.toggleProperty('showSummary');
    }
  }
});
