import Ember from 'ember';
import service from 'ember-service/inject';

export default Ember.Component.extend({
  remaining: Ember.computed('duration', 'position', function(){
    var difference = this.get('duration') - this.get('position');
    return Math.floor(difference / 1000);
  }),

  session: service(),
  store: service(),
  streamEnabled: Ember.computed('session.data.user-prefs-active-autoplay', function(){
    let session = this.get('session');
    let pref = session.getWithDefault('data.user-prefs-active-autoplay', 'default_stream');
    return pref === 'default_stream';
  }),
  preferredStream: Ember.computed('session.data.user-prefs-active-stream', function(){
    let slug = this.get('session.data.user-prefs-active-stream') || 'wnyc-fm939';
    return this.get('store').peekRecord('stream', slug);
  }),
  classNames: ['notification', 'notification-active'],
  didNotElapse: Ember.computed.gte('remaining', 0),
  didAnimate: false,
  actions: {
    dismiss() {
      this.get('dismissNotification')();
    }
  }
});
