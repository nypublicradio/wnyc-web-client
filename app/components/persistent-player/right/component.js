import Component from 'ember-component';
import get from 'ember-metal/get';

export default Component.extend({
  classNames: ['persistent-player--controls'],
  actions: {
    setVolume(vol) {
      get(this, 'setVolume')(vol);
    },
    toggleMute() {
      get(this, 'toggleMute')();
    }
  }
});
