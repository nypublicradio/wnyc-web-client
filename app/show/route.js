import Route from 'ember-route';
import RSVP from 'rsvp';
import service from 'ember-service/inject';
import ENV from 'wnyc-web-client/config/environment';

export default Route.extend({
  titleToken: 'All Shows, Podcasts and Programs',
  
  googleAds: service(),

  model() {
    return RSVP.hash({
      allShows: this.store.query('show', {
        discover_station: ENV.showsDiscoverStation,
        api_key: ENV.showsAPIKey,
        page_size: 150,
        'fields[show]': 'slug,tease,title,image,producing_organizations'
      }),
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
