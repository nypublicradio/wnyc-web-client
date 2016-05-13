import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service(),
  model() {
    let tags = this.get('session.data.discover-topics').join(",");

    let stories = this.store.query('discover.stories', {
      browser_id: this.get('session.data.browserId'),
      discover_station: 'wnyc_2',
      api_key: 'trident',
      duration: 10800,
      tags: tags
    });

    return Ember.RSVP.hash({
      stories: stories
    });
  },
  actions: {
    edit() {
      this.transitionTo('discover.edit');
    }
  }
});
