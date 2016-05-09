import Ember from 'ember';
import service from 'ember-service/inject';
import { beforeTeardown, homepageCleanup } from '../../lib/compat-hooks';
import ENV from '../../config/environment';
import LegacySupportMixin from 'overhaul/mixins/legacy-support';
import {
  isInDom,
  embeddedComponentSetup,
  installAlienListeners,
  unbindAlienListener,
} from '../../lib/alien-dom';

const { $, get, computed, run } = Ember;
const { wnycURL } = ENV;

function doRefresh() {
  const { googletag } = window;

  if (googletag && googletag.apiReady) {
    run.schedule('afterRender', this, () => {
      googletag.cmd.push(() => {
        googletag.pubads().refresh();
      });
    });
  } else {
    run.later(this, doRefresh, 500);
  }
}

export default Ember.Component.extend(LegacySupportMixin, {
  legacyAnalytics: service(),
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

      this.set('showingOverlay', isInDom(page.get('id')));
    }
  },

  didRender() {
    let page = this.get('page');
    if (page !== this._lastPage) {
      this._lastPage = page;
      let elt = this.$('.django-content');
      elt.empty();

      if (isInDom(page.get('id'))) {
        // if an alien dom is present, capture any escaped clicks but otherwise
        // leave the alien alone
        if (page.get('id') === '/') {
          homepageCleanup();
        }
        installAlienListeners(this);
      } else {
        unbindAlienListener();
        this.get('page').appendTo(elt).then(() => {
          // After the server-rendered page has been inserted, we
          // re-enable any overlaid content so that it can wormhole
          // itself into the server-rendered DOM.
          this.set('showingOverlay', true);
          if (ENV.renderGoogleAds) {
            doRefresh();
          }

          this.$().imagesLoaded().progress((i, image) => {
            Ember.run(() => {
              image.img.classList.add('is-loaded');
            });
          });

        });
      }
    }
  },

  click(event) {
    let legacyAnalytics = get(this, 'legacyAnalytics');
    legacyAnalytics.dispatch(event);

    let target = $(event.target).closest('a');
    let href = target.attr('href');
    if (target.length > 0 && href && href[0] !== '#') {
      let router = this.get('router');
      let href = new URL(target.attr('href'), new URL(this.get('page.id'), wnycURL).toString()).toString();
      if (href.indexOf(wnycURL) === 0) {
        href = href.replace(wnycURL, '');

        // all URLS are maked as external by legacy JS in development mode
        if (ENV.environment !== 'development' && target.attr('target') === '_blank') {
          return true;
        } else if (target.hasClass('stf')) {
        // admin link
          return true;
        } else if (href.split('.').length > 1) {
        // URL has an extension; allow to bubble up
          return true;
        } else if (!this.features.isEnabled('django-page-routing')) {
          return false;
        }

        let { routeName, params, queryParams } = router.recognize(href.replace(/^\//, ''));

        if (!this.get('isDestroyed') && !this.get('isDestroying')) {
          router.transitionTo(routeName, params, queryParams);
        }
        event.preventDefault();

        // clear out the alienDom and other teardown steps
        beforeTeardown(this.get('element'), this.get('page'));
        return false;
      }
    }

    if (this.isLegacyEvent(event)) {
      return this.fireLegacyEvent(event.target);
    }
  }
});
