import Ember from 'ember';
import service from 'ember-service/inject';
import PlayParamMixin from 'wnyc-web-client/mixins/play-param';
import { beforeTeardown } from 'wnyc-web-client/lib/compat-hooks';
const { get } = Ember;
const { hash: waitFor } = Ember.RSVP;

export default Ember.Route.extend(PlayParamMixin, {
  metrics: service(),
  session: service(),
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
        isStaff: get(this, 'session.data.isStaff'),
        browserId: get(this, 'session.data.browserId')
      });
    });
  },
  afterModel(model, transition) {
    let metrics = get(this, 'metrics');
    let {containers:action, title:label} = get(model, 'story.analytics');
    let nprVals = get(model, 'story.nprAnalyticsDimensions');

    if (get(model, 'story.extendedStory.headerDonateChunk')) {
      transition.send('updateDonateChunk', get(model, 'story.extendedStory.headerDonateChunk'));
    }

    metrics.trackEvent({
      eventName: 'viewedStory',
      category: 'Viewed Story',
      action,
      label,
      id: get(model, 'story.id'),
      type: get(model, 'story.itemType')
    });

    metrics.invoke('trackPage', 'NprAnalytics', {
      page: `/story/${get(model, 'story.slug')}`,
      title: label,
      nprVals,
      isNpr: true
    });
  },
  
  setupController(controller) {
    controller.set('isMobile', window.Modernizr.touchevents);
    controller.set('session', get(this, 'session'));
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
