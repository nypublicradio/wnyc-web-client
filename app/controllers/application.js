import Controller from 'ember-controller';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import { readOnly } from 'ember-computed';

export default Controller.extend({
  audio:        service(),
  metrics:      service(),

  modal:        null,
  queryParams:  ['modal'],

  showPlayer:   readOnly('audio.playedOnce'),

  actions: {
    showModal(which) {
      this._scrollY = window.scrollY;
      this.set('modal', which);
      this._wasModal = true;

      let metrics = get(this, 'metrics');
      metrics.trackEvent({
        category: 'Persistent Player',
        action: 'Click',
        label: 'Open Queue'
      });
    },
    closeModal() {
      if (!this.get('modal')) {
        return;
      }
      window.scrollTo(0, this._scrollY);
      this.set('modal', null);
      this._wasModal = true;
    },
  }
});
