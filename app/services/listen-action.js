import Ember from 'ember';
import ENV from '../config/environment';
import RSVP from 'rsvp';

export default Ember.Service.extend({
  session: Ember.inject.service(),

  browserId: Ember.computed.alias('session.data.browserId'),

  init() {
    this.set('queue', []);
  },

  flushQueue() {
    let queue = this.get('queue');

    if (queue.length === 0) {
      return;
    }

    if (queue.length === 1) {
      let item = queue[0];
      this.sendSingleListenAction(item.pk, item.action, item.value, item.ts);
    }
    else {
      this.sendBulkListenActions(queue);
    }

    this.set('queue', []);
  },

  queueListenAction(pk, action, value) {
    let queue = this.get('queue');
    let ts = new Date().getTime();

    queue.addObject({
      pk: pk,
      action: action,
      value: value,
      ts: ts
    });

    Ember.run.scheduleOnce('actions', () => {
      this.flushQueue();
    });
  },

  sendPlay(pk) {
    return this.queueListenAction(pk, 'play');
  },

  sendSkip(pk) {
    return this.queueListenAction(pk, 'skip');
  },

  sendPause(pk, seconds) {
    return this.queueListenAction(pk, 'pause', seconds);
  },

  sendComplete(pk) {
    return this.queueListenAction(pk, 'complete');
  },

  sendDelete(pk) {
    return this.queueListenAction(pk, 'delete');
  },

  sendHeardStream(pk) {
    return this.queueListenAction(pk, 'heardstream');
  },

  sendSingleListenAction(pk, action, value, ts) {
    // pk:       the story pk
    // action:  'pause' | 'skip' | 'play' | 'complete' | 'delete' | 'heardstream'
    // value:   <seconds if action=='pause, absent otherwise>
    // ts:       Unixstyle epoch integer timestamp for when this event occured

    //POST /api/v1/listenaction/create/(pk)/(action)/?browser_id=abc123abc123&context=OPB_App_Discover

    let baseUrl = [ENV.wnycAPI, 'api/v1/listenaction/create', pk, action].join("/");
    let url = `${baseUrl}?browser_id=${this.get('browserId')}`;

    return new RSVP.Promise((resolve) => {
      return Ember.$.ajax({
        data: JSON.stringify({
          pk: pk,
          action: action,
          value:  value,
          ts: ts
        }),
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

  sendBulkListenActions(data) {
    let url = [ENV.wnycAPI, 'api/v1/listenaction/create'].join("/");

    let payload = {
      browser_id: this.get('browserId'),
      actions: data
    };

    return new RSVP.Promise((resolve) => {
      return Ember.$.ajax({
        data: JSON.stringify(payload),
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
  }
});
