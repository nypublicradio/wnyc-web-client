import Ember from 'ember';
const {
  get
} = Ember;

export default Ember.Route.extend({
  session:       Ember.inject.service(),
  discoverQueue: Ember.inject.service(),
  discoverPrefs: Ember.inject.service(),
  listenActions: Ember.inject.service(),

  model() {
    let prefs = this.get('discoverPrefs');
    var stories;

    if (this.get('discoverQueue.items').length > 0) {
      let queuedStories = this.get('discoverQueue.items');

      // push the stories into the store
      queuedStories.forEach((story) => { this.store.push(story); });

      // push the stories into the store
      let ids = queuedStories.map(i => i.data.id);

      // make sure we're only getting the ones that were in the queue
      stories = this.store.peekAll('discover.stories').filter(story => {
        return ids.contains(story.id);
      });
    }
    else {
      let tags = prefs.get('selectedTopicTags').join(",");
      stories = this.store.query('discover.stories', {
        browser_id: this.get('session.data.browserId'),
        discover_station: 'wnyc_2',
        api_key: 'trident',
        duration: 10800,
        tags: tags
      });
    }

    return Ember.RSVP.hash({
      stories: stories
    });
  },
  afterModel(model) {
    this.get('discoverQueue').updateQueue(model.stories.toArray());
  },
  actions: {
    findMore() {
      let listenActions = this.get('listenActions');
      let discoverQueue = this.get('discoverQueue');
      discoverQueue.get('items').forEach(item => {
        listenActions.sendSkip(get(item, 'id'), 'discover');
        // send a skip action for each item in the playlist
      });
      discoverQueue.emptyQueue();

      this.refresh();
    },
    removeItem(item) {
      let listenActions = this.get('listenActions');
      listenActions.sendDelete(get(item, 'id'), 'discover');
    },
    edit() {
      this.transitionTo('discover.edit');
    }
  }
});
