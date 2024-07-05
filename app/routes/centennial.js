import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  model() {
    let archiveItems = this.store.findRecord('bucket', 'wnyc-centennial-archives')
    .then(b => b.get('bucketItems'))
    let featuredCategory1 = this.store.findRecord('bucket', 'centennial-featured-content-1')
    let featuredCategory2 = this.store.findRecord('bucket', 'centennial-featured-content-2')
    let featuredCategory3 = this.store.findRecord('bucket', 'centennial-featured-content-3')
    let events = this.store.findRecord('bucket', 'wnyc-centennial-events')
    .then(b => b.get('bucketItems'))

    return RSVP.hash({
      archiveItems,
      featuredCategory1,
      featuredCategory2,
      featuredCategory3,
      events
    })
  }
});
