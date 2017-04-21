import Route from 'ember-route';
import service from 'ember-service/inject';
import RSVP from 'rsvp';
import ENV from 'wqxr-web-client/config/environment';
import service from 'ember-service/inject';

export default Route.extend({
  titleToken: 'All Shows, Podcasts and Programs',
  
  googleAds: service(),

  model() {
    return RSVP.hash({
      allShows: this.store.query('shows', { discover_station: ENV.showsDiscoverStation, api_key: ENV.showsAPIKey }),
      // Because of usability conerns, we're commenting this featured show
      // item for now. We want users to access their favorite shows quickly.
      //featured: this.store.findRecord('bucket', 'wnyc-shows-featured').then(b => b.get('bucketItems.firstObject'))
    });
  },
  
  afterModel() {
    this.get('googleAds').doTargeting();
  },

  actions: {
    willTransition() {
      this.controller.send("resetSearchFilter");
    },
  },

});
