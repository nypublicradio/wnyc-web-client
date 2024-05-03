import Route from '@ember/routing/route';
import { hash } from 'rsvp';

const ARCHIVE_BUCKET = 'wnyc-centennial-archives';
const EXPLORE_BUCKET_1 = 'wnyc-centennial-archives';
const EXPLORE_BUCKET_2 = 'wnyc-centennial-archives';

export default Route.extend({
  model() {
    let archiveStories = this.store.findRecord('bucket', ARCHIVE_BUCKET);
    let exploreStories1 = this.store.findRecord('bucket', EXPLORE_BUCKET_1);
    let exploreStories2 = this.store.findRecord('bucket', EXPLORE_BUCKET_2);
    return hash({archiveStories, exploreStories1, exploreStories2});
  },
});
