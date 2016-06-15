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

  nextUnplayedItem() {
    let history = this.get('history');
    return this.get('items').find(function(item) {
      return !history.hasListenedTo(item.id);
    });
  }
});
