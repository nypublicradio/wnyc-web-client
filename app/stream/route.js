import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  googleAds:  service(),
  titleToken: 'Listen Live to WQXR, New Sounds, Operavore, and WQXR\'s American Standards',

  model() {
    return this.store.findAll('stream').then(streams => {
      return streams.filterBy('isWQXR').sortBy('sitePriority')
        .concat(streams.filterBy('isWNYC').sortBy('sitePriority')).uniq();
    });
  },

  afterModel() {
    this.get('googleAds').doTargeting();
  }
});
