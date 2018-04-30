import { match } from '@ember/object/computed';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';

export default Controller.extend({
  dj             : service(),
  hifi           : service(),
  session        : service(),
  listenAnalytics: service(),
  queue          : service('listen-queue'),

  queryParams:  ['modal', 'play'],
  modal:        null,
  play:         null,

  showPlayer: reads('dj.showPlayer'),

  isHomepage: match('currentRouteName', /^index(_loading)?$/),

  actions: {

    showModal(which) {
      this._scrollY = window.scrollY;
      this.set('modal', which);
      this._wasModal = true;
    },
    closeModal() {
      if (!this.get('modal')) {
        return;
      }
      window.scrollTo(0, this._scrollY);
      this.set('modal', null);
      this._wasModal = true;
    },

    soundTitleDidChange() {
      if (this.get('hifi.currentSound.isStream')) {
        this.get('dataLayer').audioTracking('schedule', this.get('hifi.currentSound'));
      }
    },
  }
});
