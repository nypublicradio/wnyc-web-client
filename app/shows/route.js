import Route from 'ember-route';
import RSVP from 'rsvp';

export default Route.extend({
  model() {
    return RSVP.hash({
      allShows: this.store.findAll('shows'),
      // Because of usability conerns, we're commenting this featured show 
      // item for now. We want users to access their favorite shows quickly.
      //featured: this.store.findRecord('bucket', 'wnyc-shows-featured').then(b => b.get('bucketItems.firstObject'))
    });
  },

});
