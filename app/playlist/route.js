import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';

export default Route.extend({
  googleAds: service(),
  
  model({ slug }) {
    return this.store.findRecord('stream', slug);
  },
  titleToken(model) {
    let streamTitle = get(model, 'streaminfo.name');
    return `Playlist for ${streamTitle}`;
  },
  
  actions: {
    didTransition() {
      this.get('googleAds').refresh();
    }
  }
});
