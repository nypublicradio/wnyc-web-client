import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  moment: service(),
  classNames: ['discover-playlist-story-info'],
  showSummary: false,

  actions: {
    toggleSummary() {
      this.toggleProperty('showSummary');
    }
  }
});
