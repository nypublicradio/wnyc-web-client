import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

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
