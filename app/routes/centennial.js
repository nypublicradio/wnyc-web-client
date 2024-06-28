import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  model() {
    let archiveItems = this.store.findRecord('bucket', 'wnyc-centennial-archives')
    .then(b => b.get('bucketItems'))
    return RSVP.hash({
      archiveItems
    })
  }
});
