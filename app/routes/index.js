import Ember from 'ember';
import service from 'ember-service/inject';
import PlayParamMixin from 'wnyc-web-client/mixins/play-param';
import rsvp from 'rsvp';
import { beforeTeardown } from 'wnyc-web-client/lib/compat-hooks';
const { hash } = rsvp;
const { get } = Ember;

export default Ember.Route.extend(PlayParamMixin, {
  classNames: ['home'],
  metrics: service(),
  title: 'WNYC | New York Public Radio, Podcasts, Live Streaming Radio, News',

  model() {
    let page = this.store.findRecord('django-page', '/');
    let featuredStream = this.store.findRecord('stream', 'wnyc-fm939');
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
