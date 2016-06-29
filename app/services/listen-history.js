import Service from 'ember-service';
import { readOnly } from 'ember-computed';
import service from 'ember-service/inject';

export default Service.extend({
  session: service(),
  items:   readOnly('session.data.listens'),

  addListen(story) {
    let session  = this.get('session');
    let listens  = session.getWithDefault('data.listens', []).slice();

    let listen = {
      id: `listen${Date.now()}-${(Math.random() * 100).toFixed()}`,
      story: story
    };

    listens.unshiftObject(listen);
    session.set('data.listens', listens);
  },

  removeListenByListenId(id) {
    let session = this.get('session');
    let listens = session.getWithDefault('data.listens', []).slice();

    let listen = listens.findBy('id', id);
    listens.removeObject(listen);
    session.set('data.listens', listens);
  },

  removeListenByStoryPk(pk) {
    let session = this.get('session');
    let listens = session.getWithDefault('data.listens', []).slice();

    let listen = listens.findBy('story.id', pk);
    listens.removeObject(listen);
    session.set('data.listens', listens);
  },

  clearHistory() {
    let session = this.get('session');
    session.set('data.listens', []);
  },

  hasListenedTo(id) {
    return this.historyFor(id).length > 0;
  },

  historyFor(id) {
    let session = this.get('session');
    let listens = session.getWithDefault('data.listens', []);

    return listens.filterBy('story.id', id);
  },

  indexByStoryPk(pk) {
    let session = this.get('session');
    let listens = session.getWithDefault('data.listens', []);
    let listen = listens.findBy('story.id', pk);

    return listens.indexOf(listen);
  }
});
