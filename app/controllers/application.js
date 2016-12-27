import Ember from 'ember';
import Controller from 'ember-controller';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import { and, not, reads, equal } from 'ember-computed';

export default Controller.extend({
  audio:        service(),
  metrics:      service(),

  queryParams:  ['modal', 'play'],
  modal:        null,
  play:         null,

  noErrors:     not('audio.hasErrors'),
  showPlayer:   and('noErrors', 'audio.playedOnce'),

  isHomepage: Ember.computed.match('currentRouteName', /^index(_loading)?$/),


  // Persistent Player Component Integration


  currentAudio: reads('audio.currentAudio'),
  isAudioStream: equal('currentAudio.audioType', 'stream'), // unused?



  actions: {


    showModal(which) {
      this._scrollY = window.scrollY;
      this.set('modal', which);
      this._wasModal = true;

      let metrics = get(this, 'metrics');
      metrics.trackEvent('GoogleAnalytics', {
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
