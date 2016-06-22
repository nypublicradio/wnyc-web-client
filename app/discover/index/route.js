import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service(),
  discoverQueue: Ember.inject.service(),

  model() {
    var stories;

    if (this.get('discoverQueue.items').length > 0) {
      stories = this.get('discoverQueue.items');
    }
    else {
      let tags = this.get('session.data.discover-topics').join(",");
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
      this.get('discoverQueue').updateQueue([]);
      this.refresh();
    },
    edit() {
      this.transitionTo('discover.edit');
    }
  }
});
