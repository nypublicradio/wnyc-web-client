import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['notification', 'notification-active'],
  elapsed: true,
  audioCueElapsed: false,
  secondsRemaining: 15,
  startCountdown: Ember.on('init', function(){
    var id = setInterval(() => {
      var seconds = this.decrementProperty('secondsRemaining');
      if (seconds === 0) {
        this.set('elapsed', false);
        clearInterval(this.get('_intervalId'));
      }
    }, 1000);
    this.set('_intervalId', id);
  }),

  actions: {
    oncancel() {
      if (this.get('secondsRemaining') > 0) {
        clearInterval(this.get('_intervalId'));
      }
      this.oncancel();
    }
  }
});
