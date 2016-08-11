import Component from 'ember-component';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import computed, { readOnly } from 'ember-computed';

export default Component.extend({
  audio: service(),
  store: service(),
  slug: null,
  stream: computed('slug', function() {
    let slug = get(this, 'slug');
    if (slug) {
      let stream = get(this, 'store').findRecord('stream', slug);
      return stream;
    }
  }),
  showTitle: readOnly('stream.currentShow.title'),
  episodeTitle: readOnly('stream.currentShow.episodeTitle')
});
