import Ember from 'ember';
import { beforeTeardown } from '../../lib/compat-hooks';
import ENV from '../../config/environment';
import {
  isInDom,
  clearAlienDom,
  embeddedComponentSetup,
  installAlienListener
} from '../../lib/alien-dom';

const { $ } = Ember;
const { wnycURL } = ENV;

export default Ember.Component.extend({
  router: Ember.inject.service('wnyc-routing'),

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
        installAlienListener(this);
      } else {
        // otherwise clear out the dom and render our server-fetched content
        clearAlienDom();
        this.get('page').appendTo(elt).then(() => {
          // After the server-rendered page has been inserted, we
          // re-enable any overlaid content so that it can wormhole
          // itself into the server-rendered DOM.
          this.set('showingOverlay', true);
        });
      }
    }
  },

  click(event) {
    let target = $(event.target).closest('a');
    if (target.length > 0) {
      let router = this.get('router');
      let href = new URL(target.attr('href'), new URL(this.get('page.id'), wnycURL).toString()).toString();
      if (href.indexOf(wnycURL) === 0) {
        href = href.replace(wnycURL, '');

        if (target.attr('target') === '_blank') {
          return true;
        } else if (!this.features.isEnabled('django-page-routing')) {
          window.location.assign(href.replace(/^([^\/])/, '/$1'));
          return false;
        }

        let { routeName, params } = router.recognize(href.replace(/^\//, ''));
        router.transitionTo(routeName, ...params);
        event.preventDefault();
        beforeTeardown(this.get('element'), this.get('page'));
        return false;
      }
    }
  }
});
