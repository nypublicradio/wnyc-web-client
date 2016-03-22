import Ember from 'ember';
import service from 'ember-service/inject';
const { get, setProperties } = Ember;
const { hash: waitFor } = Ember.RSVP;

export default Ember.Route.extend({
  metrics: service(),
  sessionManager: service(),
  model({ slug }) {
    return this.store.find('django-page', `story/${slug}`.replace(/\/*$/, '/')).then(page => {
      let story = page.get('wnycContent');
      let comments = this.store.query('comment', { itemTypeId: story.get('itemTypeId'), itemId: story.get('id') });
      let relatedStories = this.store.query('story', { itemId: story.get('id'), limit: 5});
      return waitFor({
        page,
        story,
        getComments: () => comments,
        getRelatedStories: () => relatedStories
      });
    });
  },
  afterModel(model) {
    let metrics = get(this, 'metrics');
    let sessionManager = get(this,'sessionManager');
    let {containers:action, title:label} = get(model, 'story.analytics');

    setProperties(model, {
      user: get(sessionManager, 'user'),
      browserId: get(sessionManager, 'browserId')
    });

    metrics.trackEvent({
      eventName: 'viewedStory',
      category: 'Viewed Story',
      action,
      label,
      model: get(model, 'story')
    });
  }
});
