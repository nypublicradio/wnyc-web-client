import Ember from 'ember';
import service from 'ember-service/inject';
const {
  A:emberArray,
  computed
} = Ember;

export default Ember.Service.extend({
  session: service(),
  items:   computed.alias('session.data.discover-queue'),
  history: service('listen-history'),
  count:   computed.alias('session.data.discover-queue.length'),

  init() {
    let items = this.get('session').getWithDefault('data.discover-queue', emberArray());
    
    if (items.length > 0 && items[0].cmsPK) {
      // reset after serialization changes
      // we can remove this after release, this just helps anyone who tried this in dev
      this.set('items', []);
    }
    else {
      this.set('items', items);
    }

    this._super(...arguments);
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
