import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import PlayParamMixin from 'wnyc-web-client/mixins/play-param';
import rsvp from 'rsvp';
import config from 'wnyc-web-client/config/environment';
import fetch from 'fetch';
import { beforeTeardown } from 'nypr-django-for-ember/utils/compat-hooks';
import DS from 'ember-data';
const { hash } = rsvp;

const STREAM_BG = '/assets/img/backgrounds/streambanner.jpg';

export default Route.extend(PlayParamMixin, {
  classNames: ['home'],
  dj: service(),
  metrics: service(),
  googleAds: service(),
  title: 'WNYC | New York Public Radio, Podcasts, Live Streaming Radio, News',

  model() {
    let page = this.store.findRecord('django-page', '/');
    // let streams = this.store.findAll('stream', {reload: true});
    let featuredStream = this.store.findRecord('stream', 'wnyc-fm939');
    let gothamist = fetch(config.gothamistStories)
      .then(r => r.json()).then(({entries = []}) => entries.slice(0, 5))
      .catch(() => []);
    return hash({page, featuredStream, gothamist});
  },
  afterModel({ page }) {
    let metrics = get(this, 'metrics');
    let path = document.location.pathname; // e.g. '/shows/bl/'
    let title = (get(page, 'title') || '').trim();
    metrics.trackPage('NprAnalytics', {
      page: path,
      title
    });
    get(this, 'googleAds').doTargeting();
  },

  actions: {
    willTransition() {
      this._super(...arguments);
      beforeTeardown();
      return true;
    }
  },

  setupController(controller) {
    this._super(...arguments);
    let streams = DS.PromiseArray.create({
      promise: this.store.findAll('stream', {reload: true}).then(s => {
        return s.filterBy('isWNYC').sortBy('sitePriority')
        .concat(s.filterBy('isWQXR').sortBy('sitePriority')).uniq();
      })
    });
    controller.set('streams', streams);
    controller.set('background', STREAM_BG);
  }
});
