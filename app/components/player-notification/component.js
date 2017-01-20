import Ember from 'ember';
import get from 'ember-metal/get';

export default Ember.Component.extend({
  didAnimate: false,
  classNames: ['player-notification', 'js-player-notification'],
  actions   : {
    dismiss() {
      get(this, 'onDismiss')();
    }
  }
});
