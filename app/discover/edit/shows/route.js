import Ember from 'ember';

export default Ember.Route.extend({
  discoverPrefs: Ember.inject.service(),

  model() {
    let prefs = this.get('discoverPrefs');

    return this.store.query('shows', {
      discover_station: 'wnyc_v2',
      api_key: 'trident'
    }).then((shows) => {
      prefs.setDefaultShows(shows.mapBy('slug'));

      return Ember.RSVP.hash({
        shows: shows,
        selectedShowSlugs: prefs.get('selectedShowSlugs')
      });
    });
  }
});
