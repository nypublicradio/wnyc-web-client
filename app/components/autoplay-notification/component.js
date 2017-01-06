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
  didAnimate     : false
});
