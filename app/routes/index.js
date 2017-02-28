import Ember from 'ember';
import service from 'ember-service/inject';
import PlayParamMixin from 'wqxr-web-client/mixins/play-param';
import { beforeTeardown } from 'wqxr-web-client/lib/compat-hooks';
import rsvp from 'rsvp';
const { hash } = rsvp;
const { get } = Ember;

export default Ember.Route.extend(PlayParamMixin, {
  classNames: ['home'],
  metrics: service(),
  title: 'WQXR | New York\'s Classical Music Radio Station',

  model() {
    let page = this.store.findRecord('django-page', '/');
    let featuredStream = this.store.findRecord('stream', 'wqxr');
    return hash({page, featuredStream});
  },
  afterModel({ page }) {
    let metrics = get(this, 'metrics');
    let path = document.location.pathname; // e.g. '/shows/bl/'
    let title = (get(page, 'title') || '').trim();
    metrics.trackPage('NprAnalytics', {
      page: path,
      title
    });
  },

  actions: {
    willTransition() {
      this._super(...arguments);
      beforeTeardown();
      return true;
    }
  }
});
