import Ember from 'ember';
import service from 'ember-service/inject';
const { get } = Ember;
const { hash: waitFor } = Ember.RSVP;

export default Ember.Route.extend({
  metrics: service(),
  model({ slug }) {
    return this.store.find('django-page', `story/${slug}`.replace(/\/*$/, '/')).then(page => {
      let story = page.get('wnycContent');
      let comments = this.store.query('comment', { itemTypeId: story.get('itemTypeId'), itemId: story.get('id') });
      let relatedStories = this.store.query('story', { itemId: story.get('id'), limit: 5});
      return waitFor({
        page,
        story,
        user: this.store.find('current_user', 'current'),
        browserId: this.store.find('browser_id', 'current'),
        getComments: () => comments,
        getRelatedStories: () => relatedStories
      });
    });
  },
  afterModel(model) {
    let metrics = get(this, 'metrics');
    let {gaAction:action, gaLabel:label} = get(model, 'story.analytics');

    metrics.trackEvent({
      eventName: 'viewedStory',
      category: 'Viewed Story',
      action,
      label,
      model: get(model, 'story')
    });
  }
});
