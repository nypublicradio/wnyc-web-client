import { isEmpty } from '@ember/utils';
import { hash } from 'rsvp';
import { gt } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { get } from '@ember/object';

export default Route.extend({
  session:          service(),
  discoverQueue:    service(),
  discoverPrefs:    service(),
  scroller:         service(),
  titleToken: 'Discover Playlist',

  hasQueuedStories: gt('discoverQueue.items.length', 0),

  setupController(controller) {
    controller.set('noNewResults', false);
    return this._super(...arguments);
  },

  model() {
    var stories;
    if (this.get('hasQueuedStories')) {
      stories = this._loadStoriesFromQueue();
    }
    else {
      stories = this._loadStoriesFromServer();
    }

    return hash({stories});
  },

  afterModel(model) {
    this._updateDiscoverQueue(model.stories);
  },

  _loadStoriesFromQueue() {
    let prefs         = this.get('discoverPrefs');
    let excludedIds   = prefs.get('excludedStoryIds');
    let queuedStories = this.get('discoverQueue.items');

    return queuedStories.reject(story => excludedIds.includes(story.id));
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
      _nocache:         Date.now(),
      'fields[story]': 'title,headers,estimated_duration,audio_duration_readable,newsdate,tease,audio,cms_pk,slug'
    }).then(stories => {
      return stories.reject(s => excludedIds.includes(s.id));
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
    if (isEmpty(stories)) {
      return true;
    }
    else {
      let oldStoryIds = this._loadStoriesFromQueue().mapBy('id');
      let newStoryIds = stories.mapBy('id');
      return isEmpty(newStoryIds.reject(s => oldStoryIds.includes(s)));
    }
  },

  actions: {
    findMore() {
      let controller = this.controllerFor('discover.index');

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
        this.get('scroller').scrollVertical('.sitechrome-top', {duration: 500});
        controller.set('findingMore', false);
      });
    },
    removeItem(item) {
      let prefs         = this.get('discoverPrefs');
      let itemId        = get(item, 'id');

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
