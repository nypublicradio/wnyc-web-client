import Ember from 'ember';
const {
  get
} = Ember;

export default Ember.Route.extend({
  session:       Ember.inject.service(),
  discoverQueue: Ember.inject.service(),
  listenActions: Ember.inject.service(),
  preflight:     Ember.inject.service('discover-playlist-preflight'),
  discoverPrefs: Ember.inject.service(),

  model() {
    let prefs         = this.get('discoverPrefs');
    let excludedIds   = prefs.get('excludedStoryIds');
    let queuedStories = this.get('discoverQueue.items');
    var stories;

    if (queuedStories.length > 0) {

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
      let preflight = this.get('preflight');
      let topicTags = prefs.get('selectedTopicTags');
      let showSlugs = prefs.get('selectedShowSlugs');

      stories = Ember.RSVP.hash({
        showStories: preflight.storiesFromShows(showSlugs),
        tagStories: preflight.storiesFromTopics(topicTags)
      }).then((results) => {
        return this.store.query('discover.stories', {
          show_stories: results.showStories,
          tag_stories:  results.tagStories,
          duration:     10800,
          _nocache:     Date.now()
        }).then(stories => {
          return stories.filter(s => !excludedIds.contains(s.id));
        });
      }, function(/*error*/) {

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
        listenActions.sendSkip(itemId, 'NYPR_Web');
        prefs.excludeStoryId(itemId);
      });
      discoverQueue.emptyQueue();

      this.refresh();
    },
    removeItem(item) {
      let listenActions = this.get('listenActions');
      let prefs         = this.get('discoverPrefs');
      let itemId        = get(item, 'id');

      listenActions.sendDelete(itemId, 'NYPR_Web');

      // Make sure this doesn't show up again
      prefs.excludeStoryId(itemId);
    },
    edit() {
      this.transitionTo('discover.edit');
    }
  }
});
