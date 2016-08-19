import Component from 'ember-component';
import get from 'ember-metal/get';
import computed from 'ember-computed';
import service from 'ember-service/inject';

export default Component.extend({
  audio: service(),
  store: service(),
  tagName: '',
  slug: null,
  stream: computed('slug', function() {
    let slug = get(this, 'slug');
    if (slug) {
      return get(this, 'store').findRecord('stream', slug);
    }
  }),
  actions: {
    listenLive(slug) {
      get(this, 'audio').playStream(slug);
    }
  }
});
