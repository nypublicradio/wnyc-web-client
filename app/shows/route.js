import Route from 'ember-route';
import RSVP from 'rsvp';

export default Route.extend({
  model() {
    return RSVP.hash({
      allShows: this.store.findAll('shows'),
      featured: this.store.findRecord('bucket', 'wnyc-shows-featured').then(b => b.get('bucketItems.firstObject'))
    });
  },

});
