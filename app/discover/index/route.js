import Ember from 'ember';
const {
  get
} = Ember;

export default Ember.Route.extend({
  session:          Ember.inject.service(),
  discoverQueue:    Ember.inject.service(),
  listenActions:    Ember.inject.service(),
  discoverPrefs:    Ember.inject.service(),
  scroller:         Ember.inject.service(),

  hasQueuedStories: Ember.computed.gt('discoverQueue.items.length', 0),

  model() {
    var stories;
    if (this.get('hasQueuedStories')) {
      stories = this._loadStoriesFromQueue();
    }
    else {
      stories = this._loadStoriesFromServer();
    }

    return Ember.RSVP.hash({stories});
  },

  afterModel(model) {
    this._updateDiscoverQueue(model.stories);
  },

  _loadStoriesFromQueue() {
    let prefs         = this.get('discoverPrefs');
    let excludedIds   = prefs.get('excludedStoryIds');
    let queuedStories = this.get('discoverQueue.items');

    return queuedStories.reject(story => excludedIds.contains(story.id));
  },

  _loadStoriesFromServer() {
    var stories;
    let prefs             = this.get('discoverPrefs');
    let excludedIds       = prefs.get('excludedStoryIds');
    let topicTags         = prefs.get('selectedTopicTags');
    let excludedShowSlugs = prefs.get('excludedShowSlugs');

    stories = this.store.query('discover.stories', {
      shows:            excludedShowSlugs.join(","),
      tags:             topicTags.join(","),
      duration:         10800,
      _nocache:         Date.now()
    }).then(stories => {
      return stories.reject(s => excludedIds.contains(s.id));
    });

    return stories;
  },

  _updateDiscoverQueue(stories) {
    // The queue is the up to date list of items that should be visible in the playlist,
    // but the playlist holds on to deleted items a little longer in order to hide them with css effects

    // If the stories in the playlist get bound to the queue, then when we remove an item
    // from the queue the playlist will yank that sucker right out without
    // doing our super sweet CSS effect. That's why we do a .copy() right here.

    this.get('discoverQueue').updateQueue(stories.copy());
  },

  _hasNoNewResults(stories) {
    if (Ember.isEmpty(stories)) {
      return true;
    }
    else {
      let oldStoryIds = this._loadStoriesFromQueue().mapBy('id');
      let newStoryIds = stories.mapBy('id');
      return Ember.isEmpty(newStoryIds.reject(s => oldStoryIds.contains(s)));
    }
  },

  actions: {
    findMore() {
      let controller = this.controllerFor('discover.index');

      // TODO: add button effect for when find more is getting more items
      controller.set('findingMore', true);
      controller.set('noNewResults', false);

      this._loadStoriesFromServer().then(stories => {
        if (this._hasNoNewResults(stories)) {
          controller.set('noNewResults', true);
          return this._loadStoriesFromQueue();
        }
        else {
          return stories;
        }
      }).then(s => {
        this.set('currentModel.stories', s);
        this._updateDiscoverQueue(s);
      }).finally(() => {
        controller.set('findingMore', false);
      });
    },
    removeItem(item) {
      let listenActions = this.get('listenActions');
      let prefs         = this.get('discoverPrefs');
      let itemId        = get(item, 'id');

      listenActions.sendDelete(itemId, 'NYPR_Web');
      this.get('discoverQueue').removeItem(item);

      // Make sure this doesn't show up again
      prefs.excludeStoryId(itemId);
    },
    updateItems(items) {
      this._updateDiscoverQueue(items);
    },
    edit() {
      this.transitionTo('discover.edit');
    }
  }
});
