import Ember from 'ember';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import computed, { gte, equal, and } from 'ember-computed';

export default Ember.Component.extend({
  tagName        : '',

  duration       : null,
  position       : null,
  audioType      : null,

  remaining      : computed('{duration,position}', function(){
    const difference = get(this, 'duration') - get(this, 'position');
    return Math.floor(difference / 1000);
  }),

  session        : service(),
  store          : service(),

  streamEnabled  : computed('session.data.user-prefs-active-autoplay', function(){
    const session = get(this, 'session');
    const pref = get(session, 'data.user-prefs-active-autoplay') || 'default_stream';
    return pref === 'default_stream';
  }),

  preferredStream: computed('session.data.user-prefs-active-stream.slug', function(){
    const slug = get(this, 'session.data.user-prefs-active-stream.slug') || 'wnyc-fm939';
    return get(this, 'store').peekRecord('stream', slug);
  }),

  timeRemaining  : gte('remaining', 0),
  bumperPlaying  : equal('audioType', 'bumper'),
  preSwitch      : and('bumperPlaying', 'timeRemaining'),
  didAnimate     : false,

  notificationMessage: computed('preSwitch', function() {
    if (get(this, 'preSwitch')) {
      return get(this, 'notificationMessagePreSwitch');
    }
    else {
      return get(this, 'notificationMessagePostSwitch');
    }
  }),

  notificationMessagePreSwitch: computed('streamEnabled', 'preferredStream.name', 'remaining', function() {
    let remaining = get(this, 'remaining');

    if (get(this, 'streamEnabled')) {
      let streamName = get(this, 'preferredStream.name');
      return `Your episode is over. In ${remaining} seconds, we'll tune you to ${streamName}.`;
    }
    else {
      return `Your episode is over. In ${remaining} seconds, your audio queue will begin to play.`;
    }
  }),

  notificationMessagePostSwitch: computed('streamEnabled', 'preferredStream.name', function() {
    if (get(this, 'streamEnabled')) {
      let streamName = get(this, 'preferredStream.name');
      return `We tuned you to ${streamName} after your episode ended.`;
    }
    else {
      return `We began playing your audio queue after your episode ended.`;
    }
  })

});
