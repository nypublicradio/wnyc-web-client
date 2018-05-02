import { alias } from '@ember/object/computed';
import { bind } from '@ember/runloop';
import Service from '@ember/service';
import { A as emberArray } from '@ember/array';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Service.extend({
  session: service(),
  items  : alias('session.data.discover-queue'),
  history: service('listen-history'),
  count  : alias('session.data.discover-queue.length'),
  hifi   : service(),
  dj     : service(),
  actionQueue: service(),

  init() {
    this._super(...arguments);
    let hifi        = get(this, 'hifi');
    let actionQueue = get(this, 'actionQueue');

    actionQueue.addAction(hifi, 'audio-ended', {priority: 2, name: 'discover-queue'}, bind(this, this.onTrackFinished));
  },

  /* DISCOVER QUEUE -----------------------------------------------------------*/

  onTrackFinished(sound) {
    if (get(sound, 'metadata.playContext') === 'discover') {
      let nextTrack = this.nextItem(get(this, 'dj.currentContentId'));
      if (nextTrack) {
        let dj = this.get('dj');
        dj.play(get(nextTrack, 'id'), {playContext: 'discover'});
        return true;
      }
    }
  },

  addItem(item) {
    let session       = this.get('session');
    let discoverQueue = session.getWithDefault('data.discover-queue', emberArray());

    discoverQueue.pushObject(item);
    session.set('data.discover-queue', discoverQueue);
  },

  removeItem(item) {
    let session       = this.get('session');
    let discoverQueue = session.getWithDefault('data.discover-queue', emberArray());

    discoverQueue.removeObject(item);
    session.set('data.discover-queue', discoverQueue);
  },

  removeItemById(id) {
    let session       = this.get('session');
    let discoverQueue = session.getWithDefault('data.discover-queue', emberArray());

    let item = discoverQueue.findBy('id', id);
    this.removeItem(item);
  },

  updateQueue(items) {
    let session = this.get('session');
    session.set('data.discover-queue', items);
  },

  emptyQueue() {
    let session = this.get('session');
    session.set('data.discover-queue', []);
  },

  nextItem(currentPk) {
    let items = this.get('items');
    let current = this.get('items').findBy('id', currentPk);
    let currentIndex = items.indexOf(current);

    if (currentIndex < items.length) {
      return items[currentIndex + 1];
    }
  },

  nextUnplayedItem() {
    let history = this.get('history');
    return this.get('items').find(function(item) {
      return !history.hasListenedTo(item.id);
    });
  }
});
