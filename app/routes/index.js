import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import PlayParamMixin from 'wnyc-web-client/mixins/play-param';
import rsvp from 'rsvp';
import config from 'wnyc-web-client/config/environment';
import fetch from 'fetch';
import { beforeTeardown } from 'nypr-django-for-ember/utils/compat-hooks';
const { hash } = rsvp;

export default Route.extend(PlayParamMixin, {
  classNames: ['home'],
  dj: service(),
  googleAds: service(),

  model() {
    let page = this.store.findRecord('django-page', '/');
    let featuredStream = this.store.findRecord('stream', 'wnyc-fm939');
    let gothamist = fetch(config.gothamistStories)
      .then(r => r.json()).then(({entries = []}) => entries.slice(0, 5))
      .catch(() => []);
      
    return hash({page, featuredStream, gothamist});
  },
  afterModel() {
    get(this, 'googleAds').doTargeting();
  },

  actions: {
    willTransition() {
      this._super(...arguments);
      beforeTeardown();
      return true;
    }
  }
});
