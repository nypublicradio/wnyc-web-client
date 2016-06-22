import Ember from 'ember';

export default Ember.Route.extend({
  discoverPrefs: Ember.inject.service(),

  model() {
    let prefs = this.get('discoverPrefs');

    return this.store.findAll('shows').then((shows) => {
      prefs.setDefaultShows(shows.mapBy('slug'));

      return Ember.RSVP.hash({
        shows: shows,
        selectedShowSlugs: prefs.get('selectedShowSlugs')
      });
    });
  }
});
