import Ember from 'ember';
import service from 'ember-service/inject';
const { get } = Ember;
const { hash: waitFor } = Ember.RSVP;

export default Ember.Route.extend({
  metrics: service(),
  session: service(),
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
        user: get(this, 'session.data.authenticated'),
        browserId: get(this, 'session.data.browserId')
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
    
    metrics.invoke('trackPage', 'NprAnalytics', { nprVals, isNpr: true });
  }
});
