import Component from 'ember-component';
import get from 'ember-metal/get';

export default Component.extend({
  classNames: ['persistent-player--controls'],
  actions: {
    playOrPause() {
      get(this, 'playOrPause')();
    },
    rewind() {
      get(this, 'rewind')();
    },
    fastForward() {
      get(this, 'fastForward')();
    }
  }
});
