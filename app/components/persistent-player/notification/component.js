import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['notification', 'notification-active'],
  didNotElapse: Ember.computed.gte('secondsRemaining', 0.5),
  didAnimate: false,
  startCountdown: Ember.on('init', function() {
    var id = setInterval(() => {
      var seconds = this.decrementProperty('secondsRemaining');
      if (seconds === 0) {
        clearInterval(this.get('_intervalId'));
      }
    }, 1000);
    this.set('_intervalId', id);
  }),

  clearCountdown: Ember.on('willDestroyElement', function() {
    clearInterval(this.get('_intervalId'));
  }),

  actions: {
    dismiss(cancelAutoplay = false) {
      this.sendAction('dismissNotification', cancelAutoplay);
    }
  }
});
