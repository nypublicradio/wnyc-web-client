import { match } from '@ember/object/computed';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import { get } from '@ember/object';
import config from '../config/environment';

export default Controller.extend({
  dj             : service(),
  hifi           : service(),
  session        : service(),
  dataLayer      : service('nypr-metrics/data-layer'),
  queue          : service('listen-queue'),

  queryParams:  ['modal', 'play'],
  modal:        null,
  play:         null,

  showPlayer: reads('dj.showPlayer'),

  isHomepage: match('currentRouteName', /^index(_loading)?$/),

  mailchimpEndpoint: `${config.optInAPI}/mailchimp`,
  politicsBriefNewsletter: config.politicsBriefNewsletter,

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
      let sound = this.get('hifi.currentSound');
      if (get(sound, 'isStream') && get(sound, 'position') > 10) { // skip initial play
        this.get('dataLayer').audioTracking('schedule', sound);
      }
    },
  }
});
