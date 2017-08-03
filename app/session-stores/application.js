import AdaptiveStore from 'ember-simple-auth/session-stores/adaptive';
import service from 'ember-service/inject';
import set from 'ember-metal/set';

export default AdaptiveStore.extend({
  store: service(),

  init() {
    this._super(...arguments);
    this.on('sessionDataUpdated', (d) => {
      this._restoreQueue(d);
      this._restoreListens(d);
    });
  },

  restore() {
    let data = this._super(...arguments);
    return data
      .then(d => this._restoreQueue(d))
      .then(d => this._restoreListens(d));
  },

  _restoreQueue(data) {
    let store = this.get('store');
    let { queue } = data;
    if (!queue) {
      return data;
    }
    // convert serialized records to format the store expects
    // from [{data: { .. }}, {data: { ... }}]
    // to   {data: [ { ... }, { ... } ]}
    let payload = {data: queue.mapBy('data')};
    store.pushPayload(payload);

    let stories = queue.mapBy('data.id').map(id => store.peekRecord('story', id));
    set(data, 'queue', stories);
    return data;
  },

  _restoreListens(data) {
    let store = this.get('store');
    let { listens } = data;
    if (!listens) {
      return data;
    }
    // convert listens to stories
    // from [{ id, story: { data: { ... } } }, { id, story: { data: { ... } } }]
    // to: {data: [ { ... }, { ... } ]}
    let payload = {data: listens.mapBy('story.data')};
    store.pushPayload(payload);
    let stories = listens.mapBy('story.data.id').map(id => store.peekRecord('story', id));
    set(data, 'listens', listens.map((l, i) => ({id: l.id, story: stories[i]})));
    return data;
  }
});
