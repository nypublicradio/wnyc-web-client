import Route from 'ember-route';
import service from 'ember-service/inject';
import get from 'ember-metal/get';

export default Route.extend({
  googleAds: service(),
  
  titleToken(model) {
    return `Playlist for ${get(model, 'name')}`;
  },
  model({ slug }) {
    return this.store.findRecord('stream', slug);
  },
  afterModel() {
    get(this, 'googleAds').doTargeting();
  }
});
