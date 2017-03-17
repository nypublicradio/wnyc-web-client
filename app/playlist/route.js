import Route from 'ember-route';
import get from 'ember-metal/get';

export default Route.extend({
  model({ slug }) {
    return this.store.findRecord('stream', slug);
  },
  titleToken(model) {
    let streamTitle = get(model, 'streaminfo.name');
    return `Playlist for ${streamTitle}`;
  },
});
