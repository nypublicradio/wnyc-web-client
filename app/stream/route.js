import Route from 'ember-route';
import service from 'ember-service/inject';

export default Route.extend({
  googleAds: service(),

  titleToken: 'Listen Live to WNYC, WQXR, Q2, Operavore, NJPR, and the Jonathan Channel',

  model() {
    return this.store.findAll('stream').then(streams => {
      return streams.filterBy('isWNYC').sortBy('sitePriority')
        .concat(streams.filterBy('isWQXR').sortBy('sitePriority')).uniq();
    });
  },

  afterModel() {
    this.get('googleAds').doTargeting();
  }
});
