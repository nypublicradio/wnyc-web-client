import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Service.extend({
  session: Ember.inject.service(),

  init() {
    this.set('queue', []);
    this.get('session').syncBrowserId(id => this.set('browserId', id));
  },

  sendPlay(pk, context) {
    return this._queueListenAction(pk, 'play', context);
  },

  sendSkip(pk, context) {
    return this._queueListenAction(pk, 'skip', context);
  },

  sendPause(pk, context, seconds) {
    return this._queueListenAction(pk, 'pause', context, seconds);
  },

  sendComplete(pk, context) {
    return this._queueListenAction(pk, 'complete', context);
  },

  sendDelete(pk, context) {
    return this._queueListenAction(pk, 'delete', context);
  },

  sendHeardStream(pk, context) {
    return this._queueListenAction(pk, 'heardstream', context);
  },


  /* ------------------------------------------------------------ */

  _flushQueue() {
    let queue = this.get('queue');

    if (queue.length === 0) {
      return;
    }

    this.get('session').syncBrowserId(false).then(id => {
      this.set('browserId', id);

      if (queue.length === 1) {
        let item = queue[0];
        this._sendSingleListenAction(item.pk, item.action, item.context, item.value, item.ts);
      }
      else {
        this._sendBulkListenActions(queue);
      }

      this.set('queue', []);
    });
  },

  _queueListenAction(pk, action, context, value) {
    let queue = this.get('queue');
    let ts = Math.floor(new Date().getTime() / 1000);

    queue.addObject({
      pk: pk,
      action: action,
      value: value,
      context: context,
      ts: ts
    });

    Ember.run.scheduleOnce('actions', () => {
      this._flushQueue();
    });
  },

  _sendSingleListenAction(pk, action, context, value, ts) {
    //POST /api/v1/listenaction/create/(pk)/(action)/?browser_id=abc123abc123&context=OPB_App_Discover

    // pk:       the story pk
    // action:  'pause' | 'skip' | 'play' | 'complete' | 'delete' | 'heardstream'
    // value:   <seconds if action=='pause, absent otherwise>
    // ts:       Unixstyle epoch integer timestamp for when this event occured

    let baseUrl = [ENV.wnycAccountRoot, 'api/v1/listenaction/create', pk, action].join("/");
    let url = `${baseUrl}/?browser_id=${this.get('browserId')}&context=${context}`;

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
      xhrFields: {
        withCredentials: true
      }
    });
  },

  _sendBulkListenActions(data) {
    //POST /api/v1/listenaction/create/

    // { browser_id: 123512125,
    //    actions: [
    //      {pk: 1, action: 'play', context: 'discover'}
    //    ]
    // }

    let url = [ENV.wnycAccountRoot, 'api/v1/listenaction/create/'].join("/");

    let payload = {
      browser_id: this.get('browserId'),
      actions: data
    };

    return Ember.$.ajax({
      data: JSON.stringify(payload),
      method: "POST",
      url: url,
      dataType: "json",
      xhrFields: {
        withCredentials: true
      }
    });
  }
});
