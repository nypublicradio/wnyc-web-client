import Ember from 'ember';

export default Ember.Route.extend({
  discoverPrefs: Ember.inject.service(),

  model() {
    let prefs = this.get('discoverPrefs');

    return this.store.findAll('shows', {
      discover_station: 'wnyc_v2',
      api_key: 'trident'
    }).then((shows) => {
      return Ember.RSVP.hash({
        shows: shows,
        excludedShowSlugs: prefs.get('excludedShowSlugs')
      });
    });
  }
});
