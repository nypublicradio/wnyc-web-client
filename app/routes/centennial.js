import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  model() {
    let events = this.store.findRecord('bucket', 'wnyc-centennial-events')
    .then(b => b.get('bucketItems'))
    return RSVP.hash({
      events
    })
  }
});
