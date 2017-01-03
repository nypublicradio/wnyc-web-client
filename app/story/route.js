import Ember from 'ember';
import config from 'overhaul/config/environment';
import service from 'ember-service/inject';
import PlayParamMixin from 'overhaul/mixins/play-param';
const { get } = Ember;
const { hash: waitFor } = Ember.RSVP;

export default Ember.Route.extend(PlayParamMixin, {
  metrics: service(),
  session: service(),
  currentUser: service(),
  
  setupController(controller) {
    controller.set('isMobile', window.Modernizr.touchevents);
    return this._super(...arguments);
  },
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
        user: get(this, 'currentUser.user'),
        browserId: get(this, 'session.data.browserId'),
        adminURL: config.wnycAdminURL
      });
    });
  },
  afterModel(model) {
    let metrics = get(this, 'metrics');
    let {containers:action, title:label} = get(model, 'story.analytics');
    let nprVals = get(model, 'story.nprAnalyticsDimensions');

    if (get(model, 'story.extendedStory.headerDonateChunk')) {
      this.send('updateDonateChunk', get(model, 'story.extendedStory.headerDonateChunk'));
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
  }
});
