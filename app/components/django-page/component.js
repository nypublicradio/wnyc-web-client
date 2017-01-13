import Ember from 'ember';
import service from 'ember-service/inject';
import ENV from '../../config/environment';
import LegacySupportMixin from 'wnyc-web-client/mixins/legacy-support';
import BetaActionsMixin from 'wnyc-web-client/mixins/beta-actions';
import { canonicalize } from 'wnyc-web-client/services/script-loader';
import {
  isInDom,
  embeddedComponentSetup,
  clearAlienDom,
} from '../../lib/alien-dom';

const { get, computed } = Ember;
let { wnycURL, wnycAdminRoot } = ENV;
wnycURL = canonicalize(wnycURL);

export default Ember.Component.extend(LegacySupportMixin, BetaActionsMixin, {
  audio: service(),
  session: service(),
  legacyAnalytics: service(),
  googleAds: service(),
  router: service('wnyc-routing'),
  loadingType: computed('page', function() {
    let id = get(this, 'page.id') || '';
    let firstPart = id.split('/')[0];

    switch(firstPart) {
      case '':
        return 'index';
      case 'shows':
      case 'articles':
      case 'series':
      case 'tags':
      case 'blogs':
        return 'channel';
      case 'story':
        return 'story';
      default:
        return 'legacy';
    }
  }),

  didReceiveAttrs() {
    // If we have a new page model, we want to clear any overlaid
    // content when we rerender.
    let page = this.get('page');
    if (page !== this._lastPage) {
      if (isInDom(page.get('id'))) {
        embeddedComponentSetup();
      }

      this.set('showingOverlay', false);
    }
  },

  didRender() {
    let page = this.get('page');
    if (page !== this._lastPage) {
      this._lastPage = page;
      let elt = this.$('.django-content');
      elt.empty();

      if (isInDom(page.get('id'))) {
        clearAlienDom();
      }

      this.get('page').appendTo(elt).then(() => {
        // After the server-rendered page has been inserted, we
        // re-enable any overlaid content so that it can wormhole
        // itself into the server-rendered DOM.
        this.set('showingOverlay', true);
        this.get('googleAds').refresh();

        if (this.get('session.data.isStaff')) {
          this.revealStaffLinks(this.$(), wnycAdminRoot);
        }
        this.$().imagesLoaded().progress((i, image) => {
          Ember.run(() => {
            image.img.classList.add('is-loaded');
          });
        });

      });
    }
  },

  click(event) {
    let legacyAnalytics = get(this, 'legacyAnalytics');
    legacyAnalytics.dispatch(event);

    if (this.isLegacyEvent(event)) {
      return this.fireLegacyEvent(event.target);
    }
  },

  goToSearch(q) {
    this.get('router').transitionTo('djangorendered', ['search/'], {q});
  }
});
