import Ember from 'ember';
import service from 'ember-service/inject';

export default Ember.Component.extend({
  // init() {
  //   this._super(...arguments);
  //   this.set('secondsRemaining', Math.floor(this.get('audio.bumperDuration') / 1000));
  //   var id = setInterval(() => {
  //     var seconds = this.decrementProperty('secondsRemaining');
  //     if (seconds === 0) {
  //       clearInterval(this.get('_intervalId'));
  //     }
  //   }, 1000);
  //   this.set('_intervalId', id);
  // },
  //
  // destroyElement() {
  //   clearInterval(this.get('_intervalId'));
  // },
  //
  remaining: Ember.computed('duration', 'position', function(){
    var difference = this.get('duration') - this.get('position');
    return Math.floor(difference / 1000);
  }),

  session: service(),
  store: service(),
  preferredStream: Ember.computed('session.data.user-prefs-active-stream', function(){
    let slug = this.get('session.data.user-prefs-active-stream') || 'wnyc-fm939';
    return this.get('store').peekRecord('stream', slug);
  }),
  classNames: ['notification', 'notification-active'],
  didNotElapse: Ember.computed.gte('remaining', 0),
  didAnimate: false,
  actions: {
    dismiss(cancelAutoplay = false) {
      this.get('dismissNotification')(cancelAutoplay);
    }
  }
});
