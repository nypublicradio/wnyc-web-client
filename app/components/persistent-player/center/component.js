import Component from 'ember-component';
import get from 'ember-metal/get';

export default Component.extend({
  classNames: ['persistent-playerinfo'],
  actions: {
    setPosition(p) {
      get(this, 'setPosition')(p);
    }
  }
});
