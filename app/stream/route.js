import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  googleAds: service(),

  titleToken: 'Listen Live to WNYC, WQXR, New Sounds, Operavore, NJPR, and American Standards',

  model() {
    return this.store.findAll('stream', {reload: true}).then(streams => {
      return streams.filterBy('isWNYC').sortBy('sitePriority')
        .concat(streams.filterBy('isWQXR').sortBy('sitePriority')).uniq();
    });
  },

  afterModel() {
    this.get('googleAds').doTargeting();
  }
});
