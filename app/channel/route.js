import Route from 'ember-route';
import service from 'ember-service/inject';
import Ember from 'ember';
const {
  Inflector,
  get,
  set
} = Ember;
const { hash: waitFor } = Ember.RSVP;
const inflector = new Inflector(Inflector.defaultRules);
import { beforeTeardown } from 'nypr-django-for-ember/utils/compat-hooks';
import PlayParamMixin from 'wnyc-web-client/mixins/play-param';
import config from 'wnyc-web-client/config/environment';

export default Route.extend(PlayParamMixin, {
  session:      service(),
  googleAds:    service(),

  model(params) {
    const channelPathName = inflector.pluralize(this.routeName.split('-')[0]);
    const listingSlug = `${channelPathName}/${params.slug}`;
    set(this, 'listingSlug', listingSlug);

    let channel = this.store.findRecord('channel', listingSlug);
    let listenLive = this.store.findRecord('chunk', `shows-${params.slug}-listenlive`)
      .catch(() => '');

    return waitFor({
      channel,
      listenLive,
      user: this.get('session.data.authenticated'),
    });
  },

  afterModel({ channel }, transition) {
    if (channel) {
      let canonicalHost = get(channel, 'canonicalHost');
      if  (canonicalHost && canonicalHost !== document.location.host) {
        transition.abort();
        window.location.href = get(channel, 'url');
        return;
      }
    }
    get(this, 'googleAds').doTargeting({show: channel.get('slug')});
    if (channel.get('headerDonateChunk')) {
      transition.send('updateDonateChunk', channel.get('headerDonateChunk'));
    }
    if (channel.get('altLayout')) {
      transition.send('setMiniChrome', true);
    }
    if (window.dataLayer) {
      window.dataLayer.push({showTitle: channel.get('title')});
    }
  },

  setupController(controller, model) {
    let { page_params = '' } = this.paramsFor(`${this.routeName}.page`);
    let [navSlug] = page_params.split('/');
    controller.setProperties({
      channelType: this.routeName,
      defaultSlug: navSlug,
      model,
      session: get(this, 'session'),
      adminURL: `${config.adminRoot}/admin`
    });
  },

  actions: {
    willTransition(transition) {
      let isExiting = !transition.targetName.match(this.routeName);
      this._super(...arguments);
      beforeTeardown();
      if (get(this, 'currentModel.channel.altLayout') && isExiting) {
        transition.send('setMiniChrome', false);
      }
      if (isExiting) {
        get(this, 'googleAds').clearTarget('show');
      }
      if (window.dataLayer) {
        window.dataLayer.push({showTitle: undefined});
      }
      return true;
    },
  }
});
