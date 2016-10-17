import Ember from 'ember';
import ENV from '../../../config/environment';

export default Ember.Route.extend({
  discoverPrefs: Ember.inject.service(),
  titleToken: 'Discover Edit Shows',

  model() {
    let prefs = this.get('discoverPrefs');

    return this.store.query('shows', {
      discover_station: ENV.discoverStation,
      api_key: ENV.discoverAPIKey
    }).then((shows) => {
      return Ember.RSVP.hash({
        shows: shows,
        excludedShowSlugs: prefs.get('excludedShowSlugs')
      });
    });
  }
});
