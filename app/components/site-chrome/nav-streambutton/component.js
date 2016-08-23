import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';

export default Component.extend({
  audio: service(),
  tagName: '',
  slug: '',
  name: '',
  actions: {
    listenLive(slug) {
      get(this, 'audio').playStream(slug);
    }
  }
});
