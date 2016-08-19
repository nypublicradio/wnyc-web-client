import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';

export default Component.extend({
  audio: service(),
  tagName: 'li',
  classNames: ['list-item', 'list-item--short'],
  stationSlug: 'wnyc-fm939',
  actions: {
    listenLive(slug) {
      get(this, 'audio').playStream(slug);
    }
  }
});
