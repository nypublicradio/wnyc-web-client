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
    let excludedIds = prefs.get('excludedStoryIds');
    var stories;

    if (this.get('discoverQueue.items').length > 0) {
      let queuedStories = this.get('discoverQueue.items');

      if (queuedStories.mapBy('id').compact().length > 0) {
        // these are already instantiated ember objects from the store
        stories = queuedStories;
      }
      else {
        // push the stories into the store
        queuedStories.forEach((story) => { this.store.push(story); });

        // make sure we're only getting the ones that were in the queue
        let ids = queuedStories.map(i => i.data.id);
        stories = this.store.peekAll('discover.stories').filter(story => {
          return ids.contains(story.id);
        });
      }

      stories = stories.filter(story => {
        return !excludedIds.contains(story.id);
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
      }).then(s => {
        return s.filter(story => { return !excludedIds.contains(story.id); });
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
      let prefs         = this.get('discoverPrefs');

      discoverQueue.get('items').forEach(item => {
        let itemId        = get(item, 'id');
        listenActions.sendSkip(itemId, 'discover');
        prefs.excludeStoryId(itemId);
      });
      discoverQueue.emptyQueue();

      this.refresh();
    },
    removeItem(item) {
      let listenActions = this.get('listenActions');
      let prefs         = this.get('discoverPrefs');
      let itemId        = get(item, 'id');

      listenActions.sendDelete(itemId, 'discover');

      // Make sure this doesn't show up again
      prefs.excludeStoryId(itemId);
    },
    edit() {
      this.transitionTo('discover.edit');
    }
  }
});
