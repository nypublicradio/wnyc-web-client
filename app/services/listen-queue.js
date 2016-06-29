import Service from 'ember-service';
import service from 'ember-service/inject';
import { readOnly } from 'ember-computed';
import get from 'ember-metal/get';

export default Service.extend({
  session:  service(),
  store:    service(),
  items:    readOnly('session.data.queue'),

  init() {
    this.set('pending', []);
  },

  addToQueueById(id) {
    let pending = this.get('pending');
    pending.push(id);

    let findPromise = get(this, 'store').findRecord('story', id);

    findPromise.then(story => {
      if (!pending.contains(id)) {
        // story was removed from the queue before it could be resolved
        return;
      } else {
        this._removePending(id);
      }
      let session = get(this, 'session');
      let queue = session.getWithDefault('data.queue', []).slice();

      queue.pushObject(story);
      session.set('data.queue', queue);

      return story;
    });

    return findPromise;
  },
  removeFromQueueById(id) {
    let session = get(this, 'session');
    let queue = session.getWithDefault('data.queue', []);
    let newQueue = queue.rejectBy('id', id);

    this._removePending(id);

    if (newQueue.length !== queue.length) {
      session.set('data.queue', newQueue);
    }
  },
  reset(newQueue) {
    let session = get(this, 'session');
    session.set('data.queue', newQueue);
  },
  nextItem() {
    let session = get(this, 'session');
    let queue = session.getWithDefault('data.queue', []);

    if (queue.length > 0) {
      return get(queue, 'firstObject');
    } else {
      return null;
    }
  },

  _removePending(id) {
    let pending = this.get('pending');
    let pendingIndex = pending.indexOf(id);
    if (pendingIndex !== -1) {
      pending.removeAt(pendingIndex);
    }
  }
});
