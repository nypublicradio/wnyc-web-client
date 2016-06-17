import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service(),
  model() {
    return this.store.findAll('shows').then(shows => {
      var savedShows = [];
      let savedShowsKeys = this.get('session.data.discover-shows');
      if (savedShowsKeys) {
        // Now we'll find the matching objects in the discover topics,
        // and add them to the selectedTopics list
        shows.forEach(function(show) {
          if (savedShowsKeys.contains(show.get('id'))) {
            savedShows.addObject(show);
          }
        });
      }
      if (!savedShows || savedShows.length === 0) {
        savedShows = [].concat(shows.toArray());
      }
      return Ember.RSVP.hash({
        shows: shows,
        savedShows: savedShows
      });
    });
  },
  actions: {
    next(selectedShows) {
      this.send('saveShows', selectedShows);
      this.transitionTo('discover.index');
    }
  }
});
