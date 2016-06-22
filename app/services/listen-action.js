import Ember from 'ember';
import ENV from '../config/environment';
import RSVP from 'rsvp';

export default Ember.Service.extend({
  session: Ember.inject.service(),

  browserId: Ember.computed.alias('session.data.browserId'),

  sendPlay(pk) {
    return this.sendListenAction(pk, 'play');
  },

  sendSkip(pk) {
    return this.sendListenAction(pk, 'skip');
  },

  sendPause(pk, seconds) {
    return this.sendListenAction(pk, 'pause', seconds);
  },

  sendComplete(pk) {
    return this.sendListenAction(pk, 'complete');
  },

  sendDelete(pk) {
    return this.sendListenAction(pk, 'delete');
  },

  sendHeardStream(pk) {
    return this.sendListenAction(pk, 'heardstream');
  },

  sendListenAction(pk, action, value) {
    let ts = new Date().getTime();

    // pk:       the story pk
    // action:  'pause' | 'skip' | 'play' | 'complete' | 'delete' | 'heardstream'
    // value:   <seconds if action=='pause, absent otherwise>
    // ts:       Unixstyle epoch integer timestamp for when this event occured

    //POST /api/v1/listenaction/create/(pk)/(action)/?browser_id=abc123abc123&context=OPB_App_Discover

    let baseUrl = [ENV.wnycAPI, 'api/v1/listenaction/create', pk, action].join("/");
    let url = `${baseUrl}?browser_id=${this.get('browserId')}`;

    return new RSVP.Promise((resolve) => {
      return Ember.$.ajax({
        data: {
          pk: pk,
          action: action,
          value:  value,
          ts: ts
        },
        method: "POST",
        url: url,
        dataType: "json",
        contentType: "application/json",
        xhrFields: {
          withCredentials: true
        }
      }).then((results) => {
        resolve(results);
      });
    });
  },
});
