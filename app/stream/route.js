import Route from 'ember-route';
import service from 'ember-service/inject';

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
