import { hash } from 'rsvp';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import config from 'wnyc-web-client/config/environment';

export default Route.extend({
  discoverPrefs: service(),
  titleToken: 'Discover Edit Topics',

  model() {
    return hash({
      topics: this.store.query("discover.topics", {discover_station: config.discoverTopicsKey}),
      selectedTopicTags: this.get('discoverPrefs.selectedTopicTags')
    });
  },
  actions: {

  }
});
