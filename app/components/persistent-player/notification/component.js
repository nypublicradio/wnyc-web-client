import Ember from 'ember';
import get from 'ember-metal/get';

export default Ember.Component.extend({
  didAnimate: false,
  classNames: ['notification', 'notification-active'],
  actions: {
    dismiss() {
      get(this, 'dismissNotification')();
    }
  }
});
