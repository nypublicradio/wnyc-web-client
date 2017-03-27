import Ember from 'ember';
import service from 'ember-service/inject';
import PlayParamMixin from 'wqxr-web-client/mixins/play-param';
import { beforeTeardown } from 'wqxr-web-client/lib/compat-hooks';
import config from 'wqxr-web-client/config/environment';
const { get } = Ember;
const { hash: waitFor } = Ember.RSVP;

export default Ember.Route.extend(PlayParamMixin, {
  metrics:      service(),
  session:      service(),
  googleAds:    service(),
  dataPipeline: service(),
  currentUser:  service(),
  
  titleToken(model) {
    return `${get(model, 'story.title')} - ${get(model, 'story.headers.brand.title')}`;
  },
  title(tokens) {
    return `${tokens[0]} - WNYC`;
  },
  model({ slug }) {
    return this.store.findRecord('django-page', `story/${slug}`.replace(/\/*$/, '/')).then(page => {
      let story = page.get('wnycContent');
      let comments = this.store.query('comment', { itemTypeId: story.get('itemTypeId'), itemId: story.get('id') });
      let relatedStories = this.store.query('story', { itemId: story.get('id'), limit: 5});
      return waitFor({
        page,
        story,
        getComments: () => comments,
        getRelatedStories: () => relatedStories,
        adminURL: `${config.wnycAdminRoot}/admin`
      });
    });
  },
  afterModel(model, transition) {
    let metrics = get(this, 'metrics');
    let dataPipeline = get(this, 'dataPipeline');
    let {containers:action, title:label} = get(model, 'story.analytics');
    let nprVals = get(model, 'story.nprAnalyticsDimensions');
    
    get(this, 'googleAds').doTargeting(get(model, 'story').forDfp());

    if (get(model, 'story.extendedStory.headerDonateChunk')) {
      transition.send('updateDonateChunk', get(model, 'story.extendedStory.headerDonateChunk'));
    }

    // google analytics
    metrics.trackEvent('GoogleAnalytics', {
      category: 'Viewed Story',
      action,
      label,
    });

    // NPR
    metrics.trackPage('NprAnalytics', {
      page: `/story/${get(model, 'story.slug')}`,
      title: label,
      nprVals,
    });
    
    // data pipeline
    dataPipeline.reportItemView({
      cms_id: get(model, 'story.id'),
      item_type: get(model, 'story.itemType'),
      site_id: get(model, 'story.siteId'),
      client: config.clientSlug
    });
  },
  
  setupController(controller) {
    controller.set('isMobile', window.Modernizr.touchevents);
    controller.set('session', get(this, 'session'));
    controller.set('user', get(this, 'currentUser.user'));
    return this._super(...arguments);
  },
  
  actions: {
    willTransition() {
      this._super(...arguments);
      beforeTeardown();
      return true;
    }
  }
});
