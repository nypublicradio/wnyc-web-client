import Component from 'ember-component';
import service from 'ember-service/inject';
import { readOnly } from 'ember-computed';

export default Component.extend({
  audio:          service(),
  listenHistory:  service(),

  listens:        readOnly('listenHistory.items'),

  classNames:     ['player-history'],

  actions: {
    removeFromHistory(pk) {
      this.get('listenHistory').removeListenByStoryPk(pk);
    },
  },
});
