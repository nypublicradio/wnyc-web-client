import Ember from 'ember';
const {
  get
} = Ember;

export default Ember.Route.extend({
  session:       Ember.inject.service(),
  discoverQueue: Ember.inject.service(),
  listenActions: Ember.inject.service(),
  discoverPrefs: Ember.inject.service(),
  scroller:      Ember.inject.service(),

  model() {
    this.set('noNewResults', false);

    var stories;
    if (this.get('isFindingMore')) {
      stories = this._loadStoriesFromServer().then(s => {
        if (s.length === 0) {
          this.controllerFor('discover.index').set('noNewResults', true);
          return this._loadStoriesFromQueue();
        }
        else {
          return s;
        }
      });
    }
    else if (this._hasQueuedStories()) {
      stories = this._loadStoriesFromQueue();
    }
    else {
      stories = this._loadStoriesFromServer();
    }

    return Ember.RSVP.hash({
      stories: stories
    });
  },
  afterModel(model) {
    let stories = model.stories.toArray();
    // .toArray() so the playlist items don't get bound to the session object
    //  which will cause unwanted things to happen when deleting items

    if (this.controllerFor('discover.index').get('noNewResults')) {
      Ember.run.scheduleOnce('afterRender', this, function(){
        this.get('scroller').scrollVertical(Ember.$('.discover-playlist-footer'), {duration: 500});
      });
    }
    else {
      this.get('discoverQueue').updateQueue(stories);
    }
  },

  _hasQueuedStories() {
    let queuedStories = this.get('discoverQueue.items');

    return queuedStories.length > 0;
  },

  _loadStoriesFromQueue() {
    var stories;
    let prefs         = this.get('discoverPrefs');
    let excludedIds   = prefs.get('excludedStoryIds');
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

    return stories;
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
      return stories.filter(s => !excludedIds.contains(s.id));
    });

    return stories;
  },

  actions: {
    findMore() {
      this.set('isFindingMore', true);
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
