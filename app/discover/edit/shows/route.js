import { hash } from 'rsvp';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import ENV from '../../../config/environment';

export default Route.extend({
  discoverPrefs: service(),
  titleToken: 'Discover Edit Shows',

  model() {
    let prefs = this.get('discoverPrefs');

    return this.store.query('show', {
      discover_station: ENV.discoverStation,
      api_key: ENV.discoverAPIKey,
      'fields[show]': 'slug,title,image'
    }).then((shows) => {
      return hash({
        shows: shows,
        excludedShowSlugs: prefs.get('excludedShowSlugs')
      });
    });
  }
});
