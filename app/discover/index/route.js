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
      stories = this.get('discoverQueue.items');
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
        listenActions.sendSkip(get(item, 'cmsPK'), 'discover');
        // send a skip action for each item in the playlist
      });
      discoverQueue.emptyQueue();

      this.refresh();
    },
    removeItem(item) {
      let listenActions = this.get('listenActions');
      listenActions.sendDelete(get(item, 'cmsPK'), 'discover');
    },
    edit() {
      this.transitionTo('discover.edit');
    }
  }
});
